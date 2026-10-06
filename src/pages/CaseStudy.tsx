import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { projectBySlug, projects } from '@/content/projects'
import { ProjectVisual } from '@/ui/ProjectVisual'
import { Reveal } from '@/motion/Reveal'
import { gsap, ScrollTrigger, useGSAP } from '@/motion/gsap'
import { animate, onceVisible, stagger } from '@/motion/anime'
import { TeX } from '@/ui/TeX'
import { Arrow } from '@/ui/Arrow'
import { Picture } from '@/ui/Picture'
import { Magnetic } from '@/ui/Magnetic'
import { ModelSlot } from '@/gl/ModelSlot'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { prefersReducedMotion } from '@/lib/useReducedMotion'
import NotFound from './NotFound'

const anchors = [
  { id: 'cs-overview', label: 'Overview' },
  { id: 'cs-figure', label: 'Figure' },
  { id: 'cs-built', label: 'What it does' },
  { id: 'cs-hard', label: 'What was hard' },
]

export default function CaseStudy() {
  const { slug = '' } = useParams()
  const p = projectBySlug(slug)
  useDocumentTitle(p ? `${p.title} | Sivakumar Ramakrishnan` : '404 | Sivakumar Ramakrishnan', p?.summary)
  if (!p) return <NotFound />
  return <Study key={p.slug} slug={p.slug} />
}

function Study({ slug }: { slug: string }) {
  const p = projectBySlug(slug)!
  const navigate = useNavigate()
  const root = useRef<HTMLElement>(null)
  const [section, setSection] = useState(anchors[0].id)
  const i = projects.indexOf(p)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]
  const links = Object.entries(p.links).filter(([, v]) => v) as [string, string][]
  const lists: [string, string, string[]][] = [
    ['cs-built', 'What it does', p.features],
    ['cs-hard', 'What was hard', p.challenges],
  ]

  // ← / → step through projects (with the same view transition as a click).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return
      // replace: moving between projects never stacks history, so Back always leaves the projects
      if (e.key === 'ArrowRight') navigate(`/work/${next.slug}`, { viewTransition: true, replace: true })
      if (e.key === 'ArrowLeft') navigate(`/work/${prev.slug}`, { viewTransition: true, replace: true })
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [navigate, next.slug, prev.slug])

  useGSAP(
    () => {
      // Index rail: active anchor + vertical reading-progress hairline.
      anchors.forEach(({ id }) => {
        if (!document.getElementById(id)) return
        ScrollTrigger.create({ trigger: `#${id}`, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setSection(id) })
      })
      gsap.to('[data-progress]', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true } })
      if (prefersReducedMotion() || !document.querySelector('[data-figure]')) return
      // Figure: clip-path wipe in, then a slow parallax drift inside its frame.
      gsap.fromTo(
        '[data-figure]',
        { clipPath: 'inset(0 0 100% 0 round 16px)' },
        { clipPath: 'inset(0 0 0% 0 round 16px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '[data-figure]', start: 'top 80%', once: true } },
      )
      // (No parallax zoom on the image: scaling a raster figure up is exactly what made it blurry.)
    },
    { scope: root, dependencies: [slug] },
  )

  // Lists: items cascade in and their indices count up from 00 (Anime.js).
  useEffect(() => {
    const cleanups = [...root.current!.querySelectorAll<HTMLElement>('[data-list]')].map((ol) => {
      const items = ol.querySelectorAll<HTMLElement>('li')
      items.forEach((li) => (li.style.opacity = '0'))
      return onceVisible(ol, () => {
        animate(items, { opacity: [0, 1], translateX: [-18, 0], duration: 800, delay: stagger(90), ease: 'outExpo' })
        items.forEach((li, k) => {
          const num = li.querySelector('[data-n]')!
          const o = { n: 0 }
          animate(o, { n: k + 1, duration: 600, delay: k * 90, ease: 'outQuad', onUpdate: () => void (num.textContent = String(Math.round(o.n)).padStart(2, '0')) })
        })
      })
    })
    return () => cleanups.forEach((c) => c())
  }, [slug])

  // "All work" goes back to the Selected work section: history-back when there is somewhere to
  // go back to (the restore logic lands it on #work), otherwise straight to /#work.
  const back = (e: React.MouseEvent) => {
    e.preventDefault()
    if ((history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate('/#work', { viewTransition: true })
  }

  return (
    <main ref={root} className="pt-28">
      {/* Sticky back: stays with you while reading */}
      <Link
        to="/#work"
        onClick={back}
        className="glass-clear fixed left-4 top-[86px] z-40 flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider !text-fg/90 transition-transform hover:-translate-x-0.5 md:left-8"
        data-cursor
      >
        ← All work <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
        <span className="text-muted">/ {projects.length}</span>
      </Link>
      <article className="container-x pt-8">
        <header className="mt-10 grid gap-8 md:grid-cols-12">
          <p className="eyebrow md:col-span-3">
            <span className="text-accent">{String(i + 1).padStart(2, '0')}</span> / {p.org} · {p.year}
          </p>
          <h1 className="display text-[clamp(3rem,8vw,8rem)] md:col-span-9" style={{ viewTransitionName: `title-${p.slug}` }}>
            <Reveal as="span" mode="chars" immediate delay={0.45} className="block">
              {p.title}
            </Reveal>
          </h1>
        </header>

        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl border hairline md:aspect-[21/9]" style={{ viewTransitionName: `media-${p.slug}` }}>
          {/* Overlapping views would clear each other's region, so a model replaces the shader rather than layering on it. */}
          {p.model ? (
            <>
              {/* Transparent on purpose: the shared WebGL canvas renders *behind* the page. */}
              <div className="grid-paper absolute inset-0" />
              <ModelSlot url={p.model} className="absolute inset-0" />
            </>
          ) : (
            <ProjectVisual project={p} className="absolute inset-0" />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/85 to-transparent p-5 md:p-8">
            <TeX block className="text-base md:text-xl">
              {p.equation}
            </TeX>
          </div>
        </div>

        <div className="mt-20 grid gap-16 md:grid-cols-12">
          {/* Sticky index rail with reading progress */}
          <aside className="md:col-span-3">
            <div className="space-y-10 md:sticky md:top-28">
              <nav aria-label="On this page" className="relative hidden pl-5 md:block">
                <span className="absolute left-0 top-0 h-full w-px bg-line" />
                <span data-progress className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-accent" />
                <ul className="space-y-2.5">
                  {anchors
                    .filter((a) => a.id !== 'cs-figure' || p.image)
                    .map((a) => (
                      <li key={a.id}>
                        <a
                          href={`#${a.id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            document.getElementById(a.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }}
                          className={`eyebrow transition-colors ${section === a.id ? '!text-fg' : 'hover:text-fg'}`}
                        >
                          <span className={`mr-2 inline-block h-px align-middle transition-all duration-500 ${section === a.id ? 'w-6 bg-accent' : 'w-3 bg-fg/30'}`} />
                          {a.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </nav>
              <div>
                <p className="eyebrow mb-3">Stack</p>
                <ul className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              {links.length > 0 && (
                <div>
                  <p className="eyebrow mb-3">Links</p>
                  <ul className="space-y-2">
                    {links.map(([k, href]) => (
                      <li key={k}>
                        <a href={href} target="_blank" rel="noopener" className="link-draw capitalize">
                          {k} <Arrow className="text-accent" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          <div className="space-y-24 md:col-span-8 md:col-start-5">
            <div id="cs-overview" className="scroll-mt-28 space-y-6">
              {p.body.map((para, k) => (
                <Reveal as="p" key={k} className={k === 0 ? 'font-serif text-3xl leading-snug md:text-4xl' : 'text-lg leading-relaxed text-muted'}>
                  {para}
                </Reveal>
              ))}
            </div>
            {p.image && (
              <figure id="cs-figure" className="scroll-mt-28">
                <div data-figure className="overflow-hidden rounded-2xl border hairline bg-bg-2 p-3 md:p-5">
                  <Picture name={p.image} alt={`${p.title}, figure`} sizes="(min-width: 768px) 60vw, 100vw" fit="native" eager className="block rounded-lg" />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-muted">Fig. 1. {p.title}</figcaption>
              </figure>
            )}
            <div className="grid gap-16 sm:grid-cols-2">
              {lists.map(([id, label, items]) => (
                <div key={id} id={id} className="scroll-mt-28">
                  <p className="eyebrow mb-4 border-b hairline pb-3">{label}</p>
                  <ol data-list className="space-y-4">
                    {items.map((f) => (
                      <li key={f} className="grid grid-cols-[2.2rem_1fr] leading-relaxed">
                        <span data-n className="font-mono text-[11px] tabular-nums text-accent">
                          00
                        </span>
                        {f}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <NextProject slug={next.slug} />
      <p className="container-x py-8 text-center font-mono text-[10px] text-muted">← / → to step through projects</p>
    </main>
  )
}

/** The next project as a large card: its own live visual behind a veil that lifts on hover. */
function NextProject({ slug }: { slug: string }) {
  const n = projectBySlug(slug)!
  const hover = useRef({ current: 0 }).current
  const veil = useRef<HTMLDivElement>(null)
  const lift = (on: boolean) => {
    hover.current = on ? 1 : 0
    animate(veil.current!, { opacity: on ? 0.35 : 0.8, duration: 600, ease: 'outExpo' })
  }
  return (
    <Link to={`/work/${n.slug}`} viewTransition replace onPointerEnter={() => lift(true)} onPointerLeave={() => lift(false)} className="group relative mt-32 block overflow-hidden border-y hairline" data-cursor>
      <div className="absolute inset-0" style={{ viewTransitionName: `media-${n.slug}` }}>
        <ProjectVisual project={n} hover={hover} className="absolute inset-0" />
      </div>
      <div ref={veil} className="absolute inset-0 bg-bg" style={{ opacity: 0.8 }} />
      <div className="container-x relative flex min-h-[46vh] items-end justify-between gap-6 py-16">
        <div>
          <p className="eyebrow">Next project</p>
          <Magnetic strength={0.12}>
            <p className="display mt-3 text-5xl transition-colors duration-500 group-hover:text-accent md:text-8xl" style={{ viewTransitionName: `title-${n.slug}` }}>
              {n.title}
            </p>
          </Magnetic>
          <p className="mt-4 max-w-[52ch] text-muted">{n.summary}</p>
        </div>
        <Arrow className="h-12 w-12 shrink-0 text-muted transition duration-500 group-hover:rotate-45 group-hover:text-accent" />
      </div>
    </Link>
  )
}
