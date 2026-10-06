import { useState } from 'react'
import { MathWord } from '@/ui/MathWord'
import { profile } from '@/content/profile'
import { GLSlot } from '@/gl/Slot'
import { Magnetic } from '@/ui/Magnetic'
import { Reveal } from '@/motion/Reveal'
import { Arrow } from '@/ui/Arrow'
import { TeX } from '@/ui/TeX'

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section id="contact" className="relative overflow-hidden pt-28 md:pt-40">
      <div className="container-x relative">
        <p className="eyebrow border-t hairline pt-6">
          <span className="text-accent">07</span> / Contact
        </p>
        <div className="relative grid items-center gap-8 py-10 md:grid-cols-12">
          <div className="relative z-10 md:col-span-7">
            <Reveal as="h2" className="display text-[clamp(3.5rem,11vw,11rem)]">
              Let’s build something <MathWord kind="solve">non-trivial</MathWord>.
            </Reveal>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Magnetic>
                <a href={`mailto:${profile.email}?subject=Hello%20from%20your%20portfolio`} className="inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-lg text-[var(--bg)] transition-transform hover:scale-[1.03]">
                  Write to me <Arrow />
                </a>
              </Magnetic>
              <button onClick={copy} className="link-draw font-mono text-sm text-muted hover:text-fg">
                {copied ? 'copied ✓' : profile.email}
              </button>
            </div>
          </div>
          <div className="relative aspect-square md:col-span-5">
            <GLSlot scene="mobius" className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-muted">
              <TeX className="text-xs">{'\\mathbf r(u,v)=\\big((1+\\tfrac v2\\cos\\tfrac u2)\\cos u,\\ (1+\\tfrac v2\\cos\\tfrac u2)\\sin u,\\ \\tfrac v2\\sin\\tfrac u2\\big)'}</TeX>
            </div>
          </div>
        </div>
      </div>
      <footer className="container-x mt-16 flex flex-wrap items-center justify-between gap-4 border-t hairline py-6 font-mono text-[11px] text-muted">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="flex gap-5">
          {profile.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-draw hover:text-fg">
              {l.label}
            </a>
          ))}
        </span>
        <span>One-sided surface, two-sided conversation.</span>
        <p className="w-full text-[10px] leading-relaxed opacity-70">
          Credits: JWST model courtesy of{' '}
          <a href="https://science.nasa.gov/3d-resources/james-webb-space-telescope-b/" target="_blank" rel="noopener" className="underline">NASA</a>. Carnatic venu model generated from a photo by Asidhara1212,{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Carnatic_Flute_2.jpg" target="_blank" rel="noopener" className="underline">CC BY-SA 4.0</a>. Chess knight model generated from a photo by MichaelMaggs,{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Chess_piece_-_Black_knight.JPG" target="_blank" rel="noopener" className="underline">CC BY-SA 2.5</a>. Astrolabe, orrery, glove and torii generated with Meshy.
        </p>
      </footer>
    </section>
  )
}
