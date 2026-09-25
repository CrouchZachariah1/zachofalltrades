export type Vec3 = [number, number, number]

export function clamp(x: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, x))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

export function remap(
  x: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
): number {
  if (inMax === inMin) return outMin
  return lerp(outMin, outMax, clamp((x - inMin) / (inMax - inMin)))
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

export function sectionAlpha(
  p: number,
  start: number,
  end: number,
  fade = 0.028,
): number {
  if (p < start) return remap(p, start - fade, start, 0, 1)
  if (p > end) return remap(p, end, end + fade, 1, 0)
  return 1
}

export function inBand(p: number, start: number, end: number, pad = 0.05): boolean {
  return p >= start - pad && p <= end + pad
}

export function hash(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function hash2(i: number, j: number): number {
  const x = Math.sin(i * 269.5 + j * 183.3) * 43758.5453
  return x - Math.floor(x)
}
