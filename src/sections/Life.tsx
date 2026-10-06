import { useEffect, useRef, useState } from 'react'
import { MathWord } from '@/ui/MathWord'
import { Link } from 'react-router'
import { hobbies, resources, type Hobby } from '@/content/life'
import { SectionHead } from '@/ui/SectionHead'
import { Arrow } from '@/ui/Arrow'
import { ModelSlot } from '@/gl/ModelSlot'
import { Tilt } from '@/ui/Tilt'

/**
 * A full 6½-minute recital (~10 MB), so it's click-to-play with sound: only the poster loads
 * up front, and it pauses itself when scrolled away.
 */
function LazyVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const v = ref.current!
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && v.pause())
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <div className="relative h-full w-full">
      <video ref={ref} poster={poster} controls={started} playsInline preload="none" aria-label={label} className="h-full w-full object-cover">
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
      {!started && (
        <button
          onClick={() => {
            setStarted(true)
            ref.current?.play().catch(() => {})
          }}
          className="group absolute inset-0 grid place-items-center"
          aria-label={`Play: ${label}`}
        >
          {/* Clear Liquid Glass over media, with the HIG's 35% dimming layer (the poster is bright) */}
          <span className="glass-clear dim grid h-16 w-16 place-items-center rounded-full transition duration-500 group-hover:scale-110">▶</span>
        </button>
      )}
    </div>
  )
}

/** YouTube facade: a thumbnail until clicked, so no third-party JS loads by default. */
function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false)
  return on ? (
    <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
  ) : (
    <button onClick={() => setOn(true)} className="group relative h-full w-full" aria-label={`Play: ${title}`}>
      {/* oar2 is the vertical (Shorts) thumbnail; fall back to the 16:9 one */}
      <img
        src={`https://i.ytimg.com/vi/${id}/oar2.jpg`}
        onError={(e) => (e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hq720.jpg`)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 grid place-items-center">
        <span className="glass-clear dim grid h-16 w-16 place-items-center rounded-full transition duration-500 group-hover:scale-110">▶</span>
      </span>
    </button>
  )
}

/**
 * A compact card for each hobby, shaped to its media: 16:9 for the recital, 9:16 for the chess
 * Short, and for hobbies without media, the 3D model itself on a stage.
 */
function MediaCard({ h }: { h: Hobby }) {
  const m = h.media
  const tall = m?.aspect === '9/16'
  return (
    <Tilt max={4} className={`group mx-auto w-full ${!m ? 'max-w-[340px]' : tall ? 'max-w-[260px]' : 'max-w-[420px]'}`}>
      {/* A model card can't use the frosted material: the model renders on the canvas behind the page. */}
      <figure className={`${m ? 'material' : 'frame-gl'} relative overflow-hidden rounded-[22px] p-2.5 shadow-[0_30px_70px_-40px_rgb(0_0_0/0.8)]`}>
        <figcaption className="flex items-center justify-between gap-3 px-1.5 pb-2.5 pt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {m ? m.label : h.title}
          </span>
          <span>{m ? [m.source, m.duration].filter(Boolean).join(' · ') : '3D model'}</span>
        </figcaption>
        <div className={`relative overflow-hidden rounded-[14px] ${m ? 'bg-bg-2' : ''}`} style={{ aspectRatio: m ? m.aspect : '1 / 1' }}>
          {m?.kind === 'video' && <LazyVideo src={m.src} poster={m.poster} label={`${h.title}: ${m.label}`} />}
          {m?.kind === 'youtube' && <LiteYouTube id={m.id} title={`${h.title}: ${m.label}`} />}
          {!m && (
            <>
              <div className="grid-paper absolute inset-0 opacity-40" />
              <ModelSlot url={h.model.url} spin={0.35} className="absolute inset-0" />
            </>
          )}
          <span className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <p className="px-1.5 pb-1 pt-3 text-sm leading-snug text-muted">{m ? h.line : h.model.note}</p>
      </figure>
    </Tilt>
  )
}

/** The small model tile that sits beside each hobby's heading. */
function ModelTile({ h, active }: { h: Hobby; active: boolean }) {
  return (
    <span
      aria-hidden
      className={`frame-gl relative inline-block h-24 w-24 shrink-0 overflow-hidden rounded-2xl align-middle transition-[border-color,transform] duration-500 ${active ? '!border-accent/60 -translate-y-0.5' : ''}`}
    >
      <ModelSlot url={h.model.url} axis={h.model.axis} spin={active ? 0.9 : 0.3} className="absolute inset-0" />
    </span>
  )
}

export function Life() {
  const [open, setOpen] = useState(0)
  return (
    <section id="life" className="container-x relative py-28 md:py-40">
      <SectionHead index="06" label="Off the clock" title={<>The rest of the <MathWord kind="wave">signal</MathWord>.</>} />
      <div className="grid gap-12 md:grid-cols-12">
        <ul className="divide-y divide-line border-y hairline md:col-span-7">
          {hobbies.map((h, i) => (
            <li key={h.title}>
              <button onClick={() => setOpen(i)} onPointerEnter={() => setOpen(i)} className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-7 text-left" aria-expanded={open === i}>
                <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="flex items-center gap-5">
                    <span className={`display block text-5xl transition-colors md:text-7xl ${open === i ? 'text-accent' : ''}`}>{h.title}</span>
                    <ModelTile h={h} active={open === i} />
                  </span>
                  <span className="mt-2 block text-muted">{h.line}</span>
                  <span className={`grid transition-[grid-template-rows] duration-500 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <span className="overflow-hidden">
                      <span className="block max-w-[52ch] pt-4 leading-relaxed">{h.detail}</span>
                      {h.links && (
                        <span className="mt-3 flex gap-4">
                          {h.links.map((l) => (
                            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="link-draw font-mono text-[11px] uppercase" onClick={(e) => e.stopPropagation()}>
                              {l.label} <Arrow />
                            </a>
                          ))}
                        </span>
                      )}
                    </span>
                  </span>
                </span>
                <Arrow className={`text-muted transition ${open === i ? 'rotate-45 text-accent' : ''}`} />
              </button>
              {/* Mobile: the card sits under its row (outside the row button: no nested buttons) */}
              {open === i && (
                <div className="pb-7 md:hidden">
                  <MediaCard h={h} />
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-28 flex justify-center">
            <MediaCard key={open} h={hobbies[open]} />
          </div>
        </div>
      </div>

      <Link to="/library" viewTransition className="group mt-24 grid gap-6 border-t hairline pt-8 md:grid-cols-12" data-cursor>
        <p className="eyebrow md:col-span-3">Library · {resources.length} entries</p>
        <p className="display text-5xl transition-colors group-hover:text-accent md:col-span-7 md:text-7xl">
          Things that taught me <em>how to think</em>
        </p>
        <Arrow className="h-10 w-10 self-end justify-self-end text-muted transition group-hover:rotate-45 group-hover:text-accent md:col-span-2" />
      </Link>
    </section>
  )
}
