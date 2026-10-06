import { lazy, type ComponentType } from 'react'

const CHUNK_ERROR = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i
export const isChunkError = (e: unknown) => CHUNK_ERROR.test(String((e as Error)?.message ?? e))

/**
 * A tab opened before a deploy still references the *old* chunk filenames. Retry once (it may
 * just be a network blip); if the chunk is truly gone, reload once so the browser fetches the
 * new index.html and its new chunk names. A sessionStorage stamp prevents reload loops.
 */
export function reloadForNewBuild() {
  try {
    const last = Number(sessionStorage.getItem('chunk-reload') ?? 0)
    if (Date.now() - last < 30_000) return false
    sessionStorage.setItem('chunk-reload', String(Date.now()))
  } catch {
    /* storage blocked: still reload once */
  }
  location.reload()
  return true
}

export function lazyWithRetry<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      return await load()
    } catch (e) {
      if (!isChunkError(e)) throw e
      await new Promise((r) => setTimeout(r, 300))
      try {
        return await load()
      } catch (e2) {
        if (isChunkError(e2) && reloadForNewBuild()) return new Promise<never>(() => {}) // page is reloading
        throw e2
      }
    }
  })
}
