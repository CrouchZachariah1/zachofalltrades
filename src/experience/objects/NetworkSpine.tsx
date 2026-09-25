import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { palette } from '../../config/palette.ts'
import { world } from '../../config/scenes.ts'
import type { Quality } from '../../lib/quality.ts'
import { networkFrag, networkVert } from '../materials/shaders.ts'

type Props = {
  quality: Quality
}

const hub: [number, number, number][] = [
  [0.62, 0.05, 0.18],
  [0.22, 0.03, 0.1],
  [0.0, 0.2, 0.0],
  [-0.58, 0.07, 0.12],
  [1.15, 0.28, -1.15],
  [1.85, 0.72, -2.7],
  [2.38, 0.95, -3.85],
  [2.7, 1.15, -5.4],
  [0.8, 0.55, -9],
  [0.15, 0.4, -18],
  [0.0, 0.32, world.repair[2]],
  [0.6, 1.0, -90],
  [0.0, 1.38, world.website[2]],
  [0.0, 1.2, world.code[2]],
  [0.0, 1.1, world.consult[2]],
  [0.0, 0.4, world.os[2]],
  [0.0, 0.2, world.planet[2]],
  [0.0, 0.15, world.universe[2]],
  [0.0, 0.22, world.cta[2]],
]

const offshoots: [[number, number, number], [number, number, number]][] = [
  [
    [2.7, 1.15, -5.4],
    [4.6, 1.7, -11],
  ],
  [
    [2.38, 0.95, -3.85],
    [3.8, 0.4, -6.5],
  ],
  [
    [-0.58, 0.07, 0.12],
    [-2.4, 0.6, -4.8],
  ],
  [
    [-2.55, 0.9, -5.7],
    [-4.8, 0.35, -14],
  ],
  [
    [0.0, 0.32, world.repair[2]],
    [2.2, 1.4, world.repair[2] - 8],
  ],
  [
    [0.0, 1.38, world.website[2]],
    [3.4, 2.2, world.website[2] - 12],
  ],
  [
    [0.0, 1.1, world.consult[2]],
    [-3.2, 1.8, world.consult[2] - 6],
  ],
]

export function NetworkSpine({ quality }: Props) {
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const { lineGeo, nodeCount } = useMemo(() => {
    const pairs: [[number, number, number], [number, number, number]][] = []
    for (let i = 0; i < hub.length - 1; i += 1) pairs.push([hub[i], hub[i + 1]])
    const extra = quality.tier === 'low' ? offshoots.slice(0, 2) : offshoots
    extra.forEach((p) => pairs.push(p))
    if (quality.tier !== 'low') {
      pairs.push([hub[0], hub[3]])
      pairs.push([hub[2], hub[6]])
    }

    const pos: number[] = []
    const aT: number[] = []
    pairs.forEach((pair, e) => {
      pos.push(...pair[0], ...pair[1])
      aT.push(e * 0.13, e * 0.13 + 1)
    })
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    lineGeo.setAttribute('aT', new THREE.Float32BufferAttribute(aT, 1))
    return { lineGeo, nodeCount: quality.tier === 'low' ? 8 : hub.length }
  }, [quality.tier])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(palette.accent) },
      uAlpha: { value: 0.85 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
    const inst = nodesRef.current
    if (!inst) return
    for (let i = 0; i < nodeCount; i += 1) {
      const p = hub[i]
      dummy.position.set(p[0], p[1], p[2])
      dummy.scale.setScalar(0.012 + (i % 4 === 0 ? 0.01 : 0))
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={networkVert}
          fragmentShader={networkFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.55} depthWrite={false} />
      </instancedMesh>
    </group>
  )
}
