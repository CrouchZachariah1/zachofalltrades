import { site } from '../config/site.ts'

export function ContactNap() {
  return (
    <dl className="contact-nap">
      <div>
        <dt>Location</dt>
        <dd>
          {site.city}, {site.country}
        </dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </dd>
      </div>
      <div>
        <dt>Phone</dt>
        <dd>
          <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
        </dd>
      </div>
      <div>
        <dt>WhatsApp</dt>
        <dd>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
            {site.phoneDisplay}
          </a>
        </dd>
      </div>
    </dl>
  )
}
