import { Command } from 'cmdk'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { projects } from '@/content/projects'
import { profile } from '@/content/profile'
import { toggleTheme } from '@/lib/theme'
import { sections } from './Nav'
import { getLenis } from '@/motion/SmoothScroll'

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean | ((v: boolean) => boolean)) => void }) {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [setOpen])

  useEffect(() => {
    const l = getLenis()
    if (open) l?.stop()
    else l?.start()
  }, [open])

  const run = (fn: () => void) => () => {
    setOpen(false)
    fn()
  }

  const item = 'flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm data-[selected=true]:bg-fg/[0.07] data-[selected=true]:text-fg text-muted'
  const group = '[&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3'

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      overlayClassName="fixed inset-0 z-[80] bg-bg/70 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[18vh] z-[81] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border hairline bg-bg-2 shadow-2xl"
    >
      <Command.Input placeholder="Jump to a section, project, or action…" className="w-full border-b hairline bg-transparent px-4 py-4 font-sans text-base outline-none placeholder:text-muted" />
      <Command.List className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
        <Command.Empty className="px-3 py-6 text-sm text-muted">No results. Try “RAG” or “theme”.</Command.Empty>
        <Command.Group heading="Sections" className={group}>
          {sections.map((s, i) => (
            <Command.Item key={s.id} value={`section ${s.label}`} onSelect={run(() => navigate(`/#${s.id}`))} className={item}>
              {s.label}
              <span className="font-mono text-[10px]">{String(i + 1).padStart(2, '0')}</span>
            </Command.Item>
          ))}
          <Command.Item value="library resources reading" onSelect={run(() => navigate('/library'))} className={item}>
            Library <span className="font-mono text-[10px]">/library</span>
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Projects" className={group}>
          {projects.map((p) => (
            <Command.Item key={p.slug} value={`project ${p.title} ${p.tags.join(' ')}`} onSelect={run(() => navigate(`/work/${p.slug}`, { viewTransition: true, replace: location.pathname.startsWith('/work/') }))} className={item}>
              {p.title}
              <span className="font-mono text-[10px]">{p.year}</span>
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Actions" className={group}>
          <Command.Item value="toggle theme dark light" onSelect={run(toggleTheme)} className={item}>
            Toggle theme
          </Command.Item>
          <Command.Item value="copy email contact" onSelect={run(() => navigator.clipboard?.writeText(profile.email))} className={item}>
            Copy email <span className="font-mono text-[10px]">{profile.email}</span>
          </Command.Item>
          <Command.Item value="resume cv download" onSelect={run(() => window.open(profile.resume, '_blank'))} className={item}>
            Open résumé
          </Command.Item>
          {profile.links.map((l) => (
            <Command.Item key={l.href} value={`open ${l.label}`} onSelect={run(() => window.open(l.href, '_blank', 'noopener'))} className={item}>
              {l.label}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}
