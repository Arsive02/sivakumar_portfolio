import { lazyWithRetry as lazy } from '@/lib/lazyWithRetry'
import { Suspense } from 'react'

// KaTeX (~75KB gz) is split out and only fetched when an equation is first rendered.
const KaTeX = lazy(() => import('@/lib/katex'))

export function TeX({ children, block = false, className = '' }: { children: string; block?: boolean; className?: string }) {
  return (
    <span className={`katex-line ${className}`}>
      <Suspense fallback={<span className="font-mono text-[0.8em] opacity-50">{children}</span>}>
        <KaTeX tex={children} block={block} />
      </Suspense>
    </span>
  )
}
