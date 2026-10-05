import { useState } from 'react'
import { services, site } from '../config/site.ts'
import { openQuote, openSection } from '../lib/actions.ts'
import { BrandMark } from './Mark.tsx'

const sectionIds = new Set(['web', 'ads', 'care'])

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
            <button
              type="button"
              title={copied ? 'Email address copied' : site.email}
              aria-label={copied ? 'Email address copied' : `Copy ${site.email}`}
              onClick={() => {
                void navigator.clipboard.writeText(site.email).then(
                  () => {
                    setCopied(true)
                    window.setTimeout(() => setCopied(false), 1600)
                  },
                  () => {},
                )
              }}
            >
              {copied ? 'Copied' : 'Email'}
            </button>
          </li>
          <li>
            <a href={`tel:${site.phoneTel}`} title={`Call ${site.phoneDisplay}`} aria-label={`Call ${site.phoneDisplay}`}>
              Call
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
