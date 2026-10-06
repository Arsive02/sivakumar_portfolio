import { OrthographicCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GPUComputationRenderer, type Variable } from 'three/addons/misc/GPUComputationRenderer.js'
import velocityShader from '../shaders/heroVelocity.glsl'
import positionShader from '../shaders/heroPosition.glsl'
import pointsVert from '../shaders/heroPoints.vert'
import pointsFrag from '../shaders/heroPoints.frag'
import { heroControl, heroRefs, heroTelemetry } from '../store'
import { cssVar, useTheme } from '@/lib/theme'
import { ScrollTrigger } from '@/motion/gsap'
import { prefersReducedMotion } from '@/lib/useReducedMotion'
import { intro, setIntro } from '@/intro/state'

const EPOCHS = 200
/** Seconds after the schedule completes before we call the name "formed" (velocities have decayed). */
const SETTLE = 0.45
/** Training length in *simulated* seconds — slow devices take longer, but never reveal early. */
const TRAIN = 2.2

const setFormed = (v: boolean) => {
  if (heroTelemetry.formed === v) return
  heroTelemetry.formed = v
  heroTelemetry.listeners.forEach((l) => l())
}

/** Rasterise the hero <h1> exactly where it sits on screen, return (x, y) samples in view space. */
function sampleTitle(el: HTMLElement, host: DOMRect, count: number): Float32Array {
  const w = Math.ceil(host.width), h = Math.ceil(host.height)
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const ctx = cv.getContext('2d', { willReadFrequently: true })!
  const cs = getComputedStyle(el)
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'

  // Draw glyph-by-glyph at the browser's own layout positions, so wrapping & kerning match.
  const range = document.createRange()
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const ascent = ctx.measureText('H').actualBoundingBoxAscent
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? ''
    for (let i = 0; i < text.length; i++) {
      if (text[i].trim() === '') continue
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getBoundingClientRect()
      const lineH = r.height
      const baseline = r.top - host.top + (lineH + ascent) / 2
      ctx.fillText(text[i], r.left - host.left, baseline)
    }
  }

  const { data } = ctx.getImageData(0, 0, w, h)
  const hits: number[] = []
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 140) hits.push(x, y)

  const out = new Float32Array(count * 2)
  const n = hits.length / 2
  for (let i = 0; i < count; i++) {
    const k = n ? Math.floor(Math.random() * n) * 2 : 0
    out[i * 2] = (n ? hits[k] : Math.random() * w) - w / 2 + (Math.random() - 0.5) * 2
    out[i * 2 + 1] = h / 2 - (n ? hits[k + 1] : Math.random() * h) + (Math.random() - 0.5) * 2
  }
  return out
}

export default function HeroTraining() {
  const { gl, size } = useThree()
  const theme = useTheme()
  const side = innerWidth < 768 ? 128 : 192 // 16k mobile, 37k desktop
  const count = side * side
  const reduced = prefersReducedMotion()

  const sim = useRef<{ gpu: GPUComputationRenderer; pos: Variable; vel: Variable; target: THREE.DataTexture } | null>(null)
  const stepRef = useRef<(dt: number, t: number) => void>(() => {})
  const restartRef = useRef<() => void>(() => {})
  /** Whether the hero was live last frame; flips on when the intro hands over (or immediately). */
  const live = useRef(false)
  const state = useRef({ progress: 0, scatter: 0, mouse: new THREE.Vector2(9999, 9999), mouseForce: 0, formedAt: -1, simT: -1 })

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointsVert,
        fragmentShader: pointsFrag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uPositions: { value: null },
          uVelocities: { value: null },
          uSize: { value: 1.9 * Math.min(devicePixelRatio, 1.75) },
          uInk: { value: new THREE.Color() },
          uAccent: { value: new THREE.Color() },
          uOpacity: { value: 0.9 },
        },
      }),
    [],
  )

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const refs = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      refs[i * 2] = ((i % side) + 0.5) / side
      refs[i * 2 + 1] = (Math.floor(i / side) + 0.5) / side
    }
    g.setAttribute('aRef', new THREE.BufferAttribute(refs, 2))
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    return g
  }, [count, side])

  useEffect(() => {
    material.uniforms.uInk.value.set(cssVar('--fg'))
    material.uniforms.uAccent.value.set(cssVar('--accent'))
  }, [theme, material])

  // Build the simulation once the title's font is ready and laid out.
  useEffect(() => {
    let disposed = false
    let st: ScrollTrigger | undefined
    let onResize = () => {}

    const init = async () => {
      await document.fonts.ready
      const el = heroRefs.title
      const band = el?.closest<HTMLElement>('[data-hero-band]')
      const host = band?.getBoundingClientRect()
      if (!el || !band || !host || disposed) return

      const gpu = new GPUComputationRenderer(side, side, gl)
      const pos0 = gpu.createTexture()
      const vel0 = gpu.createTexture()
      const target = new THREE.DataTexture(new Float32Array(count * 4), side, side, THREE.RGBAFormat, THREE.FloatType)
      const samples = sampleTitle(el, host, count)

      const scatter = () => {
        const p = pos0.image.data as Float32Array
        // Straight out of the intro: everything starts at the collapse point and bursts outward,
        // so the measured particle *becomes* the swarm that trains into the name.
        if (intro.burst) {
          const v = vel0.image.data as Float32Array
          const cx = ((intro.point.x + 1) / 2) * innerWidth - (host.left + host.width / 2)
          const cy = -(((1 - intro.point.y) / 2) * innerHeight - (host.top + host.height / 2))
          for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2, sp = 300 + Math.random() * 1500
            p[i * 4] = Math.max(-host.width / 2, Math.min(host.width / 2, cx)) + (Math.random() - 0.5) * 6
            p[i * 4 + 1] = Math.max(-host.height / 2, Math.min(host.height / 2, cy)) + (Math.random() - 0.5) * 6
            p[i * 4 + 2] = 0
            p[i * 4 + 3] = Math.random()
            v[i * 4] = Math.cos(a) * sp
            v[i * 4 + 1] = Math.sin(a) * sp
          }
          return
        }
        for (let i = 0; i < count; i++) {
          p[i * 4] = (Math.random() - 0.5) * (host.width - 8)
          p[i * 4 + 1] = (Math.random() - 0.5) * (host.height - 8)
          p[i * 4 + 2] = (Math.random() - 0.5) * 60
          p[i * 4 + 3] = Math.random()
        }
      }
      scatter()
      const writeTargets = (xy: Float32Array) => {
        const t = target.image.data as Float32Array
        for (let i = 0; i < count; i++) {
          t[i * 4] = xy[i * 2]
          t[i * 4 + 1] = xy[i * 2 + 1]
        }
        target.needsUpdate = true
      }
      writeTargets(samples)
      const bounds = new THREE.Vector2(host.width / 2 - 6, host.height / 2 - 6)
      // Re-rasterise the title when the layout changes; particles simply re-converge.
      let timer = 0
      onResize = () => {
        clearTimeout(timer)
        timer = window.setTimeout(() => {
          const h = band.getBoundingClientRect()
          bounds.set(h.width / 2 - 6, h.height / 2 - 6)
          writeTargets(sampleTitle(el, h, count))
        }, 200)
      }
      addEventListener('resize', onResize)

      const vel = gpu.addVariable('textureVelocity', velocityShader, vel0)
      const pos = gpu.addVariable('texturePosition', positionShader, pos0)
      gpu.setVariableDependencies(vel, [pos, vel])
      gpu.setVariableDependencies(pos, [pos, vel])
      Object.assign(vel.material.uniforms, {
        uTime: { value: 0 },
        uDelta: { value: 0 },
        uProgress: { value: 0 },
        uScatter: { value: 0 },
        uMouse: { value: state.current.mouse },
        uMouseForce: { value: 0 },
        uTarget: { value: target },
        uBounds: { value: bounds },
      })
      pos.material.uniforms.uDelta = { value: 0 }
      const err = gpu.init()
      if (err) {
        console.warn('[hero] GPGPU unavailable:', err)
        return
      }
      sim.current = { gpu, pos, vel, target }

      const train = () => {
        state.current.progress = reduced ? 1 : 0
        state.current.formedAt = -1
        state.current.simT = reduced ? TRAIN : 0 // advanced by the simulation step, not the wall clock
      }
      // (Re)start training: reseed positions (a burst if we just came out of the intro) and
      // reset the schedule. Cheap: two texture uploads, no shader compiles.
      const restart = () => {
        setFormed(false)
        ;(vel0.image.data as Float32Array).fill(0)
        scatter() // writes burst velocities into vel0 when coming out of the intro
        pos0.needsUpdate = true
        vel0.needsUpdate = true
        gpu.renderTexture(pos0, gpu.getCurrentRenderTarget(pos))
        gpu.renderTexture(vel0, gpu.getCurrentRenderTarget(vel))
        train()
        if (reduced) for (let i = 0; i < 400; i++) step(1 / 60, i / 60) // settle instantly
      }
      heroControl.retrain = restart
      restartRef.current = restart
      // Warm-up: one hidden step compiles the simulation shaders now (during the intro, if one
      // is playing) instead of stalling the hand-over later.
      step(1 / 60, 0)

      st = ScrollTrigger.create({
        trigger: band.closest('section')!,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (s) => (state.current.scatter = s.progress),
      })
      el.dataset.gl = 'on'
    }

    const step = (dt: number, time: number) => {
      const s = sim.current
      if (!s) return
      // Schedule in simulated time: progress = 1 − (1 − t/T)³ (fast start, gentle landing).
      const st = state.current
      if (st.simT >= 0 && st.simT < TRAIN) {
        st.simT = Math.min(TRAIN, st.simT + dt)
        st.progress = 1 - Math.pow(1 - st.simT / TRAIN, 3)
      }
      const u = s.vel.material.uniforms
      u.uTime.value = time
      u.uDelta.value = dt
      u.uProgress.value = state.current.progress
      u.uScatter.value = state.current.scatter
      u.uMouseForce.value = state.current.mouseForce
      s.pos.material.uniforms.uDelta.value = dt
      s.gpu.compute()
    }
    stepRef.current = step

    init()
    return () => {
      disposed = true
      removeEventListener('resize', onResize)
      st?.kill()
      sim.current?.gpu.dispose()
      sim.current?.target.dispose()
      sim.current = null
      if (heroRefs.title) delete heroRefs.title.dataset.gl
      heroControl.retrain = () => {}
      setFormed(false)
    }
  }, [gl, side, count, reduced])

  useFrame(({ clock, pointer }, delta) => {
    const s = sim.current
    if (!s) return
    const st = state.current
    // While the intro plays the hero is built and warm but paused and invisible.
    if (!intro.done) {
      live.current = false
      material.uniforms.uOpacity.value = 0
      return
    }
    if (!live.current) {
      live.current = true
      restartRef.current()
      if (intro.burst) setIntro({ burst: false })
    }
    // Pointer → view-space px; a gentle "gradient kick" that decays when the pointer rests.
    const nx = pointer.x * size.width * 0.5
    const ny = pointer.y * size.height * 0.5
    const moved = Math.hypot(nx - st.mouse.x, ny - st.mouse.y)
    st.mouse.set(nx, ny)
    st.mouseForce += (Math.min(moved / 12, 1) - st.mouseForce) * 0.08
    if (!reduced) stepRef.current(Math.min(delta, 1 / 30), clock.elapsedTime)

    material.uniforms.uPositions.value = s.gpu.getCurrentRenderTarget(s.pos).texture
    material.uniforms.uVelocities.value = s.gpu.getCurrentRenderTarget(s.vel).texture
    // Formation: once the schedule ends and the swarm has settled, hand over to the crisp
    // DOM type and keep the particles as a faint shimmer layer.
    const p = st.progress
    if (p >= 1 && st.formedAt < 0) st.formedAt = st.simT
    if (p >= 1) st.simT += reduced ? SETTLE + 1 : Math.min(delta, 1 / 30) // keep counting settle time in sim-seconds
    if (st.formedAt >= 0 && st.simT - st.formedAt > SETTLE) setFormed(true)
    const target = (heroTelemetry.formed ? 0.32 : 0.92) * (1 - st.scatter * 0.6)
    material.uniforms.uOpacity.value += (target - material.uniforms.uOpacity.value) * 0.06

    // Telemetry for the DOM readout: a plausible loss curve driven by the schedule.
    heroTelemetry.progress = p
    heroTelemetry.epoch = Math.round(p * EPOCHS)
    heroTelemetry.loss = 2.31 * Math.exp(-5.2 * p) + 0.0124 + (1 - p) * 0.04 * Math.abs(Math.sin(clock.elapsedTime * 7.3))
    heroTelemetry.listeners.forEach((l) => l())
  })

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 500]} near={1} far={2000} />
      <points geometry={geometry} material={material} frustumCulled={false} />
    </>
  )
}
