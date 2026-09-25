export type SceneId =
  | 'open'
  | 'workshop'
  | 'explosion'
  | 'repair'
  | 'city'
  | 'code'
  | 'consult'
  | 'os'
  | 'planet'
  | 'universe'
  | 'cta'

export const bands: Record<SceneId, [number, number]> = {
  open: [0, 0.082],
  workshop: [0.078, 0.192],
  explosion: [0.182, 0.278],
  repair: [0.262, 0.372],
  city: [0.35, 0.478],
  code: [0.458, 0.558],
  consult: [0.538, 0.642],
  os: [0.622, 0.718],
  planet: [0.7, 0.822],
  universe: [0.802, 0.908],
  cta: [0.888, 1],
}

export const world = {
  repair: [0, 0, -55] as [number, number, number],
  website: [0, 1.35, -132] as [number, number, number],
  code: [0, 1.2, -176] as [number, number, number],
  consult: [0, 1.1, -240] as [number, number, number],
  os: [0, 0, -290] as [number, number, number],
  planet: [0, 0, -360] as [number, number, number],
  universe: [0, 0, -420] as [number, number, number],
  cta: [0, 0, -470] as [number, number, number],
}

const order: SceneId[] = [
  'open',
  'workshop',
  'explosion',
  'repair',
  'city',
  'code',
  'consult',
  'os',
  'planet',
  'universe',
  'cta',
]

export function sceneFromProgress(p: number): SceneId {
  let current: SceneId = 'open'
  for (const id of order) {
    if (p >= bands[id][0]) current = id
  }
  return current
}
