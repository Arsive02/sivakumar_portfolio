/**
 * Displacement map for a capsule-shaped piece of "liquid glass".
 *
 * For each pixel we take the signed distance to the capsule's edge (a rounded rect whose
 * corner radius is half its height) and the outward normal there. Displacement is strongest at
 * the rim and falls to zero `band` px inside, so the backdrop bends only near the edges, like a
 * thick lens, while the middle stays clear. R/G store the normal × falloff around 128 (neutral).
 * Returned as a data URL for an SVG <feImage>, consumed by <feDisplacementMap>.
 */
export function capsuleDisplacementMap(width: number, height: number, band = 14, scale = 0.5): string {
  const W = Math.max(2, Math.round(width * scale)), H = Math.max(2, Math.round(height * scale))
  const r = H / 2, b = band * scale
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const ctx = cv.getContext('2d')!
  const img = ctx.createImageData(W, H)
  const ax = r, bx = W - r // the capsule's core segment, at y = r
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const px = x + 0.5, py = y + 0.5
      const qx = Math.max(ax, Math.min(bx, px)) // nearest point on the core segment
      const vx = px - qx, vy = py - r
      const len = Math.hypot(vx, vy) || 1e-6
      const inside = r - len // distance to the rim (positive inside)
      const nx = vx / len, ny = vy / len // outward normal
      // smooth falloff: 1 at the rim, 0 at `band` inside (a little curvature, like a bevel)
      const t = Math.max(0, Math.min(1, inside / b))
      const m = inside < 0 ? 0 : (1 - t) * (1 - t)
      const i = (y * W + x) * 4
      img.data[i] = 128 + nx * m * 127
      img.data[i + 1] = 128 + ny * m * 127
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  ctx.putImageData(img, 0, 0)
  return cv.toDataURL()
}
