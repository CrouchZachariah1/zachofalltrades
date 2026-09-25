import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { palette } from '../../config/palette.ts'
import { live } from '../../store/experience.ts'
import { LabelSprite } from './LabelSprite.tsx'

const boxes: { pos: [number, number, number]; size: [number, number, number]; label: string }[] = [
  { pos: [0, 0.16, 0], size: [0.12, 0.08, 0.02], label: 'CPU' },
  { pos: [0.18, 0.16, 0], size: [0.14, 0.06, 0.02], label: 'RAM' },
  { pos: [0, 0.0, 0], size: [0.16, 0.07, 0.02], label: 'GPU' },
  { pos: [0.18, 0.0, 0], size: [0.12, 0.05, 0.02], label: 'SSD' },
  { pos: [0.09, -0.14, 0], size: [0.16, 0.06, 0.02], label: 'PSU' },
]

export function SystemDiagram() {
  const group = useRef<THREE.Group>(null)
  const lines = useMemo(() => {
    const pts = [
      0, 0.16, 0, 0.18, 0.16, 0, 0, 0.16, 0, 0, 0, 0, 0.18, 0.16, 0, 0.18, 0, 0, 0, 0, 0, 0.18, 0, 0, 0,
      0, 0, 0.09, -0.14, 0, 0.18, 0, 0, 0.09, -0.14, 0,
    ]
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return geo
  }, [])

  useFrame((_, dt) => {
    const on = live.pcLabels
    const g = group.current
    if (!g) return
    g.visible = on > 0.12
    const s = THREE.MathUtils.damp(g.scale.x, 0.7 + on * 0.3, 6, dt)
    g.scale.setScalar(s)
  })

  return (
    <group ref={group} position={[0.42, 0.34, -0.12]} visible={false}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={palette.accent} transparent opacity={0.35} />
      </lineSegments>
      {boxes.map((b) => (
        <group key={b.label} position={b.pos}>
          <mesh>
            <boxGeometry args={b.size} />
            <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.45} />
          </mesh>
          <LabelSprite
            text={b.label}
            position={[0, b.size[1] * 0.9, 0]}
            scale={[0.14, 0.032, 1]}
            color={palette.accent}
          />
        </group>
      ))}
      <LabelSprite
        text="HARDWARE CONFIGURED"
        position={[0.08, 0.3, 0]}
        scale={[0.32, 0.07, 1]}
        color={palette.accent}
      />
    </group>
  )
}
