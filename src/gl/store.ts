import { useSyncExternalStore } from 'react'

/** Tiny shared state between DOM sections and the lazily-loaded GL chunk. */
type State = { glReady: boolean }
const state: State = { glReady: false }
const subs = new Set<() => void>()

export const glStore = {
  get: () => state,
  set(patch: Partial<State>) {
    Object.assign(state, patch)
    subs.forEach((s) => s())
  },
}
export const useGLReady = () =>
  useSyncExternalStore(
    (cb) => (subs.add(cb), () => subs.delete(cb)),
    () => state.glReady,
    () => false,
  )

/** DOM handles the hero scene needs (h1 for glyph sampling). */
export const heroRefs: { title: HTMLElement | null } = { title: null }
/** Hero live readout values written by the GL scene, read by the DOM readout. */
export const heroTelemetry = { epoch: 0, loss: 2.31, progress: 0, formed: false, listeners: new Set<() => void>() }
export const heroControl = { retrain: () => {} }

/** Target Bloch-sphere state, set by the Experience section as roles scroll past. */
export const blochTarget = { theta: Math.PI / 3, phi: Math.PI / 4 }
