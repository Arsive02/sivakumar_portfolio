import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { GLSlot } from '@/gl/Slot'
import { heroControl, heroRefs, heroTelemetry, useGLReady } from '@/gl/store'
import { useIntroDone } from '@/intro/state'
import { profile } from '@/content/profile'
import { gsap, useGSAP } from '@/motion/gsap'
import { Reveal } from '@/motion/Reveal'
import { scrollToId } from '@/motion/SmoothScroll'
import { hasWebGL2 } from '@/lib/webgl'
import { prefersReducedMotion } from '@/lib/useReducedMotion'

const subscribe = (cb: () => void) => (heroTelemetry.listeners.add(cb), () => heroTelemetry.listeners.delete(cb))

function Readout() {
  const epoch = useSyncExternalStore(subscribe, () => heroTelemetry.epoch)
  const loss = useSyncExternalStore(subscribe, () => heroTelemetry.loss.toFixed(4))
  const done = epoch >= 200
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] tabular-nums text-muted">
      <span>
        epoch <span className="text-fg">{String(epoch).padStart(3, '0')}</span>/200
      </span>
      <span>
        loss <span className={done ? 'text-accent' : 'text-fg'}>{loss}</span>
      </span>
      <span className="hidden sm:inline">optim SGD · β 0.9</span>
      <button onClick={() => heroControl.retrain()} className="link-draw text-fg" data-cursor>
        ↻ retrain
      </button>
    </div>
  )
}

export function Hero() {
  const title = useRef<HTMLHeadingElement>(null)
  // The no-WebGL fallback clock only starts once the intro is out of the way.
  const introDone = useIntroDone()
  const root = useRef<HTMLElement>(null)
  const gl = useGLReady()

  useEffect(() => {
    heroRefs.title = title.current
    return () => void (heroRefs.title = null)
  }, [])

  // The name is invisible until the particles have *formed* it; then the crisp type fades in
  // under them. Without WebGL (or if GL never arrives) it simply fades in after a beat.
  const formed = useSyncExternalStore(subscribe, () => heroTelemetry.formed)
  const [fallback, setFallback] = useState(false)
  useEffect(() => {
    if (!hasWebGL2() || prefersReducedMotion()) return setFallback(true)
    if (!introDone) return // the clock starts only once the hero is allowed to run
    const t = setTimeout(() => !title.current?.dataset.gl && setFallback(true), 6000)
    return () => clearTimeout(t)
  }, [introDone])
  const showName = formed || fallback

  useGSAP(
    () => {
      gsap.to(title.current, { opacity: showName ? 1 : 0, duration: showName ? 0.9 : 0.25, ease: showName ? 'power2.out' : 'power1.in' })
    },
    { scope: root, dependencies: [showName] },
  )

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-28">
      <div className="container-x pointer-events-none relative z-10 flex flex-1 flex-col gap-4">
        <div className="flex items-end justify-between gap-6">
          <p className="eyebrow max-w-[18rem]">
            {profile.role}
            <br />
            {profile.location}
          </p>
        </div>
        {/* The particle field lives only in this band: below the eyebrow row, above the hairline. */}
        <div data-hero-band className="relative flex min-h-[38svh] flex-1 items-end">
          {/* Mounted even during the intro (paused + invisible) so it's warm at the hand-over. */}
          <GLSlot scene="hero" className="!absolute inset-0" />
          <h1
            ref={title}
            aria-label={profile.name}
            style={{ opacity: 0 }}
            className="display relative select-none pb-2 text-[clamp(4.5rem,19.5vw,22rem)] tracking-[-0.035em] text-fg"
          >
            {profile.short}
          </h1>
        </div>
        <div className="pointer-events-auto grid items-end gap-6 border-t hairline pt-5 md:grid-cols-12">
          <Reveal as="p" immediate delay={0.3} className="font-serif text-2xl italic leading-tight md:col-span-5 md:text-3xl">
            {profile.tagline}
          </Reveal>
          <div className="md:col-span-5 md:col-start-6">{gl ? <Readout /> : <span className="eyebrow">Ramakrishnan</span>}</div>
          <button onClick={() => scrollToId('about')} className="eyebrow justify-self-start hover:text-fg md:col-span-2 md:justify-self-end">
            Scroll ↓
          </button>
        </div>
      </div>
    </section>
  )
}
