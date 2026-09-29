import { services, site } from '../config/site.ts'
import { openQuote, openSection } from '../lib/actions.ts'
import { BrandMark } from './Mark.tsx'

const sectionIds = new Set(['web', 'ads', 'care'])

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <BrandMark className="footer-mark" />
          <strong>{site.name}</strong>
        </div>
        <ul className="footer-meta">
          <li>
            {site.city}, {site.country}
          </li>
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
            <button
              type="button"
              onClick={() => (sectionIds.has(s.id) ? openSection(s.id) : openQuote(s.formValue))}
            >
              {s.title}
            </button>
          </li>
        ))}
      </ul>
      <p className="footer-about">
        {site.name} is a {site.city} practice for custom PCs, repairs, upgrades, IT consulting,
        websites, website care, managed Facebook, Instagram and Google ads, Windows setup, and
        Microsoft 365 configuration. Windows and Microsoft 365 work uses the customer’s genuine
        license or subscription. We do not sell Microsoft licenses.
      </p>
    </footer>
  )
}
