import { scrollApi } from '../hooks/useSmoothScroll.ts'
import { useExperience, type InspectItem } from '../store/experience.ts'

export type { InspectItem }

export function openQuote(service?: string): void {
  useExperience.getState().requestQuote(service)
  scrollApi.toElement('contact')
}

export function inspect(item: InspectItem): void {
  useExperience.getState().setInspect(item)
}

export function jumpTo(progress: number): void {
  scrollApi.toProgress(progress)
}
