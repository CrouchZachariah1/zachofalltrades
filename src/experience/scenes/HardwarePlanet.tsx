import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { bands, world } from '../../config/scenes.ts'
import { hash, remap, sectionAlpha } from '../../lib/math.ts'
import type { Quality } from '../../lib/quality.ts'
import { chipActions } from '../../config/site.ts'
import { inspect } from '../../lib/actions.ts'
import { live } from '../../store/experience.ts'
import { Hit } from '../objects/Hit.tsx'
import { useMountRange } from '../hooks/useMountRange.ts'
import { planetFrag, planetVert } from '../materials/shaders.ts'
import { LogoMark } from '../objects/LogoMark.tsx'
import { LabelSprite } from '../objects/LabelSprite.tsx'

const regions = ['PERFORMANCE', 'RELIABILITY', 'UPGRADES', 'WORK', 'GAMING', 'CREATIVE']

export function HardwarePlanet({ quality }: { quality: Quality }) {
  const mounted = useMountRange(bands.planet[0], bands.planet[1], 0.08)
  if (!mounted) return null
  return <PlanetInner quality={quality} />
}

function PlanetInner({ quality }: { quality: Quality }) {
  const group = useRef<THREE.Group>(null)
  const planet = useRef<THREE.Mesh>(null)
  const logo = useRef<THREE.Group>(null)
  const chips = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpin: { value: 0 },
      uColor: { value: new THREE.Color('#4ee3ff') },
      uHot: { value: 0 },
    }),
    [],
  )
  const chipCount = quality.tier === 'low' ? 28 : quality.tier === 'high' ? 56 : 40

  useLayoutEffect(() => {
    const inst = chips.current
    if (!inst) return
    for (let i = 0; i < chipCount; i += 1) {
      const u = hash(i)
      const v = hash(i + 5)
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = 2.82
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      )
      dummy.lookAt(0, 0, 0)
      dummy.scale.set(0.08 + hash(i + 8) * 0.1, 0.03, 0.05)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
  }, [chipCount, dummy])

  useFrame(({ clock }) => {
    const p = live.progress
    const a = sectionAlpha(p, bands.planet[0], bands.planet[1], 0.04)
    if (group.current) group.current.visible = a > 0.02
    const spin = remap(p, 0.7, 0.81, 0, Math.PI * 1.6)
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uSpin.value = spin
    uniforms.uHot.value = remap(p, 0.73, 0.8)
    const collapse = remap(p, 0.8, 0.818, 0, 1)
    if (planet.current) {
      planet.current.rotation.y = spin
      planet.current.scale.setScalar(1 - collapse)
      planet.current.visible = collapse < 0.98
    }
    if (chips.current) {
      chips.current.rotation.y = spin
      chips.current.visible = collapse < 0.6
    }
    if (logo.current) {
      logo.current.scale.setScalar(collapse)
      logo.current.visible = collapse > 0.05
      logo.current.rotation.y = clock.elapsedTime * 0.3
    }
  })

  return (
    <group ref={group} position={world.planet}>
      <mesh ref={planet}>
        <sphereGeometry args={[2.7, 64, 64]} />
        <shaderMaterial uniforms={uniforms} vertexShader={planetVert} fragmentShader={planetFrag} />
      </mesh>
      <instancedMesh ref={chips} args={[undefined, undefined, chipCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8b949e" metalness={0.8} roughness={0.3} />
      </instancedMesh>
      <group ref={logo}>
        <LogoMark scale={3.2} />
      </group>
      {regions.map((label, i) => {
        const a = (i / regions.length) * Math.PI * 2
        const pos: [number, number, number] = [
          Math.cos(a) * 3.6,
          Math.sin(i) * 0.8,
          Math.sin(a) * 3.6,
        ]
        const meta = chipActions[label]
        return (
          <Hit
            key={label}
            label={label}
            status="PERFORMANCE OPTIMISED"
            onSelect={() =>
              inspect({
                title: label,
                body: meta?.body ?? 'A part of how the machine should feel.',
                service: meta?.service,
                progress: 0.74,
                status: 'PERFORMANCE OPTIMISED',
              })
            }
          >
            <mesh position={pos}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshBasicMaterial transparent opacity={0.0} />
            </mesh>
            <LabelSprite text={label} position={pos} scale={[0.7, 0.16, 1]} color="#4ee3ff" />
          </Hit>
        )
      })}
    </group>
  )
}
