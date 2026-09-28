import { services, site } from '../config/site.ts'
import { openQuote } from '../lib/actions.ts'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <strong>{site.name}</strong>
        <p>{site.line}</p>
        <p>{site.tagline}</p>
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
      <p className="footer-note">
        Windows and Microsoft 365 work is performed with the customer’s genuine license or
        subscription. We do not sell Microsoft licenses.
      </p>
      <p className="footer-note">
        {site.email}
      </p>
    </footer>
  )
}
