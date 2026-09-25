import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { sampleAtmosphere, sampleCamera } from '../config/camera.ts'
import { remap } from '../lib/math.ts'
import type { Quality } from '../lib/quality.ts'
import { live } from '../store/experience.ts'

export function CameraRig({ quality }: { quality: Quality }) {
  const look = useRef(new THREE.Vector3(0, 0.52, 0.06))
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const lastP = useRef(0)
  const snapped = useRef(false)
  const follow = useRef(0)
  const key = useRef<THREE.DirectionalLight>(null)
  const fill = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.PointLight>(null)
  const cursor = useRef<THREE.PointLight>(null)
  const cursorOffset = useMemo(() => new THREE.Vector3(), [])
  const { scene, gl } = useThree()
  const fog = useMemo(() => new THREE.Fog('#07080a', 1.2, 8), [])
  const bg = useMemo(() => new THREE.Color('#07080a'), [])

  scene.fog = fog
  scene.background = bg

  useFrame(({ camera }, dt) => {
    const target = live.ready ? live.progress : 0
    const jump = Math.abs(target - lastP.current) > 0.18
    lastP.current = target
    if (!snapped.current || jump) follow.current = target
    else follow.current = THREE.MathUtils.damp(follow.current, target, 2.6, dt)
    const p = follow.current
    const sample = sampleCamera(p)
    const atmo = sampleAtmosphere(p)
    const mouseAmp = quality.mobile ? 0.04 : 0.11 * remap(p, 0, 0.07, 0.2, 1)

    targetPos.current.set(
      sample.position[0] + live.pointer.x * mouseAmp,
      sample.position[1] + live.pointer.y * mouseAmp * 0.55,
      sample.position[2],
    )
    targetLook.current.set(
      sample.lookAt[0] + live.pointer.x * mouseAmp * 0.22,
      sample.lookAt[1] + live.pointer.y * mouseAmp * 0.12,
      sample.lookAt[2],
    )

    if (!snapped.current || jump) {
      camera.position.set(sample.position[0], sample.position[1], sample.position[2])
      look.current.set(sample.lookAt[0], sample.lookAt[1], sample.lookAt[2])
      camera.lookAt(look.current)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = sample.fov
        camera.updateProjectionMatrix()
      }
      bg.set(atmo.bg)
      fog.color.set(atmo.fog)
      fog.near = atmo.fogNear
      fog.far = atmo.fogFar
      gl.toneMappingExposure = atmo.exposure
      snapped.current = true
      return
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.current.x, 3.2, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.current.y, 3.2, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, 3.2, dt)
    look.current.x = THREE.MathUtils.damp(look.current.x, targetLook.current.x, 3.2, dt)
    look.current.y = THREE.MathUtils.damp(look.current.y, targetLook.current.y, 3.2, dt)
    look.current.z = THREE.MathUtils.damp(look.current.z, targetLook.current.z, 3.2, dt)
    camera.lookAt(look.current)

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.damp(camera.fov, sample.fov, 3.4, dt)
      camera.updateProjectionMatrix()
    }

    bg.set(atmo.bg)
    fog.color.set(atmo.fog)
    fog.near = atmo.fogNear
    fog.far = atmo.fogFar
    gl.toneMappingExposure = THREE.MathUtils.damp(gl.toneMappingExposure, atmo.exposure, 3, dt)
    key.current?.color.set(atmo.key)
    fill.current?.color.set(atmo.fill)
    rim.current?.color.set(atmo.rim)

    if (cursor.current) {
      cursorOffset.set(live.pointer.x * 0.8, live.pointer.y * 0.5, -1.2)
      cursorOffset.applyQuaternion(camera.quaternion)
      cursorOffset.add(camera.position)
      cursor.current.position.lerp(cursorOffset, 1 - Math.exp(-6 * dt))
      cursor.current.intensity = 0.28 + Math.min(Math.abs(live.velocity) * 0.02, 0.25)
    }
  })

  return (
    <>
      <ambientLight intensity={0.055} />
      <hemisphereLight args={['#8aa0b4', '#08090c', 0.16]} />
      <directionalLight ref={key} position={[2.2, 3.4, 2.0]} intensity={0.72} color="#d7e4f0" />
      <directionalLight ref={fill} position={[-2.2, 1.0, -1.4]} intensity={0.22} color="#1a1e24" />
      <pointLight ref={rim} position={[0.55, 0.35, 0.7]} intensity={0.32} distance={4.2} color="#4ee3ff" />
      <pointLight ref={cursor} color="#cfe8f4" distance={4.5} intensity={0.35} />
    </>
  )
}
