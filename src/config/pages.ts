import { repairServices, site } from './site.ts'

export type ServicePage = {
  id: 'computer-repairs' | 'custom-pcs' | 'web-design'
  path: string
  title: string
  description: string
  h1: string
  kicker: string
  quoteService: string
  image: string
  imageAlt: string
  intro: string
  sections: { heading: string; body: string; items?: readonly string[] }[]
  related: { href: string; label: string }[]
}

export const servicePages: ServicePage[] = [
  {
    id: 'computer-repairs',
    path: '/computer-repairs/',
    title: 'Computer Repairs in Cape Town | Zach of All Trades',
    description:
      'Diagnostics, hardware repair, Windows recovery, cooling and upgrades for home and business computers in Cape Town.',
    h1: 'Computer repairs in Cape Town',
    kicker: 'Repairs',
    quoteService: 'PC Repair',
    image: '/media/repair.jpg',
    imageAlt: 'Computer motherboard on a diagnostic bench under inspection lighting',
    intro:
      'When a machine is slow, overheating, or will not boot, we isolate the fault first — hardware, Windows, or both — then repair the part that actually failed.',
    sections: [
      {
        heading: 'How a repair starts',
        body: 'Computer repairs start with diagnostics. We tell you what failed and what is still fine, so you are not paying to replace the whole machine by default.',
        items: repairServices,
      },
      {
        heading: 'Hardware and Windows',
        body: 'Failed boards, power, storage and cooling are diagnosed then fixed. Boot loops, drivers and installs use your genuine Windows license. Heat is usually a hardware problem: dust, paste, fans and airflow.',
      },
      {
        heading: 'When an upgrade is the fix',
        body: 'A slow PC is often storage, memory, or a tired drive. If the chassis is sound, we can upgrade the bottleneck instead of building a new machine. That work lives with custom PC builds and upgrades.',
      },
    ],
    related: [
      { href: '/custom-pcs/', label: 'Custom PC builds and upgrades' },
      { href: '/#consulting', label: 'IT support and consulting' },
      { href: '/#systems', label: 'Windows and Microsoft 365' },
    ],
  },
  {
    id: 'custom-pcs',
    path: '/custom-pcs/',
    title: 'Custom PC Builds & Upgrades | Zach of All Trades Cape Town',
    description:
      'Custom gaming, work and business PCs, plus RAM, SSD, GPU and cooling upgrades, specified around the software you actually run.',
    h1: 'Custom PC builds and upgrades',
    kicker: 'Hardware',
    quoteService: 'PC Build',
    image: '/media/build.jpg',
    imageAlt: 'Custom-built desktop PC with an open chassis and cyan edge lighting',
    intro:
      'Custom gaming, work and business PCs specified around the software you actually run — assembled, cabled and ready. If the chassis you have is still sound, we upgrade the parts that hold it back.',
    sections: [
      {
        heading: 'Built around the job',
        body: 'The machine is specified for how you work and play: quiet workstations, gaming PCs with the GPU and cooling the titles need, and denser builds for the apps in the job. Performance, budget and space all go into the quote.',
        items: ['Work PCs', 'Gaming PCs', 'Creative workstations', 'Business machines'],
      },
      {
        heading: 'Upgrades without a new chassis',
        body: 'Keep the machine you have. Change RAM, SSD, GPU or cooling — the parts that are actually the bottleneck. We tell you which, before you buy parts you do not need.',
        items: ['RAM', 'SSD', 'GPU', 'Cooling'],
      },
      {
        heading: 'If something is already broken',
        body: 'A build or upgrade assumes the rest of the machine is honest. If it is not, that is a repair: diagnostics first, then the failed part.',
      },
    ],
    related: [
      { href: '/computer-repairs/', label: 'Computer repairs' },
      { href: '/#consulting', label: 'IT support and consulting' },
    ],
  },
  {
    id: 'web-design',
    path: '/web-design/',
    title: 'Website Design & Development | Zach of All Trades Cape Town',
    description:
      'Website design and development from R2,500. Professional, business and e-commerce sites, quoted around the pages and features you need.',
    h1: 'Website design and development',
    kicker: 'Web',
    quoteService: 'Website Development',
    image: '/media/hangar.jpg',
    imageAlt: 'Zach of All Trades studio hangar used as the web design page still',
    intro:
      'Website design and development is quoted around the project — pages, functionality and integrations — from clear starting prices. Advertising is a separate service.',
    sections: [
      {
        heading: 'Starting prices',
        body: 'R2,500 is the starting price for a professional website. The quote is written around the pages and features the project actually needs.',
        items: [
          'Professional Website — from R2,500',
          'Business Website — from R3,900',
          'E-Commerce — from R7,500',
          'Custom Web Development — custom quote',
        ],
      },
      {
        heading: 'What a professional site can include',
        body: 'Custom website design; mobile, tablet and desktop layouts; contact forms; WhatsApp; basic SEO setup; SSL/HTTPS; performance work; and deployment. Larger business sites and shops are quoted from the starting prices above.',
      },
      {
        heading: 'After launch',
        body: 'Website maintenance is an agreed monthly plan from R450/month. New pages, major redesigns and new functionality are quoted separately. Facebook, Instagram and Google advertising management is a separate monthly service; ad spend is paid to the platforms.',
      },
    ],
    related: [
      { href: '/#web', label: 'Full website packages and details' },
      { href: '/#care', label: 'Website maintenance' },
      { href: '/#ads', label: 'Advertising management' },
      { href: site.studioUrl, label: 'View our work' },
    ],
  },
]

export function findServicePage(pathname = window.location.pathname): ServicePage | undefined {
  const slug = pathname.replace(/\/+$/, '')
  return servicePages.find((page) => page.path.replace(/\/+$/, '') === slug)
}

export function isHomePath(pathname = window.location.pathname): boolean {
  return pathname === '/' || pathname === ''
}
