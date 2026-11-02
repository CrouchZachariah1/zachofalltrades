import { serviceHref, services, site } from '../config/site.ts'
import { onHashLinkClick } from '../lib/actions.ts'
import { BrandMark } from './Mark.tsx'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="/" aria-label={`${site.name} homepage`}>
            <BrandMark className="footer-mark" />
            <strong>{site.name}</strong>
          </a>
        </div>
        <ul className="footer-meta">
          <li>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${site.phoneDisplay}`}
            >
              WhatsApp
            </a>
          </li>
          <li>
            <a href={`tel:${site.phoneTel}`} aria-label={`Call ${site.phoneDisplay}`}>
              Call
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`}>
              Email
            </a>
          </li>
        </ul>
      </div>
      <ul className="footer-services">
        {services.map((s) => (
          <li key={s.id}>
            <a href={serviceHref(s.id)} onClick={onHashLinkClick}>
              {s.title}
            </a>
          </li>
        ))}
      </ul>
      <p className="footer-about">
        {site.name} is a {site.city} practice for computer repairs, custom PC builds and upgrades,
        website design and development, IT support and consulting, website maintenance, and
        Facebook, Instagram and Google advertising management. Windows and Microsoft 365 work uses
        the customer’s genuine license or subscription. We do not sell Microsoft licenses.
      </p>
    </footer>
  )
}
