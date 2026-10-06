import { projects, type Field } from '@/content/projects'

export type Pt = { x: number; y: number }
export type Rect = Pt & { w: number; h: number } // centre + size

/** Direction of each field from the core (degrees, 0 = right, counter-clockwise). */
const FIELD_ANGLE: Record<Field, number> = {
  information: 200,
  probability: 140,
  linear: 90,
  graphs: 36,
  optimization: 334,
  dynamics: 262,
}
const SPREAD = 20 // degrees between sibling projects around their field

/** Synapses: cross-links between projects that share ideas. */
export const SYNAPSES: [string, string][] = [
  ['rag-architecture', 'rlhf-dpo'],
  ['roberta-toxicity', 'goodreads-t5'],
  ['multimodal-system', 'paligemma-invoice'],
  ['mamba-transformer', 'autonomous-vehicle'],
  ['kl-divergence', 'stellar-mapping'],
  ['agentic-service-platform', 'rag-architecture'],
  ['ray-document-pipeline', 'resume-parser'],
  ['ui-snapshot-harness', 'agentic-service-platform'],
]

const rad = (d: number) => (d * Math.PI) / 180
const onEllipse = (c: Pt, rx: number, ry: number, deg: number): Pt => ({ x: c.x + Math.cos(rad(deg)) * rx, y: c.y - Math.sin(rad(deg)) * ry })

/**
 * Deterministic radial layout in stage pixels: core in the middle, fields on an inner ellipse,
 * projects on an outer ellipse grouped around their field, then a short one-off relaxation pushes
 * overlapping cards apart. Nothing animates afterwards, so there is no wobble.
 */
export function layoutGraph(W: number, H: number, card: { w: number; h: number }) {
  const core: Pt = { x: W / 2, y: H / 2 }
  const fieldPos = Object.fromEntries(
    (Object.keys(FIELD_ANGLE) as Field[]).map((f) => [f, onEllipse(core, W * 0.19, H * 0.23, FIELD_ANGLE[f])]),
  ) as Record<Field, Pt>

  const rx = W / 2 - card.w / 2 - 10, ry = H / 2 - card.h / 2 - 6
  const byField = new Map<Field, string[]>()
  projects.forEach((p) => byField.set(p.field, [...(byField.get(p.field) ?? []), p.slug]))
  const home: Record<string, Pt> = {}
  for (const [f, slugs] of byField) slugs.forEach((s, i) => (home[s] = onEllipse(core, rx, ry, FIELD_ANGLE[f] + (i - (slugs.length - 1) / 2) * SPREAD)))

  // Relax: separate overlapping cards (and keep clear of the core + labels), stay near home.
  const pos: Record<string, Pt> = Object.fromEntries(Object.entries(home).map(([k, v]) => [k, { ...v }]))
  const keys = Object.keys(pos)
  const padX = card.w + 18, padY = card.h + 14
  for (let it = 0; it < 120; it++) {
    for (let a = 0; a < keys.length; a++)
      for (let b = a + 1; b < keys.length; b++) {
        const A = pos[keys[a]], B = pos[keys[b]]
        const dx = B.x - A.x, dy = B.y - A.y
        const ox = padX - Math.abs(dx), oy = padY - Math.abs(dy)
        if (ox > 0 && oy > 0) {
          // push along the axis of least overlap
          if (ox / padX < oy / padY) {
            const s = (ox / 2) * Math.sign(dx || 1)
            A.x -= s
            B.x += s
          } else {
            const s = (oy / 2) * Math.sign(dy || 1)
            A.y -= s
            B.y += s
          }
        }
      }
    for (const k of keys) {
      const P = pos[k], Hm = home[k]
      P.x += (Hm.x - P.x) * 0.04
      P.y += (Hm.y - P.y) * 0.04
      P.x = Math.max(card.w / 2 + 4, Math.min(W - card.w / 2 - 4, P.x))
      P.y = Math.max(card.h / 2 + 2, Math.min(H - card.h / 2 - 2, P.y))
    }
  }
  return { core, fieldPos, pos }
}

/** Where the segment from a rect's centre toward `from` leaves the rect (edges stop at the card). */
export function rectExit(r: Rect, from: Pt, pad = 4): Pt {
  const dx = from.x - r.x, dy = from.y - r.y
  const s = Math.min((r.w / 2 + pad) / Math.abs(dx || 1e-6), (r.h / 2 + pad) / Math.abs(dy || 1e-6))
  return { x: r.x + dx * Math.min(1, s), y: r.y + dy * Math.min(1, s) }
}

/** A soft curve from a to b, bowing slightly away from the core (neural-net look). */
export function curve(a: Pt, b: Pt, core: Pt, bow = 0.18) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
  const nx = mx - core.x, ny = my - core.y
  const len = Math.hypot(nx, ny) || 1
  const d = Math.hypot(b.x - a.x, b.y - a.y) * bow
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${(mx + (nx / len) * d).toFixed(1)} ${(my + (ny / len) * d).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}
