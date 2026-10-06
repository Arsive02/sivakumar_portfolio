import { PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { orbitals, sampleOrbital } from '@/lib/hydrogen'
import { intro } from '@/intro/state'
import { cssVar } from '@/lib/theme'

const vert = /* glsl */ `
  attribute vec3 aA; attribute vec3 aB; attribute vec3 aC;
  attribute vec3 aSign; // sign of ψ in each of the three states
  attribute float aRand;
  uniform float uMix, uTime, uCollapse, uDive, uSize;
  uniform vec3 uPoint;
  varying float vPhase; varying float vAlpha;

  vec3 rotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x+s*p.z, p.y, -s*p.x+c*p.z); }

  void main(){
    // Superposition drift: smooth cyclic blend A → B → C → A.
    float m = mod(uMix, 3.0);
    float w = smoothstep(0.0, 1.0, fract(m));
    vec3 p0 = m < 1.0 ? aA : (m < 2.0 ? aB : aC);
    vec3 p1 = m < 1.0 ? aB : (m < 2.0 ? aC : aA);
    float s0 = m < 1.0 ? aSign.x : (m < 2.0 ? aSign.y : aSign.z);
    float s1 = m < 1.0 ? aSign.y : (m < 2.0 ? aSign.z : aSign.x);
    vec3 p = mix(p0, p1, w);
    vPhase = mix(s0, s1, w);

    p = rotY(p, uTime * 0.12) * 2.4 + vec3(0.0, 0.32, 0.0); // fill the frame, sit above the name
    vec3 home = p;
    // Quantum fuzz: a tiny per-particle jitter.
    p += 0.006 * vec3(sin(uTime*3.1+aRand*40.0), cos(uTime*2.7+aRand*31.0), sin(uTime*2.3+aRand*17.0));
    // Measurement: amplitude rushes to the observed point (with a little spread left over).
    float c = smoothstep(0.0, 1.0, uCollapse);
    p = mix(p, uPoint + (p - uPoint) * 0.04 * aRand, c * (0.82 + 0.18 * aRand));
    // Dive: the measured point detonates outward along each particle's original direction
    // while the camera flies in — you travel through the expanding shell.
    vec3 dir = normalize(home - uPoint + 1e-4);
    p += dir * uDive * uDive * (2.0 + 9.0 * aRand);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aRand) / max(0.12, -mv.z) * (1.0 + c * 1.5 + uDive * 3.0);
    vAlpha = smoothstep(0.02, 0.4, -mv.z);
  }
`
const frag = /* glsl */ `
  uniform vec3 uInk, uAccent; uniform float uCollapse, uFade;
  varying float vPhase; varying float vAlpha;
  void main(){
    vec2 q = gl_PointCoord - 0.5; float d = length(q);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    // Positive lobes in ink, negative lobes in the accent; collapse burns to white-hot accent.
    vec3 col = mix(uAccent, uInk, step(0.0, vPhase));
    col = mix(col, vec3(1.0, 0.92, 0.85), uCollapse * 0.6);
    gl_FragColor = vec4(col, a * 0.55 * vAlpha * (1.0 - uFade));
  }
`
// Warp tunnel the camera flies through during the dive.
const starVert = /* glsl */ `
  attribute float aRand; uniform float uSize, uDive;
  varying float vA;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aRand) / max(0.1, -mv.z) * (1.0 + uDive * 8.0);
    vA = smoothstep(0.0, 0.1, uDive) * smoothstep(0.0, 1.0, -mv.z) * (0.6 + 0.4 * aRand);
  }
`
const starFrag = /* glsl */ `
  uniform vec3 uInk; uniform float uFade; varying float vA;
  void main(){ vec2 q = gl_PointCoord - 0.5; if (length(q) > 0.5) discard; gl_FragColor = vec4(uInk, vA * 0.8 * (1.0 - uFade)); }
`

export default function Orbital() {
  const size = useThree((s) => s.size)
  const cam = useRef<THREE.PerspectiveCamera>(null)
  const count = innerWidth < 768 ? 14000 : 32000

  const { geometry, material } = useMemo(() => {
    const [A, B, C] = orbitals.map((o, k) => sampleOrbital(o, count, 7 + k))
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(A.xyz, 3))
    g.setAttribute('aA', new THREE.BufferAttribute(A.xyz, 3))
    g.setAttribute('aB', new THREE.BufferAttribute(B.xyz, 3))
    g.setAttribute('aC', new THREE.BufferAttribute(C.xyz, 3))
    const sign = new Float32Array(count * 3)
    const rnd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      sign.set([A.sign[i], B.sign[i], C.sign[i]], i * 3)
      rnd[i] = Math.random()
    }
    g.setAttribute('aSign', new THREE.BufferAttribute(sign, 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uCollapse: { value: 0 },
        uDive: { value: 0 },
        uFade: { value: 0 },
        uSize: { value: 5 * Math.min(devicePixelRatio, 1.75) },
        uPoint: { value: new THREE.Vector3() },
        uInk: { value: new THREE.Color(cssVar('--fg')) },
        uAccent: { value: new THREE.Color(cssVar('--accent')) },
      },
    })
    return { geometry: g, material }
  }, [count])

  const stars = useMemo(() => {
    const n = 5000
    const pos = new Float32Array(n * 3)
    const rnd = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, r = 0.4 + Math.random() * 3
      pos.set([Math.cos(a) * r, Math.sin(a) * r, 3 - Math.random() * 40], i * 3)
      rnd[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
    const m = new THREE.ShaderMaterial({
      vertexShader: starVert,
      fragmentShader: starFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uSize: { value: 10 * Math.min(devicePixelRatio, 1.75) }, uDive: { value: 0 }, uFade: { value: 0 }, uInk: { value: new THREE.Color(cssVar('--fg')) } },
    })
    return new THREE.Points(g, m)
  }, [])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
      stars.geometry.dispose()
      ;(stars.material as THREE.Material).dispose()
    },
    [geometry, material, stars],
  )

  useFrame(({ clock }) => {
    const u = material.uniforms
    u.uTime.value = clock.elapsedTime
    u.uMix.value = intro.mix
    u.uCollapse.value = intro.collapse
    u.uDive.value = intro.dive
    u.uFade.value = intro.fade
    ;(stars.material as THREE.ShaderMaterial).uniforms.uFade.value = intro.fade
    // Collapse point: NDC → the z = 0 plane at the resting camera distance.
    const halfH = Math.tan(THREE.MathUtils.degToRad(25)) * 3.6
    u.uPoint.value.set(intro.point.x * halfH * (size.width / size.height), intro.point.y * halfH, 0)
    ;(stars.material as THREE.ShaderMaterial).uniforms.uDive.value = intro.dive

    // Dive: dolly through the nucleus and out the far side while the FOV blows open.
    const c = cam.current
    if (c) {
      const d = intro.dive
      c.position.z = 3.6 - d * d * 32
      c.fov = 50 + 70 * d
      c.updateProjectionMatrix()
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 3.6]} fov={50} near={0.01} far={100} />
      <points geometry={geometry} material={material} frustumCulled={false} />
      <primitive object={stars} />
    </>
  )
}
