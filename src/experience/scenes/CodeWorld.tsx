import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { bands, world } from '../../config/scenes.ts'
import { hash, sectionAlpha } from '../../lib/math.ts'
import type { Quality } from '../../lib/quality.ts'
import { live } from '../../store/experience.ts'
import { useMountRange } from '../hooks/useMountRange.ts'

export function CodeWorld({ quality }: { quality: Quality }) {
  const mounted = useMountRange(bands.code[0], bands.code[1], 0.07)
  if (!mounted) return null
  return <CodeInner quality={quality} />
}

function CodeInner({ quality }: { quality: Quality }) {
  const group = useRef<THREE.Group>(null)
  const frames = useMemo(() => {
    const n = quality.tier === 'low' ? 14 : 28
    return Array.from({ length: n }, (_, i) => ({
      pos: [
        (hash(i) - 0.5) * 6,
        0.4 + hash(i + 2) * 2.4,
        world.code[2] + (hash(i + 4) - 0.5) * 22,
      ] as [number, number, number],
      rot: hash(i + 6) * 0.6,
      w: 0.4 + hash(i + 8) * 0.9,
      h: 0.24 + hash(i + 9) * 0.5,
      speed: 0.1 + hash(i + 11) * 0.4,
    }))
  }, [quality.tier])

  useFrame(({ clock }) => {
    const a = sectionAlpha(live.progress, bands.code[0], bands.code[1], 0.03)
    if (group.current) {
      group.current.visible = a > 0.02
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.05
    }
  })

  return (
    <group ref={group}>
      <gridHelper args={[28, 28, '#1c2a32', '#0b0d10']} position={[0, 0.01, world.code[2]]} />
      {frames.map((f, i) => (
        <group key={i} position={f.pos} rotation={[0, f.rot, 0]}>
          <mesh>
            <boxGeometry args={[f.w, f.h, 0.01]} />
            <meshBasicMaterial color="#7ea2ff" wireframe transparent opacity={0.55} />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[f.w * 0.92, 0.008, 0.008]} />
            <meshBasicMaterial color="#4ee3ff" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.2, world.code[2] - 18]}>
        <boxGeometry args={[1.6, 1.0, 0.04]} />
        <meshStandardMaterial color="#101214" metalness={0.4} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.35, world.code[2] - 17.96]}>
        <boxGeometry args={[1.46, 0.36, 0.02]} />
        <meshStandardMaterial color="#4ee3ff" emissive="#4ee3ff" emissiveIntensity={0.4} />
      </mesh>
      {quality.tier !== 'low' &&
        Array.from({ length: 18 }, (_, i) => (
          <mesh
            key={`l${i}`}
            position={[(hash(i + 40) - 0.5) * 8, 0.2 + hash(i + 41) * 2, world.code[2] + (i - 9) * 1.6]}
          >
            <boxGeometry args={[0.006, 0.006, 3.2]} />
            <meshBasicMaterial color="#d7e8ff" transparent opacity={0.35} />
          </mesh>
        ))}
    </group>
  )
}
