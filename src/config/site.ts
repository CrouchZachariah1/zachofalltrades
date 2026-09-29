export const site = {
  name: 'Zach of All Trades',
  short: 'ZOAT',
  tagline: 'Technology. Built right.',
  line: 'Build it. Connect it. Protect it. Fix it.',
  url: 'https://zachofalltrades.co.za',
  studioUrl: 'https://studio.zachofalltrades.co.za',
  email: 'admin@zachofalltrades.co.za',
  phoneDisplay: '060 329 2708',
  phoneTel: '+27603292708',
  whatsapp: '27603292708',
  city: 'Cape Town',
  region: 'Western Cape',
  country: 'South Africa',
  countryCode: 'ZA',
  ogImage: 'https://zachofalltrades.co.za/share.jpg',
  logo: 'https://zachofalltrades.co.za/logo.png',
  title: 'Zach of All Trades | Cape Town — PCs, Repair & Web',
  description:
    'Custom PCs, repairs, upgrades, IT consulting, websites, Facebook and Instagram ads, Windows and Microsoft 365 in Cape Town. WhatsApp 060 329 2708.',
}

export const navLinks = [
  { id: 'services', label: 'SERVICES', progress: 0.83, href: '#services' },
  { id: 'builds', label: 'PC BUILDS', progress: 0.1, href: '#builds' },
  { id: 'repairs', label: 'REPAIRS', progress: 0.3, href: '#repairs' },
  { id: 'consulting', label: 'CONSULTING', progress: 0.57, href: '#consulting' },
  { id: 'web', label: 'WEB', progress: 0.4, href: '#web' },
  { id: 'ads', label: 'ADS', progress: 0.83, href: '#ads' },
  { id: 'contact', label: 'CONTACT', href: '#contact' },
] as const

export const services = [
  {
    id: 'pc-build',
    formValue: 'PC Build',
    title: 'PC Builds',
    short: 'Custom machines, assembled for how you actually work and play.',
    body: 'Custom gaming, work, business and performance PCs designed around your performance, budget and goals.',
    progress: 0.1,
  },
  {
    id: 'pc-repair',
    formValue: 'PC Repair',
    title: 'PC Repair',
    short: 'Diagnostics, hardware repair, and software troubleshooting.',
    body: 'When something breaks, we isolate the fault and fix the machine — hardware, Windows, or both.',
    progress: 0.3,
  },
  {
    id: 'pc-upgrade',
    formValue: 'PC Upgrade',
    title: 'PC Upgrades',
    short: 'RAM, SSD, GPU, cooling, and targeted performance upgrades.',
    body: 'Keep the machine you have. Upgrade the parts that are holding it back.',
    progress: 0.16,
  },
  {
    id: 'consulting',
    formValue: 'IT Consulting',
    title: 'IT Consulting',
    short: 'Advice before you buy, build, or rebuild.',
    body: 'Technology advice, purchasing guidance, troubleshooting, and setup — so you are not guessing.',
    progress: 0.57,
  },
  {
    id: 'web',
    formValue: 'Website Development',
    title: 'Web Development',
    short: 'Websites, hosting, and ongoing maintenance — we keep the site up.',
    body: 'Professional websites for businesses and individuals. We build it, host it, and maintain it so you are not left with a page that goes stale.',
    progress: 0.4,
  },
  {
    id: 'ads',
    formValue: 'Advertising',
    title: 'Advertising',
    short: 'Facebook, Instagram, and other ads — set up and run so people actually see you.',
    body: 'Campaign setup and management on Facebook, Instagram, and similar platforms. You pay the ad spend. We make the ads run properly.',
    progress: 0.83,
  },
  {
    id: 'windows',
    formValue: 'Windows',
    title: 'Windows',
    short: 'Install, configure, update, and get drivers right.',
    body: 'Windows installation, configuration, updates and drivers using your genuine Windows license.',
    progress: 0.66,
  },
  {
    id: 'm365',
    formValue: 'Microsoft 365',
    title: 'Microsoft 365',
    short: 'Setup on your legitimate Microsoft subscription.',
    body: 'Installation, configuration and setup using your legitimate Microsoft 365 subscription. We do not sell Microsoft licenses.',
    progress: 0.66,
  },
  {
    id: 'support',
    formValue: 'Other',
    title: 'Tech Support',
    short: 'Hands-on help when the stack does not behave.',
    body: 'Practical support across hardware, Windows, and the software you already pay for.',
    progress: 0.83,
  },
] as const

export const formServices = [
  'PC Build',
  'PC Repair',
  'PC Upgrade',
  'IT Consulting',
  'Website Development',
  'Advertising',
  'Windows',
  'Microsoft 365',
  'Other',
] as const

export const budgetOptions = [
  'Prefer not to say',
  'Under R5 000',
  'R5 000–R15 000',
  'R15 000–R30 000',
  'R30 000–R50 000',
  'R50 000+',
] as const

export const osServices = [
  'Windows installation',
  'System setup',
  'Driver installation',
  'Microsoft 365 installation',
  'Software setup',
  'System configuration',
] as const

export const repairServices = [
  'Diagnostics',
  'Hardware Repair',
  'Windows Problems',
  'Overheating',
  'Slow PCs',
  'Upgrades',
  'Software Problems',
] as const

export const consultNodes = [
  { id: 'PC BUILD', desc: 'A machine specified around your software, budget and space.', service: 'PC Build' },
  { id: 'UPGRADE', desc: 'Keep the chassis. Change the parts that matter.', service: 'PC Upgrade' },
  { id: 'REPAIR', desc: 'Find the fault. Replace what failed. Leave the rest.', service: 'PC Repair' },
  { id: 'MICROSOFT 365', desc: 'Your subscription, installed and configured correctly.', service: 'Microsoft 365' },
  { id: 'WINDOWS', desc: 'A clean install and a system that boots the way it should.', service: 'Windows' },
  { id: 'WEBSITE', desc: 'A professional site we build, host, and keep running.', service: 'Website Development' },
  { id: 'ADS', desc: 'Facebook, Instagram, and similar — campaigns set up so the business is actually seen.', service: 'Advertising' },
  { id: 'NETWORK', desc: 'The unglamorous layer that makes everything else reliable.', service: 'Other' },
  { id: 'BUSINESS IT', desc: 'Practical technology decisions without the enterprise theatre.', service: 'IT Consulting' },
] as const

export const chipActions: Record<string, { service: string; body: string }> = {
  Diagnostics: { service: 'PC Repair', body: 'We isolate the fault before replacing parts.' },
  'Hardware Repair': { service: 'PC Repair', body: 'Failed boards, power, storage, and cooling — diagnosed then fixed.' },
  'Windows Problems': { service: 'Windows', body: 'Boot loops, drivers, updates, and installs using your genuine license.' },
  Overheating: { service: 'PC Repair', body: 'Dust, paste, fans, and airflow. Heat is usually a hardware problem.' },
  'Slow PCs': { service: 'PC Upgrade', body: 'Often storage, memory, or a tired drive. We tell you which.' },
  Upgrades: { service: 'PC Upgrade', body: 'RAM, SSD, GPU, and cooling — keep the machine, change the bottleneck.' },
  'Software Problems': { service: 'Other', body: 'Apps that will not launch, profiles that will not load, the unglamorous layer.' },
  'Windows installation': { service: 'Windows', body: 'Clean install and setup using your genuine Windows license.' },
  'System setup': { service: 'Windows', body: 'Accounts, updates, drivers, and a machine that is actually ready to use.' },
  'Driver installation': { service: 'Windows', body: 'Chipset, GPU, and peripherals — the parts Windows will not magic into place.' },
  'Microsoft 365 installation': { service: 'Microsoft 365', body: 'Installed and configured on your legitimate Microsoft subscription.' },
  'Software setup': { service: 'Other', body: 'The apps you already pay for, installed so they actually work.' },
  'System configuration': { service: 'Windows', body: 'Power, storage, network, and the boring settings that make a PC feel finished.' },
  PERFORMANCE: { service: 'PC Build', body: 'Specified around the software you actually run.' },
  RELIABILITY: { service: 'PC Repair', body: 'Stable power, cooling, and storage — the unsexy parts that keep a machine honest.' },
  UPGRADES: { service: 'PC Upgrade', body: 'A path to more speed without throwing the whole chassis away.' },
  WORK: { service: 'PC Build', body: 'Quiet, dense, and built for the apps in the job.' },
  GAMING: { service: 'PC Build', body: 'GPU, cooling, and power specified for the titles you play.' },
  CREATIVE: { service: 'PC Build', body: 'RAM, storage, and color-accurate output for making things.' },
}
