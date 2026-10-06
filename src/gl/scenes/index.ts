import { lazyWithRetry as lazy } from '@/lib/lazyWithRetry'

export const scenes = {
  hero: lazy(() => import('./HeroTraining')),
  bloch: lazy(() => import('./BlochSphere')),
  mobius: lazy(() => import('./Mobius')),
  model: lazy(() => import('./ModelStage')),
  orbital: lazy(() => import('./Orbital')),
}
export type SceneName = keyof typeof scenes
