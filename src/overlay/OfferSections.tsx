import {
  adsBillingDisclaimer,
  adsSpendDisclaimer,
  careDisclaimer,
  carePackages,
  combinedAdPackages,
  googleAdPackages,
  metaAdPackages,
  webExternalFeesDisclaimer,
  webPackages,
  webPricingDisclaimer,
  type OfferPackage,
} from '../config/offers.ts'
import { site } from '../config/site.ts'
import { openQuote } from '../lib/actions.ts'
import { MagneticButton } from './MagneticButton.tsx'

function OfferCard({ offer }: { offer: OfferPackage }) {
  const preview = offer.items.slice(0, 3)
  const rest = offer.items.slice(3)

  return (
    <article className="offer-card">
      <h3>{offer.name}</h3>
      <p className="offer-price">{offer.price}</p>
      {offer.management && offer.spend && (
        <p className="offer-split">
          <span>{offer.management}</span>
          <span className="offer-split-rule" aria-hidden="true" />
          <span>{offer.spend}</span>
        </p>
      )}
      <p className="offer-audience">{offer.audience}</p>
      <ul>
        {preview.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {offer.footnote ? <p className="offer-note">{offer.footnote}</p> : null}
      <MagneticButton className="primary" onClick={() => openQuote(offer.service, offer.extras)}>
        {offer.cta}
      </MagneticButton>
      {rest.length > 0 && (
        <details className="offer-details">
          <summary>
            <span className="offer-details-closed">View details</span>
            <span className="offer-details-open">Hide details</span>
          </summary>
          <p className="offer-include">{offer.includeLabel}</p>
          <ul>
            {rest.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}

function OfferGrid({ offers, columns }: { offers: OfferPackage[]; columns?: 2 | 3 }) {
  return (
    <div className={`offer-grid ${columns === 3 ? 'is-three' : ''}`}>
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  )
}

export function OfferSections() {
  return (
    <>
      <section id="web" className="offer">
        <header className="offer-head">
          <p className="kicker">03 · Web Development</p>
          <h2>
            <a href="/web-design/">Website design and development</a>
          </h2>
          <p className="body">
            Website design and development is quoted around the project — pages, functionality and
            integrations — from clear starting prices. Advertising is a separate service.
          </p>
          <p className="offer-work">
            <a href={site.studioUrl}>View our work</a>
          </p>
        </header>
        <OfferGrid offers={webPackages} />
        <aside className="offer-disclaimer">
          <p>{webPricingDisclaimer}</p>
          <p>{webExternalFeesDisclaimer}</p>
        </aside>
      </section>

      <section id="care" className="offer">
        <header className="offer-head">
          <p className="kicker">Website Care</p>
          <h2>Website maintenance</h2>
          <p className="body">Ongoing website maintenance for live sites, as an agreed monthly plan.</p>
        </header>
        <OfferGrid offers={carePackages} />
        <aside className="offer-disclaimer">
          <p>{careDisclaimer}</p>
        </aside>
      </section>

      <section id="ads" className="offer">
        <header className="offer-head">
          <p className="kicker">04 · Advertising</p>
          <h2>Facebook, Instagram and Google advertising</h2>
          <p className="body">
            Facebook, Instagram and Google advertising management from Zach of All Trades: setup,
            monitoring and optimisation on Meta and Google.
          </p>
        </header>
        <aside className="offer-callout">
          <p>
            <strong>Advertising spend is not included in the monthly management fee.</strong>
          </p>
          <p>{adsSpendDisclaimer}</p>
          <p>{adsBillingDisclaimer}</p>
          <p>
            Example: Ads Starter is R750/month management, plus a client-selected advertising budget. That R750 is for
            our work — it is not R750 of advertising.
          </p>
        </aside>

        <div className="offer-sub">
          <p className="kicker">Meta Advertising</p>
          <h3>Facebook + Instagram</h3>
        </div>
        <OfferGrid offers={metaAdPackages} columns={3} />

        <div className="offer-sub">
          <p className="kicker">Google Ads</p>
          <h3>Search and Google campaigns</h3>
          <p className="body">
            Google Ads management pricing varies with campaign complexity, competition, keywords, tracking requirements
            and the number of campaigns.
          </p>
        </div>
        <OfferGrid offers={googleAdPackages} columns={3} />

        <div className="offer-sub">
          <p className="kicker">Meta + Google</p>
          <h3>Combined management</h3>
          <p className="body">Advanced advertising requirements receive a custom quote.</p>
        </div>
        <OfferGrid offers={combinedAdPackages} />
      </section>
    </>
  )
}
