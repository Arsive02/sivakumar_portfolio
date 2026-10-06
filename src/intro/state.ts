import { useSyncExternalStore } from 'react'
import { prefersReducedMotion } from '@/lib/useReducedMotion'
import { hasWebGL2 } from '@/lib/webgl'

/**
 * Shared, mutable intro timeline values. The DOM (GSAP) writes them; the orbital scene reads
 * them every frame. `done` gates the hero so the two full-screen views never overlap.
 */
export const intro = {
  active: false,
  done: true,
  /** 0 → 2 continuous: which orbital we're drifting through (A → B → C). */
  mix: 0,
  /** 0 → 1 wavefunction collapse toward `point`. */
  collapse: 0,
  /** 0 → 1 camera dive through the nucleus. */
  dive: 0,
  /** Collapse point in NDC (−1..1). */
  point: { x: 0, y: 0 },
  /** 0 → 1 fade-out of the orbital while the page is revealed. */
  fade: 0,
  /** Hero should start as a burst from the collapse point. */
  burst: false,
}

const subs = new Set<() => void>()
export const setIntro = (patch: Partial<typeof intro>) => {
  Object.assign(intro, patch)
  subs.forEach((s) => s())
}
export const useIntroActive = () =>
  useSyncExternalStore(
    (cb) => (subs.add(cb), () => subs.delete(cb)),
    () => intro.active,
    () => false,
  )

/** Re-enter the landing (nav logo). No-op where the intro can't run (no WebGL / reduced motion). */
export function replayIntro() {
  if (!hasWebGL2() || prefersReducedMotion() || intro.active) return false
  document.documentElement.classList.add('intro-on')
  setIntro({ active: true, done: false, mix: 0, collapse: 0, dive: 0, fade: 0, burst: false })
  return true
}

export const useIntroDone = () =>
  useSyncExternalStore(
    (cb) => (subs.add(cb), () => subs.delete(cb)),
    () => intro.done,
    () => true,
  )

const KEY = 'intro-seen'

/** First visit to "/" in this tab, capable device, not a bot/automation (unless ?intro). */
export function shouldPlayIntro() {
  const forced = location.search.includes('intro')
  if (location.pathname !== '/' && !forced) return false
  if (!hasWebGL2() || prefersReducedMotion()) return false
  if (forced) return true
  if (navigator.webdriver) return false
  try {
    if (sessionStorage.getItem(KEY)) return false
  } catch {
    /* storage blocked: play it */
  }
  return true
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* ignore */
  }
}
