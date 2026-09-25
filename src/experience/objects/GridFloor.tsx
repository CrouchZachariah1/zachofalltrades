import { useMemo } from 'react'
import * as THREE from 'three'
import { gridFrag, gridVert } from '../materials/shaders.ts'

type Props = {
  color?: string
  scale?: number
  fade?: number
  size?: number
}

export function GridFloor({
  color = '#4ee3ff',
  scale = 1.6,
  fade = 9,
  size = 28,
}: Props) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uFade: { value: fade },
      uScale: { value: scale },
    }),
    [color, fade, scale],
  )

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={gridVert}
        fragmentShader={gridFrag}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
