import { lerp, lerpVec3, type Vec3 } from '../lib/math.ts'

export type CameraKeyframe = {
  t: number
  position: Vec3
  lookAt: Vec3
  fov: number
}

export type Atmosphere = {
  bg: string
  fog: string
  fogNear: number
  fogFar: number
  key: string
  fill: string
  rim: string
  exposure: number
}

export const cameraPath: CameraKeyframe[] = [
  { t: 0.0, position: [0.95, 0.68, 1.28], lookAt: [0.0, 0.52, 0.06], fov: 36 },
  { t: 0.02, position: [0.19, 0.205, 0.055], lookAt: [0.03, 0.168, 0.0], fov: 30 },
  { t: 0.028, position: [0.34, 0.24, 0.2], lookAt: [0.0, 0.2, 0.0], fov: 33 },
  { t: 0.055, position: [0.72, 0.4, 0.72], lookAt: [0.0, 0.24, 0.0], fov: 36 },
  { t: 0.082, position: [1.42, 0.78, 1.62], lookAt: [0.0, 0.26, 0.0], fov: 40 },
  { t: 0.1, position: [1.1, 0.42, 0.78], lookAt: [0.0, 0.27, 0.02], fov: 38 },
  { t: 0.12, position: [0.72, 0.34, 0.32], lookAt: [-0.02, 0.28, 0.02], fov: 36 },
  { t: 0.14, position: [0.52, 0.32, 0.12], lookAt: [0.0, 0.28, 0.02], fov: 34 },
  { t: 0.16, position: [0.78, 0.4, 0.48], lookAt: [0.0, 0.27, 0.02], fov: 38 },
  { t: 0.182, position: [1.28, 0.6, 1.15], lookAt: [0.0, 0.26, 0.0], fov: 40 },
  { t: 0.205, position: [0.0, 0.34, 1.85], lookAt: [0.0, 0.28, -4], fov: 50 },
  { t: 0.222, position: [0.22, 0.38, -10], lookAt: [0.0, 0.28, -18], fov: 54 },
  { t: 0.248, position: [-0.18, 0.24, -24], lookAt: [0.08, 0.2, -32], fov: 50 },
  { t: 0.272, position: [0.0, 0.48, -40], lookAt: [0.0, 0.32, -50], fov: 42 },
  { t: 0.295, position: [1.65, 1.15, -50], lookAt: [0.0, 0.3, -55], fov: 40 },
  { t: 0.325, position: [0.88, 0.48, -53.1], lookAt: [0.12, 0.24, -55], fov: 34 },
  { t: 0.348, position: [1.42, 0.72, -51.4], lookAt: [0.0, 0.28, -55], fov: 40 },
  { t: 0.368, position: [0.2, 1.55, -60], lookAt: [0.0, 0.5, -70], fov: 48 },
  { t: 0.392, position: [4.2, 6.2, -82], lookAt: [0.0, 2.0, -108], fov: 52 },
  { t: 0.422, position: [1.8, 3.4, -112], lookAt: [0.4, 1.6, -124], fov: 48 },
  { t: 0.448, position: [0.15, 1.55, -127.4], lookAt: [0.0, 1.38, -132], fov: 38 },
  { t: 0.468, position: [0.0, 1.38, -129.55], lookAt: [0.0, 1.38, -132], fov: 30 },
  { t: 0.492, position: [0.0, 1.35, -136], lookAt: [0.0, 1.2, -155], fov: 50 },
  { t: 0.525, position: [0.45, 2.05, -172], lookAt: [0.0, 1.4, -190], fov: 52 },
  { t: 0.548, position: [0.0, 1.55, -198], lookAt: [0.0, 1.3, -214], fov: 40 },
  { t: 0.575, position: [3.6, 2.55, -228], lookAt: [0.0, 1.15, -240], fov: 46 },
  { t: 0.605, position: [0.55, 1.35, -236], lookAt: [0.0, 1.05, -240], fov: 40 },
  { t: 0.628, position: [-2.3, 2.15, -248], lookAt: [0.0, 1.0, -240], fov: 42 },
  { t: 0.652, position: [0.0, 1.45, -278], lookAt: [0.0, 1.15, -288], fov: 40 },
  { t: 0.682, position: [1.25, 1.08, -284], lookAt: [0.15, 1.0, -290], fov: 35 },
  { t: 0.705, position: [0.0, 1.85, -300], lookAt: [0.0, 0.4, -330], fov: 42 },
  { t: 0.732, position: [0.2, 2.1, -332], lookAt: [0.0, 0.0, -360], fov: 40 },
  { t: 0.762, position: [6.4, 2.0, -360], lookAt: [0.0, 0.0, -360], fov: 36 },
  { t: 0.792, position: [0.55, 0.35, -351.5], lookAt: [0.0, 0.0, -360], fov: 42 },
  { t: 0.815, position: [0.0, 0.0, -358.2], lookAt: [0.0, 0.0, -360], fov: 48 },
  { t: 0.838, position: [0.2, 1.1, -394], lookAt: [0.0, 0.0, -420], fov: 46 },
  { t: 0.868, position: [2.1, 0.45, -412], lookAt: [0.0, 0.0, -420], fov: 40 },
  { t: 0.892, position: [-1.4, 1.15, -432], lookAt: [0.0, 0.15, -450], fov: 42 },
  { t: 0.92, position: [1.55, 0.82, -466], lookAt: [0.0, 0.26, -470], fov: 38 },
  { t: 0.955, position: [0.92, 0.46, -468], lookAt: [0.0, 0.24, -470], fov: 32 },
  { t: 1.0, position: [0.52, 0.3, -468.55], lookAt: [0.0, 0.22, -470], fov: 28 },
]

const industrial: Atmosphere = {
  bg: '#07080a',
  fog: '#07080a',
  fogNear: 1.2,
  fogFar: 7.5,
  key: '#d7e4f0',
  fill: '#1a1e24',
  rim: '#4ee3ff',
  exposure: 0.78,
}

export const atmospheres: { t: number; value: Atmosphere }[] = [
  {
    t: 0,
    value: { ...industrial, fogNear: 0.8, fogFar: 5.2, exposure: 0.74 },
  },
  {
    t: 0.08,
    value: { ...industrial, fogNear: 2.4, fogFar: 11, exposure: 0.86, key: '#e8f2fa' },
  },
  {
    t: 0.2,
    value: { ...industrial, bg: '#050607', fog: '#050607', fogNear: 2, fogFar: 16, exposure: 0.8 },
  },
  {
    t: 0.3,
    value: {
      ...industrial,
      bg: '#07090c',
      fog: '#07090c',
      fogNear: 2.5,
      fogFar: 12,
      exposure: 0.82,
    },
  },
  {
    t: 0.4,
    value: {
      ...industrial,
      bg: '#06080c',
      fog: '#06080c',
      fogNear: 8,
      fogFar: 42,
      key: '#c5d6e6',
      exposure: 0.84,
    },
  },
  {
    t: 0.5,
    value: { ...industrial, bg: '#050607', fog: '#050607', fogNear: 4, fogFar: 24, exposure: 0.8 },
  },
  {
    t: 0.58,
    value: {
      ...industrial,
      bg: '#07080a',
      fog: '#07080a',
      fogNear: 4,
      fogFar: 18,
      key: '#dfe8f0',
      exposure: 0.83,
    },
  },
  {
    t: 0.66,
    value: {
      ...industrial,
      bg: '#0a0c10',
      fog: '#0a0c10',
      fogNear: 3,
      fogFar: 14,
      key: '#e8eef4',
      exposure: 0.88,
    },
  },
  {
    t: 0.74,
    value: { ...industrial, bg: '#050607', fog: '#050607', fogNear: 6, fogFar: 22, exposure: 0.8 },
  },
  {
    t: 0.84,
    value: { ...industrial, bg: '#050607', fog: '#050607', fogNear: 5, fogFar: 22, exposure: 0.82 },
  },
  {
    t: 0.93,
    value: {
      ...industrial,
      fogNear: 1.8,
      fogFar: 10,
      key: '#f2f6fa',
      exposure: 0.92,
    },
  },
]

function sampleList<T extends { t: number }>(t: number, list: T[]): { a: T; b: T; u: number } {
  const p = Math.min(1, Math.max(0, t))
  if (p <= list[0].t) return { a: list[0], b: list[0], u: 0 }
  const last = list[list.length - 1]
  if (p >= last.t) return { a: last, b: last, u: 0 }
  let i = 0
  while (i < list.length - 1 && list[i + 1].t < p) i += 1
  const a = list[i]
  const b = list[i + 1]
  const s = (p - a.t) / (b.t - a.t)
  const u = s * s * (3 - 2 * s)
  return { a, b, u }
}

export function sampleCamera(t: number): CameraKeyframe {
  const { a, b, u } = sampleList(t, cameraPath)
  return {
    t,
    position: lerpVec3(a.position, b.position, u),
    lookAt: lerpVec3(a.lookAt, b.lookAt, u),
    fov: lerp(a.fov, b.fov, u),
  }
}

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ar = (pa >> 16) & 255
  const ag = (pa >> 8) & 255
  const ab = pa & 255
  const br = (pb >> 16) & 255
  const bg = (pb >> 8) & 255
  const bb = pb & 255
  const r = Math.round(lerp(ar, br, t))
  const g = Math.round(lerp(ag, bg, t))
  const bl = Math.round(lerp(ab, bb, t))
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`
}

export function sampleAtmosphere(t: number): Atmosphere {
  const { a, b, u } = sampleList(t, atmospheres)
  const av = a.value
  const bv = b.value
  return {
    bg: mixHex(av.bg, bv.bg, u),
    fog: mixHex(av.fog, bv.fog, u),
    fogNear: lerp(av.fogNear, bv.fogNear, u),
    fogFar: lerp(av.fogFar, bv.fogFar, u),
    key: mixHex(av.key, bv.key, u),
    fill: mixHex(av.fill, bv.fill, u),
    rim: mixHex(av.rim, bv.rim, u),
    exposure: lerp(av.exposure, bv.exposure, u),
  }
}
