import { AdaptiveDpr, Environment, Lightformer, Preload } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { degradeQuality, type Quality } from '../lib/quality.ts'
import { live, useExperience } from '../store/experience.ts'
import { CameraRig } from './CameraRig.tsx'
import { Dust } from './particles/Dust.tsx'
import { PostFX } from './PostFX.tsx'
import { CodeWorld } from './scenes/CodeWorld.tsx'
import { ConsultingNetwork } from './scenes/ConsultingNetwork.tsx'
import { DigitalCity } from './scenes/DigitalCity.tsx'
import { ExplosionTunnel } from './scenes/ExplosionTunnel.tsx'
import { HardwarePlanet } from './scenes/HardwarePlanet.tsx'
import { OsDesktop } from './scenes/OsDesktop.tsx'
import { RepairLab } from './scenes/RepairLab.tsx'
import { ServiceUniverse } from './scenes/ServiceUniverse.tsx'
import { JourneyPC } from './pc/CustomPC.tsx'
import { SpaceLogo } from './objects/SpaceLogo.tsx'
import { Workshop } from './scenes/Workshop.tsx'
import { NetworkSpine } from './objects/NetworkSpine.tsx'

type Props = {
  quality: Quality
  onQuality: (next: Quality) => void
}

export function Experience({ quality, onQuality }: Props) {
  return (
    <>
      <CameraRig quality={quality} />
      <Environment resolution={quality.tier === 'high' ? 256 : 128} environmentIntensity={0.12}>
        <Lightformer intensity={0.95} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.28} position={[3.5, 1.4, 2]} scale={[2, 3, 1]} color="#d7e8ff" />
        <Lightformer intensity={0.1} position={[-2.5, 1, -1.5]} scale={[2, 2, 1]} color="#4ee3ff" />
      </Environment>
      <Workshop quality={quality} />
      <NetworkSpine quality={quality} />
      <SpaceLogo />
      <JourneyPC quality={quality} />
      <ExplosionTunnel quality={quality} />
      <RepairLab quality={quality} />
      <DigitalCity quality={quality} />
      <CodeWorld quality={quality} />
      <ConsultingNetwork />
      <OsDesktop />
      <HardwarePlanet quality={quality} />
      <ServiceUniverse />
      <Dust quality={quality} />
      <PostFX quality={quality} />
      {quality.tier !== 'low' && <AdaptiveDpr pixelated />}
      <FpsGuard quality={quality} onQuality={onQuality} />
      <BootMarker />
      <Preload all />
    </>
  )
}

function BootMarker() {
  const frames = useRef(0)
  const setReady = useExperience((s) => s.setReady)
  useFrame(() => {
    frames.current += 1
    if (frames.current === 8) {
      live.progress = 0
      live.velocity = 0
      live.ready = true
      setReady(true)
    }
  })
  return null
}

function FpsGuard({ quality, onQuality }: Props) {
  const samples = useRef<number[]>([])
  const dropped = useRef(false)
  useFrame((_, dt) => {
    if (dropped.current || quality.tier === 'low') return
    const fps = 1 / Math.max(dt, 0.0001)
    if (samples.current.length < 45) {
      samples.current.push(fps)
      return
    }
    samples.current.push(fps)
    if (samples.current.length > 90) samples.current.shift()
    const avg = samples.current.reduce((a, b) => a + b, 0) / samples.current.length
    if (avg < 28) {
      dropped.current = true
      onQuality(degradeQuality(quality))
    }
  })
  return null
}
