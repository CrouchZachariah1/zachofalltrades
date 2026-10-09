import type { MouseEvent } from 'react'
import type { QuoteExtras } from '../config/offers.ts'
import { scrollApi } from '../hooks/useSmoothScroll.ts'
import { useExperience, type InspectItem } from '../store/experience.ts'

export type { InspectItem, QuoteExtras }

export function followHash(href: string): void {
  const id = href.startsWith('#') ? href.slice(1) : href
  if (!id) return
  const hash = `#${id}`
  if (window.location.hash !== hash) history.pushState(null, '', hash)
  scrollApi.toElement(id)
}

export function onHashLinkClick(event: MouseEvent<HTMLAnchorElement>): void {
  onSiteLinkClick(event)
}

export function onSiteLinkClick(event: MouseEvent<HTMLAnchorElement>): void {
  const href = event.currentTarget.getAttribute('href') || ''
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return

  const url = new URL(href, window.location.origin)
  if (url.origin !== window.location.origin) return

  const here = window.location.pathname.replace(/\/+$/, '') || '/'
  const there = url.pathname.replace(/\/+$/, '') || '/'
  if (there !== here || !url.hash) return

  event.preventDefault()
  followHash(url.hash)
}

export function openSection(id: string): void {
  if (document.getElementById(id)) {
    scrollApi.toElement(id)
    return
  }
  const fallback: Record<string, string> = {
    web: 'Website Development',
    ads: 'Advertising',
    care: 'Website Care',
  }
  if (fallback[id]) openQuote(fallback[id])
}

export function openQuote(service?: string, extras?: QuoteExtras): void {
  useExperience.getState().requestQuote(service, extras)
  scrollApi.toElement('contact')
}

export function inspect(item: InspectItem): void {
  useExperience.getState().setInspect(item)
}

export function jumpTo(progress: number): void {
  scrollApi.toProgress(progress)
}
