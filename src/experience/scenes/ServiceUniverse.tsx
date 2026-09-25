import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { services } from '../../config/site.ts'
import { bands, world } from '../../config/scenes.ts'
import { sectionAlpha } from '../../lib/math.ts'
import { inspect } from '../../lib/actions.ts'
import { live, useExperience } from '../../store/experience.ts'
import { useMountRange } from '../hooks/useMountRange.ts'
import { LabelSprite } from '../objects/LabelSprite.tsx'
import { LogoMark } from '../objects/LogoMark.tsx'

export function ServiceUniverse() {
  const mounted = useMountRange(bands.universe[0], bands.universe[1], 0.07)
  if (!mounted) return null
  return <UniverseInner />
}

function UniverseInner() {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const setHoveredNode = useExperience((s) => s.setHoveredNode)
  const setHover = useExperience((s) => s.setHover)

  const nodes = useMemo(
    () =>
      services.map((s, i) => {
        const a = (i / services.length) * Math.PI * 2
        return {
          ...s,
          pos: [Math.cos(a) * 3.1, Math.sin(a * 1.4) * 1.1, Math.sin(a) * 3.1] as [
            number,
            number,
            number,
          ],
        }
      }),
    [],
  )

  const lines = useMemo(() => {
    const pts: number[] = []
    nodes.forEach((n) => pts.push(0, 0, 0, n.pos[0], n.pos[1], n.pos[2]))
    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i]
      const m = nodes[(i + 2) % nodes.length]
      pts.push(n.pos[0], n.pos[1], n.pos[2], m.pos[0], m.pos[1], m.pos[2])
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return geo
  }, [nodes])

  useFrame(({ clock }) => {
    const a = sectionAlpha(live.progress, bands.universe[0], bands.universe[1], 0.03)
    if (group.current) {
      group.current.visible = a > 0.02
      group.current.rotation.y = clock.elapsedTime * 0.04
    }
  })

  return (
    <group ref={group} position={world.universe}>
      <LogoMark scale={1.4} />
      <LabelSprite
        text="ZACH OF ALL TRADES"
        position={[0, 0.55, 0]}
        scale={[1.15, 0.22, 1]}
        color="#ffffff"
      />
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#4ee3ff" transparent opacity={0.22} />
      </lineSegments>
      {nodes.map((n) => (
        <group key={n.id} position={n.pos}>
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(n.id)
              setHoveredNode(n.title, n.short)
              setHover(n.title.toUpperCase(), 'SYSTEM ONLINE')
            }}
            onPointerOut={() => {
              setHovered(null)
              setHoveredNode(null)
              setHover(null)
            }}
            onClick={(e) => {
              e.stopPropagation()
              inspect({
                title: n.title,
                body: n.body,
                service: n.formValue,
                progress: n.progress,
                status: 'SYSTEM ONLINE',
              })
            }}
          >
            <sphereGeometry args={[hovered === n.id ? 0.16 : 0.1, 16, 16]} />
            <meshStandardMaterial
              color="#e8eef4"
              emissive="#4ee3ff"
              emissiveIntensity={hovered === n.id ? 1.1 : 0.4}
            />
          </mesh>
          <LabelSprite
            text={n.title.toUpperCase()}
            position={[0, 0.26, 0]}
            scale={[0.55, 0.12, 1]}
          />
        </group>
      ))}
    </group>
  )
}
