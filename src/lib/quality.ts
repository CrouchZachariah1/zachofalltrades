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
      dpr: [1, 1.5],
      particles: 280,
      tunnel: 72,
      city: 48,
      stars: 56,
      bloom: true,
      transmission: false,
      antialias: false,
      pixelRatioMax: 1.5,
    }
  }
  if (tier === 'medium') {
    return {
      tier,
      webgl: true,
      mobile,
      reducedMotion: false,
      dpr: [1, 1.15],
      particles: 160,
      tunnel: 48,
      city: 32,
      stars: 36,
      bloom: true,
      transmission: false,
      antialias: false,
      pixelRatioMax: 1.15,
    }
  }
  return {
    tier,
    webgl: true,
    mobile,
    reducedMotion: false,
    dpr: [1, 1],
    particles: 80,
    tunnel: 28,
    city: 18,
    stars: 22,
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

  let tier: QualityTier = 'medium'
  if (mobile) {
    tier = cores >= 8 && (memory ?? 4) >= 4 ? 'medium' : 'low'
  } else if ((memory ?? 8) >= 8 && cores >= 8) {
    tier = 'high'
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
