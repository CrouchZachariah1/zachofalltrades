import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type * as THREE from 'three'
import { bands, world } from '../../config/scenes.ts'
import { remap, sectionAlpha } from '../../lib/math.ts'
import { inspect } from '../../lib/actions.ts'
import { live } from '../../store/experience.ts'
import { useMountRange } from '../hooks/useMountRange.ts'
import { GridFloor } from '../objects/GridFloor.tsx'
import { Hit } from '../objects/Hit.tsx'

const windows = [
  {
    pos: [-0.55, 1.15, 0.1],
    size: [0.9, 0.58],
    title: 'Windows setup',
    service: 'Windows',
    body: 'Clean install, drivers, and a system that boots the way it should — using your genuine license.',
  },
  {
    pos: [0.5, 1.35, -0.05],
    size: [0.72, 0.5],
    title: 'Microsoft 365',
    service: 'Microsoft 365',
    body: 'Installed and configured on your legitimate Microsoft subscription. We do not sell licenses.',
  },
  {
    pos: [0.15, 0.72, 0.18],
    size: [0.8, 0.42],
    title: 'Drivers',
    service: 'Windows',
    body: 'Chipset, GPU, and peripherals. The parts Windows will not magic into place.',
  },
  {
    pos: [-0.35, 0.62, -0.12],
    size: [0.55, 0.36],
    title: 'Software setup',
    service: 'Other',
    body: 'The apps you already pay for, installed so they actually launch.',
  },
]

export function OsDesktop() {
  const mounted = useMountRange(bands.os[0], bands.os[1], 0.07)
  if (!mounted) return null
  return <OsInner />
}

function OsInner() {
  const group = useRef<THREE.Group>(null)
  const panes = useRef<THREE.Group>(null)

  useFrame(() => {
    const p = live.progress
    const a = sectionAlpha(p, bands.os[0], bands.os[1], 0.03)
    if (group.current) group.current.visible = a > 0.02
    if (panes.current) {
      panes.current.children.forEach((child, i) => {
        const local = remap(p, bands.os[0] + i * 0.008, bands.os[0] + 0.04 + i * 0.008)
        child.scale.setScalar(0.15 + local * 0.85)
        child.position.y = (child.userData.y as number) + (1 - local) * 0.25
      })
    }
  })

  return (
    <group ref={group} position={world.os}>
      <GridFloor color="#4ee3ff" fade={8} scale={1.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#101214" roughness={0.9} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.8, 48]} />
        <meshStandardMaterial color="#16191e" metalness={0.55} roughness={0.28} />
      </mesh>
      <group ref={panes}>
        {windows.map((w, i) => (
          <group key={i} position={w.pos as [number, number, number]} userData={{ y: w.pos[1] }}>
          <Hit
            label={w.title.toUpperCase()}
            status="HARDWARE CONFIGURED"
            onSelect={() =>
              inspect({
                title: w.title,
                body: w.body,
                service: w.service,
                progress: 0.66,
                status: 'HARDWARE CONFIGURED',
              })
            }
          >
            <mesh>
              <boxGeometry args={[w.size[0], w.size[1], 0.02]} />
              <meshPhysicalMaterial
                color="#d9e4f5"
                roughness={0.12}
                metalness={0.05}
                transparent
                opacity={0.16}
              />
            </mesh>
            <mesh position={[0, w.size[1] / 2 - 0.03, 0.012]}>
              <boxGeometry args={[w.size[0], 0.05, 0.006]} />
              <meshStandardMaterial color="#eef3fb" emissive="#9ecbff" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[-w.size[0] / 2 + 0.08, w.size[1] / 2 - 0.03, 0.016]}>
              <circleGeometry args={[0.01, 12]} />
              <meshBasicMaterial color="#7adfff" />
            </mesh>
            <mesh position={[0, -0.02, 0.014]}>
              <boxGeometry args={[w.size[0] * 0.72, 0.012, 0.004]} />
              <meshBasicMaterial color="#c5d4ea" />
            </mesh>
            <mesh position={[0, -0.08, 0.014]}>
              <boxGeometry args={[w.size[0] * 0.5, 0.012, 0.004]} />
              <meshBasicMaterial color="#8aa0c0" />
            </mesh>
          </Hit>
          </group>
        ))}
      </group>
    </group>
  )
}
