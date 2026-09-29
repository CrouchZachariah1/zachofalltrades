import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { scrollApi } from '../hooks/useSmoothScroll.ts'
import { degradeQuality, type Quality } from '../lib/quality.ts'
import { live, useExperience } from '../store/experience.ts'
import { CameraRig } from './CameraRig.tsx'
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
  onFail: () => void
}

export function Experience({ quality, onQuality, onFail }: Props) {
  return (
    <>
      <LenisPump />
      <CameraRig quality={quality} />
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
      <FpsGuard key={quality.tier} quality={quality} onQuality={onQuality} onFail={onFail} />
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

function FpsGuard({ quality, onQuality, onFail }: Props) {
  const warm = useRef(0)
  const bad = useRef(0)
  const dropped = useRef(false)
  useFrame((_, dt) => {
    if (dropped.current) return
    if (document.hidden) return
    if (warm.current < 24) {
      warm.current += 1
      return
    }
    if (dt > 1 / 32) bad.current += 1
    else bad.current = Math.max(0, bad.current - 2)
    if (bad.current > 8) {
      dropped.current = true
      if (quality.tier === 'low') onFail()
      else onQuality(degradeQuality(quality))
    }
  })
  return null
}
