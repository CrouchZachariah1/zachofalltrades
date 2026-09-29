import type { QuoteExtras } from '../config/offers.ts'
import { scrollApi } from '../hooks/useSmoothScroll.ts'
import { useExperience, type InspectItem } from '../store/experience.ts'

export type { InspectItem, QuoteExtras }

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
