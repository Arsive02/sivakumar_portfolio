import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const subscribe = (cb: () => void) => {
  const mq = matchMedia(query)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export const prefersReducedMotion = () => matchMedia(query).matches
export const useReducedMotion = () => useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
