import { services, site } from '../config/site.ts'
import { openQuote } from '../lib/actions.ts'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <strong>{site.name}</strong>
        <p>
          {site.city}, {site.country}
        </p>
        <p>{site.line}</p>
        <p>{site.tagline}</p>
        <ul className="footer-meta">
          <li>{site.email}</li>
          <li>
            <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
          </li>
          <li>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </li>
          <li>
            <a href={site.studioUrl}>Studio</a>
          </li>
        </ul>
      </div>
      <ul className="footer-services">
        {services.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => openQuote(s.formValue)}>
              {s.title}
            </button>
          </li>
        ))}
      </ul>
      <p className="footer-about">
        {site.name} is a {site.city} practice for custom PCs, repairs, upgrades, IT consulting,
        websites with hosting and maintenance, Facebook and Instagram ads, Windows setup, and
        Microsoft 365 configuration.
      </p>
      <p className="footer-note">
        Windows and Microsoft 365 work is performed with the customer’s genuine license or
        subscription. We do not sell Microsoft licenses.
      </p>
    </footer>
  )
}
