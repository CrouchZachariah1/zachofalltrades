import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { bands } from '../../config/scenes.ts'
import { palette } from '../../config/palette.ts'
import { sectionAlpha } from '../../lib/math.ts'
import type { Quality } from '../../lib/quality.ts'
import { makeGradientRay } from '../../lib/textures.ts'
import { live } from '../../store/experience.ts'
import { useMountRange } from '../hooks/useMountRange.ts'
import { BenchHardware } from '../objects/BenchHardware.tsx'
import { FacilityRoom } from '../objects/FacilityRoom.tsx'
import { GridFloor } from '../objects/GridFloor.tsx'
import { SystemDiagram } from '../objects/SystemDiagram.tsx'

export function Workshop({ quality }: { quality: Quality }) {
  const mounted = useMountRange(bands.open[0], bands.workshop[1], 0.08)
  if (!mounted) return null
  return <WorkshopInner quality={quality} />
}

function WorkshopInner({ quality }: { quality: Quality }) {
  const group = useRef<THREE.Group>(null)
  const ray = useMemo(() => makeGradientRay(), [])

  useFrame(() => {
    const a = sectionAlpha(live.progress, bands.open[0], bands.workshop[1], 0.04)
    if (group.current) {
      group.current.visible = a > 0.02
    }
  })

  return (
    <group ref={group}>
      <FacilityRoom quality={quality} />
      <GridFloor color={palette.accent} fade={9} scale={1.35} />
      <BenchHardware />
      <SystemDiagram />

      {quality.tier !== 'low' && (
        <mesh position={[0.18, 1.15, 0.2]} rotation={[0, 0.12, -0.06]}>
          <planeGeometry args={[0.22, 1.5]} />
          <meshBasicMaterial
            map={ray}
            transparent
            depthWrite={false}
            opacity={0.18}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}
