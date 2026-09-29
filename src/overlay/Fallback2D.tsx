import { chipActions, repairServices, services, site } from '../config/site.ts'
import { openQuote } from '../lib/actions.ts'
import { MagneticButton } from './MagneticButton.tsx'

type Props = {
  reason?: 'webgl' | 'motion'
}

export function Fallback2D({ reason }: Props) {
  return (
    <main className="fallback">
      <section className="fall-hero">
        <p className="kicker">CAPE TOWN</p>
        <h1>
          <span>ZACH</span>
          <span>OF ALL</span>
          <span>TRADES</span>
        </h1>
        <p className="lede">{site.line}</p>
        <p className="body">{site.tagline}</p>
        {reason === 'motion' && (
          <p className="fall-note">Motion is reduced. This is the still version of the studio.</p>
        )}
        {reason === 'webgl' && (
          <p className="fall-note">This device skipped the 3D layer. The work is still here.</p>
        )}
      </section>

      <section>
        <p className="kicker">HARDWARE</p>
        <h2>BUILT FOR YOU.</h2>
        <p>Custom PCs designed around your performance, budget and goals.</p>
        <MagneticButton className="primary" onClick={() => openQuote('PC Build')}>
          BUILD YOUR PC
        </MagneticButton>
      </section>

      <section>
        <p className="kicker">COMPONENTS</p>
        <h2>
          WE DON’T JUST SELL COMPUTERS.
          <br />
          WE BUILD THEM.
        </h2>
      </section>

      <section>
        <p className="kicker">DIAGNOSTICS</p>
        <h2>
          SOMETHING BROKE?
          <br />
          WE FIX IT.
        </h2>
        <ul className="chips">
          {repairServices.map((item) => {
            const meta = chipActions[item]
            return (
              <li key={item}>
                <button type="button" onClick={() => meta && openQuote(meta.service)}>
                  {item}
                </button>
              </li>
            )
          })}
        </ul>
        <MagneticButton className="primary" onClick={() => openQuote('PC Repair')}>
          BOOK A REPAIR
        </MagneticButton>
      </section>

      <section>
        <p className="kicker">WEB</p>
        <h2>
          YOUR BUSINESS.
          <br />
          YOUR WEBSITE.
        </h2>
        <p>We build the site, host it, and keep it maintained.</p>
        <MagneticButton className="primary" onClick={() => openQuote('Website Development')}>
          BUILD MY WEBSITE
        </MagneticButton>
      </section>

      <section>
        <p className="kicker">ADS</p>
        <h2>
          FACEBOOK.
          <br />
          INSTAGRAM.
          <br />
          SEEN.
        </h2>
        <p>Campaigns set up and run on the platforms people already use. You pay the ad spend. We make it run properly.</p>
        <MagneticButton className="primary" onClick={() => openQuote('Advertising')}>
          RUN ADS
        </MagneticButton>
      </section>

      <section>
        <p className="kicker">DEVELOPMENT</p>
        <h2>
          FROM IDEA
          <br />
          TO ONLINE.
        </h2>
      </section>

      <section>
        <p className="kicker">NETWORK</p>
        <h2>
          DON’T KNOW WHAT YOU NEED?
          <br />
          THAT’S WHAT WE’RE HERE FOR.
        </h2>
        <p>Tell us what you’re trying to accomplish. We’ll help you figure out the technology.</p>
        <MagneticButton className="primary" onClick={() => openQuote('IT Consulting')}>
          GET ADVICE
        </MagneticButton>
      </section>

      <section>
        <p className="kicker">SYSTEMS</p>
        <h2>
          YOUR TECH.
          <br />
          SET UP RIGHT.
        </h2>
        <p>Activation uses your genuine Windows license or Microsoft 365 subscription.</p>
        <MagneticButton className="primary" onClick={() => openQuote()}>
          SET THIS UP
        </MagneticButton>
      </section>

      <section>
        <p className="kicker">INFRASTRUCTURE</p>
        <h2>PERFORMANCE. RELIABILITY. THE WHOLE MACHINE.</h2>
        <ul className="chips">
          {['PERFORMANCE', 'RELIABILITY', 'UPGRADES', 'WORK', 'GAMING', 'CREATIVE'].map((item) => {
            const meta = chipActions[item]
            return (
              <li key={item}>
                <button type="button" onClick={() => meta && openQuote(meta.service)}>
                  {item}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <p className="kicker">SERVICES</p>
        <h2>ZACH OF ALL TRADES</h2>
        <div className="fall-grid">
          {services.map((s) => (
            <button key={s.id} type="button" className="fall-card" onClick={() => openQuote(s.formValue)}>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
              <span>REQUEST THIS</span>
            </button>
          ))}
        </div>
      </section>

      <section className="fall-end">
        <p className="kicker">ZACH OF ALL TRADES</p>
        <h2>
          READY TO BUILD
          <br />
          SOMETHING BETTER?
        </h2>
        <p>
          {site.line}
        </p>
        <MagneticButton className="primary" onClick={() => openQuote()}>
          GET A QUOTE
        </MagneticButton>
      </section>
    </main>
  )
}
