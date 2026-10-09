import { serviceHref, services, site } from '../config/site.ts'
import { onHashLinkClick, openQuote } from '../lib/actions.ts'
import { ContactActions } from './ContactActions.tsx'
import { HexMark } from './Mark.tsx'
import { MagneticButton } from './MagneticButton.tsx'
import { OfferSections } from './OfferSections.tsx'

type Props = {
  reason?: 'webgl' | 'motion'
}

const ticker = 'PCs · Repairs · Consulting · Web · Ads · Windows · Microsoft 365 · '

const chapters = [
  {
    id: 'builds',
    index: '01',
    kicker: 'Hardware',
    title: 'Custom PC builds and upgrades',
    body: 'Custom gaming, work, and business PCs specified around the software you actually run — assembled, cabled, and ready. Upgrades keep the machine you have and change the parts that hold it back.',
    cta: 'Build your PC',
    service: 'PC Build',
    href: '/custom-pcs/',
    image: '/media/build.jpg',
    imageAlt: 'Custom-built desktop PC with an open chassis and cyan edge lighting',
  },
  {
    id: 'repairs',
    index: '02',
    kicker: 'Diagnostics',
    title: 'Computer repairs',
    body: 'Computer repairs in Cape Town start with diagnostics. Then hardware repair, Windows recovery, cooling, storage, and the slow machines that just need the right part.',
    cta: 'Book a repair',
    service: 'PC Repair',
    href: '/computer-repairs/',
    image: '/media/repair.jpg',
    imageAlt: 'Computer motherboard on a diagnostic bench under inspection lighting',
    flip: true,
  },
] as const

const leads = [
  {
    target: 'web',
    index: '03',
    kicker: 'Web',
    title: 'Website design and development',
    body: 'Professional websites from R2,500.',
    go: 'Explore Web Development',
    href: '/web-design/',
  },
  {
    target: 'ads',
    index: '04',
    kicker: 'Ads',
    title: 'Advertising management',
    body: 'Facebook, Instagram and Google advertising management from R750/month.',
    go: 'Explore Advertising',
  },
  {
    target: 'care',
    index: '05',
    kicker: 'Care',
    title: 'Website maintenance',
    body: 'Ongoing website maintenance from R450/month.',
    go: 'View Maintenance Plans',
  },
] as const

const modules = [
  {
    id: 'consulting',
    index: '06',
    kicker: 'Consulting',
    title: 'IT support and consulting',
    body: 'Tell us what you are trying to get done. IT support and consulting helps you choose the right technology before you buy, build, or rebuild.',
    service: 'IT Consulting',
    go: 'Request IT advice',
  },
  {
    id: 'systems',
    index: '07',
    kicker: 'Systems',
    title: 'Windows and Microsoft 365',
    body: 'Windows and Microsoft 365 installed and configured on your genuine licence or subscription. We do not sell Microsoft licences.',
    service: 'Windows',
    go: 'Request Windows setup',
  },
] as const

function catalogGo(id: string): string {
  switch (id) {
    case 'pc-build':
      return 'Build your PC'
    case 'pc-repair':
      return 'Request a repair'
    case 'pc-upgrade':
      return 'Discuss an upgrade'
    case 'consulting':
      return 'Request IT advice'
    case 'web':
      return 'Explore Web Development'
    case 'ads':
      return 'Explore Advertising'
    case 'care':
      return 'View Maintenance Plans'
    case 'windows':
      return 'Request Windows setup'
    case 'm365':
      return 'Request Microsoft 365 setup'
    case 'support':
      return 'Request tech support'
    default:
      return 'Get a quote'
  }
}

export function Fallback2D({ reason }: Props) {
  return (
    <main className="stage">
      <section className="stage-hero" id="top">
        <img
          className="stage-hero-photo"
          src="/media/hangar.jpg"
          alt=""
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
        />
        <div className="stage-hero-shade" />
        <div className="stage-hero-grid" aria-hidden="true" />
        <HexMark className="stage-hero-hex" />
        <div className="stage-hero-inner">
          <div className="stage-hero-copy">
            <p className="kicker">
              <span className="stage-pip" aria-hidden="true" />
              Cape Town
            </p>
            <h1>
              <span className="stage-word">ZACH</span>
              <span className="stage-of">OF ALL</span>
              <span className="stage-word">TRADES</span>
            </h1>
            <p className="lede">{site.tagline}</p>
            <p className="body">{site.intro}</p>
            {reason === 'motion' && (
              <p className="fall-note">Motion is reduced. This is the still version of the studio.</p>
            )}
            <div className="beat-actions">
              <MagneticButton className="primary" href="#services">
                Explore services
              </MagneticButton>
              <MagneticButton className="ghost" onClick={() => openQuote()}>
                Get a quote
              </MagneticButton>
            </div>
            <ul className="stage-meta">
              <li>{site.city}</li>
            </ul>
          </div>
        </div>
        <p className="stage-scroll" aria-hidden="true">
          Scroll
        </p>
        <div className="stage-ticker" aria-hidden="true">
          <div className="stage-ticker-track">
            <span>{ticker}</span>
            <span>{ticker}</span>
            <span>{ticker}</span>
          </div>
        </div>
      </section>

      {chapters.map((chapter) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className={chapter.id === 'repairs' ? 'stage-chapter is-flip' : 'stage-chapter'}
        >
          <figure className="stage-chapter-frame">
            <img
              src={chapter.image}
              alt={chapter.imageAlt}
              width="1400"
              height="1050"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="stage-chapter-copy">
            <p className="kicker">
              {chapter.index} · {chapter.kicker}
            </p>
            <h2>
              <a href={chapter.href}>{chapter.title}</a>
            </h2>
            <p className="body">{chapter.body}</p>
            <MagneticButton className="primary" onClick={() => openQuote(chapter.service)}>
              {chapter.cta}
            </MagneticButton>
          </div>
        </section>
      ))}

      <section className="stage-leads">
        {leads.map((lead) => (
          <a
            key={lead.target}
            className="stage-lead"
            href={'href' in lead ? lead.href : `#${lead.target}`}
            onClick={onHashLinkClick}
          >
            <p className="kicker">
              {lead.index} · {lead.kicker}
            </p>
            <p className="stage-lead-title">{lead.title}</p>
            <p className="body">{lead.body}</p>
            <span className="stage-mod-go">{lead.go}</span>
          </a>
        ))}
      </section>

      <OfferSections />

      <section className="stage-modules">
        {modules.map((mod) => (
          <a
            key={mod.id}
            id={mod.id}
            className="stage-mod"
            href="#contact"
            onClick={(event) => {
              event.preventDefault()
              openQuote(mod.service)
            }}
          >
            <p className="kicker">
              {mod.index} · {mod.kicker}
            </p>
            <h2>{mod.title}</h2>
            <p className="body">{mod.body}</p>
            <span className="stage-mod-go">{mod.go}</span>
          </a>
        ))}
      </section>

      <section id="services" className="stage-catalog">
        <header className="stage-catalog-head">
          <p className="kicker">08 · Services</p>
          <h2>Services</h2>
          <p className="body">Choose a service. We quote the work, then we do it.</p>
        </header>
        <div className="stage-catalog-grid">
          {services.map((s, i) => (
            <a
              key={s.id}
              className="stage-card"
              href={serviceHref(s.id)}
              onClick={(event) => {
                if (serviceHref(s.id) === '#contact') {
                  event.preventDefault()
                  openQuote(s.formValue)
                  return
                }
                onHashLinkClick(event)
              }}
            >
              <span className="stage-card-index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
              <span className="stage-card-go">{catalogGo(s.id)}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="stage-end">
        <HexMark className="stage-end-mark" />
        <p className="kicker">Zach of All Trades</p>
        <h2>
          Ready to build
          <br />
          something better?
        </h2>
        <p className="body">{site.line}</p>
        <div className="beat-actions">
          <MagneticButton className="primary" onClick={() => openQuote()}>
            Get a quote
          </MagneticButton>
          <ContactActions />
        </div>
      </section>
    </main>
  )
}
