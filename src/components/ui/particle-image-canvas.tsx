import { Canvas } from '@react-three/fiber'
import type { CSSProperties } from 'react'

import { ParticleImage, type ParticleImageProps } from './particle-image'

interface ParticleImageCanvasProps extends ParticleImageProps {
  /** Applied to the canvas wrapper, so size and position it however you like */
  className?: string
  style?: CSSProperties
}

export function ParticleImageCanvas({
  className,
  style,
  ...particleProps
}: ParticleImageCanvasProps) {
  return (
    <Canvas
      className={className}
      // Clear R3F's inline defaults so your classes take effect
      style={{
        width: undefined,
        height: undefined,
        position: undefined,
        ...style,
      }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: false }}
    >
      <ParticleImage {...particleProps} />
    </Canvas>
  )
}
