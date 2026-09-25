import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { consultNodes } from '../../config/site.ts'
import { bands, world } from '../../config/scenes.ts'
import { sectionAlpha } from '../../lib/math.ts'
import { inspect } from '../../lib/actions.ts'
import { live, useExperience } from '../../store/experience.ts'
import { useMountRange } from '../hooks/useMountRange.ts'
import { LabelSprite } from '../objects/LabelSprite.tsx'

export function ConsultingNetwork() {
  const mounted = useMountRange(bands.consult[0], bands.consult[1], 0.07)
  if (!mounted) return null
  return <NetworkInner />
}

function NetworkInner() {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const setHoveredNode = useExperience((s) => s.setHoveredNode)
  const setHover = useExperience((s) => s.setHover)

  const nodes = useMemo(() => {
    return consultNodes.map((n, i) => {
      const a = (i / consultNodes.length) * Math.PI * 2
      return {
        ...n,
        pos: [Math.cos(a) * 2.4, 0.6 + Math.sin(i * 1.7) * 0.55, Math.sin(a) * 2.4] as [
          number,
          number,
          number,
        ],
      }
    })
  }, [])

  const lines = useMemo(() => {
    const pts: number[] = []
    nodes.forEach((n) => {
      pts.push(0, 0.8, 0, n.pos[0], n.pos[1], n.pos[2])
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return geo
  }, [nodes])

  useFrame(({ clock }) => {
    const a = sectionAlpha(live.progress, bands.consult[0], bands.consult[1], 0.03)
    if (group.current) {
      group.current.visible = a > 0.02
      group.current.rotation.y = clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={group} position={world.consult}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.28, 0.1, 0.2]} />
        <meshStandardMaterial color="#16191e" metalness={0.7} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.86, 0.11]}>
        <boxGeometry args={[0.16, 0.012, 0.004]} />
        <meshStandardMaterial
          color="#4ee3ff"
          emissive="#4ee3ff"
          emissiveIntensity={0.7}
          toneMapped={false}
        />
      </mesh>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#4ee3ff" transparent opacity={0.28} />
      </lineSegments>
      <LabelSprite text="CONNECTION SECURE" position={[0, 1.12, 0]} scale={[0.42, 0.09, 1]} />
      <LabelSprite text="SECURITY" position={[-1.4, 1.55, -0.4]} scale={[0.32, 0.07, 1]} color="#8b919a" />
      {nodes.map((n) => (
        <group key={n.id} position={n.pos}>
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(n.id)
              setHoveredNode(n.id, n.desc)
              setHover(n.id, 'NETWORK LINK ACTIVE')
            }}
            onPointerOut={() => {
              setHovered(null)
              setHoveredNode(null)
              setHover(null)
            }}
            onClick={(e) => {
              e.stopPropagation()
              inspect({
                title: n.id,
                body: n.desc,
                service: n.service,
                progress: 0.57,
                status: 'NETWORK LINK ACTIVE',
              })
            }}
          >
            <sphereGeometry args={[hovered === n.id ? 0.13 : 0.09, 16, 16]} />
            <meshStandardMaterial
              color={hovered === n.id ? '#e8eef4' : '#c5d0da'}
              emissive="#4ee3ff"
              emissiveIntensity={hovered === n.id ? 1.1 : 0.35}
            />
          </mesh>
          <LabelSprite text={n.id} position={[0, 0.22, 0]} scale={[0.42, 0.1, 1]} color="#4ee3ff" />
        </group>
      ))}
    </group>
  )
}
