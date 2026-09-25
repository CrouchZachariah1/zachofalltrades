import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import type { Quality } from '../lib/quality.ts'

export function PostFX({ quality }: { quality: Quality }) {
  if (!quality.bloom) return null
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        luminanceThreshold={1.22}
        intensity={quality.tier === 'high' ? 0.11 : 0.07}
        mipmapBlur
        resolutionScale={quality.tier === 'high' ? 0.6 : 0.45}
      />
      <Vignette offset={0.22} darkness={0.72} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.22} />
    </EffectComposer>
  )
}
