import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { bands, world } from '../../config/scenes.ts'
import { remap, sectionAlpha } from '../../lib/math.ts'
import type { Quality } from '../../lib/quality.ts'
import { makeHudTexture } from '../../lib/textures.ts'
import { live } from '../../store/experience.ts'
import { useMountRange } from '../hooks/useMountRange.ts'
import { hologramFrag, hologramVert } from '../materials/shaders.ts'
import { GridFloor } from '../objects/GridFloor.tsx'
import { LabelSprite } from '../objects/LabelSprite.tsx'
import { CustomPC } from '../pc/CustomPC.tsx'

export function RepairLab({ quality }: { quality: Quality }) {
  const mounted = useMountRange(bands.repair[0], bands.repair[1], 0.07)
  if (!mounted) return null
  return <LabInner quality={quality} />
}

function LabInner({ quality }: { quality: Quality }) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const hud = useRef<THREE.MeshBasicMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#4ee3ff') },
      uAlpha: { value: 1 },
    }),
    [],
  )
  const hudMap = useMemo(
    () =>
      makeHudTexture([
        { label: 'CPU TEMP', value: '68°' },
        { label: 'GPU TEMP', value: '74°' },
        { label: 'RAM USAGE', value: 'ERR', warn: true },
        { label: 'SSD HEALTH', value: '98%' },
        { label: 'FAN SPEED', value: '1420' },
        { label: 'STATUS', value: 'FAULT', warn: true },
      ]),
    [],
  )

  useFrame(({ clock }) => {
    const p = live.progress
    const a = sectionAlpha(p, bands.repair[0], bands.repair[1], 0.03)
    if (group.current) group.current.visible = a > 0.02
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uAlpha.value = a
    const healed = remap(p, 0.345, 0.365, 0, 1)
    uniforms.uColor.value.set(healed > 0.5 ? '#4ee3ff' : '#c45a52')
    if (ring.current) ring.current.rotation.y = clock.elapsedTime * 0.35
    if (hud.current) hud.current.opacity = a * 0.9
  })

  return (
    <group ref={group} position={world.repair}>
      <GridFloor color="#4ee3ff" fade={10} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#101214" roughness={0.9} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 48]} />
        <meshStandardMaterial color="#121417" metalness={0.7} roughness={0.25} />
      </mesh>
      <CustomPC quality={quality} variant="repair" />
      <mesh position={[1.85, 0.9, -1.4]}>
        <boxGeometry args={[0.42, 1.8, 0.36]} />
        <meshStandardMaterial color="#101318" metalness={0.7} roughness={0.38} />
      </mesh>
      <mesh position={[-1.7, 0.85, -1.8]}>
        <boxGeometry args={[0.4, 1.7, 0.34]} />
        <meshStandardMaterial color="#0c0e11" metalness={0.65} roughness={0.5} />
      </mesh>
      <mesh ref={ring} position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.9, 48, 1, true]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={hologramVert}
          fragmentShader={hologramFrag}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.55, 0.42, 0.1]} rotation={[0, -0.5, 0]}>
        <planeGeometry args={[0.42, 0.42]} />
        <meshBasicMaterial ref={hud} map={hudMap} transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.55, 0.38, 0.05]} rotation={[0, 0.6, 0]}>
        <planeGeometry args={[0.32, 0.2]} />
        <meshBasicMaterial color="#4ee3ff" transparent opacity={0.08} />
      </mesh>
      <LabelSprite text="DIAGNOSTICS" position={[-0.62, 0.72, 0.12]} scale={[0.32, 0.07, 1]} color="#8b919a" />
      <LabelSprite text="DIAGNOSTIC READY" position={[0.55, 0.68, 0.12]} scale={[0.34, 0.07, 1]} />
    </group>
  )
}
