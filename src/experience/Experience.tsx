import { Environment, Lightformer } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { scrollApi } from '../hooks/useSmoothScroll.ts'
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
      <LenisPump />
      <CameraRig quality={quality} />
      <Environment resolution={quality.tier === 'high' ? 128 : 64} environmentIntensity={0.12}>
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
      <FpsGuard key={quality.tier} quality={quality} onQuality={onQuality} />
      <BootMarker />
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

function LenisPump() {
  useFrame(() => {
    const lenis = scrollApi.lenis
    if (!lenis) return
    lenis.raf(performance.now())
    if (!live.ready) return
    const limit = lenis.limit
    live.progress = limit <= 0 ? 0 : Math.min(1, Math.max(0, lenis.scroll / limit))
    live.velocity = lenis.velocity
  }, -1)
  return null
}

function FpsGuard({ quality, onQuality }: Props) {
  const warm = useRef(0)
  const bad = useRef(0)
  const dropped = useRef(false)
  useFrame((_, dt) => {
    if (dropped.current || quality.tier === 'low') return
    if (warm.current < 30) {
      warm.current += 1
      return
    }
    if (dt > 1 / 42) bad.current += 1
    else bad.current = Math.max(0, bad.current - 2)
    if (bad.current > 10) {
      dropped.current = true
      onQuality(degradeQuality(quality))
    }
  })
  return null
}
