import manifest from '@/content/images.json'

type Entry = { w: number; h: number; widths: number[]; avif?: number[] }
const images = manifest as Record<string, Entry>

/**
 * Responsive picture from the optimised set in /media/img (scripts/optimize-images.mjs).
 * - The srcset always tops out at the source's native width, so HiDPI screens get every pixel.
 * - AVIF is offered only when every width has one; lossless diagrams ship WebP only, and a
 *   partial AVIF set would cap the resolution.
 * - `fit="native"` never displays the image wider than its own pixel width (no upscaling blur).
 */
export function Picture({
  name,
  alt,
  sizes = '100vw',
  className = '',
  eager = false,
  fit = 'fill',
}: {
  name: string
  alt: string
  sizes?: string
  className?: string
  eager?: boolean
  fit?: 'fill' | 'native'
}) {
  const e = images[name]
  if (!e) return null
  const set = (ext: string, ws: number[]) => ws.map((w) => `/media/img/${name}-${w}.${ext} ${w}w`).join(', ')
  const avifAll = !!e.avif && e.avif.length === e.widths.length
  const top = e.widths[e.widths.length - 1]
  return (
    <picture>
      {avifAll && <source type="image/avif" srcSet={set('avif', e.widths)} sizes={sizes} />}
      <source type="image/webp" srcSet={set('webp', e.widths)} sizes={sizes} />
      <img
        src={`/media/img/${name}-${top}.webp`}
        alt={alt}
        width={e.w}
        height={e.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? { fetchPriority: 'high' as const } : {})}
        className={className}
        style={fit === 'native' ? { maxWidth: `min(100%, ${e.w}px)`, height: 'auto', marginInline: 'auto' } : undefined}
      />
    </picture>
  )
}
