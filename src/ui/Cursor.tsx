import { useEffect, useRef } from 'react'
import { animate, svg } from '@/motion/anime'

const R = 13 // unit-circle radius in px
const TRAIL = 46 // samples in the unrolled sine trace

// Same command structure (M + 4 cubic segments) so morphTo can interpolate point-for-point.
const CIRCLE = `M ${R} 0 C ${R} 7.18 7.18 ${R} 0 ${R} C -7.18 ${R} -${R} 7.18 -${R} 0 C -${R} -7.18 -7.18 -${R} 0 -${R} C 7.18 -${R} ${R} -7.18 ${R} 0 Z`
const S = 19 // half-size of the selection bracket
const SQUARE = `M ${S} 0 C ${S} ${S} ${S} ${S} 0 ${S} C -${S} ${S} -${S} ${S} -${S} 0 C -${S} -${S} -${S} -${S} 0 -${S} C ${S} -${S} ${S} -${S} ${S} 0 Z`

/**
 * Phasor cursor. A unit circle whose radius vector points along the pointer's velocity
 * (θ = atan2(vy, vx)); the history of sin θ unrolls to the right as a trailing sine wave,
 * the way a rotating phasor traces a sinusoid. A tangent arrow scales with |v|.
 * Over links it morphs into a selection bracket. Readout: normalised (x, y) and |v|.
 */
export function Cursor() {
  const root = useRef<SVGSVGElement>(null)
  const shape = useRef<SVGPathElement>(null)
  const shapeCircle = useRef<SVGPathElement>(null)
  const shapeSquare = useRef<SVGPathElement>(null)
  const radius = useRef<SVGLineElement>(null)
  const tip = useRef<SVGCircleElement>(null)
  const arrow = useRef<SVGLineElement>(null)
  const wave = useRef<SVGPolylineElement>(null)
  const label = useRef<SVGTextElement>(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const el = root.current!
    let x = innerWidth / 2, y = innerHeight / 2 // rendered position
    let tx = x, ty = y // target (pointer)
    let px = x, py = y // previous pointer, for velocity
    let theta = 0, speed = 0, visible = false, hot = false
    // Over the nav, the cursor stays a circle and *points* at the hovered item instead.
    let pointAt: Element | null = null
    let grow = 1
    const hist: number[] = Array(TRAIL).fill(0)
    let raf = 0

    const frame = () => {
      raf = requestAnimationFrame(frame)
      x += (tx - x) * 0.32
      y += (ty - y) * 0.32
      const vx = tx - px, vy = ty - py
      px = tx
      py = ty
      const v = Math.hypot(vx, vy)
      speed += (v - speed) * 0.15
      // In the nav the phasor aims at the hovered item's centre; elsewhere it follows the velocity.
      const aim = pointAt?.getBoundingClientRect()
      if (aim || v > 0.6) {
        // Unwrap the angle so the phasor turns the short way round.
        let target = aim ? Math.atan2(aim.top + aim.height / 2 - y, aim.left + aim.width / 2 - x) : Math.atan2(vy, vx)
        while (target - theta > Math.PI) target -= 2 * Math.PI
        while (target - theta < -Math.PI) target += 2 * Math.PI
        theta += (target - theta) * (aim ? 0.18 : 0.25)
      }
      grow += ((pointAt ? 1.18 : 1) - grow) * 0.15
      shape.current!.setAttribute('transform', `scale(${grow.toFixed(3)})`)
      hist.pop()
      hist.unshift(Math.sin(theta))

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const cx = R * Math.cos(theta), cy = R * Math.sin(theta)
      radius.current!.setAttribute('x2', `${cx}`)
      radius.current!.setAttribute('y2', `${cy}`)
      tip.current!.setAttribute('cx', `${cx}`)
      tip.current!.setAttribute('cy', `${cy}`)
      const len = pointAt ? 7 : Math.min(28, speed * 1.6) // a short, steady pointer in the nav
      arrow.current!.setAttribute('x1', `${cx}`)
      arrow.current!.setAttribute('y1', `${cy}`)
      arrow.current!.setAttribute('x2', `${cx + Math.cos(theta) * len}`)
      arrow.current!.setAttribute('y2', `${cy + Math.sin(theta) * len}`)
      // Unrolled projection: sample i sits i·1.1px to the right of the circle.
      wave.current!.setAttribute('points', hist.map((s, i) => `${R + 6 + i * 1.1},${s * R}`).join(' '))
      wave.current!.style.opacity = hot ? '0' : `${Math.min(1, 0.25 + speed / 8)}`
      const nx = (tx / innerWidth) * 2 - 1, ny = 1 - (ty / innerHeight) * 2
      const f = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(2)}`
      label.current!.textContent = `(${f(nx)}, ${f(ny)})  |v| ${speed.toFixed(1)}`
    }

    const morph = (to: SVGPathElement) => animate(shape.current!, { d: svg.morphTo(to), duration: 420, ease: 'outExpo' })

    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!visible) {
        visible = true
        x = px = tx
        y = py = ty
        el.style.opacity = '1'
      }
    }
    const over = (e: PointerEvent) => {
      const target = e.target as Element
      const navItem = target.closest('header nav a, header nav button')
      pointAt = navItem
      // Nav items: no square morph, just a subtle grow + pointing (handled in the frame loop).
      const h = !navItem && !!target.closest('a, button, [data-cursor], [role="tab"]')
      if (h === hot) return
      hot = h
      el.dataset.hot = h ? '1' : ''
      morph(h ? shapeSquare.current! : shapeCircle.current!)
      animate([radius.current!, tip.current!, arrow.current!], { opacity: h ? 0 : 1, duration: 250 })
    }
    const leave = () => {
      visible = false
      el.style.opacity = '0'
    }

    raf = requestAnimationFrame(frame)
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      removeEventListener('pointermove', move)
      removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <svg
      ref={root}
      aria-hidden
      width="1"
      height="1"
      overflow="visible"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden opacity-0 transition-opacity duration-300 [@media(pointer:fine)]:block"
    >
      {/* morph targets (never rendered) */}
      <path ref={shapeCircle} d={CIRCLE} className="hidden" />
      <path ref={shapeSquare} d={SQUARE} className="hidden" />
      {/* axes through the centre: a tiny coordinate frame */}
      <g stroke="var(--fg)" strokeOpacity="0.25" strokeWidth="0.75">
        <line x1={-R - 5} y1="0" x2={R + 5} y2="0" />
        <line x1="0" y1={-R - 5} x2="0" y2={R + 5} />
      </g>
      <path ref={shape} d={CIRCLE} fill="none" stroke="var(--fg)" strokeOpacity="0.7" strokeWidth="1" className="[[data-hot='1']_&]:stroke-[var(--accent)]" />
      <polyline ref={wave} fill="none" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.8" strokeLinecap="round" />
      <line ref={radius} x1="0" y1="0" x2={R} y2="0" stroke="var(--fg)" strokeWidth="1" />
      <line ref={arrow} stroke="var(--accent)" strokeWidth="1.25" strokeLinecap="round" />
      <circle ref={tip} r="2.2" fill="var(--accent)" />
      <circle r="1.4" fill="var(--fg)" />
      <text ref={label} x={R + 8} y={R + 16} fill="var(--muted)" fontSize="9" className="font-mono tabular-nums" />
    </svg>
  )
}
