import { useEffect, useRef, useState } from 'react'
import { MathWord } from '@/ui/MathWord'
import { profile } from '@/content/profile'
import { education } from '@/content/experience'
import { dft, evaluate, glyphContour, type Term } from '@/lib/fourier'
import { cssVar, useTheme } from '@/lib/theme'
import { prefersReducedMotion } from '@/lib/useReducedMotion'
import { ScrollTrigger } from '@/motion/gsap'
import { Reveal } from '@/motion/Reveal'
import { SectionHead } from '@/ui/SectionHead'
import { TeX } from '@/ui/TeX'
import { Arrow } from '@/ui/Arrow'
import { Tilt } from '@/ui/Tilt'
import { Picture } from '@/ui/Picture'

const MAX_TERMS = 160

/**
 * Fourier epicycles: the initial "S", traced by a chain of rotating circles.
 * Scrolling through the section raises the number of harmonics from 1 → 160,
 * so the drawing sharpens from a circle into the glyph.
 */
function Epicycles() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [n, setN] = useState(1)
  const theme = useTheme()
  const nRef = useRef(1)

  useEffect(() => {
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    let terms: Term[] = []
    let raf = 0
    let visible = false
    let t = 0
    let last = performance.now()
    let curve: { re: number; im: number }[] = []
    let curveN = -1
    const trail: { re: number; im: number }[] = []
    const fg = cssVar('--fg-rgb').split(' ').join(',')
    const accent = cssVar('--accent')

    const resize = () => {
      const r = cv.getBoundingClientRect()
      const dpr = Math.min(devicePixelRatio, 2)
      cv.width = r.width * dpr
      cv.height = r.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      if (!visible || !terms.length) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t = (t + dt * 0.07) % 1
      const { width: W, height: H } = cv.getBoundingClientRect()
      const scale = Math.min(W, H) * 0.42
      const cx = W / 2, cy = H / 2
      const count = nRef.current

      if (curveN !== count) {
        curve = Array.from({ length: 400 }, (_, i) => evaluate(terms, count, i / 400))
        curveN = count
        trail.length = 0
      }

      ctx.clearRect(0, 0, W, H)
      // Full reconstruction at this order, faint.
      ctx.beginPath()
      curve.forEach((p, i) => (i ? ctx.lineTo(cx + p.re * scale, cy + p.im * scale) : ctx.moveTo(cx + p.re * scale, cy + p.im * scale)))
      ctx.closePath()
      ctx.strokeStyle = `rgba(${fg},0.14)`
      ctx.lineWidth = 1
      ctx.stroke()

      // Epicycle chain.
      let x = cx, y = cy
      ctx.lineWidth = 0.75
      for (let i = 0; i < count; i++) {
        const { k, amp, phase } = terms[i]
        const r = amp * scale
        const a = 2 * Math.PI * k * t + phase
        if (r > 0.6) {
          ctx.strokeStyle = `rgba(${fg},${Math.max(0.05, 0.3 - i * 0.004)})`
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.stroke()
        }
        const nx = x + r * Math.cos(a), ny = y + r * Math.sin(a)
        ctx.strokeStyle = `rgba(${fg},0.45)`
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(nx, ny)
        ctx.stroke()
        x = nx
        y = ny
      }

      // The pen and its recent trail.
      trail.unshift({ re: x, im: y })
      if (trail.length > 160) trail.pop()
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      for (let i = 1; i < trail.length; i++) {
        ctx.strokeStyle = accent
        ctx.globalAlpha = 1 - i / trail.length
        ctx.beginPath()
        ctx.moveTo(trail[i - 1].re, trail[i - 1].im)
        ctx.lineTo(trail[i].re, trail[i].im)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)
    resize()
    addEventListener('resize', resize)
    glyphContour('S', 'italic 300px "Instrument Serif"').then((z) => {
      terms = dft(z, MAX_TERMS / 2)
      if (prefersReducedMotion()) {
        nRef.current = MAX_TERMS
        setN(MAX_TERMS)
      }
    })
    raf = requestAnimationFrame(draw)

    const st = prefersReducedMotion()
      ? undefined
      : ScrollTrigger.create({
          trigger: cv.closest('section')!,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: true,
          onUpdate: (s) => {
            const v = Math.max(1, Math.round(1 + Math.pow(s.progress, 1.6) * (MAX_TERMS - 1)))
            if (v !== nRef.current) {
              nRef.current = v
              setN(v)
            }
          },
        })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      removeEventListener('resize', resize)
      st?.kill()
    }
  }, [theme])

  return (
    <figure className="relative">
      <canvas ref={canvas} className="aspect-square w-full" aria-label="A Fourier series drawing the letter S with rotating circles" role="img" />
      <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t hairline pt-3">
        <TeX className="text-sm text-muted">{'z(t)=\\sum_{k}c_k\\,e^{2\\pi i k t}'}</TeX>
        <span className="font-mono text-[11px] tabular-nums text-muted">
          N = <span className="text-accent">{String(n).padStart(3, '0')}</span> harmonics
        </span>
      </figcaption>
    </figure>
  )
}

export function About() {
  return (
    <section id="about" className="container-x relative py-28 md:py-40">
      <SectionHead index="01" label="About" title={<>I like the math <MathWord kind="riemann">underneath</MathWord> the model.</>} />
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:sticky md:top-28 md:col-span-6 md:self-start lg:col-span-5">
          <Epicycles />
        </div>
        <div className="space-y-14 md:col-span-6 lg:col-span-6 lg:col-start-7">
          <div className="grid items-end gap-8 sm:grid-cols-[minmax(0,19rem)_1fr]">
            <Tilt max={5} className="group">
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[28px] border hairline bg-black shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
                <Picture
                  name="profile"
                  alt={profile.name}
                  sizes="(min-width: 640px) 360px, 100vw"
                  className="h-full w-full origin-[50%_30%] scale-[1.18] object-cover object-[50%_20%] transition duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.12]"
                />
                {/* Spotlight that follows the pointer (Tilt sets --mx/--my) */}
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [background:radial-gradient(40%_40%_at_var(--mx,50%)_var(--my,50%),rgb(255_255_255/0.18),transparent)] group-hover:opacity-100" />
              </figure>
            </Tilt>
            <div className="space-y-3 pb-1">
              <p className="font-serif text-3xl leading-tight">{profile.name}</p>
              <p className="text-muted">{profile.role}</p>
            </div>
          </div>
          <Reveal as="p" className="text-xl leading-relaxed md:text-2xl">
            {profile.intro}
          </Reveal>
          <div>
            <p className="eyebrow mb-4">Focus</p>
            <ul className="flex flex-wrap gap-2">
              {profile.focus.map((f) => (
                <li key={f} className="chip">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Education</p>
            <ul className="divide-y divide-line border-y hairline">
              {education.map((e) => (
                <li key={e.degree} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-serif text-2xl leading-tight">{e.degree}</p>
                    <p className="mt-1 text-muted">{e.institution}</p>
                    <p className="mt-3 text-sm text-muted">{e.courses.slice(0, 5).join(' · ')}</p>
                  </div>
                  <div className="font-mono text-xs text-muted sm:text-right">
                    <p>{e.period}</p>
                    <p className="mt-1">
                      GPA <span className="text-fg">{e.gpa}</span>/4.00
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {profile.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-draw text-lg">
                {l.label} <Arrow className="text-accent" />
              </a>
            ))}
            <a href={profile.resume} target="_blank" rel="noopener" className="link-draw text-lg">
              Résumé <Arrow className="text-accent" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
