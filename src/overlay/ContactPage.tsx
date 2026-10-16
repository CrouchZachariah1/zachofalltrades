import { contactPage } from '../config/pages.ts'
import { site } from '../config/site.ts'
import { ContactActions } from './ContactActions.tsx'

export function ContactPage() {
  return (
    <main className="stage service-page">
      <section className="service-hero" id="top">
        <figure className="service-hero-frame">
          <img
            src="/media/hangar.jpg"
            alt="Zach of All Trades studio hangar in Cape Town"
            width="1400"
            height="1050"
            fetchPriority="high"
            decoding="async"
          />
        </figure>
        <div className="service-hero-copy">
          <nav className="service-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <a href="/">{site.name}</a>
              </li>
              <li aria-current="page">{contactPage.kicker}</li>
            </ol>
          </nav>
          <p className="kicker">{contactPage.kicker}</p>
          <h1>{contactPage.h1}</h1>
          <p className="body">
            Cape Town. WhatsApp, call, email, or the quote form below. ZOAT Studio is the web
            development division — work and portfolio live there.
          </p>
          <div className="beat-actions">
            <ContactActions />
          </div>
        </div>
      </section>
      <section className="service-related">
        <h2>Pages</h2>
        <ul>
          <li>
            <a href="/computer-repairs/">Computer repairs</a>
          </li>
          <li>
            <a href="/custom-pcs/">Custom PCs</a>
          </li>
          <li>
            <a href="/web-design/">Website design</a>
          </li>
          <li>
            <a href="/it-support/">IT support</a>
          </li>
          <li>
            <a href={site.studioUrl}>ZOAT Studio</a>
          </li>
        </ul>
      </section>
    </main>
  )
}
