/**
 * One small, bespoke animation per project, drawn with Canvas2D. Each one shows what the
 * project actually does (retrieval, OCR, a conveyor under a camera, a task scheduler...).
 * A single shared ticker paints only the canvases that are on screen.
 */

export type Palette = { ink: string; muted: string; accent: string; bg: string }
export type Input = { hover: number; mx: number; my: number } // mx/my in 0..1, card space
type Draw = (c: CanvasRenderingContext2D, t: number, w: number, h: number, p: Palette, i: Input) => void

/* ───────────── helpers ───────────── */
const TAU = Math.PI * 2
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const alpha = (hex: string, a: number) => {
  const n = hex.replace('#', '')
  const v = n.length === 3 ? n.split('').map((x) => x + x).join('') : n
  return `rgba(${parseInt(v.slice(0, 2), 16)},${parseInt(v.slice(2, 4), 16)},${parseInt(v.slice(4, 6), 16)},${a})`
}
const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath()
  c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2))
}
const dot = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  c.beginPath()
  c.arc(x, y, r, 0, TAU)
  c.fill()
}
const line = (c: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
  c.beginPath()
  c.moveTo(x1, y1)
  c.lineTo(x2, y2)
  c.stroke()
}
const label = (c: CanvasRenderingContext2D, s: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = 'left') => {
  c.font = `${Math.max(6, size)}px "JetBrains Mono Variable", ui-monospace, monospace`
  c.fillStyle = color
  c.textAlign = align
  c.textBaseline = 'middle'
  c.fillText(s, x, y)
}
const smooth = (x: number) => x * x * (3 - 2 * x)
const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

/* ───────────── RAG: k-nearest neighbours in an embedding space ───────────── */
const ragPts = (() => {
  const r = rng(7), pts: [number, number][] = []
  const centres = [[0.25, 0.35], [0.7, 0.3], [0.45, 0.7], [0.8, 0.72]]
  for (let i = 0; i < 70; i++) {
    const [a, b] = centres[i % 4]
    pts.push([a + (r() - 0.5) * 0.28, b + (r() - 0.5) * 0.26])
  }
  return pts
})()
const rag: Draw = (c, t, w, h, p, i) => {
  const k = i.hover ? 7 : 5
  const qx = i.hover ? i.mx : 0.5 + 0.32 * Math.sin(t * 0.45), qy = i.hover ? i.my : 0.48 + 0.26 * Math.sin(t * 0.7 + 1)
  const d = ragPts.map(([x, y], j) => ({ j, d: (x - qx) ** 2 + (y - qy) ** 2 })).sort((a, b) => a.d - b.d)
  const top = new Set(d.slice(0, k).map((e) => e.j))
  c.lineWidth = 1
  c.strokeStyle = alpha(p.accent, 0.7)
  for (const e of d.slice(0, k)) line(c, qx * w, qy * h, ragPts[e.j][0] * w, ragPts[e.j][1] * h)
  ragPts.forEach(([x, y], j) => {
    c.fillStyle = top.has(j) ? p.accent : alpha(p.ink, 0.35)
    dot(c, x * w, y * h, top.has(j) ? 2.6 : 1.6)
  })
  c.strokeStyle = p.accent
  c.lineWidth = 1.2
  c.beginPath()
  c.arc(qx * w, qy * h, Math.sqrt(d[k - 1].d) * Math.min(w, h) * 1.05 + 2, 0, TAU)
  c.setLineDash([3, 3])
  c.stroke()
  c.setLineDash([])
  c.fillStyle = p.ink
  dot(c, qx * w, qy * h, 3.4)
  // generation bar: retrieved context → tokens
  const g = (t * 0.35) % 1
  c.fillStyle = alpha(p.ink, 0.12)
  rr(c, w * 0.06, h * 0.9, w * 0.88, 3, 2)
  c.fill()
  c.fillStyle = p.accent
  rr(c, w * 0.06, h * 0.9, w * 0.88 * smooth(g), 3, 2)
  c.fill()
}

/* ───────────── KL divergence: P vs a drifting Q, the KL integrand shaded ───────────── */
const gauss = (x: number, m: number, s: number) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * 2.5066)
const kl: Draw = (c, t, w, h, p, i) => {
  const mq = i.hover ? (i.mx - 0.5) * 4 : Math.sin(t * 0.5) * 1.4, sq = 0.8 + 0.3 * Math.sin(t * 0.37)
  const X = (x: number) => ((x + 3) / 6) * w, Y = (v: number) => h * 0.88 - v * h * 1.6
  c.fillStyle = alpha(p.accent, 0.18)
  c.beginPath()
  c.moveTo(X(-3), Y(0))
  for (let x = -3; x <= 3; x += 0.05) {
    const P = gauss(x, 0, 0.9), Q = gauss(x, mq, sq)
    c.lineTo(X(x), Y(P * Math.log((P + 1e-4) / (Q + 1e-4)) > 0 ? P : 0))
  }
  c.lineTo(X(3), Y(0))
  c.fill()
  const curve = (m: number, s: number, col: string) => {
    c.strokeStyle = col
    c.lineWidth = 1.6
    c.beginPath()
    for (let x = -3; x <= 3; x += 0.05) c[x === -3 ? 'moveTo' : 'lineTo'](X(x), Y(gauss(x, m, s)))
    c.stroke()
  }
  curve(0, 0.9, p.ink)
  curve(mq, sq, p.accent)
  c.strokeStyle = alpha(p.ink, 0.3)
  c.lineWidth = 1
  line(c, 0, Y(0), w, Y(0))
  let D = 0
  for (let x = -3; x <= 3; x += 0.05) {
    const P = gauss(x, 0, 0.9), Q = gauss(x, mq, sq)
    D += P * Math.log((P + 1e-6) / (Q + 1e-6)) * 0.05
  }
  label(c, `D = ${D.toFixed(2)}`, w * 0.95, h * 0.1, Math.min(w, h) * 0.09, p.muted, 'right')
}

/* ───────────── Stellar mapping: a constellation is found in the starfield ───────────── */
const stars = (() => {
  const r = rng(3)
  return Array.from({ length: 90 }, () => ({ x: r(), y: r(), b: r(), ph: r() * TAU }))
})()
const dipper: [number, number][] = [[0.18, 0.62], [0.32, 0.56], [0.45, 0.6], [0.56, 0.52], [0.6, 0.34], [0.8, 0.3], [0.82, 0.5]]
const stellar: Draw = (c, t, w, h, p) => {
  for (const s of stars) {
    c.fillStyle = alpha(p.ink, 0.25 + 0.6 * s.b * (0.6 + 0.4 * Math.sin(t * 2 + s.ph)))
    dot(c, s.x * w, s.y * h, 0.5 + s.b * 1.2)
  }
  const cyc = (t * 0.25) % 1
  const n = Math.min(dipper.length - 1, Math.floor(cyc * 1.6 * (dipper.length - 1)))
  c.strokeStyle = p.accent
  c.lineWidth = 1.2
  c.beginPath()
  dipper.slice(0, n + 1).forEach(([x, y], j) => c[j ? 'lineTo' : 'moveTo'](x * w, y * h))
  c.stroke()
  c.fillStyle = p.accent
  dipper.forEach(([x, y], j) => j <= n && dot(c, x * w, y * h, 2.4))
  if (n >= dipper.length - 1) {
    const x0 = 0.12 * w, y0 = 0.24 * h, x1 = 0.88 * w, y1 = 0.7 * h, l = Math.min(w, h) * 0.08
    c.strokeStyle = alpha(p.accent, 0.9)
    c.beginPath()
    for (const [x, y, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) {
      c.moveTo(x, y + sy * l)
      c.lineTo(x, y)
      c.lineTo(x + sx * l, y)
    }
    c.stroke()
    label(c, 'URSA MAJOR 0.97', x0, y0 - 6, Math.min(w, h) * 0.075, p.accent)
  }
}

/* ───────────── Mamba: selective state space, hₜ = āhₜ₋₁ + b̄xₜ ───────────── */
const mamba: Draw = (c, t, w, h, p) => {
  const N = 18, cw = w / N, off = (t * 2.2) % 1
  const x = (k: number) => Math.sin(k * 1.7) * 0.6 + Math.sin(k * 0.43) * 0.4
  const gate = (k: number) => 0.5 + 0.5 * Math.sin(k * 0.9 + 1.3)
  const base = Math.floor(t * 2.2)
  let hs = 0
  const hv: number[] = []
  for (let j = -30; j < N + 1; j++) {
    const k = base + j, g = gate(k)
    hs = (1 - g) * hs + g * x(k) // selective: the gate decides how much xₜ overwrites the state
    if (j >= 0) hv.push(hs)
  }
  for (let j = 0; j < N + 1; j++) {
    const k = base + j, g = gate(k), xx = (j - off) * cw
    c.fillStyle = alpha(g > 0.55 ? p.accent : p.ink, 0.15 + 0.6 * g)
    rr(c, xx + 1, h * 0.12, cw - 2, h * 0.16, 2)
    c.fill()
  }
  label(c, 'xₜ', 4, h * 0.06, Math.min(w, h) * 0.08, p.muted)
  c.strokeStyle = p.accent
  c.lineWidth = 1.6
  c.beginPath()
  hv.forEach((v, j) => c[j ? 'lineTo' : 'moveTo']((j - off) * cw + cw / 2, h * 0.66 - v * h * 0.22))
  c.stroke()
  label(c, 'hₜ', 4, h * 0.46, Math.min(w, h) * 0.08, p.muted)
  c.strokeStyle = alpha(p.ink, 0.35)
  c.setLineDash([2, 3])
  line(c, w * 0.72, h * 0.08, w * 0.72, h * 0.94)
  c.setLineDash([])
}

/* ───────────── Goodreads: a review streams in, T5 writes the rating ───────────── */
const goodreads: Draw = (c, t, w, h, p) => {
  const cyc = (t * 0.22) % 1, r = rng(11)
  const lines = 4, words = 6
  let shown = Math.floor(clamp01(cyc / 0.55) * lines * words)
  for (let l = 0; l < lines; l++) {
    let x = w * 0.06
    for (let k = 0; k < words; k++) {
      const ww = (0.04 + r() * 0.06) * w
      if (shown-- > 0) {
        c.fillStyle = alpha(p.ink, 0.55)
        rr(c, x, h * (0.14 + l * 0.11), ww, h * 0.05, 2)
        c.fill()
      }
      x += ww + w * 0.015
    }
  }
  const dist = [0.05, 0.08, 0.17, 0.42, 0.28]
  const grow = smooth(clamp01((cyc - 0.5) / 0.25))
  const bw = w * 0.1, x0 = w * 0.2
  dist.forEach((v, k) => {
    const bh = v * h * 0.9 * grow
    c.fillStyle = k === 3 ? p.accent : alpha(p.ink, 0.35)
    rr(c, x0 + k * (bw + w * 0.04), h * 0.9 - bh, bw, bh, 2)
    c.fill()
    label(c, `${k + 1}`, x0 + k * (bw + w * 0.04) + bw / 2, h * 0.95, Math.min(w, h) * 0.07, p.muted, 'center')
  })
  if (cyc > 0.78) label(c, '★★★★☆', w * 0.94, h * 0.62, Math.min(w, h) * 0.11, p.accent, 'right')
}

/* ───────────── PaliGemma: OCR boxes on an invoice become JSON ───────────── */
const fieldsInv = [
  { k: 'vendor', x: 0.08, y: 0.12, w: 0.3 },
  { k: 'date', x: 0.08, y: 0.24, w: 0.18 },
  { k: 'items', x: 0.08, y: 0.42, w: 0.36 },
  { k: 'total', x: 0.24, y: 0.78, w: 0.2 },
]
const paligemma: Draw = (c, t, w, h, p) => {
  c.fillStyle = alpha(p.ink, 0.08)
  rr(c, w * 0.04, h * 0.06, w * 0.46, h * 0.88, 4)
  c.fill()
  c.fillStyle = alpha(p.ink, 0.3)
  for (let l = 0; l < 6; l++) {
    rr(c, w * 0.08, h * (0.5 + l * 0.045), w * (0.22 + ((l * 37) % 13) / 100), h * 0.018, 1)
    c.fill()
  }
  const cyc = (t * 0.25) % 1, active = Math.floor(cyc * 5)
  fieldsInv.forEach((f, k) => {
    c.fillStyle = alpha(p.ink, 0.5)
    rr(c, f.x * w + 2, f.y * h + 2, f.w * w - 4, h * 0.05, 1)
    c.fill()
    if (k <= active) {
      c.strokeStyle = k === active ? p.accent : alpha(p.accent, 0.5)
      c.lineWidth = 1.2
      c.strokeRect(f.x * w, f.y * h - 1, f.w * w, h * 0.07)
    }
  })
  const fs = Math.min(w, h) * 0.075
  label(c, '{', w * 0.56, h * 0.12, fs, p.muted)
  fieldsInv.forEach((f, k) => k <= active && label(c, `  "${f.k}": ✓`, w * 0.56, h * (0.26 + k * 0.14), fs, k === active ? p.accent : p.muted))
  label(c, '}', w * 0.56, h * 0.88, fs, p.muted)
}

/* ───────────── RLHF / DPO: chosen vs rejected, the margin climbs a sigmoid ───────────── */
const rlhf: Draw = (c, t, w, h, p) => {
  const cyc = (t * 0.18) % 1, s = smooth(cyc)
  const yw = 0.35 + 0.45 * s, yl = 0.35 - 0.25 * s
  const fs = Math.min(w, h) * 0.075
  const bar = (y: number, v: number, col: string, tag: string) => {
    c.fillStyle = alpha(p.ink, 0.1)
    rr(c, w * 0.16, y, w * 0.32, h * 0.08, 3)
    c.fill()
    c.fillStyle = col
    rr(c, w * 0.16, y, w * 0.32 * v, h * 0.08, 3)
    c.fill()
    label(c, tag, w * 0.06, y + h * 0.04, fs, col)
  }
  bar(h * 0.22, yw, p.accent, '✓')
  bar(h * 0.42, yl, alpha(p.ink, 0.6), '✗')
  label(c, 'π(y_w)  π(y_l)', w * 0.16, h * 0.1, fs, p.muted)
  // σ(β·margin)
  const X = (m: number) => w * 0.56 + ((m + 4) / 8) * w * 0.38, Y = (v: number) => h * 0.86 - v * h * 0.6
  c.strokeStyle = alpha(p.ink, 0.5)
  c.lineWidth = 1.2
  c.beginPath()
  for (let m = -4; m <= 4; m += 0.1) c[m === -4 ? 'moveTo' : 'lineTo'](X(m), Y(1 / (1 + Math.exp(-m * 1.4))))
  c.stroke()
  const m = -2.5 + 6 * s
  c.fillStyle = p.accent
  dot(c, X(m), Y(1 / (1 + Math.exp(-m * 1.4))), 3.4)
  label(c, 'σ(β·Δ)', w * 0.94, h * 0.18, fs, p.muted, 'right')
}

/* ───────────── RoBERTa: attention over tokens, toxic ones get flagged ───────────── */
const toks = ['this', 'is', 'so', 'dumb', 'you', 'clown']
const toxic = new Set([3, 5])
const roberta: Draw = (c, t, w, h, p) => {
  const n = toks.length, gap = w / (n + 0.5), y = h * 0.7, fs = Math.min(Math.min(w, h) * 0.08, gap * 0.28)
  const focus = Math.floor(t * 0.8) % n
  for (let j = 0; j < n; j++) {
    if (j === focus) continue
    const a = 0.15 + 0.85 * Math.exp(-Math.abs(j - focus) * 0.7) * (toxic.has(j) ? 1.6 : 1)
    c.strokeStyle = alpha(toxic.has(j) ? p.accent : p.ink, Math.min(0.9, a * 0.6))
    c.lineWidth = 0.6 + a * 1.4
    const x1 = gap * (focus + 0.75), x2 = gap * (j + 0.75)
    c.beginPath()
    c.moveTo(x1, y - h * 0.06)
    c.quadraticCurveTo((x1 + x2) / 2, y - h * 0.06 - Math.abs(x2 - x1) * 0.45, x2, y - h * 0.06)
    c.stroke()
  }
  toks.forEach((s, j) => {
    const flare = toxic.has(j) ? 0.5 + 0.5 * Math.sin(t * 3 + j) : 0
    c.fillStyle = toxic.has(j) ? alpha(p.accent, 0.25 + 0.35 * flare) : alpha(p.ink, j === focus ? 0.25 : 0.1)
    rr(c, gap * (j + 0.75) - gap * 0.45, y - h * 0.05, gap * 0.9, h * 0.13, 3)
    c.fill()
    label(c, s, gap * (j + 0.75), y + h * 0.015, fs, toxic.has(j) ? p.accent : p.ink, 'center')
  })
  label(c, `toxic ${(0.86 + 0.05 * Math.sin(t)).toFixed(2)}`, w * 0.94, h * 0.12, fs, p.accent, 'right')
}

/* ───────────── Resume parser: a scan line, entities get tagged ───────────── */
const resumeLines = [
  { w: 0.42, tag: 'NAME', span: [0, 0.42] },
  { w: 0.7 },
  { w: 0.55, tag: 'ORG', span: [0.0, 0.22] },
  { w: 0.65, tag: 'DATE', span: [0.42, 0.65] },
  { w: 0.6 },
  { w: 0.5, tag: 'SKILL', span: [0.1, 0.3] },
  { w: 0.68, tag: 'DATE', span: [0.48, 0.68] },
]
const resume: Draw = (c, t, w, h, p) => {
  c.fillStyle = alpha(p.ink, 0.07)
  rr(c, w * 0.1, h * 0.05, w * 0.8, h * 0.9, 4)
  c.fill()
  const scan = ((t * 0.22) % 1) * h * 0.9 + h * 0.05
  const fs = Math.min(w, h) * 0.065
  resumeLines.forEach((l, k) => {
    const y = h * (0.14 + k * 0.11), x0 = w * 0.16
    c.fillStyle = alpha(p.ink, k === 0 ? 0.6 : 0.3)
    rr(c, x0, y, w * 0.68 * l.w, h * (k === 0 ? 0.05 : 0.03), 1)
    c.fill()
    if (l.tag && scan > y) {
      const [a, b] = l.span!
      c.strokeStyle = l.tag === 'DATE' ? p.ink : p.accent
      c.lineWidth = 1.1
      c.strokeRect(x0 + w * 0.68 * a - 2, y - 3, w * 0.68 * (b - a) + 4, h * (k === 0 ? 0.05 : 0.03) + 6)
      label(c, l.tag, x0 + w * 0.68 * b + 6, y + h * 0.015, fs, l.tag === 'DATE' ? p.muted : p.accent)
    }
  })
  c.strokeStyle = alpha(p.accent, 0.8)
  c.lineWidth = 1.2
  line(c, w * 0.1, scan, w * 0.9, scan)
}

/* ───────────── Multimodal: four modalities converge to one embedding ───────────── */
const multimodal: Draw = (c, t, w, h, p) => {
  const cx = w / 2, cy = h / 2, s = Math.min(w, h)
  c.strokeStyle = alpha(p.ink, 0.6)
  c.lineWidth = 1.2
  c.beginPath() // audio waveform, top-left
  for (let x = 0; x <= s * 0.28; x += 2) c[x ? 'lineTo' : 'moveTo'](w * 0.06 + x, h * 0.18 + Math.sin(x * 0.35 + t * 5) * s * 0.05 * Math.sin(x * 0.05))
  c.stroke()
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) { // image patches, top-right
    c.fillStyle = alpha(p.ink, 0.15 + 0.5 * (((a * 7 + b * 3 + Math.floor(t * 2)) % 5) / 5))
    c.fillRect(w * 0.76 + a * s * 0.05, h * 0.08 + b * s * 0.05, s * 0.045, s * 0.045)
  }
  c.fillStyle = alpha(p.ink, 0.45) // text lines, bottom-left
  for (let l = 0; l < 3; l++) c.fillRect(w * 0.06, h * (0.74 + l * 0.07), s * (0.22 - l * 0.04), s * 0.025)
  for (let f = 0; f < 3; f++) { // video frames, bottom-right
    c.strokeStyle = alpha(p.ink, 0.5)
    c.strokeRect(w * 0.7 + f * s * 0.09, h * 0.76, s * 0.08, s * 0.1)
  }
  const sources = [[w * 0.18, h * 0.18], [w * 0.84, h * 0.16], [w * 0.14, h * 0.8], [w * 0.8, h * 0.82]]
  sources.forEach(([sx, sy], k) => {
    for (let j = 0; j < 4; j++) {
      const u = (t * 0.5 + j / 4 + k * 0.13) % 1
      c.fillStyle = alpha(p.accent, 1 - u * 0.6)
      dot(c, sx + (cx - sx) * u, sy + (cy - sy) * u, 1.8)
    }
  })
  const pulse = 1 + 0.15 * Math.sin(t * 4)
  c.fillStyle = alpha(p.accent, 0.2)
  dot(c, cx, cy, s * 0.09 * pulse)
  c.fillStyle = p.accent
  dot(c, cx, cy, s * 0.035)
}

/* ───────────── Edge AIoT: chips on a conveyor under a camera ───────────── */
const edge: Draw = (c, t, w, h, p) => {
  const belt = h * 0.72, speed = w * 0.18, spacing = w * 0.28, s = Math.min(w, h)
  c.strokeStyle = alpha(p.ink, 0.35)
  c.lineWidth = 1
  line(c, 0, belt + s * 0.1, w, belt + s * 0.1)
  c.setLineDash([4, 6])
  c.lineDashOffset = -t * speed
  line(c, 0, belt + s * 0.14, w, belt + s * 0.14)
  c.setLineDash([])
  // camera + scan cone
  const camX = w * 0.5
  c.fillStyle = alpha(p.ink, 0.7)
  rr(c, camX - s * 0.06, h * 0.06, s * 0.12, s * 0.08, 2)
  c.fill()
  c.fillStyle = alpha(p.accent, 0.08)
  c.beginPath()
  c.moveTo(camX - s * 0.03, h * 0.14)
  c.lineTo(camX - s * 0.16, belt)
  c.lineTo(camX + s * 0.16, belt)
  c.lineTo(camX + s * 0.03, h * 0.14)
  c.fill()
  for (let k = -1; k < 5; k++) {
    const id = Math.floor(t * speed / spacing) - k
    const x = ((t * speed) % spacing) + k * spacing - spacing * 0.5
    const bad = id % 4 === 0
    const passed = x > camX
    const drop = bad && passed ? Math.min(1, (x - camX) / (w * 0.25)) : 0
    const cs = s * 0.13, y = belt - cs + drop * h * 0.3
    c.fillStyle = bad && passed ? alpha(p.accent, 0.85) : alpha(p.ink, 0.55)
    rr(c, x - cs / 2, y, cs, cs, 2)
    c.fill()
    c.fillStyle = alpha(p.ink, 0.4)
    for (let q = 0; q < 3; q++) c.fillRect(x - cs / 2 + (q + 0.5) * (cs / 3) - 1, y + cs, 2, s * 0.025)
    if (Math.abs(x - camX) < s * 0.12) {
      c.strokeStyle = bad ? p.accent : p.ink
      c.lineWidth = 1.2
      c.strokeRect(x - cs / 2 - 3, y - 3, cs + 6, cs + 6)
      label(c, bad ? 'DEFECT' : 'OK', x, y - s * 0.06, s * 0.07, bad ? p.accent : p.muted, 'center')
    }
  }
}

/* ───────────── AGV: lane following + YOLO boxes on the road ───────────── */
const agv: Draw = (c, t, w, h, p) => {
  const vx = w * 0.5 + Math.sin(t * 0.5) * w * 0.05, vy = h * 0.28, s = Math.min(w, h)
  c.strokeStyle = alpha(p.ink, 0.6)
  c.lineWidth = 1.4
  line(c, vx - w * 0.02, vy, w * 0.08, h)
  line(c, vx + w * 0.02, vy, w * 0.92, h)
  c.strokeStyle = alpha(p.ink, 0.5)
  for (let k = 0; k < 6; k++) { // centre dashes rushing toward the viewer
    const u = ((k / 6 + t * 0.35) % 1) ** 2
    const y = vy + (h - vy) * u, len = (h - vy) * 0.06 * (0.2 + u)
    line(c, vx + (w * 0.5 - vx) * u, y, vx + (w * 0.5 - vx) * (u + 0.03), y + len)
  }
  // obstacles approaching, with detection boxes
  for (const [lane, ph, name] of [[-0.6, 0, 'car'], [0.55, 0.5, 'person']] as const) {
    const u = ((t * 0.18 + ph) % 1) ** 1.6
    const x = vx + lane * w * 0.4 * u, y = vy + (h * 0.8 - vy) * u, bs = s * (0.05 + 0.22 * u)
    c.fillStyle = alpha(p.ink, 0.35)
    rr(c, x - bs / 2, y - bs, bs, bs, 2)
    c.fill()
    c.strokeStyle = p.accent
    c.lineWidth = 1.2
    c.strokeRect(x - bs / 2 - 3, y - bs - 3, bs + 6, bs + 6)
    label(c, `${name} ${(0.82 + 0.1 * u).toFixed(2)}`, x - bs / 2 - 3, y - bs - 9, s * 0.06, p.accent)
  }
  // our vehicle, holding the lane
  const sway = Math.sin(t * 1.3) * w * 0.02
  c.fillStyle = p.accent
  c.beginPath()
  c.moveTo(w * 0.5 + sway, h * 0.8)
  c.lineTo(w * 0.5 + sway - s * 0.07, h * 0.96)
  c.lineTo(w * 0.5 + sway + s * 0.07, h * 0.96)
  c.fill()
}

/* ───────────── Agentic platform: an orchestrator routes to agents, agents call tools ───────────── */
const platform: Draw = (c, t, w, h, p) => {
  const s = Math.min(w, h), fs = s * 0.065
  const O = [w * 0.5, h * 0.16], A = [w * 0.26, h * 0.5], S = [w * 0.74, h * 0.5]
  const tools = [[w * 0.12, h * 0.84, 'SQL'], [w * 0.4, h * 0.84, 'DOCS'], [w * 0.62, h * 0.84, 'JIRA'], [w * 0.88, h * 0.84, 'IMG']] as const
  c.strokeStyle = alpha(p.ink, 0.3)
  c.lineWidth = 1
  for (const n of [A, S]) line(c, O[0], O[1], n[0], n[1])
  tools.forEach(([x, y], k) => line(c, (k < 1 ? A : S)[0], (k < 1 ? A : S)[1], x, y))
  const node = (x: number, y: number, r: number, col: string, txt: string) => {
    c.fillStyle = col
    dot(c, x, y, r)
    label(c, txt, x, y + r + fs, fs, p.muted, 'center')
  }
  // a request arrives, is routed (alternating), the agent calls a tool, the answer returns
  const cyc = (t * 0.4) % 2, toS = Math.floor(t * 0.2) % 2 === 0
  const tgt = toS ? S : A
  const tool = toS ? tools[1 + (Math.floor(t * 0.4) % 3)] : tools[0]
  const seg = (a: number[], b: number[], u: number) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]
  const T = [tool[0], tool[1]]
  const pos = cyc < 0.5 ? seg([w * 0.5, 0], O, cyc / 0.5) : cyc < 1 ? seg(O, tgt, (cyc - 0.5) / 0.5) : cyc < 1.5 ? seg(tgt, T, (cyc - 1) / 0.5) : seg(T, tgt, (cyc - 1.5) / 0.5)
  node(O[0], O[1], s * 0.06, p.accent, 'orchestrator')
  node(A[0], A[1], s * 0.045, toS ? alpha(p.ink, 0.5) : p.accent, 'analyst')
  node(S[0], S[1], s * 0.045, toS ? p.accent : alpha(p.ink, 0.5), 'service')
  tools.forEach(([x, y, n]) => {
    c.fillStyle = tool[2] === n && cyc > 1 ? p.accent : alpha(p.ink, 0.35)
    rr(c, x - s * 0.06, y - s * 0.03, s * 0.12, s * 0.06, 2)
    c.fill()
    label(c, n, x, y, fs * 0.85, p.bg, 'center')
  })
  c.fillStyle = p.ink
  dot(c, pos[0], pos[1], 3)
}

/* ───────────── Ray: a scheduler fans documents out to parallel workers ───────────── */
const ray: Draw = (c, t, w, h, p) => {
  const lanes = 6, s = Math.min(w, h), fs = s * 0.065
  const sx = w * 0.1, ex = w * 0.86
  c.fillStyle = alpha(p.accent, 0.85)
  rr(c, sx - s * 0.05, h * 0.2, s * 0.1, h * 0.62, 3)
  c.fill()
  for (let l = 0; l < lanes; l++) {
    const y = h * (0.24 + l * 0.11)
    c.strokeStyle = alpha(p.ink, 0.18)
    c.lineWidth = 1
    line(c, sx + s * 0.05, y, ex, y)
    const speed = 0.35 + ((l * 37) % 7) / 14
    for (let k = 0; k < 3; k++) {
      const u = (t * speed * 0.4 + k / 3 + l * 0.11) % 1
      const x = sx + s * 0.05 + (ex - sx - s * 0.05) * u
      c.fillStyle = u > 0.6 && u < 0.8 ? p.accent : alpha(p.ink, 0.55)
      rr(c, x - s * 0.025, y - s * 0.022, s * 0.05, s * 0.044, 1.5)
      c.fill()
    }
  }
  c.fillStyle = alpha(p.ink, 0.5)
  for (let k = 0; k < 8; k++) c.fillRect(ex + s * 0.03, h * (0.82 - k * 0.07), s * 0.06, h * 0.05)
  label(c, `${(1000 + Math.floor(t * 41) % 4000).toLocaleString()} docs`, w * 0.96, h * 0.1, fs, p.muted, 'right')
}

/* ───────────── UI snapshot harness: 7 languages × N screens fill in ───────────── */
const langs = ['EN', 'JA', 'DE', 'FR', 'ES', 'ZH', 'KO']
const harness: Draw = (c, t, w, h, p) => {
  const cols = 7, rows = 5, s = Math.min(w, h)
  const gx = w * 0.05, gy = h * 0.2, cw = (w * 0.9) / cols, ch = (h * 0.66) / rows
  const total = cols * rows, cyc = (t * 0.12) % 1.15, filled = Math.floor(Math.min(1, cyc) * total)
  langs.forEach((l, k) => label(c, l, gx + k * cw + cw / 2, h * 0.11, s * 0.065, k * rows <= filled ? p.accent : p.muted, 'center'))
  for (let k = 0; k < total; k++) {
    const col = Math.floor(k / rows), row = k % rows
    const x = gx + col * cw + 2, y = gy + row * ch + 2, cw2 = cw - 4, ch2 = ch - 4
    c.strokeStyle = alpha(p.ink, 0.15)
    c.lineWidth = 1
    c.strokeRect(x, y, cw2, ch2)
    if (k < filled) {
      c.fillStyle = alpha(p.ink, 0.12)
      c.fillRect(x, y, cw2, ch2)
      c.fillStyle = alpha(p.ink, 0.45)
      c.fillRect(x + 2, y + 2, cw2 - 4, Math.max(1, ch2 * 0.15))
      c.fillStyle = alpha(p.accent, 0.6)
      c.fillRect(x + 2, y + ch2 * 0.55, (cw2 - 4) * 0.5, Math.max(1, ch2 * 0.12))
    }
    if (k === filled && cyc < 1) {
      c.strokeStyle = p.accent
      c.lineWidth = 1.4
      c.strokeRect(x - 1, y - 1, cw2 + 2, ch2 + 2)
    }
  }
  label(c, `${Math.round((Math.min(1, cyc) * 910))} / 910`, w * 0.95, h * 0.94, s * 0.065, p.muted, 'right')
}

export const anims: Record<string, Draw> = {
  'rag-architecture': rag,
  'kl-divergence': kl,
  'stellar-mapping': stellar,
  'mamba-transformer': mamba,
  'goodreads-t5': goodreads,
  'paligemma-invoice': paligemma,
  'rlhf-dpo': rlhf,
  'roberta-toxicity': roberta,
  'resume-parser': resume,
  'multimodal-system': multimodal,
  'edge-aiot': edge,
  'autonomous-vehicle': agv,
  'agentic-service-platform': platform,
  'ray-document-pipeline': ray,
  'ui-snapshot-harness': harness,
}

/* ───────────── shared ticker ───────────── */
type Item = { canvas: HTMLCanvasElement; draw: Draw; input: () => Input; visible: boolean; t0: number }
const items = new Set<Item>()
let raf = 0
let palette: Palette | null = null
const readPalette = (): Palette => {
  const cs = getComputedStyle(document.documentElement)
  return { ink: cs.getPropertyValue('--fg').trim(), muted: cs.getPropertyValue('--muted').trim(), accent: cs.getPropertyValue('--accent').trim(), bg: cs.getPropertyValue('--bg').trim() }
}
new MutationObserver(() => (palette = null)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

function frame(now: number) {
  raf = requestAnimationFrame(frame)
  palette ??= readPalette()
  for (const it of items) {
    if (!it.visible) continue
    const cv = it.canvas, dpr = Math.min(devicePixelRatio, 2)
    const W = cv.clientWidth, H = cv.clientHeight
    if (!W || !H) continue
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
    }
    const c = cv.getContext('2d')!
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, W, H)
    it.draw(c, (now - it.t0) / 1000, W, H, palette, it.input())
  }
}

/** Register a canvas; returns an unregister function. */
export function mountAnim(canvas: HTMLCanvasElement, slug: string, input: () => Input, reduced: boolean) {
  const draw = anims[slug]
  if (!draw) return () => {}
  const it: Item = { canvas, draw, input, visible: false, t0: performance.now() - Math.random() * 4000 }
  if (reduced) {
    // one static frame, a few seconds in, so the picture is meaningful
    requestAnimationFrame(() => {
      const dpr = Math.min(devicePixelRatio, 2), W = canvas.clientWidth, H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      const c = canvas.getContext('2d')!
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(c, 3.2, W, H, readPalette(), { hover: 0, mx: 0.5, my: 0.5 })
    })
    return () => {}
  }
  const io = new IntersectionObserver(([e]) => (it.visible = e.isIntersecting), { rootMargin: '100px' })
  io.observe(canvas)
  items.add(it)
  if (!raf) raf = requestAnimationFrame(frame)
  return () => {
    io.disconnect()
    items.delete(it)
    if (!items.size) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
}
