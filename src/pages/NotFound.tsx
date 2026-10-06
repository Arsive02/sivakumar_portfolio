import { Link } from 'react-router'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { TeX } from '@/ui/TeX'

export default function NotFound() {
  useDocumentTitle('404 | Sivakumar Ramakrishnan')
  return (
    <main className="container-x grid min-h-[100svh] content-center gap-8 py-28">
      <p className="eyebrow">Error 404</p>
      <h1 className="display text-[clamp(3.5rem,11vw,11rem)]">
        <TeX>{'\\lim_{x\\to\\text{here}} f(x)'}</TeX> <span className="text-muted">does not exist.</span>
      </h1>
      <Link to="/" viewTransition className="link-draw justify-self-start text-lg">
        ← Return to the origin
      </Link>
    </main>
  )
}
