import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { isSoftwareRenderer, type Quality } from '../lib/quality.ts'
import { Experience } from './Experience.tsx'

type Props = {
  quality: Quality
  onQuality: (next: Quality) => void
  onFail: () => void
}

export function CanvasRoot({ quality, onQuality, onFail }: Props) {
  return (
    <div className="canvas-root">
      <Canvas
        dpr={quality.dpr}
        shadows={false}
        eventPrefix="client"
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'default',
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: true,
        }}
        camera={{ fov: 36, near: 0.04, far: 240, position: [0.95, 0.68, 1.28] }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.9
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.setClearColor('#07080a')
          camera.lookAt(0, 0.52, 0.06)
          if (isSoftwareRenderer(gl.getContext() as WebGLRenderingContext)) {
            onFail()
            return
          }
          const canvas = gl.domElement
          const lost = (event: Event) => {
            event.preventDefault()
            onFail()
          }
          canvas.addEventListener('webglcontextlost', lost, { once: true })
        }}
      >
        <Experience quality={quality} onQuality={onQuality} onFail={onFail} />
      </Canvas>
    </div>
  )
}
