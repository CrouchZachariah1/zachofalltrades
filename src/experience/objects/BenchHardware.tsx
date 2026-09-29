import { useMemo } from 'react'
import * as THREE from 'three'
import { palette } from '../../config/palette.ts'
import { inspect } from '../../lib/actions.ts'
import { makeSiteScreen } from '../../lib/textures.ts'
import { Hit } from './Hit.tsx'
import { LabelSprite } from './LabelSprite.tsx'

export function BenchHardware() {
  const site = useMemo(() => makeSiteScreen(), [])
  const cable = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, 0.03, 0.2),
      new THREE.Vector3(0.34, 0.018, 0.26),
      new THREE.Vector3(0.18, 0.012, 0.16),
      new THREE.Vector3(0.08, 0.02, 0.08),
    ])
    return new THREE.TubeGeometry(curve, 24, 0.0042, 6, false)
  }, [])

  return (
    <group>
      <Hit
        label="NETWORK INFRASTRUCTURE"
        status="NETWORK LINK ACTIVE"
        onSelect={() =>
          inspect({
            title: 'Network infrastructure',
            body: 'Routing, wireless, and the quiet links that keep every machine on the same page.',
            service: 'Other',
            progress: 0.57,
            status: 'NETWORK LINK ACTIVE',
          })
        }
      >
        <Router />
      </Hit>

      <Hit
        label="WEB DEVELOPMENT"
        status="SYSTEM ONLINE"
        onSelect={() =>
          inspect({
            title: 'Web development',
            body: 'Professional websites from R2,500. Quoted around the pages and features you need.',
            service: 'Website Development',
            progress: 0.4,
            status: 'SYSTEM ONLINE',
          })
        }
      >
        <Laptop map={site} />
      </Hit>

      <mesh geometry={cable}>
        <meshStandardMaterial color="#1a1d22" roughness={0.62} />
      </mesh>
      <mesh position={[-0.72, 0.018, 0.3]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.05, 0.01, 0.024]} />
        <meshStandardMaterial color="#121417" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[-0.72, 0.026, 0.3]} rotation={[-1.15, 0.3, 0]}>
        <boxGeometry args={[0.048, 0.08, 0.004]} />
        <meshStandardMaterial
          color="#0b0d11"
          emissive={palette.accent}
          emissiveIntensity={0.08}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      <LabelSprite
        text="CONNECTED DEVICES"
        position={[-0.72, 0.14, 0.3]}
        scale={[0.32, 0.07, 1]}
        color="#8b919a"
      />
      <LabelSprite
        text="NETWORK LINK ACTIVE"
        position={[0.62, 0.16, 0.2]}
        scale={[0.36, 0.075, 1]}
        color={palette.accent}
      />
    </group>
  )
}

function Router() {
  return (
    <group position={[0.62, 0.04, 0.2]}>
      <mesh>
        <boxGeometry args={[0.16, 0.032, 0.11]} />
        <meshStandardMaterial color="#1a1e24" metalness={0.55} roughness={0.38} />
      </mesh>
      {[-0.04, 0, 0.04].map((x) => (
        <mesh key={x} position={[x, 0.05, -0.03]} rotation={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.0024, 0.0024, 0.09, 6]} />
          <meshStandardMaterial color="#2a3038" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {[-0.05, -0.02, 0.01, 0.04].map((x) => (
        <mesh key={x} position={[x, 0.005, 0.056]}>
          <boxGeometry args={[0.012, 0.006, 0.004]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.accent}
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
      <pointLight position={[0, 0.04, 0.08]} color={palette.accent} distance={0.55} intensity={0.16} />
    </group>
  )
}

function Laptop({ map }: { map: THREE.CanvasTexture }) {
  return (
    <group position={[-0.58, 0.02, 0.14]} rotation={[0, 0.35, 0]}>
      <mesh>
        <boxGeometry args={[0.28, 0.01, 0.18]} />
        <meshStandardMaterial color="#16191e" metalness={0.6} roughness={0.32} />
      </mesh>
      <group position={[0, 0.09, -0.08]} rotation={[-0.38, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.28, 0.17, 0.008]} />
          <meshStandardMaterial color="#101318" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.25, 0.15]} />
          <meshStandardMaterial
            map={map}
            emissive={palette.accent}
            emissiveIntensity={0.16}
            toneMapped={false}
          />
        </mesh>
      </group>
      <pointLight position={[0, 0.1, 0.04]} color="#cfe4f4" distance={0.7} intensity={0.22} />
    </group>
  )
}
