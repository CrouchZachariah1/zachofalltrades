import { useState } from 'react'
import { serviceHref, services, site } from '../config/site.ts'
import { onHashLinkClick } from '../lib/actions.ts'
import { copySupportEmail } from './ContactActions.tsx'
import { BrandMark } from './Mark.tsx'

export function Footer() {
  const [copied, setCopied] = useState(false)

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
          <li>
            <a href={`mailto:${site.email}`} title={site.email} aria-label={`Email us at ${site.email}`}>
              Email us
            </a>
          </li>
          <li>
            <button
              type="button"
              title={copied ? 'Email address copied' : `Copy ${site.email}`}
              aria-label={copied ? 'Email address copied' : `Copy email address ${site.email}`}
              onClick={() => {
                void copySupportEmail().then((ok) => {
                  if (!ok) return
                  setCopied(true)
                  window.setTimeout(() => setCopied(false), 2000)
                })
              }}
            >
              {copied ? 'Copied' : 'Copy email'}
            </button>
            <span className="visually-hidden" role="status" aria-live="polite">
              {copied ? 'Email address copied' : ''}
            </span>
          </li>
          <li>
            <a href={`tel:${site.phoneTel}`} title={`Call ${site.phoneDisplay}`} aria-label={`Call ${site.phoneDisplay}`}>
              Call {site.phoneDisplay}
            </a>
          </li>
          <li>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              title={`WhatsApp ${site.phoneDisplay}`}
              aria-label={`WhatsApp ${site.phoneDisplay}`}
            >
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
