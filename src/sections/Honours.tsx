import { Delaunay } from 'd3-delaunay'
import { MathWord } from '@/ui/MathWord'
import { useEffect, useMemo, useRef, useState } from 'react'
import { achievements, type AchievementKind } from '@/content/achievements'
import { ScrollTrigger } from '@/motion/gsap'
import { prefersReducedMotion } from '@/lib/useReducedMotion'
import { SectionHead } from '@/ui/SectionHead'
import { Arrow } from '@/ui/Arrow'
import { ModelSlot } from '@/gl/ModelSlot'
import { Tilt } from '@/ui/Tilt'
import { animate, onceVisible, stagger } from '@/motion/anime'

const W = 1000, H = 900
const ITER = 24

/** Seeded PRNG so the layout is identical on every visit. */
function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Polygon centroid (shoelace). */
function centroid(poly: [number, number][]) {
  let a = 0, cx = 0, cy = 0
  for (let i = 0, n = poly.length - 1; i < n; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[i + 1]
    const f = x0 * y1 - x1 * y0
    a += f
    cx += (x0 + x1) * f
    cy += (y0 + y1) * f
  }
  a *= 0.5
  return a ? [cx / (6 * a), cy / (6 * a)] : poly[0]
}

/**
 * Lloyd's algorithm: move each site to the centroid of its Voronoi cell, repeat.
 * Converges to a centroidal Voronoi tessellation. Weighted sites are pulled less, so
 * heavier honours keep larger cells for longer.
 */
function lloydFrames() {
  const rnd = mulberry32(7)
  let pts = achievements.map(() => [W * (0.1 + 0.8 * rnd() ** 1.6), H * (0.1 + 0.8 * rnd())] as [number, number])
  const frames = [pts]
  for (let k = 0; k < ITER; k++) {
    const v = Delaunay.from(pts).voronoi([0, 0, W, H])
    pts = pts.map((p, i) => {
      const poly = v.cellPolygon(i) as [number, number][] | null
      if (!poly) return p
      const [cx, cy] = centroid(poly)
      const step = 0.55 / Math.sqrt(achievements[i].weight)
      return [p[0] + (cx - p[0]) * step, p[1] + (cy - p[1]) * step]
    })
    frames.push(pts)
  }
  return frames
}

const kindStyle: Record<AchievementKind, { fill: string; label: string }> = {
  award: { fill: 'var(--accent)', label: 'Award' },
  certification: { fill: 'var(--fg)', label: 'Certification' },
  contribution: { fill: 'var(--muted)', label: 'Open source' },
}

export function Honours() {
  const frames = useMemo(lloydFrames, [])
  const [t, setT] = useState(prefersReducedMotion() ? ITER : 0)
  const [hover, setHover] = useState<number | null>(null)
  const ref = useRef<SVGSVGElement>(null)
  const list = useRef<HTMLOListElement>(null)

  // Cards cascade in on a 2-column grid stagger (Anime.js), from the top-left.
  useEffect(() => {
    const ol = list.current!
    const cards = ol.querySelectorAll<HTMLElement>('[data-card]')
    cards.forEach((c) => (c.style.opacity = '0'))
    return onceVisible(ol, () => {
      animate(cards, {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 900,
        ease: 'outExpo',
        delay: stagger(55, { grid: [2, Math.ceil(cards.length / 2)], from: 'first' }),
      })
    })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      end: 'bottom 50%',
      scrub: true,
      onUpdate: (s) => setT(+(s.progress * ITER).toFixed(2)),
    })
    return () => st.kill()
  }, [])

  // Interpolate between Lloyd iterations for continuous motion.
  const pts = useMemo(() => {
    const k = Math.min(Math.floor(t), ITER - 1), f = t - k
    return frames[k].map((p, i) => [p[0] + (frames[k + 1][i][0] - p[0]) * f, p[1] + (frames[k + 1][i][1] - p[1]) * f] as [number, number])
  }, [t, frames])
  const voronoi = useMemo(() => Delaunay.from(pts).voronoi([0, 0, W, H]), [pts])

  return (
    <section id="honours" className="container-x relative py-28 md:py-40">
      <div className="relative">
        <SectionHead
          index="05"
          label="Honours"
          title={<>Relaxed into <MathWord kind="lloyd">place</MathWord>.</>}
          aside="My awards and certificates, laid out as a Voronoi diagram. As you scroll, Lloyd's algorithm moves each point toward the middle of its cell until everything settles."
        />
        <ModelSlot url="/models/astrolabe.glb" spin={0.2} className="pointer-events-none absolute -top-4 right-0 hidden h-56 w-56 xl:block" />
      </div>
      {/* Two panes on one top line: the diagram stays pinned while the cards scroll past. */}
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:sticky lg:top-24 lg:col-span-6">
          <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl border hairline" onPointerLeave={() => setHover(null)} role="img" aria-label="Voronoi diagram of achievements">
            {achievements.map((ach, i) => {
              const d = voronoi.renderCell(i)
              const on = hover === i
              return (
                <path
                  key={ach.title}
                  d={d}
                  fill={kindStyle[ach.kind].fill}
                  fillOpacity={on ? 0.34 : ach.kind === 'award' ? 0.1 : 0.03}
                  stroke={on ? 'var(--accent)' : 'var(--fg)'}
                  strokeOpacity={on ? 0.9 : 0.3}
                  strokeWidth={on ? 2 : 1}
                  className="cursor-pointer transition-[fill-opacity,stroke-opacity] duration-300"
                  onPointerEnter={() => setHover(i)}
                  onClick={() => document.getElementById(`honour-${i}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })}
                />
              )
            })}
            {pts.map((p, i) => (
              <g key={i} pointerEvents="none">
                <circle cx={p[0]} cy={p[1]} r={2 + achievements[i].weight * 1.6} fill={hover === i ? 'var(--accent)' : 'var(--fg)'} />
                <text x={p[0] + 10} y={p[1] + 4} className="fill-muted font-mono" fontSize="13">
                  {String(i + 1).padStart(2, '0')}
                </text>
              </g>
            ))}
          </svg>
          <div className="mt-4 flex items-center justify-between font-mono text-[11px] tabular-nums text-muted">
            <span>
              Lloyd iteration <span className="text-accent">{Math.round(t)}</span>/{ITER}
            </span>
            <span className="flex gap-4">
              {(['award', 'certification', 'contribution'] as const).map((k) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: kindStyle[k].fill, opacity: k === 'award' ? 0.8 : 0.5 }} />
                  {kindStyle[k].label}
                </span>
              ))}
            </span>
          </div>
        </div>

        <ol ref={list} className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
          {achievements.map((x, i) => {
            const on = hover === i
            const Tag = x.link ? 'a' : 'div'
            return (
              <li key={x.title} id={`honour-${i}`} data-card className={x.kind === 'award' && x.weight >= 2 ? 'sm:col-span-2' : ''} onPointerEnter={() => setHover(i)}>
                <Tilt max={4} className="h-full">
                  <Tag
                    {...(x.link ? { href: x.link, target: '_blank', rel: 'noopener' } : {})}
                    className={`material group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl p-5 transition-[transform,border-color] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 ${on ? '!border-accent/70' : ''}`}
                  >
                    <span className={`spotlight pointer-events-none absolute inset-0 transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`} />
                    <span className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
                      <span className={x.kind === 'award' ? 'text-accent' : ''}>{kindStyle[x.kind].label}</span>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                    </span>
                    <span className="relative">
                      <span className={`block font-serif leading-tight ${x.kind === 'award' && x.weight >= 2 ? 'text-3xl' : 'text-xl'}`}>{x.title}</span>
                      <span className="mt-2 flex items-center justify-between gap-3 text-sm text-muted">
                        <span>
                          {x.issuer} · {x.date}
                        </span>
                        {x.link && <Arrow className="shrink-0 transition duration-500 group-hover:rotate-45 group-hover:text-accent" />}
                      </span>
                    </span>
                  </Tag>
                </Tilt>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
