import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from '@/lib/useReducedMotion'
import { readAnchor, rememberScroll, resolveAnchor, type Anchor } from './scrollMemory'

let lenis: Lenis | null = null
export const getLenis = () => lenis

/** Scroll to a section id (or top), smoothly when Lenis is active. */
export function scrollToId(id: string | null, immediate = false) {
  const target = id ? document.getElementById(id) : 0
  if (target === null) return
  if (lenis) lenis.scrollTo(target as HTMLElement | number, { immediate, offset: 0, duration: 1.4 })
  else if (target === 0) window.scrollTo({ top: 0 })
  else (target as HTMLElement).scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' })
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()))
/** True from the moment a route commits until its scroll position is settled; saves are paused. */
let restoring = false

export function SmoothScroll() {
  const { pathname, hash, key } = useLocation()
  const navType = useNavigationType()
  const pending = useRef<Anchor | null>(null)
  const prevPath = useRef(pathname)

  // Before any effect or scroll event can run for the new entry, freeze saving and grab its
  // remembered anchor. (Otherwise the returning page, briefly at the top, overwrote it.)
  // Policy: going *back* from a project page to the homepage always lands on Selected work,
  // wherever the project was opened from.
  useLayoutEffect(() => {
    restoring = true
    const fromProject = prevPath.current.startsWith('/work/')
    pending.current = navType === 'POP' ? (pathname === '/' && fromProject ? { id: 'work', offset: 0 } : readAnchor(key)) : null
    prevPath.current = pathname
  }, [key, navType, pathname])

  // We restore scroll ourselves (the browser's restore runs before pins exist).
  useEffect(() => {
    history.scrollRestoration = 'manual'
  }, [])

  // Continuously remember where we are in this history entry.
  useEffect(() => {
    let t = 0
    const save = () => {
      if (restoring) return
      clearTimeout(t)
      t = window.setTimeout(() => rememberScroll(key), 120)
    }
    // Snapshot synchronously on any click (capture phase), i.e. before a link navigates —
    // cleanup would be too late, it runs after the next page has already rendered.
    const now = () => !restoring && rememberScroll(key)
    addEventListener('scroll', save, { passive: true })
    addEventListener('click', now, { capture: true })
    return () => {
      clearTimeout(t)
      removeEventListener('scroll', save)
      removeEventListener('click', now, { capture: true })
    }
  }, [key])

  useEffect(() => {
    if (prefersReducedMotion()) return
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  // Route change. Back/forward (POP) restores the remembered anchor once fonts, pins and
  // spacers have settled; new navigations go to the hash target or the top.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await document.fonts.ready
      await nextFrame()
      await nextFrame()
      if (cancelled) return
      ScrollTrigger.refresh()
      const anchor = pending.current ?? (hash ? { id: hash.slice(1), offset: 0 } : null)
      const apply = () => {
        const y = resolveAnchor(anchor)
        if (y === null) return
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
        window.scrollTo(0, y)
        ScrollTrigger.update()
      }
      if (anchor) apply()
      else scrollToId(null, true)
      // Late layout changes (lazy equations, images, fonts) can shift sections after the jump.
      // For a moment, re-apply the anchor whenever the page height changes, unless the
      // visitor has started scrolling themselves.
      let userMoved = false
      const stop = () => (userMoved = true)
      const opts = { passive: true, capture: true } as const
      addEventListener('wheel', stop, opts)
      addEventListener('touchstart', stop, opts)
      addEventListener('keydown', stop, opts)
      const ro = new ResizeObserver(() => anchor && !userMoved && !cancelled && apply())
      ro.observe(document.body)
      setTimeout(() => {
        ro.disconnect()
        removeEventListener('wheel', stop, opts)
        removeEventListener('touchstart', stop, opts)
        removeEventListener('keydown', stop, opts)
        if (!cancelled) restoring = false
      }, 1000)
    })()
    return () => void (cancelled = true)
  }, [pathname, hash, key, navType])

  return null
}
