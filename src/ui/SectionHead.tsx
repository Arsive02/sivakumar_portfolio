import type { ReactNode } from 'react'
import { Reveal } from '@/motion/Reveal'

export function SectionHead({ index, label, title, aside }: { index: string; label: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <header className="mb-14 grid gap-6 border-t hairline pt-6 md:mb-20 md:grid-cols-12">
      <p className="eyebrow md:col-span-3">
        <span className="text-accent">{index}</span> / {label}
      </p>
      <Reveal as="h2" className="display text-[clamp(2.6rem,7vw,6.5rem)] md:col-span-9">
        {title}
      </Reveal>
      {aside && <div className="text-muted md:col-span-6 md:col-start-4">{aside}</div>}
    </header>
  )
}
