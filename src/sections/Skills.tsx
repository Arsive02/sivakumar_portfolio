import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MathWord } from '@/ui/MathWord'
import { attention, groupLabels, skills } from '@/content/skills'
import { ScrollTrigger } from '@/motion/gsap'
import { prefersReducedMotion } from '@/lib/useReducedMotion'
import { SectionHead } from '@/ui/SectionHead'
import { TeX } from '@/ui/TeX'

const N = skills.length
const CELL = 10

/** Row-wise softmax of the affinity matrix at temperature τ. */
function softmaxRows(m: number[][], tau: number) {
  return m.map((row) => {
    const ex = row.map((v) => Math.exp(v / tau))
    const z = ex.reduce((a, b) => a + b, 0)
    return ex.map((e) => e / z)
  })
}

export function Skills() {
  const svg = useRef<SVGSVGElement>(null)
  const [tau, setTau] = useState(0.35)
  const [focus, setFocus] = useState<number | null>(null)
  const tauRef = useRef(tau)
  const query = useRef<HTMLDivElement>(null)
  const queryTitle = useRef<HTMLParagraphElement>(null)
  const [offset, setOffset] = useState(0)
  const offsetRef = useRef(0)

  const weights = useMemo(() => softmaxRows(attention, tau), [tau])
  const row = focus ?? 0
  const top = useMemo(
    () =>
      weights[row]
        .map((w, j) => ({ j, w }))
        .filter((x) => x.j !== row)
        .sort((a, b) => b.w - a.w)
        .slice(0, 5),
    [weights, row],
  )

  // The QUERY panel slides so its title sits level with the hovered row (lg+ only).
  useLayoutEffect(() => {
    const place = () => {
      const svgEl = svg.current, q = query.current, title = queryTitle.current
      const rowEl = svgEl?.querySelector<SVGTextElement>(`[data-row="${focus ?? 0}"]`)
      if (!svgEl || !q || !title || !rowEl || !matchMedia('(min-width: 1024px)').matches) return setOffset((offsetRef.current = 0))
      // Layout positions via offsetTop (unaffected by the in-flight transform), relative to the aside.
      const aside = q.offsetParent as HTMLElement
      const base = aside.getBoundingClientRect().top
      const r = rowEl.getBoundingClientRect(), m = svgEl.getBoundingClientRect()
      const naturalTitle = base + title.offsetTop + title.offsetHeight / 2
      let next = r.top + r.height / 2 - naturalTitle
      next = Math.max(0, Math.min(next, m.bottom - naturalTitle)) // the title may reach the last row
      setOffset((offsetRef.current = next))
    }
    place()
    const ro = new ResizeObserver(place)
    if (svg.current) ro.observe(svg.current)
    return () => ro.disconnect()
  }, [focus])

  // Scroll anneals the temperature: uniform attention → sharp attention.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const st = ScrollTrigger.create({
      trigger: svg.current,
      start: 'top 85%',
      end: 'bottom 40%',
      scrub: true,
      onUpdate: (s) => {
        const t = +(4 * Math.pow(0.08 / 4, s.progress)).toFixed(3) // geometric 4 → 0.08
        if (t !== tauRef.current) setTau((tauRef.current = t))
      },
    })
    return () => st.kill()
  }, [])


  return (
    <section id="skills" className="container-x relative py-28 md:py-40">
      <SectionHead
        index="04"
        label="Skills"
        title={<>What attends to <MathWord kind="softmax">what</MathWord>.</>}
        aside="My toolkit as an attention map. Each row is a skill, and each column shows what it leans on. As you scroll, the temperature drops and the pattern gets sharper."
      />
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* τ and the skill groups sit above the matrix, so the query panel has the whole column */}
          <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-6 border-t hairline pt-4">
            <TeX className="text-sm text-muted">{'\\alpha_{ij}=\\frac{\\exp(s_{ij}/\\tau)}{\\sum_k \\exp(s_{ik}/\\tau)}'}</TeX>
            <p className="mt-2 font-mono text-[11px] tabular-nums text-muted">
              τ = <span className="text-accent">{tau.toFixed(3)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(groupLabels).map(([g, label]) => (
              <span key={g} className="chip">
                {label} · {skills.filter((s) => s.group === g).length}
              </span>
            ))}
          </div>
          </div>
          <svg
            ref={svg}
            viewBox={`-92 -92 ${N * CELL + 96} ${N * CELL + 96}`}
            className="w-full select-none"
            role="img"
            aria-label="Skill attention matrix"
          >
            {skills.map((s, i) => (
              <g key={s.id}>
                <text
                  data-row={i}
                  x={-6}
                  y={i * CELL + CELL * 0.72}
                  textAnchor="end"
                  className={`font-mono transition-colors ${focus === i ? 'fill-accent' : 'fill-muted'}`}
                  fontSize="5.4"
                >
                  {s.id}
                </text>
                <text
                  transform={`translate(${i * CELL + CELL * 0.7} -6) rotate(-60)`}
                  className={`font-mono ${focus !== null && top.some((t) => t.j === i) ? 'fill-accent' : 'fill-muted'}`}
                  fontSize="5.4"
                >
                  {s.id}
                </text>
              </g>
            ))}
            {weights.map((r, i) =>
              r.map((w, j) => {
                // Brightness relative to uniform attention (1/N): diffuse rows stay dim, sharp peaks glow.
                const v = Math.min(1, (w * N) / 5)
                const hot = focus === i
                return (
                  <rect
                    key={`${i}-${j}`}
                    x={j * CELL + 0.6}
                    y={i * CELL + 0.6}
                    width={CELL - 1.2}
                    height={CELL - 1.2}
                    rx={0.8}
                    fill={hot || v > 0.6 ? 'var(--accent)' : 'var(--fg)'}
                    fillOpacity={0.04 + 0.86 * v * (focus === null || hot ? 1 : 0.45)}
                    onPointerEnter={() => setFocus(i)}
                    onClick={() => setFocus(i)}
                  />
                )
              }),
            )}
          </svg>
        </div>
        <aside className="relative space-y-8 lg:col-span-4">
          <div ref={query} className="transition-transform duration-500 ease-[var(--ease-out)]" style={{ transform: `translateY(${offset}px)` }}>
            <p className="eyebrow">Query</p>
            <p ref={queryTitle} className="mt-2 font-serif text-4xl">
              <span className="mr-2 inline-block h-px w-6 -translate-y-2 bg-accent align-middle" aria-hidden />
              {skills[row].id}
            </p>
            <p className="eyebrow mt-1">{groupLabels[skills[row].group]}</p>
            <ul className="mt-6 space-y-3">
              {top.map(({ j, w }) => (
                <li key={j} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-3 text-sm">
                  <span>{skills[j].id}</span>
                  <span className="h-px bg-line">
                    <span className="block h-px origin-left bg-accent transition-transform duration-300" style={{ transform: `scaleX(${Math.min(1, w / top[0].w)})` }} />
                  </span>
                  <span className="text-right font-mono text-[11px] tabular-nums text-muted">{w.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
