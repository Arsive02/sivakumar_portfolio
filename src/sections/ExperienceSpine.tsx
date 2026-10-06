import { useEffect, useRef, useState } from 'react'
import { animate, svg, utils } from '@/motion/anime'
import { ScrollTrigger } from '@/motion/gsap'
import { prefersReducedMotion } from '@/lib/useReducedMotion'

const X = 14 // spine axis (px from the list's left edge)
const SWAY = 11 // how far the weave swings between nodes

/**
 * The Experience spine: a path that weaves through every role node (alternating cubic
 * arcs, like a geodesic winding round the sphere), drawn by Anime.js as you scroll.
 * A glowing head rides the drawn tip; each node rings when the head reaches it.
 */
export function ExperienceSpine({ list, count }: { list: React.RefObject<HTMLOListElement | null>; count: number }) {
  const [geo, setGeo] = useState<{ d: string; h: number; ys: number[] } | null>(null)
  const draw = useRef<SVGPathElement>(null)
  const head = useRef<SVGGElement>(null)
  const rings = useRef<(SVGCircleElement | null)[]>([])

  // Lay the path through the node positions; recompute when the list reflows.
  useEffect(() => {
    const ol = list.current
    if (!ol) return
    const measure = () => {
      const ys = [...ol.querySelectorAll<HTMLElement>('[data-role]')].map((li) => li.offsetTop + 14)
      const h = ol.offsetHeight
      let d = `M ${X} 0 L ${X} ${ys[0]}`
      for (let i = 0; i < ys.length - 1; i++) {
        const a = ys[i], b = ys[i + 1], s = i % 2 ? -SWAY : SWAY
        d += ` C ${X + s} ${a + (b - a) * 0.3} ${X + s} ${a + (b - a) * 0.7} ${X} ${b}`
      }
      d += ` L ${X} ${h}`
      setGeo({ d, h, ys })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ol)
    return () => ro.disconnect()
  }, [list, count])

  // Scroll → draw progress → head position → node rings.
  useEffect(() => {
    if (!geo || !draw.current) return
    const path = draw.current
    const [drawable] = svg.createDrawable(path)
    const L = path.getTotalLength()
    // Arc-length position of each node (sampled once).
    const nodeAt = geo.ys.map((y) => {
      let lo = 0, hi = L
      for (let k = 0; k < 24; k++) {
        const mid = (lo + hi) / 2
        if (path.getPointAtLength(mid).y < y) lo = mid
        else hi = mid
      }
      return lo / L
    })
    const passed = new Set<number>()
    const set = (p: number) => {
      utils.set(drawable, { draw: `0 ${p}` })
      const pt = path.getPointAtLength(p * L)
      head.current?.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
      nodeAt.forEach((f, i) => {
        if (p >= f && !passed.has(i)) {
          passed.add(i)
          const r = rings.current[i]
          if (r) animate(r, { r: [5, 22], opacity: [0.9, 0], duration: 1100, ease: 'outExpo' })
        } else if (p < f) passed.delete(i)
      })
    }
    if (prefersReducedMotion()) return void set(1)
    set(0)
    const st = ScrollTrigger.create({
      trigger: list.current,
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 0.4,
      onUpdate: (s) => set(s.progress),
    })
    return () => st.kill()
  }, [geo, list])

  if (!geo) return null
  return (
    <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={X * 2 + SWAY} height={geo.h} aria-hidden>
      <defs>
        <filter id="spine-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <path d={geo.d} fill="none" stroke="var(--line)" strokeWidth="1" />
      <path ref={draw} d={geo.d} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      {geo.ys.map((y, i) => (
        <g key={i}>
          <circle ref={(el) => void (rings.current[i] = el)} cx={X} cy={y} r="5" fill="none" stroke="var(--accent)" opacity="0" />
          <circle cx={X} cy={y} r="4.5" fill="var(--bg)" stroke="var(--fg)" strokeOpacity="0.45" />
        </g>
      ))}
      <g ref={head}>
        <circle r="9" fill="var(--accent)" opacity="0.55" filter="url(#spine-glow)" />
        <circle r="3.5" fill="var(--accent)" />
      </g>
    </svg>
  )
}
