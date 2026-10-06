import type { ReactNode } from 'react'
import type { Project } from '@/content/projects'
import { ProjectVisual } from '@/ui/ProjectVisual'

/**
 * Small project card with a frame that says what the project *is*. The live shader stays as the
 * art inside; the frame (CSS/SVG only) changes per project.
 */
type Frame = { shape?: 'rect' | 'circle' | 'receipt' | 'dogear'; over?: ReactNode; under?: ReactNode; around?: ReactNode }

const ink = 'rgb(var(--fg-rgb) / 0.55)'

const frames: Record<string, Frame> = {
  // An orchestrator routing to two specialist agents (hub and spokes).
  'agentic-service-platform': {
    over: (
      <>
        <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full">
          <path d="M50 14 L22 58 M50 14 L78 58" stroke={ink} strokeWidth="1" fill="none" />
          <circle cx="50" cy="12" r="5" fill="var(--accent)" />
        </svg>
        <Tag className="bottom-1.5 left-1.5">analyst</Tag>
        <Tag className="bottom-1.5 right-1.5">service</Tag>
      </>
    ),
  },
  // Many workers in parallel: lanes, and how many of them.
  'ray-document-pipeline': {
    over: (
      <>
        <span className="absolute inset-x-1.5 top-1/2 flex -translate-y-1/2 flex-col gap-[7px]">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-px bg-fg/35" style={{ marginLeft: `${i * 8}%` }} />
          ))}
        </span>
        <Tag className="right-1.5 top-1.5">× n workers</Tag>
      </>
    ),
  },
  // A browser window, once per language.
  'ui-snapshot-harness': {
    over: (
      <>
        <span className="absolute inset-x-0 top-0 flex h-3.5 items-center gap-[3px] border-b border-fg/20 bg-bg/60 px-1.5">
          <span className="h-[4px] w-[4px] rounded-full bg-fg/50" />
          <span className="h-[4px] w-[4px] rounded-full bg-fg/50" />
          <span className="h-[4px] w-[4px] rounded-full bg-accent" />
        </span>
        <Tag className="bottom-1.5 right-1.5">7 langs</Tag>
      </>
    ),
  },
  // Retrieval: a stack of documents behind the result, and the k it retrieves.
  'rag-architecture': {
    under: (
      <>
        {/* Outline-only: anything opaque here would hide the shader, which renders on the canvas *behind* the page. */}
        <span className="absolute inset-0 translate-x-[7px] -translate-y-[7px] rounded-[10px] border border-fg/15 [clip-path:polygon(0_0,100%_0,100%_100%,calc(100%-7px)_100%,calc(100%-7px)_7px,0_7px)]" />
        <span className="absolute inset-0 translate-x-[3.5px] -translate-y-[3.5px] rounded-[10px] border border-fg/25 [clip-path:polygon(0_0,100%_0,100%_100%,calc(100%-3.5px)_100%,calc(100%-3.5px)_3.5px,0_3.5px)]" />
      </>
    ),
    over: <Tag className="bottom-1.5 right-1.5">top-k</Tag>,
  },
  // Two distributions and the divergence between them.
  'kl-divergence': {
    over: (
      <>
        <svg viewBox="0 0 60 14" className="absolute left-1.5 top-1.5 h-3.5 w-14">
          <path d="M0 13 C14 13 18 2 26 2 S38 13 60 13" fill="none" stroke={ink} strokeWidth="1.2" />
          <path d="M0 13 C22 13 28 4 36 4 S46 13 60 13" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
        </svg>
        <Tag className="right-1.5 top-1.5">D_KL</Tag>
      </>
    ),
  },
  // A telescope's view: circular lens with a degree ring.
  'stellar-mapping': {
    shape: 'circle',
    around: (
      <svg viewBox="-50 -50 100 100" className="pointer-events-none absolute -inset-[7px] h-[calc(100%+14px)] w-[calc(100%+14px)]">
        <circle r="48" fill="none" stroke={ink} strokeWidth=".6" />
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i * 10 * Math.PI) / 180, l = i % 9 === 0 ? 5 : 2.5
          return <line key={i} x1={Math.cos(a) * 48} y1={Math.sin(a) * 48} x2={Math.cos(a) * (48 - l)} y2={Math.sin(a) * (48 - l)} stroke={i % 9 ? ink : 'var(--accent)'} strokeWidth=".7" />
        })}
      </svg>
    ),
  },
  // A sequence model reading a tape of states.
  'mamba-transformer': {
    over: (
      <span className="absolute inset-x-1.5 bottom-1.5 flex gap-[2px]">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-[1px] ${i === 11 ? 'bg-accent' : i % 3 === 0 ? 'bg-fg/50' : 'bg-fg/20'}`} />
        ))}
      </span>
    ),
  },
  // A book: spine on the left, ribbon bookmark.
  'goodreads-t5': {
    over: (
      <>
        <span className="absolute inset-y-0 left-0 w-[9px] border-r border-fg/20 bg-[repeating-linear-gradient(180deg,rgb(var(--fg-rgb)/0.18)_0_1px,transparent_1px_6px)] bg-bg-2/80" />
        <span className="absolute -bottom-2 right-3 h-[calc(100%+4px)] w-2 bg-accent/90 [clip-path:polygon(0_0,100%_0,100%_100%,50%_85%,0_100%)]" />
      </>
    ),
  },
  // An invoice: torn receipt edge, structured output.
  'paligemma-invoice': {
    shape: 'receipt',
    over: <Tag className="left-1.5 top-1.5">{'{ json }'}</Tag>,
  },
  // A preference pair: chosen vs rejected.
  'rlhf-dpo': {
    over: (
      <>
        <span className="absolute inset-y-0 left-1/2 w-px bg-fg/40" />
        <span className="absolute left-1.5 top-1 font-mono text-[10px] text-accent">✓</span>
        <span className="absolute right-1.5 top-1 font-mono text-[10px] text-muted">✗</span>
      </>
    ),
  },
  // Moderation: redacted lines.
  'roberta-toxicity': {
    over: (
      <span className="absolute left-1.5 top-1.5 flex flex-col gap-[3px]">
        <span className="h-[4px] w-10 rounded-sm bg-fg/70" />
        <span className="h-[4px] w-6 rounded-sm bg-accent" />
        <span className="h-[4px] w-8 rounded-sm bg-fg/70" />
      </span>
    ),
  },
  // A résumé page with a folded corner.
  'resume-parser': {
    shape: 'dogear',
    over: <span className="absolute right-0 top-0 h-4 w-4 bg-fg/25 [clip-path:polygon(0_0,0_100%,100%_100%)]" />,
  },
  // Four modalities, one per corner.
  'multimodal-system': {
    over: (
      <>
        {['♪', '▣', '✎', '▶'].map((g, i) => (
          <span key={g} className={`absolute font-mono text-[9px] text-fg/70 ${['left-1.5 top-1', 'right-1.5 top-1', 'bottom-1 left-1.5', 'bottom-1 right-1.5'][i]}`}>
            {g}
          </span>
        ))}
      </>
    ),
  },
  // A microcontroller: pins on every side.
  'edge-aiot': {
    around: (
      <>
        <span className="absolute -top-[5px] inset-x-3 h-[5px] bg-[repeating-linear-gradient(90deg,rgb(var(--fg-rgb)/0.5)_0_3px,transparent_3px_8px)]" />
        <span className="absolute -bottom-[5px] inset-x-3 h-[5px] bg-[repeating-linear-gradient(90deg,rgb(var(--fg-rgb)/0.5)_0_3px,transparent_3px_8px)]" />
        <span className="absolute -left-[5px] inset-y-3 w-[5px] bg-[repeating-linear-gradient(180deg,rgb(var(--fg-rgb)/0.5)_0_3px,transparent_3px_8px)]" />
        <span className="absolute -right-[5px] inset-y-3 w-[5px] bg-[repeating-linear-gradient(180deg,rgb(var(--fg-rgb)/0.5)_0_3px,transparent_3px_8px)]" />
      </>
    ),
    over: <Tag className="bottom-1.5 left-1.5">MCU</Tag>,
  },
  // A driving HUD: corner brackets and lane lines.
  'autonomous-vehicle': {
    over: (
      <>
        <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M3 14 V3 H14 M86 3 H97 V14 M97 61 V72 H86 M14 72 H3 V61" fill="none" stroke="var(--accent)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <path d="M30 75 L46 40 M70 75 L54 40" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <Tag className="right-1.5 top-1.5">auto</Tag>
      </>
    ),
  },
}

function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`absolute rounded-sm bg-bg/70 px-1 py-[1px] font-mono text-[8px] uppercase tracking-wider text-fg/85 backdrop-blur-sm ${className}`}>{children}</span>
}

const shapeClass: Record<NonNullable<Frame['shape']>, string> = {
  rect: 'rounded-[10px] aspect-[4/3]',
  circle: 'rounded-full aspect-square',
  receipt: 'rounded-t-[10px] aspect-[4/3] [clip-path:polygon(0_0,100%_0,100%_92%,95%_100%,90%_92%,85%_100%,80%_92%,75%_100%,70%_92%,65%_100%,60%_92%,55%_100%,50%_92%,45%_100%,40%_92%,35%_100%,30%_92%,25%_100%,20%_92%,15%_100%,10%_92%,5%_100%,0_92%)]',
  dogear: 'rounded-[10px] aspect-[4/3] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)]',
}

export function ProjectCard({ project, hover, active = false }: { project: Project; hover: { current: number }; active?: boolean }) {
  const f = frames[project.slug] ?? {}
  const shape = f.shape ?? 'rect'
  return (
    <span className="block">
      <span className={`relative block ${shape === 'circle' ? 'mx-auto w-[78%]' : ''}`}>
        {f.under}
        {f.around}
        <span
          className={`relative block overflow-hidden border transition-[border-color,box-shadow] duration-500 ${shapeClass[shape]} ${active ? 'border-accent/70 shadow-[0_0_0_1px_rgb(var(--accent-rgb)/0.3),0_18px_40px_-24px_rgb(var(--accent-rgb)/0.7)]' : 'border-fg/15'}`}
          style={{ viewTransitionName: `media-${project.slug}` }}
        >
          <ProjectVisual project={project} hover={hover} className="absolute inset-0" />
          {f.over}
        </span>
      </span>
      <span className="mt-1.5 block truncate text-center font-serif text-[0.82rem] leading-tight" style={{ viewTransitionName: `title-${project.slug}` }}>
        {project.title}
      </span>
    </span>
  )
}
