import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { gsap } from '@/motion/gsap'

/**
 * Pointer-driven 3D tilt with a soft spotlight. The spotlight position is exposed as
 * --mx / --my (in %) so children can paint a radial gradient that follows the cursor.
 */
export function Tilt({ children, max = 6, className = '', style }: { children: ReactNode; max?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(pointer: fine)').matches) return
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' })
    gsap.set(el, { transformPerspective: 900 })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const u = (e.clientX - r.left) / r.width
      const v = (e.clientY - r.top) / r.height
      ry((u - 0.5) * 2 * max)
      rx(-(v - 0.5) * 2 * max)
      el.style.setProperty('--mx', `${u * 100}%`)
      el.style.setProperty('--my', `${v * 100}%`)
    }
    const leave = () => (rx(0), ry(0))
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [max])
  return (
    <div ref={ref} className={`will-change-transform [transform-style:preserve-3d] ${className}`} style={style}>
      {children}
    </div>
  )
}
