import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { palette } from '../../config/palette.ts'
import { inspect } from '../../lib/actions.ts'
import type { Quality } from '../../lib/quality.ts'
import { makeOpsTexture } from '../../lib/textures.ts'
import { live } from '../../store/experience.ts'
import { Hit } from './Hit.tsx'
import { LabelSprite } from './LabelSprite.tsx'

type Props = {
  quality: Quality
}

const plaques: { text: string; position: [number, number, number]; scale: [number, number, number] }[] = [
  { text: 'HARDWARE', position: [-1.55, 1.18, -3.2], scale: [0.42, 0.09, 1] },
  { text: 'NETWORK', position: [1.72, 1.42, -3.6], scale: [0.38, 0.08, 1] },
  { text: 'INFRASTRUCTURE', position: [2.15, 1.95, -4.6], scale: [0.5, 0.1, 1] },
  { text: 'SYSTEM STATUS', position: [-2.05, 0.72, -4.4], scale: [0.46, 0.09, 1] },
  { text: 'ACTIVE SYSTEMS', position: [0.9, 2.28, -2.4], scale: [0.44, 0.09, 1] },
  { text: 'SECURITY', position: [2.05, 0.52, -3.35], scale: [0.32, 0.07, 1] },
  { text: 'DIAGNOSTICS', position: [-1.85, 1.52, -5.1], scale: [0.4, 0.085, 1] },
]

export function FacilityRoom({ quality }: Props) {
  const group = useRef<THREE.Group>(null)
  const leds = useRef<THREE.MeshStandardMaterial[]>([])

  useFrame(({ clock }) => {
    const a = live.progress < 0.22 ? 1 : Math.max(0, 1 - (live.progress - 0.22) * 14)
    if (group.current) group.current.visible = a > 0.02
    const t = clock.elapsedTime
    leds.current.forEach((m, i) => {
      m.emissiveIntensity = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.4 + i * 1.7))
    })
  })

  const pushLed = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !leds.current.includes(m)) leds.current.push(m)
  }

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, -2.4]} receiveShadow={false}>
        <planeGeometry args={[14, 16]} />
        <meshStandardMaterial color="#121417" roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.12, -0.004, 0.06]}>
        <planeGeometry args={[1.7, 1.05]} />
        <meshStandardMaterial color="#1a1e24" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.12, 0.001, 0.06]}>
        <planeGeometry args={[1.55, 0.9]} />
        <meshStandardMaterial color="#0d0f12" metalness={0.4} roughness={0.45} />
      </mesh>

      <Workbench />

      <mesh position={[0, 2.82, -2.2]}>
        <boxGeometry args={[9, 0.06, 12]} />
        <meshStandardMaterial color="#0c0e11" metalness={0.35} roughness={0.7} />
      </mesh>
      {[-1.6, 0, 1.6].map((x) => (
        <mesh key={x} position={[x, 2.76, -1.4]}>
          <boxGeometry args={[1.15, 0.02, 0.08]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.accent}
            emissiveIntensity={0.28}
            toneMapped={false}
          />
        </mesh>
      ))}

      <mesh position={[-3.15, 1.1, -2.8]}>
        <boxGeometry args={[0.08, 2.8, 8.4]} />
        <meshStandardMaterial color="#14171b" metalness={0.45} roughness={0.62} />
      </mesh>
      <mesh position={[3.25, 1.1, -3.4]}>
        <boxGeometry args={[0.08, 2.8, 7.2]} />
        <meshStandardMaterial color="#14171b" metalness={0.45} roughness={0.62} />
      </mesh>

      <mesh position={[0, 1.35, -7.35]}>
        <boxGeometry args={[6.4, 2.7, 0.04]} />
        <meshStandardMaterial
          color="#8aa0b0"
          transparent
          opacity={0.07}
          roughness={0.08}
          metalness={0.12}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.35, -7.42]}>
        <boxGeometry args={[6.6, 2.9, 0.03]} />
        <meshStandardMaterial color="#07080a" metalness={0.2} roughness={0.8} />
      </mesh>

      <spotLight
        position={[0.35, 1.95, 1.05]}
        angle={0.46}
        penumbra={0.78}
        intensity={1.55}
        distance={5.5}
        color="#eaf2fa"
      />
      <pointLight position={[0.12, 0.55, 0.2]} color="#d7e6f4" distance={1.8} intensity={0.45} />
      <pointLight position={[2.45, 1.1, -4.2]} color={palette.accent} distance={3.4} intensity={0.22} />
      <pointLight position={[-1.8, 0.6, -5.5]} color="#9eb4c8" distance={4} intensity={0.08} />

      <Rack position={[2.38, 0, -3.85]} lit pushLed={pushLed} interactive />
      {quality.tier !== 'low' && (
        <>
          <Rack position={[2.62, 0, -4.55]} lit={false} pushLed={pushLed} />
          <Rack position={[2.82, 0, -5.35]} lit={false} dim />
          <Rack position={[-2.55, 0, -5.7]} lit={false} dim />
        </>
      )}

      {quality.tier !== 'low' && <WallScreens />}
      {plaques.map((p) => (
        <LabelSprite key={p.text} text={p.text} position={p.position} scale={p.scale} color="#8b919a" />
      ))}
      <LabelSprite
        text="ZACH OF ALL TRADES"
        position={[0, 2.22, -7.12]}
        scale={[1.15, 0.22, 1]}
        color="#e8eef4"
      />

      <HazeVeil position={[0.4, 1.15, -2.2]} rotation={[0.12, 0.2, 0]} />
      {quality.tier === 'high' && <HazeVeil position={[-1.2, 0.9, -4.8]} rotation={[0.2, -0.4, 0]} />}

      <mesh position={[1.05, 2.48, -1.15]}>
        <cylinderGeometry args={[0.07, 0.09, 0.04, 16]} />
        <meshStandardMaterial color="#1a1e24" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.05, 2.44, -1.15]}>
        <sphereGeometry args={[0.035, 12, 8]} />
        <meshStandardMaterial color="#0d1014" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Workbench() {
  return (
    <group position={[0.14, -0.04, 0.08]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.62, 0.045, 0.98]} />
        <meshStandardMaterial color="#1c2128" metalness={0.68} roughness={0.32} />
      </mesh>
      {[
        [-0.72, -0.38, -0.4],
        [0.72, -0.38, -0.4],
        [-0.72, -0.38, 0.4],
        [0.72, -0.38, 0.4],
      ].map((pos) => (
        <mesh key={pos.join(',')} position={pos as [number, number, number]}>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
          <meshStandardMaterial color="#121417" metalness={0.55} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0.58, 0.03, 0.28]} rotation={[0, 0.4, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />
        <meshStandardMaterial color="#6a717a" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0.66, 0.028, 0.22]}>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 10]} />
        <meshStandardMaterial color="#2a3036" roughness={0.5} />
      </mesh>
      <mesh position={[0.48, 0.03, 0.34]}>
        <boxGeometry args={[0.09, 0.008, 0.03]} />
        <meshStandardMaterial color="#0c3d2a" roughness={0.45} />
      </mesh>
    </group>
  )
}

function Rack({
  position,
  lit,
  dim,
  interactive,
  pushLed,
}: {
  position: [number, number, number]
  lit: boolean
  dim?: boolean
  interactive?: boolean
  pushLed?: (m: THREE.MeshStandardMaterial | null) => void
}) {
  const body = (
    <group position={position}>
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.46, 1.84, 0.4]} />
        <meshStandardMaterial
          color={dim ? '#0c0e11' : '#14171c'}
          metalness={0.72}
          roughness={dim ? 0.55 : 0.34}
        />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[0, 0.18 + i * 0.155, 0.205]}>
          <boxGeometry args={[0.4, 0.12, 0.012]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#1a1e24' : '#101318'} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {lit &&
        [0.35, 0.66, 0.98, 1.28].map((y, i) => (
          <mesh key={y} position={[0.18, y, 0.214]}>
            <boxGeometry args={[0.018, 0.018, 0.006]} />
            <meshStandardMaterial
              color={palette.accent}
              emissive={palette.accent}
              emissiveIntensity={0.6}
              ref={i === 0 ? pushLed : undefined}
              toneMapped={false}
            />
          </mesh>
        ))}
    </group>
  )

  if (!interactive) return body
  return (
    <Hit
      label="SYSTEM SUPPORT"
      status="SYSTEM ONLINE"
      onSelect={() =>
        inspect({
          title: 'System support',
          body: 'The unglamorous layer: storage, backups, and the machines that have to stay up.',
          service: 'Other',
          progress: 0.83,
          status: 'SYSTEM ONLINE',
        })
      }
    >
      {body}
    </Hit>
  )
}

function WallScreens() {
  const maps = useMemo(
    () => ({
      net: makeOpsTexture('NETWORK', ['UPLINK  ACTIVE', 'AP-01  5 GHz', 'CLIENTS  14', 'LATENCY  2 ms']),
      sys: makeOpsTexture('PERFORMANCE', ['CPU  18%', 'MEM  6.2 GB', 'STORAGE  OK', 'THERMALS  STABLE']),
    }),
    [],
  )
  return (
    <group>
      <group position={[-1.35, 1.45, -7.28]}>
        <mesh>
          <boxGeometry args={[0.72, 0.44, 0.03]} />
          <meshStandardMaterial color="#0b0d10" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[0.66, 0.38]} />
          <meshStandardMaterial
            map={maps.net}
            emissive={palette.accent}
            emissiveIntensity={0.12}
            toneMapped={false}
          />
        </mesh>
        <pointLight position={[0, 0, 0.2]} color={palette.accent} distance={1.6} intensity={0.18} />
      </group>
      <group position={[1.15, 1.52, -7.28]}>
        <mesh>
          <boxGeometry args={[0.64, 0.4, 0.03]} />
          <meshStandardMaterial color="#0b0d10" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[0.58, 0.34]} />
          <meshStandardMaterial
            map={maps.sys}
            emissive="#9eb4c8"
            emissiveIntensity={0.1}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

function HazeVeil({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation} renderOrder={2}>
      <planeGeometry args={[3.2, 2.2]} />
      <meshBasicMaterial
        color="#9aa7b4"
        transparent
        opacity={0.035}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
