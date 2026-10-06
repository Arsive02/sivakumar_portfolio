export type Complex = { re: number; im: number }
export type Term = { k: number; amp: number; phase: number }

/**
 * Trace the outer contour of a glyph and return it as an ordered, arc-length-resampled
 * closed curve centred on the origin (unit-ish scale).
 */
export async function glyphContour(char: string, font: string, samples = 512): Promise<Complex[]> {
  await document.fonts.load(font, char)
  const S = 360
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const ctx = cv.getContext('2d', { willReadFrequently: true })!
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#000'
  ctx.fillText(char, S / 2, S / 2 + S * 0.05)
  const { data } = ctx.getImageData(0, 0, S, S)
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < S && y < S && data[(y * S + x) * 4 + 3] > 127

  // Moore-neighbour boundary tracing from the first filled pixel in raster order.
  let start = -1
  for (let i = 0; i < S * S && start < 0; i++) if (data[i * 4 + 3] > 127) start = i
  if (start < 0) return []
  const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
  const sx = start % S, sy = Math.floor(start / S)
  const pts: [number, number][] = [[sx, sy]]
  let x = sx, y = sy, d = 7 // as if we arrived moving NE, so the first search starts at W
  for (let guard = 0; guard < S * S; guard++) {
    let found = false
    for (let k = 0; k < 8; k++) {
      const nd = (d + 5 + k) % 8 // clockwise, starting just past the backtrack pixel
      const nx = x + dirs[nd][0], ny = y + dirs[nd][1]
      if (on(nx, ny)) {
        x = nx
        y = ny
        d = nd
        found = true
        break
      }
    }
    if (!found || (x === sx && y === sy)) break
    pts.push([x, y])
  }

  // Arc-length resample so the DFT sees uniform time steps.
  const seg: number[] = [0]
  for (let i = 1; i <= pts.length; i++) {
    const a = pts[i - 1], b = pts[i % pts.length]
    seg.push(seg[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]))
  }
  const total = seg[seg.length - 1]
  const out: Complex[] = []
  let j = 0
  for (let i = 0; i < samples; i++) {
    const s = (i / samples) * total
    while (seg[j + 1] < s) j++
    const a = pts[j], b = pts[(j + 1) % pts.length]
    const t = (s - seg[j]) / (seg[j + 1] - seg[j] || 1)
    out.push({ re: (a[0] + (b[0] - a[0]) * t - S / 2) / (S / 2), im: (a[1] + (b[1] - a[1]) * t - S / 2) / (S / 2) })
  }
  return out
}

/** c_k = (1/N) Σ z_n e^{-2πikn/N}, sorted by amplitude (largest circles first). */
export function dft(z: Complex[], maxK: number): Term[] {
  const N = z.length
  const terms: Term[] = []
  for (let k = -maxK; k <= maxK; k++) {
    let re = 0, im = 0
    for (let n = 0; n < N; n++) {
      const a = (-2 * Math.PI * k * n) / N
      re += z[n].re * Math.cos(a) - z[n].im * Math.sin(a)
      im += z[n].re * Math.sin(a) + z[n].im * Math.cos(a)
    }
    re /= N
    im /= N
    terms.push({ k, amp: Math.hypot(re, im), phase: Math.atan2(im, re) })
  }
  return terms.sort((a, b) => b.amp - a.amp)
}

/** Partial sum of the first `n` terms at time t ∈ [0, 1). */
export function evaluate(terms: Term[], n: number, t: number) {
  let re = 0, im = 0
  for (let i = 0; i < n; i++) {
    const { k, amp, phase } = terms[i]
    const a = 2 * Math.PI * k * t + phase
    re += amp * Math.cos(a)
    im += amp * Math.sin(a)
  }
  return { re, im }
}
