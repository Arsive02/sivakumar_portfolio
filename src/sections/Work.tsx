import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { fields, projects, type Field, type Project } from '@/content/projects'
import { animate, onceVisible, stagger, svg, utils } from '@/motion/anime'
import { prefersReducedMotion } from '@/lib/useReducedMotion'
import { ProjectCard } from '@/ui/ProjectCard'
import { TeX } from '@/ui/TeX'
import { curve, layoutGraph, rectExit, SYNAPSES } from './workGraph'

export { ProjectVisual } from '@/ui/ProjectVisual'

const ORDER = Object.keys(fields) as Field[]
const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<string, Project>

/** Seeded background star field (stable between renders). */
function stars(W: number, H: number, n = 140) {
  let s = 11
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  return Array.from({ length: n }, () => ({ x: r() * W, y: r() * H, r: r() < 0.08 ? 1.3 : 0.6, o: 0.15 + r() * 0.35 }))
}

type Box = { x: number; y: number; w: number; h: number }

function Node({ project, rect, dim, active, onHover, onOpen }: { project: Project; rect: Box; dim: boolean; active: boolean; onHover: (s: string | null) => void; onOpen: (p: Project, el: HTMLElement) => void }) {
  const hover = useRef({ current: 0 }).current
  hover.current = active ? 1 : 0
  return (
    <a
      href={`/work/${project.slug}`}
      data-node
      onClick={(e) => {
        e.preventDefault()
        onOpen(project, e.currentTarget)
      }}
      onPointerEnter={() => onHover(project.slug)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(project.slug)}
      onBlur={() => onHover(null)}
      aria-label={`${project.title}, ${fields[project.field].label}`}
      className={`group absolute block transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${dim ? 'opacity-35' : 'opacity-100'} ${active ? '-translate-y-1' : ''}`}
      style={{ left: rect.x - rect.w / 2, top: rect.y - rect.h / 2, width: rect.w }}
      data-cursor
    >
      <ProjectCard project={project} hover={hover} active={active} />
      <span data-ring className="pointer-events-none absolute left-1/2 top-[38%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent opacity-0" />
    </a>
  )
}

type Edge = { id: string; d: string; kind: 'trunk' | 'branch' | 'synapse'; field?: Field; slug?: string; slugs?: [string, string] }

/** Desktop: the constellation. Fits the viewport; nothing moves except the signals. */
function Constellation() {
  const stage = useRef<HTMLDivElement>(null)
  const dots = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [size, setSize] = useState({ W: 0, H: 0 })
  const [hovered, setHovered] = useState<string | null>(null)

  useLayoutEffect(() => {
    const el = stage.current!
    const ro = new ResizeObserver(([e]) => setSize({ W: Math.round(e.contentRect.width), H: Math.round(e.contentRect.height) }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const card = useMemo(() => {
    const w = Math.round(Math.max(108, Math.min(146, size.W * 0.088, size.H * 0.17)))
    return { w, h: Math.round(w * 0.75 + 22) }
  }, [size])
  const g = useMemo(() => (size.W ? layoutGraph(size.W, size.H, card) : null), [size, card])
  const sky = useMemo(() => stars(size.W, size.H), [size])

  // Edges stop at the card border, so nothing ever runs underneath a card.
  const edges = useMemo<Edge[]>(() => {
    if (!g) return []
    const rect = (s: string) => ({ ...g.pos[s], w: card.w, h: card.h })
    const out: Edge[] = []
    ORDER.forEach((f) => out.push({ id: `t-${f}`, kind: 'trunk', field: f, d: curve(g.core, g.fieldPos[f], g.core, 0.1) }))
    projects.forEach((p) => out.push({ id: `b-${p.slug}`, kind: 'branch', field: p.field, slug: p.slug, d: curve(g.fieldPos[p.field], rectExit(rect(p.slug), g.fieldPos[p.field]), g.core) }))
    SYNAPSES.forEach(([a, b]) => {
      const A = rect(a), B = rect(b)
      out.push({ id: `s-${a}-${b}`, kind: 'synapse', slugs: [a, b], d: curve(rectExit(A, B), rectExit(B, A), g.core, 0.35) })
    })
    return out
  }, [g, card])

  // Grow the network when it first scrolls in: trunks, then branches, then synapses, then cards.
  const grown = useRef(false)
  useEffect(() => {
    const el = stage.current
    if (!el || !edges.length || grown.current || prefersReducedMotion()) return
    const groups = (['trunk', 'branch', 'synapse'] as const).map((k) => svg.createDrawable([...el.querySelectorAll<SVGPathElement>(`[data-edge="${k}"]`)]))
    const nodes = el.querySelectorAll<HTMLElement>('[data-node]')
    groups.forEach((d) => utils.set(d, { draw: '0 0' }))
    nodes.forEach((n) => (n.style.opacity = '0'))
    return onceVisible(el, () => {
      grown.current = true
      groups.forEach((d, i) => animate(d, { draw: ['0 0', '0 1'], duration: 700, delay: stagger(40, { start: 200 + i * 450 }), ease: 'outQuad' }))
      animate(nodes, { opacity: [0, 1], scale: [0.6, 1], duration: 700, delay: stagger(45, { start: 900 }), ease: 'outBack(1.4)', onComplete: () => nodes.forEach((n) => (n.style.opacity = '')) })
    })
  }, [edges])

  // Activations: small signals fire along random edges (cheap CSS offset-path; paused offscreen).
  useEffect(() => {
    const host = dots.current
    if (!host || !edges.length || prefersReducedMotion()) return
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(host)
    const pool = [...host.children] as HTMLElement[]
    let k = 0
    const id = setInterval(() => {
      if (!visible) return
      const e = edges[(Math.random() * edges.length) | 0]
      const dot = pool[k++ % pool.length]
      dot.style.offsetPath = `path('${e.d}')`
      const rev = e.kind !== 'synapse' && Math.random() < 0.5
      dot.animate(
        [
          { offsetDistance: rev ? '100%' : '0%', opacity: 0 },
          { opacity: 1, offset: 0.15 },
          { opacity: 1, offset: 0.85 },
          { offsetDistance: rev ? '0%' : '100%', opacity: 0 },
        ],
        { duration: 900 + Math.random() * 500, easing: 'ease-in-out' },
      )
    }, 420)
    return () => {
      clearInterval(id)
      io.disconnect()
    }
  }, [edges])

  // Hover propagates an activation: the project's branch, then its field's trunk, then the core.
  const hotField = hovered ? bySlug[hovered].field : null
  const edgeState = (e: Edge) => {
    if (!hovered) return 'idle'
    if (e.kind === 'branch' && e.slug === hovered) return 'hot-1'
    if (e.kind === 'trunk' && e.field === hotField) return 'hot-2'
    if (e.kind === 'synapse' && e.slugs!.includes(hovered)) return 'hot-1'
    return 'dim'
  }
  const related = (s: string) => !hovered || s === hovered || SYNAPSES.some((pair) => pair.includes(hovered) && pair.includes(s))

  const open = (p: Project, el: HTMLElement) => {
    const ring = el.querySelector<HTMLElement>('[data-ring]')
    if (prefersReducedMotion() || !ring) return void navigate(`/work/${p.slug}`, { viewTransition: true })
    animate(ring, { scale: [1, 14], opacity: [0.9, 0], duration: 420, ease: 'outExpo' })
    setTimeout(() => navigate(`/work/${p.slug}`, { viewTransition: true }), 240)
  }

  return (
    <div ref={stage} className="relative h-full w-full">
      {g && (
        <>
          <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            {sky.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="var(--fg)" opacity={s.o * 0.5} />
            ))}
            {edges.map((e) => {
              const st = edgeState(e)
              const hot = st.startsWith('hot')
              const base = e.kind === 'trunk' ? { w: 2.2, o: 0.4 } : e.kind === 'branch' ? { w: 1.1, o: 0.32 } : { w: 0.9, o: 0.22 }
              const delay = st === 'hot-2' ? '0.15s' : '0s'
              return (
                <path
                  key={e.id}
                  data-edge={e.kind}
                  d={e.d}
                  fill="none"
                  stroke={hot ? 'var(--accent)' : 'var(--fg)'}
                  strokeOpacity={hot ? 0.95 : st === 'dim' ? base.o * 0.4 : base.o}
                  strokeWidth={hot ? base.w + 0.8 : base.w}
                  strokeDasharray={e.kind === 'synapse' ? '3 5' : undefined}
                  strokeLinecap="round"
                  style={{ transition: `stroke .35s ease ${delay}, stroke-opacity .35s ease ${delay}` }}
                />
              )
            })}
            <circle cx={g.core.x} cy={g.core.y} r="16" fill="none" stroke="var(--accent)" strokeOpacity=".35" />
            <circle cx={g.core.x} cy={g.core.y} r={hovered ? 9 : 7} fill="var(--accent)" style={{ transition: 'r .4s ease .3s' }} />
            {ORDER.map((f) => (
              <circle key={f} cx={g.fieldPos[f].x} cy={g.fieldPos[f].y} r={hotField === f ? 6 : 4.5} fill={hotField === f ? 'var(--accent)' : 'var(--bg)'} stroke="var(--accent)" strokeWidth="1.5" style={{ transition: 'all .35s ease .15s' }} />
            ))}
          </svg>

          <div ref={dots} className="pointer-events-none absolute inset-0" aria-hidden>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full bg-accent opacity-0 shadow-[0_0_8px_rgb(var(--accent-rgb)/0.9)] [offset-rotate:0deg]" />
            ))}
          </div>

          <div className="pointer-events-none absolute -translate-x-1/2 translate-y-5 text-center" style={{ left: g.core.x, top: g.core.y }}>
            <p className="font-serif text-xl italic">Mathematics</p>
          </div>
          {ORDER.map((f) => {
            const p = g.fieldPos[f], below = p.y >= g.core.y
            return (
              <div
                key={f}
                className={`pointer-events-none absolute -translate-x-1/2 text-center transition-opacity duration-300 ${below ? 'translate-y-3' : '-translate-y-[calc(100%+12px)]'} ${hotField && hotField !== f ? 'opacity-40' : ''}`}
                style={{ left: p.x, top: p.y }}
              >
                <p className={`eyebrow whitespace-nowrap ${hotField === f ? '!text-accent' : '!text-fg'}`}>{fields[f].label}</p>
                <TeX className="text-[11px] text-muted">{fields[f].eq}</TeX>
              </div>
            )
          })}

          {projects.map((p) => (
            <Node key={p.slug} project={p} rect={{ ...g.pos[p.slug], ...card }} dim={!related(p.slug)} active={hovered === p.slug} onHover={setHovered} onOpen={open} />
          ))}
        </>
      )}
    </div>
  )
}

/** Small or short screens: one field per block, the same small cards in a grid. */
function Grouped() {
  const navigate = useNavigate()
  return (
    <div className="container-x space-y-12">
      {ORDER.map((f) => (
        <div key={f} className="relative border-l hairline pl-5">
          <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-accent" />
          <p className="eyebrow !text-fg">{fields[f].label}</p>
          <TeX className="text-xs text-muted">{fields[f].eq}</TeX>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {projects
              .filter((p) => p.field === f)
              .map((p) => (
                <a
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(`/work/${p.slug}`, { viewTransition: true })
                  }}
                  className="block"
                >
                  <ProjectCard project={p} hover={{ current: 0 }} />
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const DESKTOP = '(min-width: 1024px) and (min-height: 640px)'

export function Work() {
  const [desktop, setDesktop] = useState(() => matchMedia(DESKTOP).matches)
  useEffect(() => {
    const mq = matchMedia(DESKTOP)
    const on = () => setDesktop(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  return (
    <section id="work" className={`relative ${desktop ? 'flex h-[100svh] flex-col pb-6 pt-24' : 'py-28'}`}>
      <header className="container-x mb-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-2 border-t hairline pt-5">
        <div>
          <p className="eyebrow">
            <span className="text-accent">02</span> / Selected work
          </p>
          <h2 className="display mt-2 text-[clamp(2.2rem,4.2vw,3.6rem)]">Everything connects back to math.</h2>
        </div>
        <p className="max-w-[44ch] text-sm text-muted">Each project is wired to the branch of math it is built on. Hover over one to trace it back, and click to open it.</p>
      </header>
      {desktop ? (
        <div className="container-x min-h-0 flex-1">
          <Constellation />
        </div>
      ) : (
        <Grouped />
      )}
    </section>
  )
}
