import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { hash } from '../../lib/math.ts'
import type { Quality } from '../../lib/quality.ts'
import { live } from '../../store/experience.ts'

export function Dust({ quality }: { quality: Quality }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = quality.particles
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (hash(i + 1) - 0.5) * 28,
        y: hash(i + 9) * 8 - 1,
        z: (hash(i + 21) - 0.5) * 40,
        s: 0.008 + hash(i + 33) * 0.02,
        ph: hash(i + 44) * Math.PI * 2,
      })),
    [count],
  )

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst) return
    const color = new THREE.Color()
    for (let i = 0; i < count; i += 1) {
      color.setHSL(0.55, 0.08, 0.55 + hash(i + 2) * 0.25)
      inst.setColorAt(i, color)
    }
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  }, [count])

  useFrame(({ clock, camera }) => {
    const inst = mesh.current
    if (!inst) return
    const t = clock.elapsedTime
    const p = live.progress
    const space = p > 0.7 ? 1 : 0
    const vel = Math.min(Math.abs(live.velocity) * 0.02, 1.2)
    for (let i = 0; i < count; i += 1) {
      const s = seeds[i]
      dummy.position.set(
        s.x + Math.sin(t * 0.15 + s.ph) * 0.4 + live.pointer.x * 0.35,
        s.y + Math.cos(t * 0.12 + s.ph) * 0.25 + space * 2,
        camera.position.z + s.z * (0.35 + space * 0.8) - vel * 2,
      )
      const sc = s.s * (1 + vel * 0.8)
      dummy.scale.setScalar(sc)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.22} depthWrite={false} />
    </instancedMesh>
  )
}
