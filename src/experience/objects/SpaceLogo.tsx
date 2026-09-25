import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { remap } from '../../lib/math.ts'
import { live } from '../../store/experience.ts'
import { LogoMark } from './LogoMark.tsx'

export function SpaceLogo() {
  const root = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const stars = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const starCount = 28
  const starSeeds = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => {
        const u = (i + 1) * 1.748
        const v = (i + 3) * 2.193
        const theta = (u % 1) * Math.PI * 2
        const phi = Math.acos(((v % 1) * 2 - 1) * 0.85)
        const r = 0.55 + (u % 0.35)
        return {
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.cos(phi) * 0.45,
          z: r * Math.sin(phi) * Math.sin(theta),
          s: 0.004 + (v % 0.01),
        }
      }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const p = live.progress
    const show = 1 - remap(p, 0.006, 0.024)
    const rootG = root.current
    if (rootG) {
      rootG.visible = show > 0.02
      rootG.position.y = 0.78 + Math.sin(t * 0.55) * 0.02
      rootG.scale.setScalar(0.95 * (0.55 + show * 0.45))
    }
    if (spin.current) spin.current.rotation.y = t * 0.42
    if (ring.current) ring.current.rotation.z = t * -0.08
    const inst = stars.current
    if (inst) {
      for (let i = 0; i < starCount; i += 1) {
        const s = starSeeds[i]
        dummy.position.set(s.x, s.y + Math.sin(t * 0.4 + i) * 0.01, s.z)
        dummy.scale.setScalar(s.s * (0.7 + show * 0.3))
        dummy.updateMatrix()
        inst.setMatrixAt(i, dummy.matrix)
      }
      inst.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={root} position={[0, 0.78, 0.08]} rotation={[0.32, 0.48, 0.06]}>
      <group ref={spin}>
        <LogoMark scale={1.35} />
        <mesh>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshBasicMaterial color="#4ee3ff" transparent opacity={0.1} depthWrite={false} />
        </mesh>
      </group>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.0035, 8, 80]} />
        <meshBasicMaterial color="#4ee3ff" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.8, 0.2, 0.4]}>
        <torusGeometry args={[0.62, 0.002, 8, 80]} />
        <meshBasicMaterial color="#4ee3ff" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <instancedMesh ref={stars} args={[undefined, undefined, starCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#c9f7ff" transparent opacity={0.28} depthWrite={false} />
      </instancedMesh>
      <pointLight color="#4ee3ff" intensity={0.45} distance={3.2} decay={2} />
    </group>
  )
}
