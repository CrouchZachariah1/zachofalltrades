export type NarrativeBeat = {
  id: string
  range: [number, number]
  kicker?: string
  title: string[]
  body?: string
  items?: string[]
  cta?: { label: string; service?: string; progress?: number; href?: string }
  secondary?: { label: string; progress?: number; href?: string }
}

export const beats: NarrativeBeat[] = [
  {
    id: 'open',
    range: [0.018, 0.086],
    kicker: 'CAPE TOWN',
    title: ['ZACH', 'OF ALL', 'TRADES'],
    body: 'Custom PCs, computer repairs, websites and IT support for homes and businesses in Cape Town.',
    cta: { label: 'Explore services', href: '#services' },
    secondary: { label: 'Get a quote' },
  },
  {
    id: 'workshop',
    range: [0.1, 0.185],
    kicker: 'HARDWARE',
    title: ['BUILT FOR YOU.'],
    body: 'Custom PCs designed around your performance, budget and goals. Click a part of the machine.',
    cta: { label: 'BUILD YOUR PC', service: 'PC Build' },
  },
  {
    id: 'explosion',
    range: [0.2, 0.268],
    kicker: 'COMPONENTS',
    title: ['WE DON’T JUST', 'SELL COMPUTERS.', 'WE BUILD THEM.'],
  },
  {
    id: 'repair',
    range: [0.288, 0.36],
    kicker: 'DIAGNOSTICS',
    title: ['SOMETHING BROKE?', 'WE FIX IT.'],
    items: [
      'Diagnostics',
      'Hardware Repair',
      'Windows Problems',
      'Overheating',
      'Slow PCs',
      'Upgrades',
      'Software Problems',
    ],
    cta: { label: 'BOOK A REPAIR', service: 'PC Repair' },
  },
  {
    id: 'city',
    range: [0.385, 0.448],
    kicker: 'WEB',
    title: ['YOUR BUSINESS.', 'YOUR WEBSITE.'],
    cta: { label: 'GET A QUOTE', service: 'Website Development' },
  },
  {
    id: 'city2',
    range: [0.45, 0.475],
    kicker: 'WEB',
    title: ['ASSEMBLED IN PLACE.'],
    body: 'Professional websites from R2,500. Quoted around the pages and features you need.',
    cta: { label: 'GET A QUOTE', service: 'Website Development' },
  },
  {
    id: 'code',
    range: [0.492, 0.548],
    kicker: 'DEVELOPMENT',
    title: ['FROM IDEA', 'TO ONLINE.'],
  },
  {
    id: 'consult',
    range: [0.568, 0.632],
    kicker: 'CONSULTING',
    title: ['DON’T KNOW', 'WHAT YOU NEED?'],
    body: 'That’s what we’re here for. Tell us what you’re trying to get done. We’ll help you choose the right technology.',
    cta: { label: 'Request IT advice', service: 'IT Consulting' },
  },
  {
    id: 'os',
    range: [0.655, 0.705],
    kicker: 'SYSTEMS',
    title: ['YOUR TECH.', 'SET UP RIGHT.'],
    items: [
      'Windows installation',
      'System setup',
      'Driver installation',
      'Microsoft 365 installation',
      'Software setup',
      'System configuration',
    ],
    body: 'Activation and Microsoft 365 setup always use your legitimate license or subscription.',
    cta: { label: 'SET THIS UP' },
  },
  {
    id: 'planet',
    range: [0.735, 0.805],
    kicker: 'INFRASTRUCTURE',
    title: ['PERFORMANCE. RELIABILITY.', 'THE WHOLE MACHINE.'],
    items: ['PERFORMANCE', 'RELIABILITY', 'UPGRADES', 'WORK', 'GAMING', 'CREATIVE'],
  },
  {
    id: 'universe',
    range: [0.83, 0.888],
    kicker: 'SERVICES',
    title: ['ZACH OF ALL TRADES'],
    body: 'Click a node. Choose a service. Or just keep moving.',
  },
  {
    id: 'cta',
    range: [0.91, 0.985],
    kicker: 'ZACH OF ALL TRADES',
    title: ['READY TO BUILD', 'SOMETHING BETTER?'],
    body: 'Build it. Connect it. Protect it. Fix it.',
  },
]
