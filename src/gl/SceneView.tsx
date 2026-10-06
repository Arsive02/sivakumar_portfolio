import { View } from '@react-three/drei'
import { Suspense, type CSSProperties } from 'react'
import { scenes, type SceneName } from './scenes'

export default function SceneView({ scene, className, style, props }: { scene: SceneName; className?: string; style?: CSSProperties; props?: Record<string, unknown> }) {
  const Scene = scenes[scene] as React.ComponentType<Record<string, unknown>>
  return (
    <View className={className} style={style}>
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </View>
  )
}
