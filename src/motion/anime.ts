// Anime.js v4: used for grid staggers, SVG drawing/morphs and the cursor. Scroll pinning and
// smooth scrolling stay with GSAP ScrollTrigger + Lenis.
// Per-module entry points: the root barrel's namespace re-exports (svg/utils/easings) defeat
// tree-shaking and pull in the whole library.
import { createDrawable, morphTo } from 'animejs/svg'
import { set } from 'animejs/utils'
export { animate } from 'animejs/animation'
export { stagger } from 'animejs/utils'
export const svg = { createDrawable, morphTo }
export const utils = { set }
import { prefersReducedMotion } from '@/lib/useReducedMotion'

/** Run `fn` once when `el` first scrolls into view (or immediately under reduced motion). */
export function onceVisible(el: Element, fn: () => void, rootMargin = '0px 0px -12% 0px') {
  if (prefersReducedMotion()) return fn(), () => {}
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      fn()
    },
    { rootMargin },
  )
  io.observe(el)
  return () => io.disconnect()
}
