import { useEffect, useRef, useState } from 'react'
import { GLSlot } from '@/gl/Slot'
import { gsap } from '@/motion/gsap'
import { getLenis } from '@/motion/SmoothScroll'
import { meanRadius, orbitals } from '@/lib/hydrogen'
import { profile } from '@/content/profile'
import { TeX } from '@/ui/TeX'
import { intro, markIntroSeen, setIntro } from './state'

const GLYPHS = 'ψφ∂∇∑∫⟨⟩|01αβħ'

/**
 * The quantum-collapse landing. The name and the electron cloud are both "in superposition"
 * until observed; a click (or Enter) is the measurement: the name snaps to definite letters,
 * the cloud collapses to the clicked point, and the camera dives through it into the site.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const name = useRef<HTMLHeadingElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const [state, setState] = useState(0)
  const [phase, setPhase] = useState<'superposition' | 'measuring'>('superposition')
  const busy = useRef(false)

  // Superposition drift through the three orbitals + flickering name.
  useEffect(() => {
    getLenis()?.stop()
    scrollTo(0, 0)
    const drift = gsap.to(intro, { mix: 3, duration: 15, ease: 'none', repeat: -1 })
    const hud = setInterval(() => setState(Math.floor(intro.mix + 0.5) % 3), 250)
    const chars = [...name.current!.querySelectorAll<HTMLSpanElement>('[data-ch]')]
    const flicker = setInterval(() => {
      if (busy.current) return
      for (const c of chars) {
        const real = c.dataset.ch!
        const excited = Math.random() < 0.18
        c.textContent = excited ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : real
        c.style.opacity = String(excited ? 0.35 + Math.random() * 0.4 : 0.55 + Math.random() * 0.45)
        c.style.transform = `translateY(${(Math.random() - 0.5) * (excited ? 10 : 3)}px)`
      }
    }, 90)
    return () => {
      drift.kill()
      clearInterval(hud)
      clearInterval(flicker)
    }
  }, [])

  const observe = (x = innerWidth / 2, y = innerHeight / 2) => {
    if (busy.current) return
    busy.current = true
    setPhase('measuring')
    gsap.killTweensOf(intro, 'mix')
    setIntro({ point: { x: (x / innerWidth) * 2 - 1, y: 1 - (y / innerHeight) * 2 } })
    const page = document.querySelector<HTMLElement>('[data-page]')!
    const chars = [...name.current!.querySelectorAll<HTMLSpanElement>('[data-ch]')]

    const tl = gsap.timeline({
      onComplete: () => {
        markIntroSeen()
        page.style.clipPath = ''
        document.documentElement.classList.remove('intro-on')
        getLenis()?.start()
        onDone()
      },
    })
    // 1. The name collapses into definite letters, left to right.
    chars.forEach((c, k) =>
      tl.call(() => {
        c.textContent = c.dataset.ch!
        gsap.to(c, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
      }, undefined, k * 0.035),
    )
    // 2. The amplitude rushes to the observed point; a flash ring marks the measurement.
    tl.to(intro, { collapse: 1, duration: 0.75, ease: 'power3.in' }, 0.05)
    tl.set(ring.current, { left: x, top: y, scale: 0, opacity: 1 }, 0.62)
    tl.to(ring.current, { scale: 46, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.62)
    tl.to([name.current, '[data-hud]'], { opacity: 0, y: -12, duration: 0.5, ease: 'power2.in' }, 0.55)
    // 3. Dive through the nucleus.
    tl.to(intro, { dive: 1, duration: 1.5, ease: 'expo.in' }, 0.8)
    // 4. The site grows out of the collapse point (and the hero starts as a burst from it).
    tl.call(() => {
      page.style.setProperty('--ix', `${x}px`)
      page.style.setProperty('--iy', `${y}px`)
      page.style.clipPath = `circle(0px at ${x}px ${y}px)`
      document.documentElement.classList.remove('intro-on')
    }, undefined, 1.55)
    tl.to(intro, { fade: 1, duration: 0.8, ease: 'power2.inOut' }, 1.6)
    tl.to(page, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at ${x}px ${y}px)`, duration: 0.9, ease: 'expo.inOut' }, 1.6)
    // 5. As the dive exits, hand over: the hero mounts and bursts out of the collapse point.
    tl.call(() => setIntro({ burst: true, done: true }), undefined, 1.95)
    tl.to(root.current, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 2.1)
  }

  // Enter = observe, Esc = skip.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') observe()
      if (e.key === 'Escape') skip()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  const skip = () => {
    if (busy.current) return
    busy.current = true
    markIntroSeen()
    document.documentElement.classList.remove('intro-on')
    getLenis()?.start()
    gsap.to(root.current, { opacity: 0, duration: 0.4, onComplete: onDone })
  }

  const o = orbitals[state]
  return (
    <div ref={root} className="fixed inset-0 z-[65] select-none" role="dialog" aria-label="Intro">
      {/* the orbital renders in the shared canvas beneath this transparent layer */}
      <GLSlot scene="orbital" className="absolute inset-0" />
      <button className="absolute inset-0 cursor-none" aria-label="Observe and enter the site" onClick={(e) => observe(e.clientX, e.clientY)} />

      <div data-hud className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-between p-5 font-mono text-[11px] text-muted md:p-8">
        <div className="space-y-1">
          <p className="text-fg">
            |ψ<sub>{o.n}{o.l}{o.m}</sub>|²
          </p>
          <p>
            n={o.n} l={o.l} m={o.m} · <TeX>{o.label}</TeX>
          </p>
          <p>⟨r⟩ = {meanRadius(o).toFixed(1)} a₀</p>
        </div>
        <p className="text-right">
          hydrogen · {phase === 'superposition' ? 'unobserved' : 'measuring…'}
          <br />
          <span className="text-accent">●</span> ψ &gt; 0 · <span className="opacity-60">●</span> ψ &lt; 0
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 grid justify-items-center gap-5 p-8 pb-14 text-center">
        <h1 ref={name} className="display text-[clamp(3.5rem,11vw,10rem)] tracking-[-0.03em]" aria-label={profile.name}>
          {profile.short.split('').map((ch, k) => (
            <span key={k} data-ch={ch} className="inline-block transition-none" aria-hidden>
              {ch}
            </span>
          ))}
        </h1>
        <div data-hud className="space-y-3">
          <p className="font-mono text-[11px] text-muted">|me⟩ = α|AI engineer⟩ + β|musician⟩ + γ|chess player⟩</p>
          <p className="eyebrow text-fg">
            click anywhere to <span className="text-accent">observe</span> · enter ↵
          </p>
        </div>
      </div>

      <button onClick={skip} className="glass-clear eyebrow absolute bottom-5 right-5 z-10 rounded-full px-4 py-2 !text-white/90 md:bottom-8 md:right-8">
        skip · esc
      </button>

      <div ref={ring} className="pointer-events-none fixed h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent opacity-0 shadow-[0_0_24px_rgb(var(--accent-rgb)/0.8)]" />
    </div>
  )
}
