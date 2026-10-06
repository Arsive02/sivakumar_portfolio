import { useState } from 'react'
import { MathWord } from '@/ui/MathWord'
import { Link } from 'react-router'
import { resources, type Resource } from '@/content/life'
import { Reveal } from '@/motion/Reveal'
import { Arrow } from '@/ui/Arrow'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { ModelSlot } from '@/gl/ModelSlot'

const topics = ['All', ...Array.from(new Set(resources.map((r) => r.topic)))]

export default function Library() {
  useDocumentTitle('Library | Sivakumar Ramakrishnan', 'Books, courses and lectures on quantum computing, linear algebra, deep learning, NLP and statistics.')
  const [topic, setTopic] = useState('All')
  const grouped = resources
    .filter((r) => topic === 'All' || r.topic === topic)
    .reduce<Record<string, Resource[]>>((acc, r) => {
      ;(acc[r.topic] ??= []).push(r)
      return acc
    }, {})

  return (
    <main className="container-x pb-32 pt-28">
      <Link to="/#life" viewTransition className="eyebrow link-draw hover:text-fg">
        ← Back
      </Link>
      <header className="relative mt-10 grid gap-8 md:grid-cols-12">
        <p className="eyebrow md:col-span-3">Library · {resources.length}</p>
        <Reveal as="h1" immediate className="display relative z-10 text-[clamp(3rem,7.4vw,7.5rem)] md:col-span-6">
          A reading list for <MathWord kind="descent">building intuition</MathWord>
        </Reveal>
        <figure className="justify-self-end md:col-span-3">
          <ModelSlot url="/models/orrery.glb" spin={0.15} className="aspect-square w-full max-w-sm" />
          <figcaption className="mt-2 text-right font-mono text-[10px] text-muted">An orrery: the solar system as gears, one of the oldest models.</figcaption>
        </figure>
        <p className="max-w-[56ch] text-lg leading-relaxed text-muted md:col-span-6 md:col-start-4">
          Books, courses and lectures that shaped how I think about math and machine learning. Filter by topic below; every entry opens in a new tab.
        </p>
      </header>
      <div className="mt-14 flex flex-wrap gap-2" role="tablist" aria-label="Filter by topic">
        {topics.map((t) => (
          <button key={t} role="tab" aria-selected={topic === t} onClick={() => setTopic(t)} className={`chip transition-colors ${topic === t ? '!border-accent !text-accent' : 'hover:text-fg'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="mt-12 space-y-16">
        {Object.entries(grouped).map(([t, items]) => (
          <section key={t}>
            <h2 className="eyebrow mb-2">{t}</h2>
            <ul className="divide-y divide-line border-y hairline">
              {items.map((r) => (
                <li key={r.link}>
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[1fr_auto] items-baseline gap-6 py-5 sm:grid-cols-[1fr_14rem_6rem_auto]">
                    <span className="font-serif text-2xl transition-colors group-hover:text-accent md:text-3xl">{r.title}</span>
                    <span className="hidden text-muted sm:block">{r.author}</span>
                    <span className="hidden font-mono text-[11px] uppercase text-muted sm:block">{r.type}</span>
                    <Arrow className="text-muted transition group-hover:rotate-45 group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
