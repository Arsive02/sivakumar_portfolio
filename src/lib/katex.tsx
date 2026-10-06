import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useMemo } from 'react'

export default function KaTeX({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(() => katex.renderToString(tex, { displayMode: block, throwOnError: false, output: 'html' }), [tex, block])
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
