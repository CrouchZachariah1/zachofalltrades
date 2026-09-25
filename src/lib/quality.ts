export type QualityTier = 'high' | 'medium' | 'low'

export type Quality = {
  tier: QualityTier
  webgl: boolean
  mobile: boolean
  reducedMotion: boolean
  dpr: [number, number]
  particles: number
  tunnel: number
  city: number
  stars: number
  bloom: boolean
  transmission: boolean
  antialias: boolean
  pixelRatioMax: number
}

export type AppMode = {
  mode: '3d' | '2d'
  reason?: 'webgl' | 'motion'
  quality: Quality
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

function baseQuality(tier: QualityTier, mobile: boolean): Quality {
  if (tier === 'high') {
    return {
      tier,
      webgl: true,
      mobile,
      reducedMotion: false,
      dpr: [1, 1.75],
      particles: 720,
      tunnel: 140,
      city: 72,
      stars: 90,
      bloom: true,
      transmission: true,
      antialias: true,
      pixelRatioMax: 1.75,
    }
  }
  if (tier === 'medium') {
    return {
      tier,
      webgl: true,
      mobile,
      reducedMotion: false,
      dpr: [1, 1.25],
      particles: 320,
      tunnel: 72,
      city: 40,
      stars: 48,
      bloom: true,
      transmission: false,
      antialias: !mobile,
      pixelRatioMax: 1.25,
    }
  }
  return {
    tier,
    webgl: true,
    mobile,
    reducedMotion: false,
    dpr: [1, 1],
    particles: 140,
    tunnel: 36,
    city: 22,
    stars: 28,
    bloom: false,
    transmission: false,
    antialias: false,
    pixelRatioMax: 1,
  }
}

export function detectAppMode(): AppMode {
  if (typeof window === 'undefined') {
    return {
      mode: '2d',
      reason: 'webgl',
      quality: { ...baseQuality('low', true), webgl: false, reducedMotion: true },
    }
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile =
    window.matchMedia('(max-width: 820px)').matches ||
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const webgl = hasWebGL()

  if (!webgl) {
    return {
      mode: '2d',
      reason: 'webgl',
      quality: { ...baseQuality('low', mobile), webgl: false, reducedMotion },
    }
  }

  if (reducedMotion) {
    return {
      mode: '2d',
      reason: 'motion',
      quality: { ...baseQuality('low', mobile), reducedMotion: true },
    }
  }

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency ?? 4

  let tier: QualityTier = 'high'
  if (mobile) {
    tier = cores >= 8 && (memory ?? 4) >= 4 ? 'medium' : 'low'
  } else if ((memory ?? 8) <= 4 || cores <= 4) {
    tier = 'medium'
  }

  return {
    mode: '3d',
    quality: { ...baseQuality(tier, mobile), reducedMotion: false },
  }
}

export function degradeQuality(current: Quality): Quality {
  if (current.tier === 'high') return baseQuality('medium', current.mobile)
  if (current.tier === 'medium') return baseQuality('low', current.mobile)
  return current
}
