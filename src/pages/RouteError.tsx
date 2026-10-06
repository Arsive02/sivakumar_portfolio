import { useEffect, useState } from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { isChunkError, reloadForNewBuild } from '@/lib/lazyWithRetry'

/** Root error boundary: quietly recovers from stale-deploy chunk errors, otherwise explains itself. */
export default function RouteError() {
  const error = useRouteError()
  const chunk = isChunkError(error)

  // A stale tab gets one automatic reload; if that already happened, say so instead of spinning.
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    if (chunk && !reloadForNewBuild()) setStuck(true)
  }, [chunk])
  const updating = chunk && !stuck

  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : String(error)

  return (
    <main className="container-x grid min-h-[100svh] content-center gap-6 py-28">
      <p className="eyebrow">{updating ? 'Updating' : 'Something broke'}</p>
      <h1 className="display text-[clamp(2.8rem,8vw,7rem)]">
        {updating ? 'A new version is live. Loading it now.' : chunk ? 'This page could not load. Check your connection and try again.' : 'This page hit an error.'}
      </h1>
      {!updating && <pre className="max-w-[70ch] overflow-auto rounded-xl border hairline bg-bg-2 p-4 font-mono text-xs text-muted">{message}</pre>}
      <div className="flex gap-6">
        <button onClick={() => location.reload()} className="link-draw text-lg">
          Reload
        </button>
        <Link to="/" className="link-draw text-lg" reloadDocument>
          ← Home
        </Link>
      </div>
    </main>
  )
}
