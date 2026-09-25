import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import type { Quality } from '../lib/quality.ts'

const chromaOffset = new Vector2(0.00035, 0.00035)

export function PostFX({ quality }: { quality: Quality }) {
  if (!quality.bloom) return null
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom luminanceThreshold={1.22} intensity={quality.tier === 'high' ? 0.11 : 0.07} mipmapBlur />
      <Vignette offset={0.22} darkness={0.72} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.22} />
      {quality.tier === 'high' ? (
        <ChromaticAberration offset={chromaOffset} radialModulation modulationOffset={0.4} />
      ) : (
        <></>
      )}
    </EffectComposer>
  )
}
