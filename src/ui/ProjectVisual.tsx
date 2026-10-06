import { useEffect, useRef } from 'react'
import type { Project } from '@/content/projects'
import { mountAnim } from './projectAnims'
import { prefersReducedMotion } from '@/lib/useReducedMotion'

/**
 * The project's own animation (see projectAnims.ts): drawn on a plain canvas by one shared
 * ticker, only while on screen. `hover` is a mutable { current } set by the card; the pointer
 * position is tracked here.
 */
export function ProjectVisual({ project, hover, className = '' }: { project: Project; hover?: { current: number }; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const mouse = { x: 0.5, y: 0.5 }
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) / r.width
      mouse.y = (e.clientY - r.top) / r.height
    }
    cv.addEventListener('pointermove', move)
    const off = mountAnim(cv, project.slug, () => ({ hover: hover?.current ?? 0, mx: mouse.x, my: mouse.y }), prefersReducedMotion())
    return () => {
      off()
      cv.removeEventListener('pointermove', move)
    }
  }, [project.slug, hover])
  return <canvas ref={ref} className={`block h-full w-full bg-bg-2 ${className}`} aria-hidden />
}
