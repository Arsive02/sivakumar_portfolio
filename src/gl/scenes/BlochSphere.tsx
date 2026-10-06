import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { blochTarget } from '../store'
import { cssVar, useTheme } from '@/lib/theme'

const TRAIL = 140

/** Bloch vector for |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩, with |0⟩ on +Y (up). */
const bloch = (theta: number, phi: number, out = new THREE.Vector3()) =>
  out.set(Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi))

function circle(n: number, f: (t: number) => THREE.Vector3) {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= n; i++) pts.push(f((i / n) * Math.PI * 2))
  return new THREE.BufferGeometry().setFromPoints(pts)
}

export default function BlochSphere() {
  const theme = useTheme()
  const group = useRef<THREE.Group>(null)
  const vec = useRef(bloch(blochTarget.theta, blochTarget.phi))
  const trailPts = useRef<THREE.Vector3[]>(Array.from({ length: TRAIL }, () => vec.current.clone()))

  const mats = useMemo(
    () => ({
      grid: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.16 }),
      axis: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.45 }),
      accent: new THREE.LineBasicMaterial(),
      trail: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55, vertexColors: true }),
      proj: new THREE.LineDashedMaterial({ dashSize: 0.04, gapSize: 0.04, transparent: true, opacity: 0.6 }),
      head: new THREE.MeshBasicMaterial(),
      shell: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.035, depthWrite: false, side: THREE.BackSide }),
    }),
    [],
  )

  useEffect(() => {
    const fg = new THREE.Color(cssVar('--fg'))
    const ac = new THREE.Color(cssVar('--accent'))
    mats.grid.color = fg
    mats.axis.color = fg
    mats.proj.color = fg
    mats.shell.color = fg
    mats.accent.color = ac
    mats.head.color = ac
  }, [theme, mats])

  const geo = useMemo(() => {
    const lat = [-60, -30, 0, 30, 60].map((d) => {
      const a = THREE.MathUtils.degToRad(d)
      return circle(96, (t) => new THREE.Vector3(Math.cos(a) * Math.cos(t), Math.sin(a), Math.cos(a) * Math.sin(t)))
    })
    const lon = [0, 30, 60, 90, 120, 150].map((d) => {
      const a = THREE.MathUtils.degToRad(d)
      return circle(96, (t) => new THREE.Vector3(Math.sin(t) * Math.cos(a), Math.cos(t), Math.sin(t) * Math.sin(a)))
    })
    const axes = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.25, 0, 0), new THREE.Vector3(1.25, 0, 0),
      new THREE.Vector3(0, -1.25, 0), new THREE.Vector3(0, 1.25, 0),
      new THREE.Vector3(0, 0, -1.25), new THREE.Vector3(0, 0, 1.25),
    ])
    const arrow = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    const proj = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    const trail = new THREE.BufferGeometry()
    trail.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3))
    trail.setAttribute('color', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3))
    return { lat, lon, axes, arrow, proj, trail }
  }, [])

  // <line> collides with SVG's JSX type, so lines are built as objects and mounted via <primitive>.
  const lines = useMemo(
    () => ({
      proj: new THREE.Line(geo.proj, mats.proj),
      trail: new THREE.Line(geo.trail, mats.trail),
      arrow: new THREE.Line(geo.arrow, mats.accent),
    }),
    [geo, mats],
  )
  const target = useMemo(() => new THREE.Vector3(), [])
  const head = useRef<THREE.Mesh>(null)

  useFrame((_, dt) => {
    // Geodesic interpolation on S²: rotate toward the target along the great circle.
    bloch(blochTarget.theta, blochTarget.phi, target)
    const v = vec.current
    const angle = v.angleTo(target)
    if (angle > 1e-4) {
      const axis = new THREE.Vector3().crossVectors(v, target).normalize()
      if (axis.lengthSq() < 0.5) axis.set(1, 0, 0)
      v.applyAxisAngle(axis, angle * (1 - Math.exp(-dt * 3.2))).normalize()
    }
    const a = geo.arrow.attributes.position as THREE.BufferAttribute
    a.setXYZ(1, v.x, v.y, v.z)
    a.needsUpdate = true
    head.current?.position.copy(v)

    // Projection: vector tip → equatorial plane → origin (shows φ).
    const p = geo.proj.attributes.position as THREE.BufferAttribute
    p.setXYZ(0, v.x, v.y, v.z)
    p.setXYZ(1, v.x, 0, v.z)
    p.setXYZ(2, 0, 0, 0)
    p.needsUpdate = true
    geo.proj.computeBoundingSphere()

    // Trail of recent states, fading out.
    const tr = trailPts.current
    tr.pop()
    tr.unshift(v.clone())
    const tp = geo.trail.attributes.position as THREE.BufferAttribute
    const tc = geo.trail.attributes.color as THREE.BufferAttribute
    const ac = mats.accent.color
    tr.forEach((q, i) => {
      tp.setXYZ(i, q.x, q.y, q.z)
      const k = 1 - i / TRAIL
      tc.setXYZ(i, ac.r * k, ac.g * k, ac.b * k)
    })
    tp.needsUpdate = tc.needsUpdate = true
    lines.proj.computeLineDistances()

    if (group.current) group.current.rotation.y += dt * 0.06
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[2.4, 1.3, 2.9]} fov={32} onUpdate={(c) => c.lookAt(0, 0, 0)} />
      <group ref={group}>
        <mesh material={mats.shell}>
          <sphereGeometry args={[1, 48, 32]} />
        </mesh>
        {[...geo.lat, ...geo.lon].map((g, i) => (
          <lineLoop key={i} geometry={g} material={mats.grid} />
        ))}
        <lineSegments geometry={geo.axes} material={mats.axis} />
        <primitive object={lines.proj} />
        <primitive object={lines.trail} />
        <primitive object={lines.arrow} />
        <mesh ref={head} material={mats.head}>
          <sphereGeometry args={[0.045, 16, 12]} />
        </mesh>
      </group>
    </>
  )
}
