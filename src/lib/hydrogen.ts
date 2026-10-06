/**
 * Hydrogen-atom orbitals (atomic units, a₀ = 1), sampled as point clouds from |ψₙₗₘ|².
 * Real orbitals so lobes have a definite sign (phase), which we keep for colouring.
 *
 *   ψ₃₂₀ ∝ r² e^(−r/3) · (3cos²θ − 1)              — the 3d_z² orbital (ring + two lobes)
 *   ψ₂₁₀ ∝ r  e^(−r/2) · cosθ                       — the 2p_z dumbbell
 *   ψ₃₁₁ ∝ r(1 − r/6) e^(−r/3) · sinθ cosφ          — 3p_x, with a radial node at r = 6
 *
 * Sampling is rejection sampling inside a ball of radius rMax with a uniform-volume proposal,
 * so the accepted points are distributed exactly as |ψ|² (no Jacobian bookkeeping needed).
 */
export type Orbital = { n: number; l: number; m: number; label: string; rMax: number; psi: (r: number, ct: number, st: number, cp: number) => number }

export const orbitals: Orbital[] = [
  { n: 3, l: 2, m: 0, label: '3d_{z^2}', rMax: 26, psi: (r, ct) => r * r * Math.exp(-r / 3) * (3 * ct * ct - 1) },
  { n: 2, l: 1, m: 0, label: '2p_z', rMax: 16, psi: (r, ct) => r * Math.exp(-r / 2) * ct },
  { n: 3, l: 1, m: 1, label: '3p_x', rMax: 30, psi: (r, _ct, st, cp) => r * (1 - r / 6) * Math.exp(-r / 3) * st * cp },
]

/** ⟨r⟩ = ½[3n² − l(l+1)] a₀ */
export const meanRadius = (o: Orbital) => 0.5 * (3 * o.n * o.n - o.l * (o.l + 1))

/** Returns xyz (normalised so the cloud spans roughly ±1) and the sign of ψ per point. */
export function sampleOrbital(o: Orbital, count: number, seed = 1) {
  let s = seed >>> 0
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
  const point = () => {
    // Uniform in the ball: r = R·u^(1/3), direction uniform on S².
    const r = o.rMax * Math.cbrt(rand())
    const ct = 2 * rand() - 1
    const st = Math.sqrt(1 - ct * ct)
    const ph = 2 * Math.PI * rand()
    return { r, ct, st, ph, v: o.psi(r, ct, st, Math.cos(ph)) }
  }
  // Estimate max |ψ|² for the acceptance ratio.
  let max = 0
  for (let i = 0; i < 40000; i++) max = Math.max(max, point().v ** 2)
  max *= 1.05

  const xyz = new Float32Array(count * 3)
  const sign = new Float32Array(count)
  for (let i = 0; i < count; ) {
    const p = point()
    if (rand() * max > p.v * p.v) continue
    const k = 1 / o.rMax
    // z is "up" in physics; map it to +y on screen.
    xyz[i * 3] = p.r * p.st * Math.cos(p.ph) * k
    xyz[i * 3 + 1] = p.r * p.ct * k
    xyz[i * 3 + 2] = p.r * p.st * Math.sin(p.ph) * k
    sign[i] = p.v >= 0 ? 1 : -1
    i++
  }
  return { xyz, sign }
}
