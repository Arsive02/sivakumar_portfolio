import { useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'
const listeners = new Set<() => void>()
const get = (): Theme => (document.documentElement.dataset.theme as Theme) ?? 'dark'

export function setTheme(t: Theme) {
  const apply = () => {
    document.documentElement.dataset.theme = t
    try {
      localStorage.setItem('theme', t)
    } catch {
      /* storage blocked — theme still applies for this session */
    }
    listeners.forEach((l) => l())
  }
  if (document.startViewTransition) document.startViewTransition(apply)
  else apply()
}
export const toggleTheme = () => setTheme(get() === 'dark' ? 'light' : 'dark')

export const useTheme = () =>
  useSyncExternalStore(
    (cb) => (listeners.add(cb), () => listeners.delete(cb)),
    get,
    () => 'dark' as Theme,
  )

/** Read a CSS custom property as a hex/rgb string (for WebGL uniforms). */
export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
