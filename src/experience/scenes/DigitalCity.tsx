import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { bands, world } from '../../config/scenes.ts'
import { hash, remap, sectionAlpha } from '../../lib/math.ts'
import type { Quality } from '../../lib/quality.ts'
import { inspect } from '../../lib/actions.ts'
import { live } from '../../store/experience.ts'
import { Hit } from '../objects/Hit.tsx'
import { useMountRange } from '../hooks/useMountRange.ts'
import { cityFrag, cityVert } from '../materials/shaders.ts'

export function DigitalCity({ quality }: { quality: Quality }) {
  const mounted = useMountRange(bands.city[0], bands.code[1], 0.08)
  if (!mounted) return null
  return <CityInner quality={quality} />
}

function CityInner({ quality }: { quality: Quality }) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const count = quality.city
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const col = (i % 9) - 4
        const row = Math.floor(i / 9) - 3
        const h = 0.8 + hash(i + 4) * 4.5
        return {
          x: col * 1.35 + (hash(i) - 0.5) * 0.4,
          z: -86 - row * 4.2 + (hash(i + 2) - 0.5) * 0.8,
          h,
          w: 0.45 + hash(i + 6) * 0.45,
          d: 0.45 + hash(i + 7) * 0.4,
        }
      }),
    [count],
  )

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst) return
    for (let i = 0; i < count; i += 1) {
      const s = seeds[i]
      dummy.position.set(s.x, s.h / 2, s.z)
      dummy.scale.set(s.w, s.h, s.d)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
  }, [count, dummy, seeds])

  useFrame(({ clock }) => {
    const p = live.progress
    const a = sectionAlpha(p, bands.city[0], bands.city[1], 0.04)
    if (group.current) group.current.visible = a > 0.02 || sectionAlpha(p, bands.code[0], bands.code[1]) > 0.02
    uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -110]}>
        <planeGeometry args={[40, 80]} />
        <meshStandardMaterial color="#0b0d10" />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={cityVert}
          fragmentShader={cityFrag}
        />
      </instancedMesh>
      <WebsiteFrame />
      {quality.tier !== 'low' &&
        Array.from({ length: 12 }, (_, i) => (
          <mesh
            key={i}
            position={[(hash(i) - 0.5) * 10, 0.9 + hash(i + 3) * 2, -90 - i * 3.2]}
            rotation={[0, 0, 0.4]}
          >
            <boxGeometry args={[0.02, 0.02, 2.4]} />
            <meshBasicMaterial color="#4ee3ff" transparent opacity={0.28} />
          </mesh>
        ))}
    </group>
  )
}

function WebsiteFrame() {
  const root = useRef<THREE.Group>(null)
  const parts = useRef<THREE.Group>(null)

  useFrame(() => {
    const p = live.progress
    const assemble = remap(p, 0.43, 0.468, 0, 1)
    const shatter = remap(p, 0.478, 0.52, 0, 1)
    if (root.current) {
      root.current.visible = p > 0.4 && p < 0.56
      const s = 0.2 + assemble * 0.8
      root.current.scale.setScalar(s * (1 - shatter * 0.35))
    }
    if (parts.current) {
      parts.current.children.forEach((child, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        child.position.y = child.userData.baseY + shatter * dir * (0.4 + i * 0.08)
        child.position.x = child.userData.baseX + shatter * (i - 4) * 0.12
        child.rotation.z = shatter * dir * 0.4
      })
    }
  })

  const panels = [
    { pos: [0, 1.55, 0], size: [1.7, 0.1, 0.02], color: '#121826' },
    { pos: [0, 0.95, 0], size: [1.62, 0.42, 0.016], color: '#4ee3ff' },
    { pos: [-0.52, 0.42, 0], size: [0.48, 0.32, 0.016], color: '#1b2436' },
    { pos: [0, 0.42, 0], size: [0.48, 0.32, 0.016], color: '#1b2436' },
    { pos: [0.52, 0.42, 0], size: [0.48, 0.32, 0.016], color: '#1b2436' },
    { pos: [0, 0.08, 0], size: [1.62, 0.08, 0.016], color: '#0e1422' },
  ] as const

  return (
    <Hit
      label="WEB DEVELOPMENT"
      status="SYSTEM ONLINE"
      onSelect={() =>
        inspect({
          title: 'Your website',
          body: 'A professional site we build, host, and keep maintained.',
          service: 'Website Development',
          progress: 0.4,
          status: 'SYSTEM ONLINE',
        })
      }
    >
    <group ref={root} position={world.website}>
      <mesh position={[0, 0.9, 0.02]}>
        <boxGeometry args={[1.78, 1.18, 0.04]} />
        <meshStandardMaterial color="#0b101c" metalness={0.4} roughness={0.3} />
      </mesh>
      <group ref={parts}>
        {panels.map((panel, i) => (
          <mesh
            key={i}
            position={panel.pos as [number, number, number]}
            userData={{ baseX: panel.pos[0], baseY: panel.pos[1] }}
          >
            <boxGeometry args={panel.size as [number, number, number]} />
            <meshStandardMaterial
              color={panel.color}
              emissive={panel.color}
              emissiveIntensity={panel.color === '#4ee3ff' ? 0.45 : 0.08}
            />
          </mesh>
        ))}
      </group>
    </group>
    </Hit>
  )
}
