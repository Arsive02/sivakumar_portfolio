import { useEffect, useState } from 'react'

/** True once the main thread is idle after first paint — used to defer WebGL. */
export function useIdle(timeout = 1200) {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200))
    const cic = window.cancelIdleCallback ?? window.clearTimeout
    const id = ric(() => setIdle(true), { timeout })
    return () => cic(id)
  }, [timeout])
  return idle
}
