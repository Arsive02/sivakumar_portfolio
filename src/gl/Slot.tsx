import { lazyWithRetry as lazy } from '@/lib/lazyWithRetry'
import { Suspense, type CSSProperties, type ReactNode } from 'react'
import { useGLReady } from './store'
import type { SceneName } from './scenes'

const LazyView = lazy(() => import('./SceneView'))

type Props = { scene: SceneName; className?: string; style?: CSSProperties; fallback?: ReactNode; props?: Record<string, unknown> }

/**
 * A rectangle in the DOM that the shared WebGL canvas paints into.
 * Until GL is ready (or if unavailable) the fallback renders in its place.
 */
export function GLSlot({ scene, className = '', style, fallback = null, props }: Props) {
  const ready = useGLReady()
  if (!ready) return <div className={className} style={style}>{fallback}</div>
  return (
    <Suspense fallback={<div className={className} style={style}>{fallback}</div>}>
      <LazyView scene={scene} className={className} style={style} props={props} />
    </Suspense>
  )
}
