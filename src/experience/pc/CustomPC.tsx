import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { inspect } from '../../lib/actions.ts'
import { remap } from '../../lib/math.ts'
import type { Quality } from '../../lib/quality.ts'
import {
  makeBrushedMetal,
  makeCarbonTexture,
  makeGpuShroudTexture,
  makeMotherboardTexture,
  makeScreenTexture,
} from '../../lib/textures.ts'
import { live } from '../../store/experience.ts'
import { useMountRange } from '../hooks/useMountRange.ts'
import { Hit } from '../objects/Hit.tsx'
import { LabelSprite } from '../objects/LabelSprite.tsx'
import { PartTag } from '../objects/PartTag.tsx'
import { Fan } from './Fan.tsx'
import { Motherboard } from './Motherboard.tsx'

const W = 0.2
const H = 0.46
const D = 0.42

type Variant = 'hero' | 'repair'

type Props = {
  quality: Quality
  variant?: Variant
}

export function CustomPC({ quality, variant = 'hero' }: Props) {
  const root = useRef<THREE.Group>(null)
  const glass = useRef<THREE.Group>(null)
  const gpu = useRef<THREE.Group>(null)
  const ram = useRef<THREE.Group>(null)
  const cooler = useRef<THREE.Group>(null)
  const mb = useRef<THREE.Group>(null)
  const psu = useRef<THREE.Group>(null)
  const ssd = useRef<THREE.Group>(null)
  const rgb = useRef<THREE.MeshStandardMaterial[]>([])
  const lcdMat = useRef<THREE.MeshStandardMaterial>(null)
  const errorLabel = useRef<THREE.Group>(null)
  const ramGlow = useRef<THREE.MeshStandardMaterial>(null)
  const state = useRef({
    explode: 0,
    panel: 0,
    power: 0.35,
    highlight: '' as string,
    flicker: 0,
  })

  const maps = useMemo(
    () => ({
      mb: makeMotherboardTexture(),
      carbon: makeCarbonTexture(),
      metal: makeBrushedMetal(),
      gpu: makeGpuShroudTexture(),
      lcdIdle: makeScreenTexture('idle'),
      lcdError: makeScreenTexture('error'),
      lcdOn: makeScreenTexture('on'),
    }),
    [],
  )

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#8aa4b0',
        transparent: true,
        opacity: 0.11,
        roughness: 0.06,
        metalness: 0,
        depthWrite: false,
        envMapIntensity: 0.7,
      }),
    [],
  )

  useFrame((clockState, dt) => {
    const p = live.progress
    if (variant === 'hero' && p >= 0.275) return
    const s = state.current
    if (variant === 'hero') {
      if (p < 0.28) {
        s.panel = remap(p, 0.075, 0.105, 0, 1)
        const out = remap(p, 0.108, 0.145, 0, 1)
        const back = 1 - remap(p, 0.172, 0.198, 0, 1)
        s.explode = out * back
        s.power = remap(p, 0.0, 0.04, 0.2, 0.7)
        s.highlight = ''
        s.flicker = 0
        live.pcLabels = s.panel * (1 - remap(p, 0.175, 0.205, 0, 1))
      } else if (p > 0.89) {
        s.panel = 0
        s.explode = 0
        s.power = remap(p, 0.92, 0.975, 0.4, 1.1)
        s.highlight = ''
        s.flicker = 0
        live.pcLabels = 0
      } else {
        s.power = 0.3
        live.pcLabels = 0
      }
    } else {
      s.panel = remap(p, 0.345, 0.365, 1, 0.2)
      s.explode = 0
      s.power = 0.5
      s.flicker = p < 0.345 ? 1 : remap(p, 0.345, 0.365, 1, 0)
      s.highlight = p > 0.318 && p < 0.35 ? 'ram' : ''
      live.pcLabels = 0
    }

    const e = s.explode
    const board = remap(live.progress, 0.1, 0.128, 0, 1) * (1 - remap(live.progress, 0.168, 0.198, 0, 1))
    if (gpu.current) gpu.current.position.set(0.01 + 0.1 * e, 0.188, 0.025)
    if (ram.current) ram.current.position.set(-0.072 + 0.04 * e, 0.338 + 0.045 * e, -0.07)
    if (cooler.current) cooler.current.position.set(-0.05 + 0.03 * e, 0.318 + 0.05 * e, 0.04)
    if (mb.current) {
      mb.current.position.set(-0.09 + 0.11 * board, 0.268, 0.02)
      mb.current.rotation.set(0, 0, 0)
    }
    if (psu.current) psu.current.position.set(0.01, 0.048, 0.06)
    if (ssd.current) ssd.current.position.set(-0.07 + 0.05 * e, 0.168, 0.05)
    if (glass.current) glass.current.rotation.y = -s.panel * 2.05
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        live.pointer.x * 0.04 * (variant === 'hero' ? 1 : 0.3),
        3,
        dt,
      )
    }

    const pulse = 0.75 + 0.25 * Math.sin(clockState.clock.elapsedTime * 1.6)
    rgb.current.forEach((m) => {
      m.emissiveIntensity = s.power * pulse * 0.55
    })
    if (lcdMat.current) {
      const blink = s.flicker ? (Math.sin(clockState.clock.elapsedTime * 16) > 0.2 ? 1 : 0.2) : 1
      lcdMat.current.emissiveIntensity = 0.4 * blink
      lcdMat.current.map =
        variant === 'repair' && s.flicker > 0.4
          ? maps.lcdError
          : s.power > 0.95
            ? maps.lcdOn
            : maps.lcdIdle
      lcdMat.current.needsUpdate = true
    }
    if (errorLabel.current) errorLabel.current.visible = variant === 'repair' && s.highlight === 'ram'
    if (ramGlow.current) {
      ramGlow.current.emissive.set(s.highlight === 'ram' ? '#ff5a4a' : '#000000')
      ramGlow.current.emissiveIntensity = s.highlight === 'ram' ? 1.6 : 0
    }
  })

  const pushRgb = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !rgb.current.includes(m)) rgb.current.push(m)
  }

  const detail = quality.tier !== 'low'

  return (
    <group ref={root}>
      <pointLight position={[0.12, 0.28, 0.05]} color="#cfe4ff" distance={0.9} intensity={0.28} />
      <Hit
        label="CUSTOM BUILD"
        status="SYSTEM ONLINE"
        onSelect={() =>
          inspect({
            title: 'Custom build',
            body: 'A machine specified around your software, budget and space — assembled on the bench, not pulled off a shelf.',
            service: 'PC Build',
            progress: 0.1,
            status: 'SYSTEM ONLINE',
          })
        }
      >
        <Case metal={maps.metal} />
      </Hit>

      <group ref={glass} position={[W / 2, H / 2, D / 2]}>
        <mesh position={[0.001, 0, -D / 2]}>
          <boxGeometry args={[0.005, H - 0.03, D - 0.03]} />
          <meshStandardMaterial color="#0b0d12" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.005, 0, -D / 2]} material={glassMat}>
          <boxGeometry args={[0.0025, H - 0.05, D - 0.05]} />
        </mesh>
      </group>

      <group>
        <Motherboard maps={{ mb: maps.mb }} groupRef={mb} detail={detail} />
      </group>

      <Hit
        label="COOLING"
        status="PERFORMANCE OPTIMISED"
        onSelect={() =>
          inspect({
            title: 'COOLING',
            body: 'Dual-tower air cooler on the CPU. Heat is what kills a quiet, stable machine.',
            service: 'PC Upgrade',
            progress: 0.16,
            status: 'PERFORMANCE OPTIMISED',
          })
        }
      >
        <Cooler groupRef={cooler} detail={detail} />
      </Hit>

      <Hit
        label="MEMORY"
        status="HARDWARE CONFIGURED"
        onSelect={() =>
          inspect({
            title: 'MEMORY',
            body: 'Four DIMMs seated in the board. Often the cheapest way a slow PC starts feeling new.',
            service: 'PC Upgrade',
            progress: 0.16,
            status: 'HARDWARE CONFIGURED',
          })
        }
      >
        <RamBank maps={maps} groupRef={ram} ramGlow={ramGlow} pushRgb={pushRgb} />
      </Hit>

      <Hit
        label="GPU"
        status="DEVICE DETECTED"
        onSelect={() =>
          inspect({
            title: 'GPU',
            body: 'Graphics card in the PCIe slot, fans facing the glass.',
            service: 'PC Build',
            progress: 0.1,
            status: 'DEVICE DETECTED',
          })
        }
      >
        <Gpu maps={maps} groupRef={gpu} pushRgb={pushRgb} detail={detail} />
      </Hit>

      <Hit
        label="STORAGE"
        status="DEVICE DETECTED"
        onSelect={() =>
          inspect({
            title: 'STORAGE',
            body: 'M.2 SSD on the board, under a small heatsink.',
            service: 'PC Upgrade',
            progress: 0.16,
            status: 'DEVICE DETECTED',
          })
        }
      >
        <group ref={ssd} position={[-0.07, 0.168, 0.05]}>
          <mesh>
            <boxGeometry args={[0.016, 0.006, 0.08]} />
            <meshStandardMaterial color="#2a3038" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.003, 0.004, 0]}>
            <boxGeometry args={[0.012, 0.003, 0.07]} />
            <meshStandardMaterial color="#8e98a6" metalness={0.9} roughness={0.2} />
          </mesh>
          <PartTag
            label="STORAGE"
            body="M.2 SSD on the board, under a small heatsink."
            service="PC Upgrade"
            progress={0.16}
            offset={[0.26, -0.05, 0.1]}
          />
        </group>
      </Hit>

      <Hit
        label="POWER"
        status="SYSTEM ONLINE"
        onSelect={() =>
          inspect({
            title: 'POWER',
            body: 'Power supply in the bottom of the chassis, under the shroud.',
            service: 'PC Build',
            progress: 0.1,
            status: 'SYSTEM ONLINE',
          })
        }
      >
        <group ref={psu} position={[0.01, 0.048, 0.06]}>
          <RoundedBox args={[0.17, 0.072, 0.16]} radius={0.005} smoothness={3}>
            <meshStandardMaterial map={maps.metal} color="#14171c" metalness={0.65} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0.038, 0]}>
            <boxGeometry args={[W - 0.03, 0.004, D - 0.08]} />
            <meshStandardMaterial color="#12151a" metalness={0.5} roughness={0.45} />
          </mesh>
          <PartTag
            label="POWER"
            body="Power supply in the bottom of the chassis, under the shroud."
            service="PC Build"
            progress={0.1}
            offset={[0.24, -0.06, 0.14]}
          />
        </group>
      </Hit>

      {detail && <Cables />}

      <group position={[0, 0.22, -D / 2 + 0.016]}>
        {[-0.11, 0.02, 0.13].map((y) => (
          <group key={y} position={[0, y, 0]}>
            <Fan radius={0.038} speed={7.5} color="#3ec6e8" intensity={0.55} />
          </group>
        ))}
      </group>
      <group position={[0, 0.28, D / 2 - 0.016]}>
        <Fan radius={0.036} speed={9} color="#3ec6e8" intensity={0.45} />
      </group>

      <mesh position={[W / 2 - 0.012, 0.34, -0.14]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.07, 0.04]} />
        <meshStandardMaterial
          ref={lcdMat}
          map={maps.lcdIdle}
          emissive="#4ee3ff"
          emissiveIntensity={0.35}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[-0.06, 0.22, 0]}>
        <boxGeometry args={[0.002, 0.28, 0.003]} />
        <meshStandardMaterial color="#3ec6e8" emissive="#3ec6e8" emissiveIntensity={0.4} ref={pushRgb} />
      </mesh>

      <group ref={errorLabel} visible={false}>
        <LabelSprite
          text="MEMORY ERROR"
          position={[0.18, 0.4, -0.05]}
          color="#ff5a4a"
          scale={[0.22, 0.05, 1]}
        />
      </group>
    </group>
  )
}

function Case({ metal }: { metal: THREE.CanvasTexture }) {
  const t = 0.012
  return (
    <group>
      <mesh position={[-W / 2 + t / 2, H / 2, 0]}>
        <boxGeometry args={[t, H, D]} />
        <meshStandardMaterial map={metal} color="#1a1e26" metalness={0.72} roughness={0.32} />
      </mesh>
      <mesh position={[0, H - t / 2, 0]}>
        <boxGeometry args={[W, t, D]} />
        <meshStandardMaterial map={metal} color="#1a1e26" metalness={0.72} roughness={0.32} />
      </mesh>
      <mesh position={[0, t / 2, 0]}>
        <boxGeometry args={[W, t, D]} />
        <meshStandardMaterial color="#0a0b0f" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, H / 2, D / 2 - t / 2]}>
        <boxGeometry args={[W, H, t]} />
        <meshStandardMaterial map={metal} color="#181c24" metalness={0.7} roughness={0.34} />
      </mesh>
      <mesh position={[0, H / 2, -D / 2 + 0.008]}>
        <boxGeometry args={[W - 0.02, H - 0.02, 0.014]} />
        <meshStandardMaterial color="#0c0e12" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.026, -D / 2 + 0.016]}>
        <cylinderGeometry args={[0.008, 0.008, 0.006, 16]} />
        <meshStandardMaterial color="#3ec6e8" emissive="#3ec6e8" emissiveIntensity={0.7} />
      </mesh>
      {[
        [-0.07, 0.006, -0.17],
        [0.07, 0.006, -0.17],
        [-0.07, 0.006, 0.17],
        [0.07, 0.006, 0.17],
      ].map((pos) => (
        <mesh key={pos.join(',')} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.01, 0.012, 0.01, 10]} />
          <meshStandardMaterial color="#12151a" />
        </mesh>
      ))}
    </group>
  )
}

function Cooler({
  groupRef,
  detail,
}: {
  groupRef: RefObject<THREE.Group | null>
  detail: boolean
}) {
  const fins = detail ? 10 : 5
  return (
    <group ref={groupRef} position={[-0.05, 0.318, 0.04]}>
      {[-0.022, 0.022].map((z) => (
        <group key={z} position={[0, 0, z]}>
          {Array.from({ length: fins }, (_, i) => (
            <mesh key={i} position={[0, -0.034 + i * 0.0075, 0]}>
              <boxGeometry args={[0.05, 0.0014, 0.02]} />
              <meshStandardMaterial color="#8b949e" metalness={0.88} roughness={0.24} />
            </mesh>
          ))}
        </group>
      ))}
      {[-0.012, 0.012].map((x) => (
        <mesh key={x} position={[x, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.0028, 0.0028, 0.055, 8]} />
          <meshStandardMaterial color="#b87333" metalness={1} roughness={0.18} />
        </mesh>
      ))}
      <group rotation={[0, Math.PI / 2, 0]} position={[0.028, 0, 0]}>
        <Fan radius={0.03} speed={8} intensity={0.6} color="#3ec6e8" />
      </group>
      <PartTag
        label="COOLING"
        body="Dual-tower air cooler on the CPU. Heat is what kills a quiet, stable machine."
        service="PC Upgrade"
        progress={0.16}
        offset={[0.26, 0.12, 0.02]}
      />
    </group>
  )
}

function RamBank({
  maps,
  groupRef,
  ramGlow,
  pushRgb,
}: {
  maps: { carbon: THREE.CanvasTexture }
  groupRef: RefObject<THREE.Group | null>
  ramGlow: RefObject<THREE.MeshStandardMaterial | null>
  pushRgb: (m: THREE.MeshStandardMaterial | null) => void
}) {
  return (
    <group ref={groupRef} position={[-0.072, 0.338, -0.07]}>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[0, 0, i * 0.016]}>
          <mesh>
            <boxGeometry args={[0.002, 0.12, 0.01]} />
            <meshStandardMaterial color="#0c3d2a" roughness={0.5} />
          </mesh>
          <mesh position={[0.005, 0, 0]}>
            <boxGeometry args={[0.007, 0.125, 0.012]} />
            <meshStandardMaterial
              ref={i === 0 ? ramGlow : undefined}
              color="#12151a"
              map={maps.carbon}
              roughness={0.38}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[0.005, 0.064, 0]}>
            <boxGeometry args={[0.008, 0.003, 0.012]} />
            <meshStandardMaterial
              color="#3ec6e8"
              emissive="#3ec6e8"
              emissiveIntensity={0.5}
              ref={pushRgb}
            />
          </mesh>
        </group>
      ))}
      <PartTag
        label="MEMORY"
        body="Four DIMMs seated in the board. Often the cheapest way a slow PC starts feeling new."
        service="PC Upgrade"
        progress={0.16}
        offset={[0.28, 0.1, -0.1]}
      />
    </group>
  )
}

function Gpu({
  maps,
  groupRef,
  pushRgb,
  detail,
}: {
  maps: { gpu: THREE.CanvasTexture }
  groupRef: RefObject<THREE.Group | null>
  pushRgb: (m: THREE.MeshStandardMaterial | null) => void
  detail: boolean
}) {
  return (
    <group ref={groupRef} position={[0.01, 0.188, 0.025]}>
      <RoundedBox args={[0.11, 0.04, 0.27]} radius={0.004} smoothness={3}>
        <meshStandardMaterial map={maps.gpu} color="#14161c" metalness={0.5} roughness={0.36} />
      </RoundedBox>
      <mesh position={[-0.052, 0, 0]}>
        <boxGeometry args={[0.004, 0.036, 0.265]} />
        <meshStandardMaterial color="#1a1e26" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[-0.07, -0.01, 0.01]}>
        <boxGeometry args={[0.03, 0.014, 0.18]} />
        <meshStandardMaterial color="#0c3a28" roughness={0.48} />
      </mesh>
      <mesh position={[-0.086, -0.01, 0.01]}>
        <boxGeometry args={[0.003, 0.01, 0.17]} />
        <meshStandardMaterial color="#c9a227" metalness={0.95} roughness={0.18} />
      </mesh>
      {[-0.08, 0, 0.08].map((z) => (
        <group key={z} position={[0.056, 0.002, z]} rotation={[0, Math.PI / 2, 0]}>
          <Fan radius={0.025} speed={12} color="#3ec6e8" intensity={0.7} />
        </group>
      ))}
      {detail && (
        <mesh position={[-0.055, 0, 0.138]}>
          <boxGeometry args={[0.006, 0.028, 0.014]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      )}
      <mesh position={[0.052, 0, 0]}>
        <boxGeometry args={[0.002, 0.004, 0.24]} />
        <meshStandardMaterial color="#3ec6e8" emissive="#3ec6e8" emissiveIntensity={0.45} ref={pushRgb} />
      </mesh>
      <PartTag
        label="GPU"
        body="Graphics card in the PCIe slot, fans facing the glass."
        service="PC Build"
        progress={0.1}
        offset={[0.28, 0.02, 0.16]}
      />
    </group>
  )
}

function Cables() {
  const geos = useMemo(() => {
    const mk = (pts: [number, number, number][], r: number) => {
      const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)))
      return new THREE.TubeGeometry(curve, 16, r, 5, false)
    }
    return [
      mk(
        [
          [-0.07, 0.09, 0.12],
          [-0.04, 0.12, 0.1],
          [0.0, 0.17, 0.08],
        ],
        0.003,
      ),
      mk(
        [
          [-0.07, 0.09, -0.1],
          [-0.05, 0.2, -0.11],
          [-0.07, 0.3, -0.12],
        ],
        0.0034,
      ),
    ]
  }, [])
  return (
    <group>
      {geos.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial color="#1a1d24" roughness={0.55} />
        </mesh>
      ))}
    </group>
  )
}

export function JourneyPC({ quality }: { quality: Quality }) {
  const mounted = useMountRange(0, 0.275, 0.04)
  if (!mounted) return null
  return <CustomPC quality={quality} variant="hero" />
}
