import { services, site } from '../config/site.ts'
import { openQuote } from '../lib/actions.ts'
import { HexMark } from './Mark.tsx'
import { MagneticButton } from './MagneticButton.tsx'

type Props = {
  reason?: 'webgl' | 'motion'
}

const ticker = 'PCs · Repairs · Consulting · Web · Ads · Windows · Microsoft 365 · '

const chapters = [
  {
    id: 'builds',
    index: '01',
    kicker: 'Hardware',
    title: 'Built for you.',
    body: 'Custom gaming, work, and business PCs specified around the software you actually run — assembled, cabled, and ready.',
    cta: 'Build your PC',
    service: 'PC Build',
    image: '/media/build.jpg',
    imageAlt: 'Open custom PC chassis with cyan edge lighting',
  },
  {
    id: 'repairs',
    index: '02',
    kicker: 'Diagnostics',
    title: 'Something broke. We fix it.',
    body: 'Diagnostics first. Then hardware repair, Windows recovery, cooling, storage, and the slow machines that just need the right part.',
    cta: 'Book a repair',
    service: 'PC Repair',
    image: '/media/repair.jpg',
    imageAlt: 'Motherboard under diagnostic light',
    flip: true,
  },
] as const

const modules = [
  {
    id: 'web',
    index: '03',
    kicker: 'Web',
    title: 'Your business. Your website.',
    body: 'We build the site, host it, and keep it maintained so you are not left with a page that goes stale.',
    service: 'Website Development',
  },
  {
    id: 'ads',
    index: '04',
    kicker: 'Ads',
    title: 'Facebook. Instagram. Seen.',
    body: 'Campaigns set up and run on the platforms people already use. You pay the ad spend. We make it run properly.',
    service: 'Advertising',
  },
  {
    id: 'consulting',
    index: '05',
    kicker: 'Network',
    title: 'Don’t know what you need?',
    body: 'Tell us what you are trying to accomplish. We will help you figure out the technology before you buy, build, or rebuild.',
    service: 'IT Consulting',
  },
  {
    id: 'systems',
    index: '06',
    kicker: 'Systems',
    title: 'Your tech. Set up right.',
    body: 'Windows and Microsoft 365 installed and configured on your genuine licence or subscription. We do not sell Microsoft licences.',
    service: 'Windows',
  },
] as const

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
              Cape Town · Systems online
            </p>
            <h1>
              <span className="stage-word">ZACH</span>
              <span className="stage-of">OF ALL</span>
              <span className="stage-word">TRADES</span>
            </h1>
            <p className="lede">{site.tagline}</p>
            <p className="body">{site.line}</p>
            {reason === 'motion' && (
              <p className="fall-note">Motion is reduced. This is the still version of the studio.</p>
            )}
            <div className="beat-actions">
              <MagneticButton className="primary" onClick={() => openQuote()}>
                Get a quote
              </MagneticButton>
              <MagneticButton className="ghost" href={`https://wa.me/${site.whatsapp}`}>
                WhatsApp
              </MagneticButton>
            </div>
            <ul className="stage-meta">
              <li>{site.city}</li>
              <li>{site.email}</li>
              <li>
                <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
              </li>
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
            <h2>{chapter.title}</h2>
            <p className="body">{chapter.body}</p>
            <MagneticButton className="primary" onClick={() => openQuote(chapter.service)}>
              {chapter.cta}
            </MagneticButton>
          </div>
        </section>
      ))}

      <section className="stage-modules">
        {modules.map((mod) => (
          <button
            key={mod.id}
            type="button"
            id={mod.id === 'systems' ? undefined : mod.id}
            className="stage-mod"
            onClick={() => openQuote(mod.service)}
          >
            <p className="kicker">
              {mod.index} · {mod.kicker}
            </p>
            <h2>{mod.title}</h2>
            <p className="body">{mod.body}</p>
            <span className="stage-mod-go">Request this</span>
          </button>
        ))}
      </section>

      <section id="services" className="stage-catalog">
        <header className="stage-catalog-head">
          <p className="kicker">07 · Services</p>
          <h2>The whole machine.</h2>
          <p className="body">Pick a path. We quote the work, then we do it.</p>
        </header>
        <div className="stage-catalog-grid">
          {services.map((s, i) => (
            <button key={s.id} type="button" className="stage-card" onClick={() => openQuote(s.formValue)}>
              <span className="stage-card-index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
              <span className="stage-card-go">Request this</span>
            </button>
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
          <MagneticButton className="ghost" href={`https://wa.me/${site.whatsapp}`}>
            WhatsApp {site.phoneDisplay}
          </MagneticButton>
        </div>
      </section>
    </main>
  )
}
