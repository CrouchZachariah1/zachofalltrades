import { type ServicePage as Page } from '../config/pages.ts'
import { site } from '../config/site.ts'
import { onSiteLinkClick, openQuote } from '../lib/actions.ts'
import { ContactActions } from './ContactActions.tsx'
import { MagneticButton } from './MagneticButton.tsx'

type Props = {
  page: Page
}

export function ServicePage({ page }: Props) {
  return (
    <main className="stage service-page">
      <section className="service-hero" id="top">
        <figure className="service-hero-frame">
          <img src={page.image} alt={page.imageAlt} width="1400" height="1050" fetchPriority="high" decoding="async" />
        </figure>
        <div className="service-hero-copy">
          <nav className="service-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <a href="/">{site.name}</a>
              </li>
              <li aria-current="page">{page.kicker}</li>
            </ol>
          </nav>
          <p className="kicker">{page.kicker}</p>
          <h1>{page.h1}</h1>
          <p className="body">{page.intro}</p>
          <div className="beat-actions">
            <MagneticButton className="primary" onClick={() => openQuote(page.quoteService)}>
              Get a quote
            </MagneticButton>
            <ContactActions />
          </div>
        </div>
      </section>

      {page.sections.map((section) => (
        <section key={section.heading} className="service-block">
          <h2>{section.heading}</h2>
          <p className="body">{section.body}</p>
          {section.items ? (
            <ul className="service-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="service-related">
        <h2>Related</h2>
        <ul>
          {page.related.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={onSiteLinkClick}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
