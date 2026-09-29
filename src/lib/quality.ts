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

function hasUsableWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const opts = { failIfMajorPerformanceCaveat: true, alpha: false, antialias: false }
    const gl =
      canvas.getContext('webgl2', opts) ||
      canvas.getContext('webgl', opts) ||
      canvas.getContext('experimental-webgl', opts)
    return Boolean(gl)
  } catch {
    return false
  }
}

function cinematicRequested(): boolean {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('3d') === '1'
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
      dpr: [1, 1.15],
      particles: 0,
      tunnel: 36,
      city: 24,
      stars: 28,
      bloom: false,
      transmission: false,
      antialias: false,
      pixelRatioMax: 1.15,
    }
  }
  if (tier === 'medium') {
    return {
      tier,
      webgl: true,
      mobile,
      reducedMotion: false,
      dpr: [1, 1],
      particles: 0,
      tunnel: 24,
      city: 16,
      stars: 18,
      bloom: false,
      transmission: false,
      antialias: false,
      pixelRatioMax: 1,
    }
  }
  return {
    tier,
    webgl: true,
    mobile,
    reducedMotion: false,
    dpr: [1, 1],
    particles: 0,
    tunnel: 16,
    city: 10,
    stars: 12,
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
      quality: { ...baseQuality('low', true), webgl: false, reducedMotion: true },
    }
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile =
    window.matchMedia('(max-width: 820px)').matches ||
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  const webgl = hasUsableWebGL()
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency ?? 4

  const twoD: AppMode = {
    mode: '2d',
    quality: { ...baseQuality('low', mobile), webgl, reducedMotion },
  }

  const finish = (mode: AppMode): AppMode => {
    document.documentElement.classList.toggle('is-2d', mode.mode === '2d')
    document.documentElement.classList.toggle('is-mobile', mode.quality.mobile)
    return mode
  }

  if (!cinematicRequested()) return finish(twoD)
  if (!webgl) return finish({ ...twoD, reason: 'webgl', quality: { ...twoD.quality, webgl: false } })
  if (reducedMotion) return finish({ ...twoD, reason: 'motion', quality: { ...twoD.quality, reducedMotion: true } })
  if (mobile || saveData) return finish(twoD)

  let tier: QualityTier = 'low'
  if ((memory ?? 4) >= 8 && cores >= 8) tier = 'medium'
  if ((memory ?? 4) >= 8 && cores >= 12) tier = 'high'

  return finish({
    mode: '3d',
    quality: { ...baseQuality(tier, false), reducedMotion: false },
  })
}

export function degradeQuality(current: Quality): Quality {
  if (current.tier === 'high') return baseQuality('medium', current.mobile)
  if (current.tier === 'medium') return baseQuality('low', current.mobile)
  return current
}

export function isSoftwareRenderer(gl: { getExtension: (name: string) => unknown; getParameter: (name: number) => unknown }): boolean {
  const ext = gl.getExtension('WEBGL_debug_renderer_info') as { UNMASKED_RENDERER_WEBGL: number } | null
  if (!ext) return false
  const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '')
  return /SwiftShader|llvmpipe|Softpipe|Software|Microsoft Basic Render/i.test(renderer)
}
