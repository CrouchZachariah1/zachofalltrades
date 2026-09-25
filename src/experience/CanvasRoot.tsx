import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import type { Quality } from '../lib/quality.ts'
import { Experience } from './Experience.tsx'

type Props = {
  quality: Quality
  onQuality: (next: Quality) => void
}

export function CanvasRoot({ quality, onQuality }: Props) {
  return (
    <div className="canvas-root">
      <Canvas
        dpr={quality.dpr}
        shadows={false}
        eventPrefix="client"
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        gl={{
          antialias: quality.antialias,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 36, near: 0.04, far: 240, position: [0.95, 0.68, 1.28] }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.9
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.setClearColor('#07080a')
          camera.lookAt(0, 0.52, 0.06)
        }}
      >
        <Experience quality={quality} onQuality={onQuality} />
      </Canvas>
    </div>
  )
}
