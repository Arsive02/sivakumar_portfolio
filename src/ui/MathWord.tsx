import { Fragment, useEffect, useRef } from 'react'
import { animate, onceVisible, stagger } from '@/motion/anime'
import { prefersReducedMotion } from '@/lib/useReducedMotion'

export type MathKind = 'riemann' | 'bloch' | 'softmax' | 'lloyd' | 'wave' | 'solve' | 'descent'

/**
 * A highlighted word with its own small piece of mathematics. It plays in full when it scrolls
 * into view, then settles into a quiet *resting* version that stays (a faint area under the
 * curve, a drifting sine, an orbiting point...). Hover replays the full animation.
 * Multi-word phrases wrap between words; each word stays whole.
 */
export function MathWord({ kind, children }: { kind: MathKind; children: string }) {
  const root = useRef<HTMLElement>(null)
  const overlay = useRef<SVGSVGElement>(null)
  const busy = useRef(false)

  const chars = () => [...root.current!.querySelectorAll<HTMLSpanElement>('[data-c]')]
  const settle = () => {
    clear(overlay.current!)
    rests[kind](chars(), root.current!, overlay.current!)
  }
  const play = () => {
    if (!root.current || busy.current) return
    if (prefersReducedMotion()) return settle()
    busy.current = true
    clear(overlay.current!)
    effects[kind](chars(), root.current, overlay.current!, () => {
      busy.current = false
      settle()
    })
  }

  useEffect(() => onceVisible(root.current!, () => setTimeout(play, 700), '0px 0px -20% 0px'))
  // Re-draw the resting overlay when the layout changes (wrapping, resize).
  useEffect(() => {
    const ro = new ResizeObserver(() => !busy.current && overlay.current?.childElementCount && settle())
    ro.observe(root.current!)
    return () => ro.disconnect()
  })

  const words = children.split(' ')
  return (
    <em className="relative inline-block pb-[0.08em] text-accent" onPointerEnter={play} ref={root}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((w, wi) => (
          <Fragment key={wi}>
            {wi > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {w.split('').map((c, i) => (
                <span key={i} data-c className="inline-block will-change-transform">
                  {c}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
      <svg ref={overlay} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" />
    </em>
  )
}

/* ─────────────────────────────── helpers ─────────────────────────────── */

type Effect = (chars: HTMLSpanElement[], word: HTMLElement, svg: SVGSVGElement, done: () => void) => void
type Rest = (chars: HTMLSpanElement[], word: HTMLElement, svg: SVGSVGElement) => void
const NS = 'http://www.w3.org/2000/svg'
function node<K extends keyof SVGElementTagNameMap>(parent: Element, tag: K, attrs: Record<string, string | number>) {
  const n = document.createElementNS(NS, tag)
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v))
  parent.appendChild(n)
  return n
}
const clear = (svg: SVGSVGElement) => svg.replaceChildren()
const reset = (chars: HTMLSpanElement[]) => chars.forEach((c) => ((c.style.transform = ''), (c.style.opacity = '')))
/** Centre of a char relative to the word box. */
const cx = (c: HTMLSpanElement) => c.offsetLeft + c.offsetWidth / 2
const baseline = (word: HTMLElement) => word.offsetHeight * 0.93

/* ── underneath: Riemann sum → integral ─────────────────────────────────── */
const curveOf = (word: HTMLElement) => {
  const w = word.offsetWidth, h = word.offsetHeight, y0 = baseline(word) + h * 0.06
  return { w, y0, f: (x: number) => y0 - h * 0.13 * (0.55 + 0.45 * Math.sin((x / w) * Math.PI * 1.6 + 0.6)) }
}
const curvePath = (w: number, f: (x: number) => number) => {
  let d = `M 0 ${f(0)}`
  for (let x = 0; x <= w; x += w / 60) d += ` L ${x} ${f(x)}`
  return d
}
const riemannRest: Rest = (_c, word, svg) => {
  const { w, y0, f } = curveOf(word)
  node(svg, 'path', { d: `${curvePath(w, f)} L ${w} ${y0} L 0 ${y0} Z`, fill: 'var(--accent)', opacity: 0.12 })
  node(svg, 'path', { d: curvePath(w, f), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.4, opacity: 0.45 })
}
const riemann: Effect = (_c, word, svg, done) => {
  const { w, y0, f } = curveOf(word)
  const curve = node(svg, 'path', { d: curvePath(w, f), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.5, opacity: 0.9 })
  const bars = node(svg, 'g', { fill: 'var(--accent)', opacity: 0.25 })
  const steps = [4, 8, 16, 32, 64]
  steps.forEach((n, k) =>
    setTimeout(() => {
      bars.replaceChildren()
      for (let i = 0; i < n; i++) {
        const x = (i / n) * w, bw = w / n, top = f(x + bw / 2)
        node(bars, 'rect', { x, y: top, width: Math.max(0.6, bw - (n > 32 ? 0 : 1)), height: y0 - top })
      }
    }, k * 260),
  )
  setTimeout(() => {
    animate([bars, curve], { opacity: 0, duration: 600, onComplete: done })
  }, steps.length * 260 + 500)
}

/* ── Bloch: letters on a sphere, a point in orbit ───────────────────────── */
const orbit = (word: HTMLElement) => {
  const w = word.offsetWidth, h = word.offsetHeight
  return { cx: w / 2, cy: h * 0.55, rx: w * 0.6, ry: h * 0.2 }
}
const ellipsePath = (o: ReturnType<typeof orbit>) => `M ${o.cx - o.rx} ${o.cy} a ${o.rx} ${o.ry} 0 1 0 ${o.rx * 2} 0 a ${o.rx} ${o.ry} 0 1 0 ${-o.rx * 2} 0`
const blochRest: Rest = (_c, word, svg) => {
  const o = orbit(word)
  node(svg, 'ellipse', { cx: o.cx, cy: o.cy, rx: o.rx, ry: o.ry, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.2, opacity: 0.6, 'stroke-dasharray': '3 5' })
  const dot = node(svg, 'circle', { r: 3.8, fill: 'var(--accent)' })
  node(dot, 'animateMotion', { dur: '8s', repeatCount: 'indefinite', path: ellipsePath(o) })
}
const bloch: Effect = (chars, word, svg, done) => {
  word.style.perspective = '600px'
  animate(chars, { rotateY: [-90, 0], opacity: [0, 1], duration: 900, delay: stagger(70), ease: 'outBack(1.4)' })
  const o = orbit(word)
  node(svg, 'ellipse', { cx: o.cx, cy: o.cy, rx: o.rx, ry: o.ry, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1, opacity: 0.5, 'stroke-dasharray': '3 4' })
  const dot = node(svg, 'circle', { r: 4, fill: 'var(--accent)' })
  const s = { t: 0 }
  animate(s, {
    t: 1,
    duration: 1600,
    ease: 'inOutSine',
    onUpdate: () => {
      const a = s.t * Math.PI * 2 + Math.PI
      dot.setAttribute('cx', `${o.cx + Math.cos(a) * o.rx}`)
      dot.setAttribute('cy', `${o.cy + Math.sin(a) * o.ry}`)
    },
    onComplete: () => (reset(chars), done()),
  })
}

/* ── what: softmax(s/τ) sharpening ──────────────────────────────────────── */
const softmaxRest: Rest = (chars, word, svg) => {
  const peak = chars[0]
  node(svg, 'rect', { x: peak.offsetLeft, y: baseline(word) + 4, width: peak.offsetWidth, height: 2.5, rx: 1, fill: 'var(--accent)', opacity: 0.7 })
  chars.slice(1).forEach((c, i) => node(svg, 'rect', { x: c.offsetLeft, y: baseline(word) + 4, width: c.offsetWidth * (0.25 + 0.15 * i), height: 2.5, rx: 1, fill: 'var(--accent)', opacity: 0.25 }))
}
const softmax: Effect = (chars, _w, _s, done) => {
  const scores = chars.map((_, i) => (i === 0 ? 2.2 : Math.random() * 1.4))
  const o = { tau: 6 }
  const paint = () => {
    const ex = scores.map((s) => Math.exp(s / o.tau))
    const z = ex.reduce((a, b) => a + b, 0), max = Math.max(...ex) / z
    chars.forEach((c, i) => {
      const p = ex[i] / z / max
      c.style.opacity = String(0.2 + 0.8 * p)
      c.style.transform = `translateY(${(1 - p) * 6}px) scale(${0.9 + 0.2 * p})`
    })
  }
  animate(o, {
    tau: 0.15,
    duration: 1300,
    ease: 'outQuad',
    onUpdate: paint,
    onComplete: () => void animate(chars, { opacity: 1, translateY: 0, scale: 1, duration: 600, delay: stagger(40), ease: 'outExpo', onComplete: () => (reset(chars), done()) }),
  })
}

/* ── place: Lloyd's relaxation ──────────────────────────────────────────── */
const lloydRest: Rest = (chars, word, svg) => chars.forEach((c) => node(svg, 'circle', { cx: cx(c), cy: baseline(word) + 7, r: 1.8, fill: 'var(--accent)', opacity: 0.45 }))
const lloyd: Effect = (chars, word, svg, done) => {
  const off = chars.map(() => ({ x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 40, r: (Math.random() - 0.5) * 50 }))
  chars.forEach((c) => node(svg, 'circle', { cx: cx(c), cy: word.offsetHeight * 0.55, r: 2, fill: 'var(--accent)', opacity: 0.8 }))
  const apply = (k: number) => chars.forEach((c, i) => (c.style.transform = `translate(${off[i].x * k}px, ${off[i].y * k}px) rotate(${off[i].r * k}deg)`))
  apply(1)
  const ITER = 6
  for (let it = 1; it <= ITER; it++)
    setTimeout(() => {
      const o = { k: Math.pow(0.5, it - 1) }
      animate(o, { k: it === ITER ? 0 : Math.pow(0.5, it), duration: 220, ease: 'outCubic', onUpdate: () => apply(o.k) })
    }, it * 230)
  setTimeout(() => (reset(chars), done()), ITER * 230 + 350)
}

/* ── signal: damped travelling wave → a slow drifting sine underline ────── */
const sineD = (w: number, y: number, A: number, k: number, phase = 0, extra = 0) => {
  let d = ''
  for (let x = -extra; x <= w + extra; x += 3) d += `${d ? 'L' : 'M'} ${x} ${y + A * Math.sin(k * x + phase)} `
  return d
}
const waveRest: Rest = (_c, word, svg) => {
  const w = word.offsetWidth, k = 0.06, period = (2 * Math.PI) / k
  const clip = node(svg, 'clipPath', { id: `wclip-${Math.round(w)}` })
  node(clip, 'rect', { x: 0, y: 0, width: w, height: word.offsetHeight * 1.4 })
  const g = node(svg, 'g', { 'clip-path': `url(#wclip-${Math.round(w)})` })
  const path = node(g, 'path', { d: sineD(w, baseline(word) + 6, 3, k, 0, period), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.4, opacity: 0.55 })
  node(path, 'animateTransform', { attributeName: 'transform', type: 'translate', from: '0 0', to: `${period} 0`, dur: '4s', repeatCount: 'indefinite' })
}
const wave: Effect = (chars, word, svg, done) => {
  const w = word.offsetWidth
  const line = node(svg, 'path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.5, opacity: 0.8 })
  const xs = chars.map(cx)
  const o = { t: 0 }
  animate(o, {
    t: 1,
    duration: 2000,
    ease: 'linear',
    onUpdate: () => {
      const t = o.t * 6, A = 14 * Math.exp(-o.t * 3)
      chars.forEach((c, i) => (c.style.transform = `translateY(${A * Math.sin(0.06 * xs[i] - 6 * t)}px)`))
      line.setAttribute('d', sineD(w, baseline(word) + 6, Math.max(3, A * 0.4), 0.06, -6 * t))
    },
    onComplete: () => (reset(chars), done()),
  })
}

/* ── non-trivial: search through symbols, lock in, ≠ 0 ──────────────────── */
const solveRest: Rest = (_c, word, svg) => {
  const t = node(svg, 'text', { x: word.offsetWidth + 6, y: word.offsetHeight * 0.32, fill: 'var(--accent)', 'font-size': word.offsetHeight * 0.26, 'font-family': 'JetBrains Mono Variable, monospace', opacity: 0.6 })
  t.textContent = '≠ 0'
}
const solve: Effect = (chars, _w, _s, done) => {
  const GLY = '∂∇∑∫λμσπθ01xy='
  const real = chars.map((c) => c.textContent!)
  let left = chars.length
  chars.forEach((c, i) => {
    if (real[i] === '-') return void left--
    let n = 0
    const lockAt = 6 + i * 2
    const id = setInterval(() => {
      if (++n >= lockAt) {
        clearInterval(id)
        c.textContent = real[i]
        animate(c, { scale: [1.25, 1], duration: 400, ease: 'outBack' })
        if (--left === 0) setTimeout(done, 400)
      } else c.textContent = GLY[(Math.random() * GLY.length) | 0]
    }, 45)
  })
}

/* ── building intuition: gradient descent with momentum ─────────────────── */
const descentRest: Rest = (_c, word, svg) => {
  const w = word.offsetWidth, y = baseline(word) + 4
  // a shallow loss bowl with the optimiser resting at its minimum
  let d = ''
  for (let x = 0; x <= w; x += 4) d += `${d ? 'L' : 'M'} ${x} ${y + 6 * ((x - w * 0.62) / (w * 0.5)) ** 2} `
  node(svg, 'path', { d, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.2, opacity: 0.4 })
  node(svg, 'circle', { cx: w * 0.62, cy: y, r: 3, fill: 'var(--accent)', opacity: 0.85 })
}
const descent: Effect = (chars, _w, _s, done) => {
  animate(chars, {
    translateY: [() => -30 - Math.random() * 50, 0],
    opacity: [0.2, 1],
    duration: 1400,
    delay: stagger(35),
    ease: 'outElastic(1, .45)', // under-damped heavy-ball convergence
    onComplete: () => (reset(chars), done()),
  })
}

const effects: Record<MathKind, Effect> = { riemann, bloch, softmax, lloyd, wave, solve, descent }
const rests: Record<MathKind, Rest> = { riemann: riemannRest, bloch: blochRest, softmax: softmaxRest, lloyd: lloydRest, wave: waveRest, solve: solveRest, descent: descentRest }
