import { Bounds, Center, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const FOV = 32
const DIST = 4

/**
 * Displays an optimised GLB (meshopt-compressed, see scripts/optimize-models.mjs).
 * No HDR environment fetch — a key/fill/rim rig keeps the look matte and editorial.
 *
 * axis 'y' (default): turntable spin, framed by drei <Bounds>.
 * axis 'x': for long thin objects in wide strips (the flute). Bounds would fit the bounding
 * *sphere* to the strip's height, leaving the object tiny, so instead we lay its longest
 * dimension along X and scale it to ~88% of the visible width, then roll it about that axis.
 */
export default function ModelStage({ url, spin = 0.25, axis = 'y' }: { url: string; spin?: number; axis?: 'x' | 'y' }) {
  const { scene } = useGLTF(url, false, true)
  const grp = useRef<THREE.Group>(null)
  const size = useThree((s) => s.size)

  const strip = useMemo(() => {
    if (axis !== 'x') return null
    const obj = scene.clone(true)
    const box = new THREE.Box3().setFromObject(obj)
    const dim = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    obj.position.sub(center)
    const holder = new THREE.Group()
    holder.add(obj)
    // Rotate so the longest extent lies along X.
    if (dim.y >= dim.x && dim.y >= dim.z) holder.rotation.z = Math.PI / 2
    else if (dim.z >= dim.x && dim.z >= dim.y) holder.rotation.y = Math.PI / 2
    const length = Math.max(dim.x, dim.y, dim.z)
    return { holder, length }
  }, [scene, axis])

  // Fit the long model to the view each frame (cheap; handles resizes). In wide strips it lies
  // along X; in squarish tiles it lies on the diagonal, which is where the most length fits.
  const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * DIST
  const visibleW = visibleH * (size.width / size.height)
  const diagonal = size.width / size.height < 1.6
  const span = diagonal ? Math.hypot(visibleW, visibleH) * 0.8 : visibleW * 0.88

  useFrame(({ pointer }, dt) => {
    const g = grp.current
    if (!g) return
    if (strip) {
      g.scale.setScalar(span / strip.length)
      // Roll about the long axis; the pointer scrubs the roll.
      g.rotation.x += dt * spin + pointer.x * dt * 2
      const rest = diagonal ? Math.atan2(visibleH, visibleW) : 0
      g.rotation.z += (rest + pointer.y * 0.06 - g.rotation.z) * 0.05
    } else {
      g.rotation.y += dt * spin
      g.rotation.x += (pointer.y * 0.15 - g.rotation.x) * 0.05
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, strip ? 0 : 0.4, DIST]} fov={FOV} />
      <hemisphereLight args={['#fff6ea', '#1a1814', 1.1]} />
      <directionalLight position={[3, 4, 2]} intensity={2.2} />
      <directionalLight position={[-4, 1, -3]} intensity={0.9} color="#7fe7d9" />
      {/* rim light from behind: dark, glossy models (the knight) keep a readable silhouette */}
      <directionalLight position={[0, 2.5, -4]} intensity={2.4} />
      {strip ? (
        <group ref={grp}>
          <primitive object={strip.holder} />
        </group>
      ) : (
        <Bounds fit clip observe margin={1.15}>
          <group ref={grp}>
            <Center>
              <primitive object={scene} />
            </Center>
          </group>
        </Bounds>
      )}
    </>
  )
}
