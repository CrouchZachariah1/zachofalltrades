import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { Object3D } from 'three'
import type * as THREE from 'three'
import { inspect } from '../../lib/actions.ts'
import { PartTag } from '../objects/PartTag.tsx'

type Props = {
  maps: { mb: THREE.CanvasTexture }
  groupRef: RefObject<THREE.Group | null>
  detail: boolean
}

export function Motherboard({ maps, groupRef, detail }: Props) {
  const capMesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const capCount = detail ? 36 : 12

  useLayoutEffect(() => {
    const inst = capMesh.current
    if (!inst) return
    for (let i = 0; i < capCount; i += 1) {
      const col = i % 6
      const row = Math.floor(i / 6)
      dummy.position.set(0.012, -0.08 + row * 0.028, -0.11 + col * 0.028)
      dummy.rotation.set(0, 0, Math.PI / 2)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
  }, [capCount, dummy])

  return (
    <group ref={groupRef} position={[-0.09, 0.268, 0.02]}>
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation()
          inspect({
            title: 'MOTHERBOARD',
            body: 'The ATX board everything else hangs off — socket, DIMMs, PCIe, power.',
            service: 'PC Build',
            progress: 0.1,
          })
        }}
      >
        <boxGeometry args={[0.3, 0.244, 0.003]} />
        <meshStandardMaterial map={maps.mb} roughness={0.52} metalness={0.12} />
      </mesh>

      <mesh position={[0.014, 0.04, 0.04]}>
        <boxGeometry args={[0.004, 0.05, 0.05]} />
        <meshStandardMaterial color="#1c2228" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh
        position={[0.02, 0.04, 0.04]}
        onClick={(e) => {
          e.stopPropagation()
          inspect({
            title: 'CPU',
            body: 'The processor on the socket, under the cooler.',
            service: 'PC Build',
            progress: 0.1,
          })
        }}
      >
        <boxGeometry args={[0.008, 0.038, 0.038]} />
        <meshStandardMaterial color="#c5ccd4" metalness={0.95} roughness={0.16} />
      </mesh>
      <PartTag
        label="MOTHERBOARD"
        body="The ATX board everything else hangs off — socket, DIMMs, PCIe, power."
        service="PC Build"
        progress={0.1}
        offset={[0.22, 0.14, 0.16]}
      />
      <PartTag
        label="CPU"
        body="The processor on the socket, under the cooler."
        service="PC Build"
        progress={0.1}
        offset={[0.22, 0.1, 0.06]}
      />

      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[0.012, 0.07, -0.07 + i * 0.016]}>
          <mesh>
            <boxGeometry args={[0.012, 0.128, 0.007]} />
            <meshStandardMaterial color="#14161c" roughness={0.42} />
          </mesh>
          <mesh position={[0.007, 0, 0]}>
            <boxGeometry args={[0.002, 0.12, 0.005]} />
            <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.22} />
          </mesh>
        </group>
      ))}

      <mesh position={[0.014, -0.068, 0.02]}>
        <boxGeometry args={[0.014, 0.012, 0.2]} />
        <meshStandardMaterial color="#101218" roughness={0.4} />
      </mesh>
      <mesh position={[0.022, -0.068, 0.02]}>
        <boxGeometry args={[0.003, 0.008, 0.19]} />
        <meshStandardMaterial color="#c9a227" metalness={0.92} roughness={0.2} />
      </mesh>

      <mesh position={[0.02, 0.02, 0.132]}>
        <boxGeometry args={[0.016, 0.05, 0.014]} />
        <meshStandardMaterial color="#f0f0ee" roughness={0.48} />
      </mesh>
      <mesh position={[0.02, 0.09, -0.128]}>
        <boxGeometry args={[0.016, 0.026, 0.014]} />
        <meshStandardMaterial color="#111" roughness={0.42} />
      </mesh>

      <mesh position={[0.018, 0.04, 0.155]}>
        <boxGeometry args={[0.03, 0.15, 0.008]} />
        <meshStandardMaterial color="#1a1d22" metalness={0.65} roughness={0.32} />
      </mesh>
      {[-0.05, -0.02, 0.01, 0.04, 0.06].map((y, i) => (
        <mesh key={y} position={[0.03, y, 0.155]}>
          <boxGeometry args={[0.012, 0.012, 0.01]} />
          <meshStandardMaterial color={i % 2 ? '#4aa3ff' : '#222'} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}

      {[-0.02, 0.01, 0.04].map((y) => (
        <mesh key={y} position={[0.02, y, -0.1]}>
          <boxGeometry args={[0.018, 0.022, 0.036]} />
          <meshStandardMaterial color="#8b949e" metalness={0.9} roughness={0.22} />
        </mesh>
      ))}

      <mesh position={[0.018, -0.02, 0.08]}>
        <boxGeometry args={[0.012, 0.026, 0.03]} />
        <meshStandardMaterial color="#6d767f" metalness={0.85} roughness={0.24} />
      </mesh>

      <mesh position={[0.016, -0.1, 0.03]}>
        <boxGeometry args={[0.006, 0.022, 0.08]} />
        <meshStandardMaterial color="#0c3a28" roughness={0.5} />
      </mesh>
      <mesh position={[0.02, -0.1, 0.03]}>
        <boxGeometry args={[0.004, 0.018, 0.072]} />
        <meshStandardMaterial color="#9aa3ae" metalness={0.88} roughness={0.2} />
      </mesh>

      {detail &&
        [0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0.02, -0.09 + i * 0.012, 0.12]}>
            <boxGeometry args={[0.01, 0.01, 0.016]} />
            <meshStandardMaterial color="#c41e3a" roughness={0.4} />
          </mesh>
        ))}

      <mesh position={[0.016, -0.04, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.003, 16]} />
        <meshStandardMaterial color="#c9a227" metalness={0.85} roughness={0.25} />
      </mesh>

      <instancedMesh ref={capMesh} args={[undefined, undefined, capCount]}>
        <cylinderGeometry args={[0.0026, 0.0026, 0.008, 8]} />
        <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.24} />
      </instancedMesh>
    </group>
  )
}
