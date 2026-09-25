import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { bands } from '../../config/scenes.ts'
import { hash, inBand, remap } from '../../lib/math.ts'
import type { Quality } from '../../lib/quality.ts'
import { live } from '../../store/experience.ts'
import { useMountRange } from '../hooks/useMountRange.ts'

export function ExplosionTunnel({ quality }: { quality: Quality }) {
  const mounted = useMountRange(bands.explosion[0], bands.explosion[1], 0.08)
  if (!mounted) return null
  return <TunnelInner quality={quality} />
}

function TunnelInner({ quality }: { quality: Quality }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const group = useRef<THREE.Group>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = quality.tunnel
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const z = -1 - (i / count) * 44
        const a = hash(i + 3) * Math.PI * 2
        const r = 0.35 + hash(i + 8) * 1.15
        return {
          x: Math.cos(a) * r,
          y: 0.25 + Math.sin(a) * r * 0.55,
          z,
          rx: hash(i + 11) * Math.PI,
          ry: hash(i + 12) * Math.PI,
          sx: 0.04 + hash(i + 14) * (i % 5 === 0 ? 0.22 : 0.08),
          sy: 0.012 + hash(i + 15) * 0.04,
          sz: 0.03 + hash(i + 16) * (i % 7 === 0 ? 0.18 : 0.05),
          spin: 0.2 + hash(i + 18) * 1.4,
          kind: i % 6,
        }
      }),
    [count],
  )

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst) return
    const color = new THREE.Color()
    for (let i = 0; i < count; i += 1) {
      const k = seeds[i].kind
      if (k === 0) color.set('#4ee3ff')
      else if (k === 1) color.set('#1c2128')
      else if (k === 2) color.set('#8b949e')
      else if (k === 3) color.set('#2a3038')
      else color.set('#101214')
      inst.setColorAt(i, color)
    }
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  }, [count, seeds])

  useFrame(({ clock }) => {
    const inst = mesh.current
    const g = group.current
    if (!inst || !g) return
    const p = live.progress
    g.visible = inBand(p, bands.explosion[0], bands.explosion[1], 0.04)
    const t = clock.elapsedTime
    const stretch = 1 + Math.min(Math.abs(live.velocity) * 0.012, 1.4)
    const local = remap(p, bands.explosion[0], bands.explosion[1])
    for (let i = 0; i < count; i += 1) {
      const s = seeds[i]
      dummy.position.set(s.x + Math.sin(t * 0.4 + i) * 0.03, s.y, s.z + local * -2)
      dummy.rotation.set(s.rx + t * s.spin * 0.2, s.ry + t * 0.15, t * 0.1)
      dummy.scale.set(s.sx, s.sy, s.sz * stretch)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={group} position={[0, 0, -2]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.45} roughness={0.35} />
      </instancedMesh>
      {quality.tier !== 'low' &&
        [0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0.3, -6 - i * 8]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.85, 0.008, 8, 40]} />
            <meshBasicMaterial color="#4ee3ff" transparent opacity={0.35} />
          </mesh>
        ))}
    </group>
  )
}
