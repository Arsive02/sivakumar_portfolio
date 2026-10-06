import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { cssVar, useTheme } from '@/lib/theme'

/**
 * A true Möbius strip:  r(u,v) = ((1 + v/2·cos(u/2))·cos u, (1 + v/2·cos(u/2))·sin u, v/2·sin(u/2)),
 * u ∈ [0, 2π), v ∈ [−1, 1]. One side, one edge. Rendered as iso-parametric lines so the
 * half-twist is legible, with a pulse of accent that travels along u — and comes back on the "other" side.
 */
const vert = /* glsl */ `
  attribute float aU;
  attribute float aV;
  varying float vU;
  varying float vV;
  varying float vDepth;
  void main() {
    vU = aU; vV = aV;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`
const frag = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uTime;
  varying float vU;
  varying float vV;
  varying float vDepth;
  void main() {
    // Travelling pulse; period 4π because a full loop of a Möbius strip needs two turns to return.
    float phase = mod(vU - uTime * 0.9, 4.0 * 3.14159265);
    float pulse = exp(-pow(phase - 1.2, 2.0) * 1.6);
    float fog = smoothstep(7.5, 3.5, vDepth);
    vec3 col = mix(uInk, uAccent, pulse);
    gl_FragColor = vec4(col, (0.22 + 0.78 * pulse) * fog);
  }
`

function mobiusLines(nu: number, nv: number) {
  const pos: number[] = [], us: number[] = [], vs: number[] = []
  const P = (u: number, v: number) => {
    const r = 1 + (v / 2) * Math.cos(u / 2)
    return [r * Math.cos(u), r * Math.sin(u), (v / 2) * Math.sin(u / 2)]
  }
  const seg = (u0: number, v0: number, u1: number, v1: number, ua: number, ub: number) => {
    pos.push(...P(u0, v0), ...P(u1, v1))
    us.push(ua, ub)
    vs.push(v0, v1)
  }
  // Lines of constant v (run along the strip). u spans 4π so the pulse can trace both "sides".
  for (let j = 0; j <= nv; j++) {
    const v = -1 + (2 * j) / nv
    for (let i = 0; i < 240; i++) {
      const u0 = (i / 240) * Math.PI * 2, u1 = ((i + 1) / 240) * Math.PI * 2
      seg(u0, v, u1, v, u0, u1)
    }
  }
  // Rungs of constant u (across the strip).
  for (let i = 0; i < nu; i++) {
    const u = (i / nu) * Math.PI * 2
    for (let k = 0; k < 8; k++) seg(u, -1 + k / 4, u, -1 + (k + 1) / 4, u, u)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aU', new THREE.Float32BufferAttribute(us, 1))
  g.setAttribute('aV', new THREE.Float32BufferAttribute(vs, 1))
  return g
}

export default function Mobius() {
  const theme = useTheme()
  const ref = useRef<THREE.LineSegments>(null)
  const geometry = useMemo(() => mobiusLines(96, 6), [])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        uniforms: { uInk: { value: new THREE.Color() }, uAccent: { value: new THREE.Color() }, uTime: { value: 0 } },
      }),
    [],
  )
  useEffect(() => {
    material.uniforms.uInk.value.set(cssVar('--fg'))
    material.uniforms.uAccent.value.set(cssVar('--accent'))
  }, [theme, material])

  useFrame(({ clock, pointer }, dt) => {
    material.uniforms.uTime.value = clock.elapsedTime
    const m = ref.current
    if (!m) return
    m.rotation.z += dt * 0.12
    m.rotation.x += (-0.9 + pointer.y * 0.25 - m.rotation.x) * 0.05
    m.rotation.y += (pointer.x * 0.35 - m.rotation.y) * 0.05
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.6]} fov={38} />
      <lineSegments ref={ref} geometry={geometry} material={material} rotation={[-0.9, 0, 0]} />
    </>
  )
}
