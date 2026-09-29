import { formServices } from './site.ts'

type ServiceId = (typeof formServices)[number]

export type PriceCard = {
  /**
   * Optional one-liner under the service brief.
   * Leave '' to hide it. Example: 'Typical builds R10 000–R50 000+'
   */
  note: string
  /**
   * Chips on the quote form, shown exactly as written.
   * Leave [] to hide the budget picker until you have figures.
   */
  bands: string[]
}

/**
 * Your price ranges.
 *
 * Edit this file when the numbers change. Labels are printed as-is.
 * Amounts are South African rand (ZAR), written with R.
 *
 * The form always adds "Prefer not to say" in front of the bands.
 */
export const preferNot = 'Prefer not to say'

export const pricing: Record<ServiceId, PriceCard> = {
  'PC Build': {
    note: '',
    bands: ['Under R10 000', 'R10 000–R18 000', 'R18 000–R30 000', 'R30 000–R50 000', 'R50 000+'],
  },
  'PC Repair': {
    note: '',
    bands: ['Under R1 500', 'R1 500–R4 000', 'R4 000–R8 000', 'Quote after diagnosis'],
  },
  'PC Upgrade': {
    note: '',
    bands: ['Under R3 000', 'R3 000–R8 000', 'R8 000–R15 000', 'R15 000+'],
  },
  'IT Consulting': {
    note: '',
    bands: ['Just the advice', 'Advice then the work'],
  },
  'Website Development': {
    note: 'Starting prices. Final pricing depends on project size, functionality and requirements.',
    bands: [
      'R2,500 – R5,000',
      'R5,000 – R8,000',
      'R8,000 – R12,000',
      'R12,000 – R20,000',
      'R20,000+',
      "I'm not sure — I'd like a recommendation",
    ],
  },
  'Website Care': {
    note: 'Monthly plans cover agreed maintenance. New pages and major work are quoted separately.',
    bands: ['R450/month', 'R750/month', 'R1,250/month', 'From R1,500/month', "I'm not sure — I'd like a recommendation"],
  },
  Advertising: {
    note: 'Monthly fee is management only. Advertising spend is paid separately to Meta or Google.',
    bands: [
      'R750/month management',
      'R1,250/month management',
      'R1,750/month management',
      'R1,500–R2,250 combined',
      'Custom / not sure',
    ],
  },
  Windows: {
    note: '',
    bands: ['Under R1 200', 'R1 200–R2 500', 'R2 500–R5 000', 'R5 000+'],
  },
  'Microsoft 365': {
    note: '',
    bands: ['Under R1 200', 'R1 200–R2 500', 'R2 500–R5 000', 'R5 000+'],
  },
  Other: {
    note: '',
    bands: ['Under R2 000', 'R2 000–R8 000', 'R8 000+'],
  },
}

const rank: ServiceId[] = [
  'PC Build',
  'Website Development',
  'Website Care',
  'Advertising',
  'PC Upgrade',
  'PC Repair',
  'IT Consulting',
  'Windows',
  'Microsoft 365',
  'Other',
]

function primary(services: string[]): ServiceId | null {
  for (const id of rank) {
    if (services.includes(id)) return id
  }
  return (services[0] as ServiceId) ?? null
}

/** Chips for the selected service(s). Empty if you have not set bands yet. */
export function bandsFor(services: string[]): string[] {
  const id = primary(services)
  if (!id) return []
  const bands = pricing[id].bands
  if (!bands.length) return []
  if (bands.some((band) => /not sure|prefer not/i.test(band))) return bands
  return [preferNot, ...bands]
}

/** Brief range line. Empty string hides it. */
export function noteFor(services: string[]): string {
  if (services.length !== 1) {
    const notes = services.map((id) => pricing[id as ServiceId]?.note).filter(Boolean)
    return notes[0] ?? ''
  }
  const id = services[0] as ServiceId
  return pricing[id]?.note ?? ''
}
