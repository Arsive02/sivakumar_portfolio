import { useRef, useState } from 'react'
import { MathWord } from '@/ui/MathWord'
import { experiences, type ExperienceType } from '@/content/experience'
import { GLSlot } from '@/gl/Slot'
import { blochTarget } from '@/gl/store'
import { gsap, ScrollTrigger, useGSAP } from '@/motion/gsap'
import { SectionHead } from '@/ui/SectionHead'
import { TeX } from '@/ui/TeX'
import { Arrow } from '@/ui/Arrow'
import { ExperienceSpine } from './ExperienceSpine'
import { animate, stagger } from '@/motion/anime'

/**
 * Each role is a quantum state. States are spread over the Bloch sphere on a
 * Fibonacci lattice (golden-angle spiral), so consecutive roles are well separated.
 */
const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const stateFor = (i: number, n: number) => {
  const z = 1 - (2 * (i + 0.5)) / n
  return { theta: Math.acos(z), phi: (i * GOLDEN) % (2 * Math.PI) }
}

const typeLabel: Record<ExperienceType, string> = {
  industry: 'Industry',
  research: 'Research',
  internship: 'Internship',
  teaching: 'Teaching',
  responsibility: 'Leadership',
}

function Ket({ theta, phi }: { theta: number; phi: number }) {
  const a = Math.cos(theta / 2).toFixed(2)
  const b = Math.sin(theta / 2).toFixed(2)
  const p = (phi / Math.PI).toFixed(2)
  return <TeX className="text-sm">{`|\\psi\\rangle = ${a}\\,|0\\rangle + e^{i\\,${p}\\pi}\\,${b}\\,|1\\rangle`}</TeX>
}

export function Experience() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const list = useRef<HTMLOListElement>(null)
  const shown = hovered ?? active
  const hoveredRef = useRef<number | null>(null)
  hoveredRef.current = hovered
  const s = stateFor(shown, experiences.length)

  // Hover previews a role: the Bloch vector swings to its state and its chips ripple in.
  const hoverRole = (i: number | null, li?: HTMLElement) => {
    setHovered(i)
    Object.assign(blochTarget, stateFor(i ?? active, experiences.length))
    if (i !== null && li) animate(li.querySelectorAll('[data-chip]'), { translateY: [6, 0], opacity: [0.4, 1], duration: 500, delay: stagger(28), ease: 'outQuad' })
  }

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>('[data-role]')
      rows.forEach((row, i) =>
        ScrollTrigger.create({
          trigger: row,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (st) => {
            if (!st.isActive) return
            setActive(i)
            if (hoveredRef.current === null) Object.assign(blochTarget, stateFor(i, experiences.length))
          },
        }),
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="experience" className="container-x relative py-28 md:py-40">
      <SectionHead
        index="03"
        label="Experience"
        title={<>A walk on the <MathWord kind="bloch">Bloch</MathWord> sphere.</>}
        aside="Each role is a point on the sphere. As you scroll, the arrow swings over to the next one."
      />
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:sticky md:top-24 md:col-span-5 md:self-start">
          <div className="relative aspect-square">
            <GLSlot scene="bloch" className="absolute inset-0" fallback={<BlochFallback />} />
            <span className="pointer-events-none absolute left-1/2 top-[6%] -translate-x-1/2 font-mono text-xs text-muted">|0⟩</span>
            <span className="pointer-events-none absolute bottom-[6%] left-1/2 -translate-x-1/2 font-mono text-xs text-muted">|1⟩</span>
          </div>
          <div className="mt-4 flex min-h-[3.5rem] flex-col gap-1 border-t hairline pt-3">
            <Ket theta={s.theta} phi={s.phi} />
            <span className="font-mono text-[11px] text-muted">
              θ = {((s.theta * 180) / Math.PI).toFixed(1)}° · φ = {((s.phi * 180) / Math.PI).toFixed(1)}° · {experiences[shown].company}
            </span>
          </div>
        </div>

        <ol ref={list} data-roles className="relative md:col-span-7">
          <ExperienceSpine list={list} count={experiences.length} />
          {experiences.map((e, i) => (
            <li
              key={e.id}
              data-role
              onPointerEnter={(ev) => hoverRole(i, ev.currentTarget)}
              onPointerLeave={() => hoverRole(null)}
              className={`group relative pb-6 pl-12 transition-opacity duration-500 md:pl-16 ${i === active || i === hovered ? 'opacity-100' : 'opacity-45'}`}
            >
              {/* Hover card: a standard material (content layer, so no Liquid Glass) + a hairline that lights up */}
              <div className="relative -ml-5 mb-10 rounded-2xl border border-transparent p-5 transition-[transform,border-color,background-color,box-shadow] duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-line group-hover:bg-fg/[0.03] group-hover:shadow-[0_24px_60px_-40px_rgba(0,0,0,.7)]">
              <span className="pointer-events-none absolute inset-y-6 left-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-y-100" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p className="eyebrow">
                  {typeLabel[e.type]} · {e.period.start} to {e.period.end}
                </p>
                <p className="eyebrow">{e.location}</p>
              </div>
              <h3 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{e.title}</h3>
              <p className="mt-1 text-lg text-muted">{e.company}</p>
              <ul className="mt-5 space-y-2.5">
                {e.highlights.map((h) => (
                  <li key={h} className="grid grid-cols-[1rem_1fr] gap-2 text-[0.98rem] leading-relaxed">
                    <span className="font-mono text-accent">∙</span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {e.skills.map((s) => (
                  <span key={s} data-chip className="chip transition-colors group-hover:border-fg/25 group-hover:text-fg">
                    {s}
                  </span>
                ))}
                {[...Object.entries(e.documents ?? {}), ...Object.entries(e.links ?? {})].map(([k, href]) =>
                  href ? (
                    <a key={k} href={href} target="_blank" rel="noopener" className="link-draw ml-2 font-mono text-[11px] uppercase">
                      {k} <Arrow />
                    </a>
                  ) : null,
                )}
              </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function BlochFallback() {
  return (
    <svg viewBox="-1.3 -1.3 2.6 2.6" className="h-full w-full text-fg" aria-hidden>
      <circle r="1" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth=".01" />
      <ellipse rx="1" ry=".3" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth=".01" />
      <line x1="0" y1="-1.2" x2="0" y2="1.2" stroke="currentColor" strokeOpacity=".4" strokeWidth=".01" />
      <line x1="0" y1="0" x2=".55" y2="-.62" stroke="var(--accent)" strokeWidth=".02" />
      <circle cx=".55" cy="-.62" r=".04" fill="var(--accent)" />
    </svg>
  )
}
