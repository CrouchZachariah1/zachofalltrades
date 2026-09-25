import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import type { Group, InstancedMesh } from 'three'
import { DoubleSide, Object3D } from 'three'

type Props = {
  radius?: number
  speed?: number
  color?: string
  intensity?: number
  blades?: number
}

export function Fan({
  radius = 0.028,
  speed = 10,
  color = '#4ee3ff',
  intensity = 1,
  blades = 9,
}: Props) {
  const spin = useRef<Group>(null)
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst) return
    for (let i = 0; i < blades; i += 1) {
      const a = (i / blades) * Math.PI * 2
      dummy.position.set(Math.cos(a) * radius * 0.4, Math.sin(a) * radius * 0.4, 0)
      dummy.rotation.set(0.18, 0, a + 0.35)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
  }, [blades, dummy, radius])

  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.z += dt * speed * (0.35 + intensity)
  })

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius + 0.0024, radius + 0.0024, 0.007, 28, 1, true]} />
        <meshStandardMaterial color="#12141a" metalness={0.7} roughness={0.32} side={DoubleSide} />
      </mesh>
      <mesh>
        <torusGeometry args={[radius, 0.0016, 8, 28]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.1 * intensity}
          roughness={0.25}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 0.62, 0.0007, 6, 24]} />
        <meshStandardMaterial color="#2a3038" metalness={0.8} roughness={0.25} />
      </mesh>
      <group ref={spin}>
        <instancedMesh ref={mesh} args={[undefined, undefined, blades]}>
          <boxGeometry args={[radius * 0.62, 0.0046, 0.0009]} />
          <meshStandardMaterial color="#1c2028" metalness={0.65} roughness={0.28} />
        </instancedMesh>
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.14, radius * 0.18, 0.007, 16]} />
        <meshStandardMaterial color="#0a0b0e" metalness={0.85} roughness={0.22} />
      </mesh>
    </group>
  )
}
