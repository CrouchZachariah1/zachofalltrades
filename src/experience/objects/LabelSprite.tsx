import { useMemo } from 'react'
import { makeLabelTexture } from '../../lib/textures.ts'

type Props = {
  text: string
  position: [number, number, number]
  opacity?: number
  scale?: [number, number, number]
  color?: string
}

export function LabelSprite({
  text,
  position,
  opacity = 1,
  scale = [0.16, 0.04, 1],
  color = '#4ee3ff',
}: Props) {
  const map = useMemo(() => makeLabelTexture(text, color), [text, color])
  if (opacity <= 0.02) return null
  return (
    <sprite position={position} scale={scale} renderOrder={20} raycast={() => {}}>
      <spriteMaterial
        map={map}
        transparent
        opacity={opacity}
        depthTest={false}
        depthWrite={false}
      />
    </sprite>
  )
}
