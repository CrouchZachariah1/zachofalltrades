import { useEffect } from 'react'
import Lenis from 'lenis'
import { live, useExperience } from '../store/experience.ts'

export const scrollApi = {
  lenis: null as Lenis | null,
  toProgress(p: number) {
    const limit =
      this.lenis?.limit ??
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const y = Math.max(0, Math.min(1, p)) * limit
    if (this.lenis) this.lenis.scrollTo(y, { duration: 2.2, lerp: 0.06 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  },
  toElement(id: string, opts?: { immediate?: boolean }) {
    const el = document.getElementById(id)
    if (!el) return
    const nav = document.querySelector('.nav')
    const offset = Math.round((nav instanceof HTMLElement ? nav.getBoundingClientRect().height : 72) + 16)
    const top = Math.max(0, Math.round(window.scrollY + el.getBoundingClientRect().top - offset))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const immediate = Boolean(opts?.immediate) || reduce
    if (this.lenis) {
      this.lenis.scrollTo(el, { offset: -offset, duration: immediate ? 0 : 1.2, lerp: 0.08, immediate })
      return
    }
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
  },
}

function readNativeProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max <= 0) return 0
  return Math.max(0, Math.min(1, window.scrollY / max))
}

function pinTop(): void {
  live.progress = 0
  live.velocity = 0
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  scrollApi.lenis?.scrollTo(0, { immediate: true })
}

export function useSmoothScroll(enabled: boolean): void {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const hash = window.location.hash.replace('#', '')
    const keepHash = new Set(['contact', 'web', 'ads', 'care', 'services', 'builds', 'repairs', 'consulting']).has(
      hash,
    )
    if (enabled) document.documentElement.classList.add('is-booting')
    if (!keepHash) pinTop()

    const { setSceneFromProgress, setCompactNav } = useExperience.getState()

    const apply = (progress: number, velocity: number) => {
      const locked = enabled && !live.ready && !keepHash
      const p = locked ? 0 : Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0))
      live.progress = p
      live.velocity = locked ? 0 : velocity
      setSceneFromProgress(p)
      setCompactNav(p > 0.03)
      const inspectAt = useExperience.getState().inspectAt
      if (inspectAt !== null && Math.abs(p - inspectAt) > 0.01) {
        useExperience.getState().setInspect(null)
      }
    }

    let released = false
    const releaseBoot = () => {
      if (released) return
      released = true
      if (!keepHash) pinTop()
      apply(keepHash ? readNativeProgress() : 0, 0)
      document.documentElement.classList.remove('is-booting')
      scrollApi.lenis?.start()
      if (keepHash && hash) window.requestAnimationFrame(() => scrollApi.toElement(hash))
    }

    if (!enabled) {
      const onScroll = () => apply(readNativeProgress(), 0)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      document.documentElement.classList.remove('is-booting')
      const jump = (id: string, immediate = false) => {
        if (!id) return
        if (document.getElementById(id)) {
          scrollApi.toElement(id, { immediate })
          return
        }
        window.requestAnimationFrame(() => {
          if (document.getElementById(id)) scrollApi.toElement(id, { immediate })
        })
      }
      if (keepHash && hash) {
        window.requestAnimationFrame(() => jump(hash, true))
        window.setTimeout(() => jump(hash, true), 280)
      }
      const onHash = () => jump(window.location.hash.replace('#', ''))
      window.addEventListener('hashchange', onHash)
      window.addEventListener('popstate', onHash)
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('hashchange', onHash)
        window.removeEventListener('popstate', onHash)
      }
    }

    const mobile = window.matchMedia('(max-width: 820px)').matches
    const lenis = new Lenis({
      lerp: mobile ? 0.14 : 0.12,
      duration: mobile ? 1.1 : 1.2,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: mobile ? 0.9 : 0.95,
      autoRaf: false,
      anchors: false,
    })
    scrollApi.lenis = lenis
    lenis.stop()
    if (!keepHash) pinTop()

    const onScroll = (instance: Lenis) => {
      apply(instance.limit <= 0 ? 0 : instance.scroll / instance.limit, instance.velocity)
    }
    lenis.on('scroll', onScroll)
    apply(0, 0)

    const unsub = useExperience.subscribe((s) => {
      if (s.ready) releaseBoot()
    })
    if (useExperience.getState().ready) releaseBoot()

    return () => {
      unsub()
      lenis.off('scroll', onScroll)
      lenis.destroy()
      scrollApi.lenis = null
    }
  }, [enabled])
}
