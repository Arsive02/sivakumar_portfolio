import { useEffect, useState } from 'react'
import { GLSlot } from './Slot'

/**
 * A GLB in /models, mounted only once it is near the viewport and confirmed to exist —
 * so a missing or not-yet-generated model degrades to an empty slot instead of an error.
 */
export function ModelSlot({ url, className = '', spin, axis }: { url: string; className?: string; spin?: number; axis?: 'x' | 'y' }) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    let alive = true
    fetch(url, { method: 'HEAD' })
      .then((r) => alive && setOk(r.ok && !r.headers.get('content-type')?.includes('text/html')))
      .catch(() => {})
    return () => void (alive = false)
  }, [url])
  if (!ok) return <div className={className} />
  return <GLSlot scene="model" className={className} props={{ url, spin, axis }} />
}
