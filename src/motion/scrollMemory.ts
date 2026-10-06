/**
 * Scroll position per history entry, stored as an anchor (section id + offset into it)
 * rather than a raw Y. The homepage's height changes once ScrollTrigger re-creates the
 * pinned project rail, so a raw Y restored too early lands in the wrong section.
 */
export type Anchor = { id: string; offset: number } | { id: null; y: number }

const KEY = 'scroll-memory'
const read = (): Record<string, Anchor> => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function rememberScroll(historyKey: string) {
  const sections = [...document.querySelectorAll<HTMLElement>('main section[id]')]
  // The last section whose top is at or above 30% of the viewport.
  const probe = innerHeight * 0.3
  let current: HTMLElement | undefined
  for (const s of sections) if (s.getBoundingClientRect().top <= probe) current = s
  const anchor: Anchor = current ? { id: current.id, offset: -current.getBoundingClientRect().top } : { id: null, y: scrollY }
  const all = read()
  all[historyKey] = anchor
  try {
    sessionStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    /* storage unavailable: restoration just falls back to top */
  }
}

/** The remembered anchor for a history entry (read it *before* anything can overwrite it). */
export const readAnchor = (historyKey: string): Anchor | null => read()[historyKey] ?? null

/** Absolute Y for an anchor, resolved against the current (settled) layout. */
export function resolveAnchor(a: Anchor | null): number | null {
  if (!a) return null
  if (a.id === null) return a.y
  const el = document.getElementById(a.id)
  if (!el) return null
  return el.getBoundingClientRect().top + scrollY + a.offset
}
