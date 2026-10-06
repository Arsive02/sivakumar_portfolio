import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor, View } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { glStore } from './store'

/**
 * The one WebGL context for the whole site. Fixed behind the page; each <GLSlot>
 * is a scissored viewport into it, so offscreen scenes cost nothing.
 */
export default function GLStage() {
  const [dpr, setDpr] = useState(Math.min(devicePixelRatio, 1.75))
  useEffect(() => {
    glStore.set({ glReady: true })
    return () => glStore.set({ glReady: false })
  }, [])

  return (
    <Canvas
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.25))} onIncline={() => setDpr((d) => Math.min(devicePixelRatio, 1.75, d + 0.25))} />
      <View.Port />
    </Canvas>
  )
}
