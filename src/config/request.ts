import { bandsFor, noteFor } from './pricing.ts'
import { formServices } from './site.ts'

export type ServiceValue = (typeof formServices)[number]

export type ServiceBrief = {
  value: ServiceValue
  label: string
  hint: string
  kicker: string
  headline: string[]
  promise: string
  includes: string[]
  note: string
  needs: string[]
  prompt: string
  tone: 'build' | 'repair' | 'upgrade' | 'advice' | 'web' | 'ads' | 'windows' | 'm365' | 'other'
}

export type BriefView = {
  kicker: string
  headline: string[]
  promise: string
  includes: string[]
  sequence?: string[]
  note: string
  range: string
  budgets: readonly string[]
  tone: ServiceBrief['tone'] | 'combo'
}

export const serviceBriefs: ServiceBrief[] = [
  {
    value: 'PC Build',
    label: 'PC Build',
    hint: 'Specified around your software, space, and the power you actually have.',
    kicker: '01 — THE MACHINE',
    headline: ['SPECIFIED.', 'ASSEMBLED.', 'YOURS.'],
    promise:
      'A PC built around the titles and tools you actually run — not a shelf box with a sticker. Parts chosen for South African stock, the room it will live in, and the power that reaches the wall.',
    includes: [
      'Spec around gaming, work, or both',
      'Assembly, BIOS, and a burn-in before it leaves',
      'PSU headroom and an optional UPS path for load-shedding',
      'Windows only on your genuine licence',
    ],
    note: 'We do not sell Microsoft licences.',
    needs: ['Gaming', 'Work / office', 'Video / creative', 'Student', 'Small business', 'Load-shedding ready'],
    prompt: 'What must it run, how loud can it be, and is Eskom part of the problem?',
    tone: 'build',
  },
  {
    value: 'PC Repair',
    label: 'Repair',
    hint: 'Diagnose first. Quote before a single part is swapped.',
    kicker: '03 — THE FAULT',
    headline: ['SOMETHING BROKE.', 'WE FIND IT.'],
    promise:
      'Isolate the fault — board, power, storage, or Windows — then a figure you can accept or walk away from. No mystery labour. Load-shedding and surge damage are on the table.',
    includes: [
      'Hardware and Windows diagnosis',
      'Quote before the repair',
      'Surge / load-shedding considered',
      'Honest call if the machine is not worth it',
    ],
    note: 'Diagnosis is the job. Parts are a separate yes.',
    needs: ["Won't turn on", 'Load-shedding / surge', 'Runs slow', 'Overheating', 'Error / crash', 'Not sure'],
    prompt: 'What happened, when it started, and was there a power cut, smell, lights, or beeps?',
    tone: 'repair',
  },
  {
    value: 'PC Upgrade',
    label: 'Upgrade',
    hint: 'Keep the chassis. Change the part that is holding it back.',
    kicker: '02 — THE BOTTLENECK',
    headline: ['KEEP THE CHASSIS.', 'CHANGE THE LIMIT.'],
    promise:
      'RAM, SSD, GPU, cooling — the piece this board and this PSU can actually take, fitted so the rest of the machine still makes sense. Quoted honestly, not in hope.',
    includes: [
      'Find the real bottleneck',
      'Parts that fit this board and PSU',
      'Fit, drivers, and a sanity check',
      'A straight answer if a new build is cheaper',
    ],
    note: 'Sometimes the honest upgrade is a different machine. We will say so.',
    needs: ['More RAM', 'Faster SSD', 'Better GPU', 'Cooler / quieter', 'For load-shedding', 'Not sure'],
    prompt: 'What feels slow, loud, or full — and how old is the machine?',
    tone: 'upgrade',
  },
  {
    value: 'IT Consulting',
    label: 'Advice',
    hint: 'A recommendation before you buy, build, or throw it out.',
    kicker: '06 — BEFORE YOU SPEND',
    headline: ['DON’T GUESS.', 'ASK FIRST.'],
    promise:
      'What to buy locally, what to skip, whether to repair or replace — a clear next step before the invoice. If the next step is our work, the advice rolls into the job.',
    includes: [
      'Fix versus replace, as a number',
      'What to buy in SA, and what not to',
      'Home, load-shedding, or small business',
      'A path, not a product list',
    ],
    note: 'Advice is the product. Hardware only if you want it next.',
    needs: ['Buying a PC', 'Fix vs replace', 'Home / load-shedding', 'Small business'],
    prompt: 'What are you trying to get done, and what have you already been told to buy?',
    tone: 'advice',
  },
  {
    value: 'Website Development',
    label: 'Website',
    hint: 'We build the site, host it, and keep it maintained.',
    kicker: '04 — THE STOREFRONT',
    headline: ['YOUR BUSINESS.', 'ON EVERY PHONE.'],
    promise:
      'A site that loads in South Africa, looks like the business, and lets people WhatsApp, call, or enquire without hunting. We host it and maintain it — not a hand-off you have to babysit.',
    includes: [
      'Mobile-first pages',
      'WhatsApp, call, and email paths',
      'Hosting on our side',
      'Ongoing maintenance after launch',
    ],
    note: 'We host and maintain the site. A custom domain can be added when you are ready.',
    needs: ['New site', 'Replace an old one', 'Hosting', 'Ongoing maintenance', 'WhatsApp enquiries'],
    prompt: 'What is the site for, and should people WhatsApp you from it?',
    tone: 'web',
  },
  {
    value: 'Advertising',
    label: 'Ads',
    hint: 'Facebook, Instagram, and similar — set up and run. You pay the platforms.',
    kicker: '05 — THE SIGNAL',
    headline: ['BE SEEN.', 'ON PURPOSE.'],
    promise:
      'Ads on Facebook, Instagram, and other platforms people already use — targeting, creative, and a campaign that actually runs. Ad spend stays on your account. We do the setup and the running.',
    includes: [
      'Facebook and Instagram campaign setup',
      'Other platforms if that is where the customers are',
      'Targeting and creative, not a random boost',
      'Reporting you can read',
    ],
    note: 'You pay Facebook, Instagram, and the rest directly. We do not mark up the ad spend.',
    needs: ['Facebook', 'Instagram', 'Both', 'Something else', 'Not sure yet'],
    prompt: 'Where should people see you, what are you selling or offering, and do you already have pages?',
    tone: 'ads',
  },
  {
    value: 'Windows',
    label: 'Windows',
    hint: 'Install and set up using the genuine licence you already own.',
    kicker: '07 — THE SYSTEM',
    headline: ['YOUR LICENCE.', 'A CLEAN MACHINE.'],
    promise:
      'A clean Windows install on the licence you already paid for — drivers that match this hardware, your account, updates, and a desktop that is actually ready to use.',
    includes: [
      'Clean install or repair install',
      'Drivers for this machine',
      'Your Microsoft account, not a generic one',
      'Updates and a first-boot check',
    ],
    note: 'We do not sell Windows licences. Bring yours, or buy it from Microsoft.',
    needs: ['New install', "Won't boot", 'Drivers / updates', 'After load-shedding'],
    prompt: 'New machine, a machine that will not boot, or drivers after a crash?',
    tone: 'windows',
  },
  {
    value: 'Microsoft 365',
    label: 'Microsoft 365',
    hint: 'Outlook, Word, Excel, Teams — on the subscription you already pay for.',
    kicker: '07 — THE SUITE',
    headline: ['YOUR SUBSCRIPTION.', 'WORKING.'],
    promise:
      'Installed and signed in on the Microsoft 365 you already own — home, school, or small office. Mail, OneDrive, and the apps. We do not sell licences.',
    includes: [
      'Apps installed on your PCs',
      'Mail and OneDrive signed in',
      'A few machines if that is the office',
      'Nothing grey-market',
    ],
    note: 'The subscription must already be yours — Microsoft, a reseller, school, or work.',
    needs: ['Install apps', 'Mail / Outlook', 'Already subscribed', 'A few PCs'],
    prompt: 'Which apps, how many PCs, and is the subscription already in your name?',
    tone: 'm365',
  },
  {
    value: 'Other',
    label: 'Something else',
    hint: 'Printers, Wi-Fi, backups — say the outcome. We will say if it is ours.',
    kicker: '09 — THE REST',
    headline: ['IF IT IS TECH,', 'SAY IT.'],
    promise:
      'The awkward job that is not on the list. Tell us what “done” looks like. We will tell you if it is our work, and quote it.',
    includes: ['A straight yes or no', 'A figure if it is yes', 'A pointer if it is not'],
    note: 'If it is not ours, we will not pretend it is.',
    needs: [],
    prompt: 'Describe the problem, the outcome you want, and where the machine lives.',
    tone: 'other',
  },
]

const ORDER = [...formServices]

function keyOf(values: string[]): string {
  return [...values].sort((a, b) => ORDER.indexOf(a as ServiceValue) - ORDER.indexOf(b as ServiceValue)).join('|')
}

type ComboSpec = {
  kicker: string
  headline: string[]
  promise: string
  sequence: string[]
  note: string
}

const combos: Record<string, ComboSpec> = {
  'PC Build|Windows': {
    kicker: 'STACK — DESK READY',
    headline: ['BUILT.', 'BOOTED.', 'YOURS.'],
    promise:
      'The machine specified around your work, then Windows installed on your genuine licence so you sit down to a desktop — not a project.',
    sequence: ['Specify the hardware', 'Assemble and burn-in', 'Install your Windows', 'Hand it over ready'],
    note: 'Licence stays yours. One figure for the box and the setup.',
  },
  'PC Build|Microsoft 365': {
    kicker: 'STACK — OPEN TO WORK',
    headline: ['A MACHINE THAT', 'OPENS TO WORK.'],
    promise:
      'Hardware specified for the apps you live in, then Microsoft 365 signed in on the subscription you already pay for.',
    sequence: ['Specify the PC', 'Assemble', 'Install your Microsoft 365', 'Mail and files in place'],
    note: 'We do not sell the subscription. We make it work on this machine.',
  },
  'PC Build|Windows|Microsoft 365': {
    kicker: 'STACK — FIRST DAY',
    headline: ['THE WHOLE DESK,', 'DAY ONE.'],
    promise:
      'Build, Windows, Microsoft 365 — sequenced as one job. You sit down to a machine that boots, signs in, and is ready for the actual work.',
    sequence: ['Specify and assemble', 'Your Windows licence', 'Your Microsoft 365', 'A desk you can use today'],
    note: 'Both licences stay yours. One figure for the stack.',
  },
  'PC Build|PC Repair': {
    kicker: 'STACK — DECIDE',
    headline: ['SAVE THIS ONE,', 'OR BUILD THE NEXT.'],
    promise:
      'Diagnose the machine you have. If the number makes sense, we repair. If it does not, the same visit becomes a spec for the replacement — no wasted trip.',
    sequence: ['Diagnose what you have', 'Quote the repair', 'If it is not worth it, spec the new build'],
    note: 'You choose after the number. Not before.',
  },
  'PC Build|PC Upgrade': {
    kicker: 'STACK — HEADROOM',
    headline: ['BUILD IT WITH', 'ROOM TO GROW.'],
    promise:
      'A machine specified for now, with the board, PSU, and case chosen so the next RAM, SSD, or GPU still fits — instead of starting over in a year.',
    sequence: ['Spec for today', 'Leave headroom', 'Note the upgrade path'],
    note: 'The cheap box that cannot be upgraded is the expensive one.',
  },
  'PC Build|IT Consulting': {
    kicker: 'STACK — THEN BUILD',
    headline: ['THE PLAN.', 'THEN THE BOX.'],
    promise:
      'Decide what you actually need — for local stock and power — then build that, not the machine a shop had on special.',
    sequence: ['What the work needs', 'What to spend', 'Then assemble that spec'],
    note: 'Advice rolls into the build. You are not charged twice for the same thinking.',
  },
  'PC Build|Website Development': {
    kicker: 'STACK — HOUSE AND SIGN',
    headline: ['THE MACHINE', 'AND THE STOREFRONT.'],
    promise:
      'A PC that can do the work, and a site that can take the calls. One request, two outcomes, sequenced so neither waits on the other forever.',
    sequence: ['Spec the machine', 'Build and host the site', 'Keep it maintained'],
    note: 'We host and maintain the site. Separate quotes if the scopes are different.',
  },
  'PC Repair|PC Upgrade': {
    kicker: 'STACK — HONEST AGAIN',
    headline: ['FIX THE FAULT.', 'THEN THE LIMIT.'],
    promise:
      'Make it reliable first. Then change the part that was holding it back. You do not upgrade a machine that still has a fault hiding in it.',
    sequence: ['Find what failed', 'Quote the repair', 'Upgrade the bottleneck', 'Hand it back working harder'],
    note: 'If the repair number is ugly, we stop before the upgrade.',
  },
  'PC Repair|Windows': {
    kicker: 'STACK — ALIVE AGAIN',
    headline: ['HARDWARE AND THE OS', 'THAT WOULDN’T.'],
    promise:
      'If it is a part, we replace the part. If it is Windows, we install your genuine licence. If it is both, we do not guess — we sequence it.',
    sequence: ['Diagnose hardware vs software', 'Repair what failed', 'Clean Windows if it is needed'],
    note: 'Bring the licence. We will not invent one.',
  },
  'PC Repair|IT Consulting': {
    kicker: 'STACK — BEFORE PARTS',
    headline: ['DIAGNOSE.', 'THEN DECIDE.'],
    promise:
      'Find the fault, then a recommendation: repair, upgrade, or stop putting money into this chassis.',
    sequence: ['Diagnose', 'A number', 'Your call'],
    note: 'The advice is the point of the visit. The repair is optional.',
  },
  'PC Repair|Microsoft 365': {
    kicker: 'STACK — BACK TO MAIL',
    headline: ['THE MACHINE,', 'THEN THE MAIL.'],
    promise:
      'Get the PC honest again, then sign Microsoft 365 back in on the subscription you already own so work does not live in a browser tab forever.',
    sequence: ['Repair the PC', 'Install your Microsoft 365', 'Mail and files back'],
    note: 'Subscription must already be yours.',
  },
  'PC Upgrade|Windows': {
    kicker: 'STACK — FRESH',
    headline: ['NEW PARTS.', 'CLEAN INSTALL.'],
    promise:
      'Fit the upgrade, then a clean Windows on your licence so the new SSD or RAM is not dragging an old, tired profile behind it.',
    sequence: ['Fit the parts', 'Clean Windows on your licence', 'Drivers for the new hardware'],
    note: 'Backup first if there is anything you cannot lose.',
  },
  'PC Upgrade|IT Consulting': {
    kicker: 'STACK — THE RIGHT PART',
    headline: ['KNOW THE LIMIT.', 'THEN BUY IT.'],
    promise:
      'Find the bottleneck, then spend on that — not on a GPU this PSU cannot feed, or RAM this board will not take.',
    sequence: ['Identify the limit', 'A part that actually fits', 'Fit it'],
    note: 'The consultation is how we avoid a wasted order.',
  },
  'Website Development|Advertising': {
    kicker: 'STACK — FOUND AND FOUND',
    headline: ['A SITE.', 'THEN THE ADS.'],
    promise:
      'A professional site worth sending people to, then Facebook and Instagram ads that actually send them. One conversation, two jobs, sequenced so the ads are not pointing at a page that is not ready.',
    sequence: ['Build and host the site', 'Contact paths that work', 'Set up and run the ads'],
    note: 'We host and maintain the site. Ad spend on the platforms stays yours.',
  },
  'IT Consulting|Advertising': {
    kicker: 'STACK — THEN SIGNAL',
    headline: ['WHO TO REACH.', 'THEN REACH THEM.'],
    promise:
      'Who the business is for, then ads on Facebook, Instagram, or wherever those people actually are — instead of boosting a post and hoping.',
    sequence: ['Who you need', 'Where they are', 'Run the campaigns'],
    note: 'You pay the platforms. We run the work.',
  },
  'IT Consulting|Website Development': {
    kicker: 'STACK — PRESENCE',
    headline: ['A SITE WITH', 'A REASON.'],
    promise:
      'What the site must do for the business — then build that, with WhatsApp and contact paths that match how South African customers actually get in touch.',
    sequence: ['What the business needs online', 'Build and host it', 'Keep it maintained'],
    note: 'We host and maintain the site. We will not build five pages you will never use.',
  },
  'IT Consulting|Windows': {
    kicker: 'STACK — THE SYSTEM',
    headline: ['WHAT YOU NEED.', 'THEN SET IT UP.'],
    promise:
      'Whether this machine wants a clean install, a repair, or a replacement — then Windows on your genuine licence if that is still the right path.',
    sequence: ['Decide the path', 'Install only if it is still the machine'],
    note: 'We do not sell the licence.',
  },
  'Windows|Microsoft 365': {
    kicker: 'STACK — MICROSOFT',
    headline: ['YOUR LICENCES.', 'INSTALLED RIGHT.'],
    promise:
      'Windows and Microsoft 365 on the subscriptions you already own. Nothing grey-market. Nothing we pretend to sell. Mail, files, and a desktop that agrees with itself.',
    sequence: ['Your Windows', 'Your Microsoft 365', 'Signed in, drivers, ready'],
    note: 'Bring both licences or subscriptions. That is the whole point.',
  },
  'Website Development|Microsoft 365': {
    kicker: 'STACK — OFFICE AND WINDOW',
    headline: ['THE SHOP WINDOW,', 'AND THE OFFICE.'],
    promise:
      'A site the public can use, and Microsoft 365 the business can work in — contact on the site, mail in Outlook, without the two living in different decades.',
    sequence: ['Site, hosting, and contact paths', 'Microsoft 365 signed in', 'Mail that matches the domain if you have it'],
    note: 'We host and maintain the site. The Microsoft subscription stays yours.',
  },
  'PC Repair|PC Upgrade|Windows': {
    kicker: 'STACK — THE WHOLE MACHINE',
    headline: ['FAULT.', 'BOTTLENECK.', 'SYSTEM.'],
    promise:
      'Repair what failed, upgrade what is slow, then Windows on your licence so the machine you hand back is the one you meant to have.',
    sequence: ['Diagnose', 'Repair', 'Upgrade', 'Clean Windows'],
    note: 'We stop at whichever step the number no longer makes sense.',
  },
  'PC Repair|Windows|Microsoft 365': {
    kicker: 'STACK — BACK TO WORK',
    headline: ['ALIVE.', 'SIGNED IN.', 'WORKING.'],
    promise:
      'The PC honest again, Windows if it needs it, Microsoft 365 on your subscription so Monday does not start in a queue at a shop.',
    sequence: ['Repair', 'Windows if needed', 'Microsoft 365 signed in'],
    note: 'Licences stay yours.',
  },
  'IT Consulting|PC Build|Windows': {
    kicker: 'STACK — FROM ZERO',
    headline: ['DECIDE.', 'BUILD.', 'BOOT.'],
    promise:
      'A plan, a machine specified for local stock and power, Windows on your licence. The long way around a bad purchase.',
    sequence: ['What you need', 'Build that', 'Your Windows'],
    note: 'Advice is not a separate invoice if we build it.',
  },
}

function briefsFor(values: string[]): ServiceBrief[] {
  return serviceBriefs
    .filter((item) => values.includes(item.value))
    .sort((a, b) => values.indexOf(a.value) - values.indexOf(b.value))
}


function synthesize(chosen: ServiceBrief[]): BriefView {
  const values = chosen.map((item) => item.value)
  const labels = chosen.map((item) => item.label)
  const licence = values.some((value) => value === 'Windows' || value === 'Microsoft 365')
  return {
    kicker: chosen.length > 2 ? 'STACK — THE JOB' : `STACK — ${labels.join(' + ').toUpperCase()}`,
    headline:
      chosen.length === 2
        ? [labels[0].toUpperCase() + '.', labels[1].toUpperCase() + '.']
        : ['ONE REQUEST.', `${chosen.length} LAYERS.`],
    promise: `We will sequence ${labels.join(', ')} as one visit where we can — so you are not paying twice for the same trip. Hardware first if there is hardware. Then the system. Then the presence.`,
    includes: [...new Set(chosen.flatMap((item) => item.includes))].slice(0, 6),
    sequence: labels.map((label) => label),
    note: licence
      ? 'Windows and Microsoft 365 work uses your genuine licence or subscription. We do not sell Microsoft licences.'
      : 'One conversation. We will say if a piece is not ours.',
    range: noteFor(values),
    budgets: bandsFor(values),
    tone: 'combo',
  }
}

export function resolveBrief(values: string[]): BriefView | null {
  const chosen = briefsFor(values)
  if (!chosen.length) return null
  if (chosen.length === 1) {
    const item = chosen[0]
    return {
      kicker: item.kicker,
      headline: item.headline,
      promise: item.promise,
      includes: item.includes,
      note: item.note,
      range: noteFor([item.value]),
      budgets: bandsFor([item.value]),
      tone: item.tone,
    }
  }
  const named = combos[keyOf(values)]
  if (named) {
    return {
      kicker: named.kicker,
      headline: named.headline,
      promise: named.promise,
      includes: [...new Set(chosen.flatMap((item) => item.includes))].slice(0, 5),
      sequence: named.sequence,
      note: named.note,
      range: noteFor(values),
      budgets: bandsFor(values),
      tone: 'combo',
    }
  }
  return synthesize(chosen)
}

export const requestOptions = serviceBriefs
