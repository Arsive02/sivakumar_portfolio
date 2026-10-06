import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ThemeToggle } from './ThemeToggle'
import { gsap, ScrollTrigger } from '@/motion/gsap'
import { scrollToId } from '@/motion/SmoothScroll'
import { profile } from '@/content/profile'
import { animate } from '@/motion/anime'
import { replayIntro } from '@/intro/state'
import { capsuleDisplacementMap } from '@/lib/glassMap'

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'honours', label: 'Honours' },
  { id: 'life', label: 'Life' },
  { id: 'contact', label: 'Contact' },
] as const

export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { pathname } = useLocation()
  const home = pathname === '/'
  const navigate = useNavigate()

  // The logo takes you back to the very beginning: top of the homepage + the landing intro.
  const toIntro = (e: React.MouseEvent) => {
    e.preventDefault()
    const play = () => {
      scrollToId(null, true)
      replayIntro()
    }
    if (home) play()
    else {
      navigate('/')
      requestAnimationFrame(() => requestAnimationFrame(play))
    }
  }
  const bar = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>('')
  const [compact, setCompact] = useState(false)
  const pill = useRef<HTMLSpanElement>(null)
  const glass = useRef<HTMLElement>(null)
  // Rebuild the lens map when the bar's size changes (it tightens when scrolled).
  const [glassSize, setGlassSize] = useState({ w: 1200, h: 52 })
  const [lensMap, setLensMap] = useState<string | null>(null)
  useEffect(() => {
    const el = glass.current
    if (!el || !document.documentElement.classList.contains('refraction')) return
    let raf = 0
    const ro = new ResizeObserver(([e]) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const w = Math.round(e.borderBoxSize[0].inlineSize / 8) * 8, h = Math.round(e.borderBoxSize[0].blockSize)
        setGlassSize((s) => (s.w === w && s.h === h ? s : { w, h }))
      })
    })
    ro.observe(el)
    return () => (ro.disconnect(), cancelAnimationFrame(raf))
  }, [])
  useEffect(() => {
    if (!document.documentElement.classList.contains('refraction')) return
    const id = setTimeout(() => setLensMap(capsuleDisplacementMap(glassSize.w, glassSize.h)), 60)
    return () => clearTimeout(id)
  }, [glassSize])
  const list = useRef<HTMLUListElement>(null)

  // Sliding active pill: FLIP from the previous link's box to the new one.
  useLayoutEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    const p = pill.current
    if (!p) return
    if (!el || !home) return void animate(p, { opacity: 0, duration: 250 })
    animate(p, { left: el.offsetLeft - 10, width: el.offsetWidth + 20, opacity: 1, duration: 650, ease: 'outElastic(1, .7)' })
  }, [active, home])

  // Page progress hairline + active-section tracking.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (s) => {
        gsap.set(bar.current, { scaleX: s.progress })
        setCompact(s.scroll() > 40)
        document.documentElement.classList.toggle('scrolled', s.scroll() > 8)
      },
    })
    const triggers = home
      ? sections.map(({ id }) =>
          ScrollTrigger.create({ trigger: `#${id}`, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => s.isActive && setActive(id) }),
        )
      : []
    return () => {
      st.kill()
      triggers.forEach((t) => t.kill())
    }
  }, [home])

  const go = (id: string) => (e: React.MouseEvent) => {
    if (!home) return
    e.preventDefault()
    // No URL rewrite here: replaceState(null) would drop React Router's history key.
    scrollToId(id)
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3">
      {/* Scroll edge effect: content sliding under the bar is blurred + faded for legibility. */}
      <div className="scroll-edge" aria-hidden />
      {/* Refraction for the glass (Chromium honours SVG filters in backdrop-filter). */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        {/* Edge lensing: a displacement map built from the capsule's own shape (src/lib/glassMap.ts),
            applied per colour channel with slightly different strengths for a hint of dispersion. */}
        <filter id="liquid-glass" x="0" y="0" width={glassSize.w} height={glassSize.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          {lensMap && <feImage href={lensMap} x="0" y="0" width={glassSize.w} height={glassSize.h} preserveAspectRatio="none" result="map" />}
          <feDisplacementMap in="SourceGraphic" in2="map" scale="34" xChannelSelector="R" yChannelSelector="G" result="dr" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="30" xChannelSelector="R" yChannelSelector="G" result="dg" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="26" xChannelSelector="R" yChannelSelector="G" result="db" />
          <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feBlend in="r" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="b" mode="screen" />
        </filter>
      </svg>
      <nav
        ref={glass}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`)
          e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`)
          e.currentTarget.style.setProperty('--glow', '1')
        }}
        onPointerLeave={(e) => e.currentTarget.style.setProperty('--glow', '0')}
        onPointerDown={() => {
          // Press: the light spreads through the glass, then settles.
          const o = { v: 0 }
          animate(o, { v: [0, 1, 0], duration: 700, ease: 'outQuad', onUpdate: () => glass.current?.style.setProperty('--press', String(o.v)) })
        }}
        className={`liquid-glass pointer-events-auto relative mx-auto flex max-w-[1440px] items-center justify-between gap-6 overflow-hidden rounded-full px-5 transition-[padding,max-width] duration-700 ease-[var(--ease-out)] ${compact ? 'max-w-[1180px] py-2' : 'py-3'}`}
        aria-label="Primary"
      >
        <div ref={bar} className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-accent/80" />
        <Link to="/" onClick={toIntro} aria-label="Back to the intro" className="font-serif text-xl leading-none tracking-tight">
          {profile.short}
          <span className="text-accent">.</span>
        </Link>
        <ul ref={list} className="relative hidden items-center gap-5 lg:flex">
          <span ref={pill} className="absolute top-1/2 h-7 -translate-y-1/2 rounded-full border border-fg/15 bg-fg/[0.07] opacity-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]" aria-hidden />
          {sections.map(({ id, label }, i) => (
            <li key={id} data-id={id} className="relative">
              <Link
                to={`/#${id}`}
                onClick={go(id)}
                className={`eyebrow transition-colors hover:text-fg ${active === id && home ? '!text-fg' : ''}`}
              >
                <span className={active === id && home ? 'text-accent' : ''}>{String(i + 1).padStart(2, '0')}</span> {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5">
          <button onClick={onOpenPalette} className="eyebrow flex items-center gap-1.5 hover:text-fg" aria-label="Open command menu">
            <kbd className="rounded border hairline px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
