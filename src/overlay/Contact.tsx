import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  webBudgetOptions,
  webFeatureOptions,
  webNeedOptions,
  webPageOptions,
} from '../config/offers.ts'
import { requestOptions, resolveBrief } from '../config/request.ts'
import { site } from '../config/site.ts'
import { quoteWhatsAppHref, submitQuote, validateQuote } from '../lib/form.ts'
import { useExperience } from '../store/experience.ts'
import { ContactActions } from './ContactActions.tsx'
import { MagneticButton } from './MagneticButton.tsx'
import { RequestBrief } from './RequestBrief.tsx'

type Step = 1 | 2 | 3

function hasDetails(needs: Record<string, string[]>, message: string): boolean {
  return `${Object.values(needs).flat().join(' ')} ${message}`.trim().length >= 4
}

function formatNeeds(chosen: typeof requestOptions, needs: Record<string, string[]>): string {
  return chosen
    .flatMap((item) => {
      const picks = needs[item.value] ?? []
      if (!picks.length) return []
      if (chosen.length === 1) return picks
      return picks.map((pick) => `${item.label}: ${pick}`)
    })
    .join(', ')
}

function serviceLine(labels: string[]): string {
  if (labels.length <= 2) return labels.join(' + ')
  return `${labels[0]} + ${labels.length - 1} more`
}

function ChipRow({
  legend,
  options,
  value,
  multiple,
  onToggle,
}: {
  legend: string
  options: readonly string[]
  value: string | string[]
  multiple?: boolean
  onToggle: (entry: string) => void
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : []
  return (
    <fieldset className="need-pick">
      <legend>{legend}</legend>
      <div className="need-row">
        {options.map((entry) => (
          <button
            key={entry}
            type="button"
            className={`need-chip ${selected.includes(entry) ? 'is-on' : ''}`}
            onClick={() => onToggle(entry)}
            aria-pressed={selected.includes(entry)}
          >
            {entry}
          </button>
        ))}
      </div>
      {multiple ? <p className="field-hint">Select everything that applies.</p> : null}
    </fieldset>
  )
}

export function Contact() {
  const prefill = useExperience((s) => s.prefillService)
  const prefillExtras = useExperience((s) => s.prefillExtras)
  const quoteTick = useExperience((s) => s.quoteTick)
  const [step, setStep] = useState<Step>(1)
  const [services, setServices] = useState<string[]>([])
  const [needs, setNeeds] = useState<Record<string, string[]>>({})
  const [budget, setBudget] = useState('Prefer not to say')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [business, setBusiness] = useState('')
  const [website, setWebsite] = useState('')
  const [deadline, setDeadline] = useState('')
  const [webNeed, setWebNeed] = useState('')
  const [pages, setPages] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'config' | 'error'>('idle')
  const [error, setError] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)
  const stepped = useRef(false)

  const chosen = useMemo(
    () =>
      requestOptions
        .filter((item) => services.includes(item.value))
        .sort((a, b) => services.indexOf(a.value) - services.indexOf(b.value)),
    [services],
  )
  const brief = useMemo(() => resolveBrief(services), [services])
  const labels = chosen.map((item) => item.label)
  const hasWeb = services.includes('Website Development')
  const needChoices = chosen.filter((item) => {
    if (item.value === 'Website Development') return false
    return item.needs.length > 0
  })
  const joined = labels.join(', ')
  const joinedNeeds = formatNeeds(chosen, needs)
  const budgets = hasWeb ? [...webBudgetOptions] : (brief?.budgets ?? [])
  const showBudget = budgets.length > 1
  const featureLine = features.join(', ')

  useEffect(() => {
    if (!quoteTick) return
    const extras = prefillExtras ?? {}
    if (prefill) {
      setServices((prev) => (prev.includes(prefill) ? prev : [...prev, prefill]))
      if (extras.webNeed) setWebNeed(extras.webNeed)
      if (extras.adsPlan) {
        setNeeds((prev) => ({ ...prev, Advertising: [extras.adsPlan as string] }))
      }
      if (extras.carePlan) {
        setNeeds((prev) => ({ ...prev, 'Website Care': [extras.carePlan as string] }))
      }
      setStep(2)
    } else {
      setStep(1)
    }
    setStatus('idle')
    setError('')
  }, [quoteTick, prefill, prefillExtras])

  useEffect(() => {
    if (budgets.includes(budget)) return
    const fallback =
      budgets.find((item) => /not sure|recommendation|prefer not/i.test(item)) ??
      budgets[0] ??
      'Prefer not to say'
    setBudget(fallback)
  }, [budgets, budget])

  useEffect(() => {
    if (!stepped.current) {
      stepped.current = true
      return
    }
    if (step === 3) {
      window.setTimeout(() => nameRef.current?.focus(), 80)
      return
    }
    headingRef.current?.focus()
  }, [step])

  useEffect(() => {
    if (!error) return
    errorRef.current?.focus()
  }, [error])

  const toggleService = (value: string) => {
    const next = services.includes(value) ? services.filter((item) => item !== value) : [...services, value]
    setServices(next)
    setNeeds((prev) => {
      const copy = { ...prev }
      for (const key of Object.keys(copy)) {
        if (!next.includes(key)) delete copy[key]
      }
      return copy
    })
    if (!next.includes('Website Development')) {
      setWebNeed('')
      setPages('')
      setFeatures([])
      setWebsite('')
      setDeadline('')
    }
    setError('')
  }

  const toggleNeed = (service: string, value: string) => {
    setNeeds((prev) => {
      const current = prev[service] ?? []
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
      if (!next.length) {
        const copy = { ...prev }
        delete copy[service]
        return copy
      }
      return { ...prev, [service]: next }
    })
    setError('')
  }

  const toggleFeature = (entry: string) => {
    setFeatures((prev) => (prev.includes(entry) ? prev.filter((item) => item !== entry) : [...prev, entry]))
    setError('')
  }

  const goPath = () => {
    if (!services.length) {
      setError('Choose at least one service to continue.')
      return
    }
    setError('')
    setStep(2)
  }

  const goDetails = () => {
    if (!services.length) {
      setError('Choose at least one service to continue.')
      setStep(1)
      return
    }
    if (hasWeb && !webNeed) {
      setError('Choose what you need for the website.')
      return
    }
    if (hasWeb && !pages) {
      setError('Choose an approximate number of pages.')
      return
    }
    if (hasWeb && !features.length && message.trim().length < 4) {
      setError('Select the features you need, or describe the project.')
      return
    }
    if (!hasWeb && !hasDetails(needs, message)) {
      setError('Add a bit more about what you need — a tap or a sentence is enough.')
      return
    }
    setError('')
    setStep(3)
  }

  const reset = () => {
    setStep(1)
    setServices([])
    setNeeds({})
    setBudget('Prefer not to say')
    setMessage('')
    setName('')
    setEmail('')
    setPhone('')
    setBusiness('')
    setWebsite('')
    setDeadline('')
    setWebNeed('')
    setPages('')
    setFeatures([])
    setStatus('idle')
    setError('')
    setWhatsapp('')
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    if (String(form.get('company') || '')) return
    if (step < 3) {
      if (step === 1) goPath()
      else goDetails()
      return
    }
    const webFocus = [webNeed && `Type: ${webNeed}`, pages && `Pages: ${pages}`, featureLine && `Features: ${featureLine}`]
      .filter(Boolean)
      .join(' · ')
    const payload = {
      name,
      email,
      phone,
      business,
      website,
      deadline,
      service: joined,
      budget,
      need: [webFocus, joinedNeeds].filter(Boolean).join(' · '),
      webNeed,
      pages,
      features: featureLine,
      message: [
        webFocus ? `Website brief: ${webFocus}` : '',
        joinedNeeds ? `Focus: ${joinedNeeds}` : '',
        website ? `Existing website: ${website}` : '',
        deadline ? `Launch / deadline: ${deadline}` : '',
        message.trim(),
      ]
        .filter(Boolean)
        .join('\n\n'),
    }
    const invalid = validateQuote(payload)
    if (invalid) {
      setError(invalid)
      setStatus('error')
      if (!payload.service) setStep(1)
      else if (hasWeb ? !webNeed || (!features.length && message.trim().length < 4) : !hasDetails(needs, message)) {
        setStep(2)
      }
      return
    }
    setError('')
    setStatus('sending')
    const result = await submitQuote(payload)
    if (result.ok) setStatus('sent')
    else if (result.reason === 'config') {
      setWhatsapp(result.whatsapp || quoteWhatsAppHref(payload))
      setStatus('config')
    } else {
      setStatus('error')
      setError('The request could not be delivered. Try WhatsApp.')
    }
  }

  const showBrief = Boolean(brief) && step !== 3

  return (
    <section id="contact" className="contact">
      <div className="contact-copy">
        <p className="contact-process">Tell us what you need → Receive a quote → Approve the work.</p>
        {showBrief && brief ? (
          <RequestBrief brief={brief} />
        ) : (
          <>
            <p className="kicker">{step === 3 ? 'REQUEST · 03 / 03' : 'REQUEST · 01 / 03'}</p>
            <h2>
              {step === 3 ? (
                <>
                  <span>HOW DO WE</span>
                  <span>REACH YOU?</span>
                </>
              ) : (
                <>
                  <span>WHAT DO YOU</span>
                  <span>NEED DONE?</span>
                </>
              )}
            </h2>
            <p className="body">
              {step === 3
                ? 'Name and email are enough. Phone is optional. We reply by email with a clear next step.'
                : 'Choose one or more services. Each one opens a brief for that job — and if you choose more than one, the work is sequenced as one visit where it can be. Microsoft work always uses your genuine licence or subscription.'}
            </p>
          </>
        )}
        {chosen.length > 0 && step > 1 && (
          <dl className="request-aside">
            <dt>{chosen.length === 1 ? 'Service' : 'Services'}</dt>
            <dd>{joined}</dd>
            {webNeed && (
              <>
                <dt>Website</dt>
                <dd>{webNeed}</dd>
              </>
            )}
            {pages && (
              <>
                <dt>Pages</dt>
                <dd>{pages}</dd>
              </>
            )}
            {joinedNeeds && (
              <>
                <dt>Focus</dt>
                <dd>{joinedNeeds}</dd>
              </>
            )}
            {showBudget && budget && (
              <>
                <dt>Budget</dt>
                <dd>{budget}</dd>
              </>
            )}
          </dl>
        )}
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
        <div className="beat-actions contact-direct">
          <ContactActions />
        </div>
      </div>

      {status === 'sent' ? (
        <div className="request-done">
          <p className="kicker">RECEIVED</p>
          <h3>We have the request.</h3>
          <p>
            {joined ? `${joined}. ` : ''}
            A confirmation is on its way to {email}. We will reply from {site.email}.
          </p>
          <MagneticButton className="ghost" onClick={reset}>
            SEND ANOTHER
          </MagneticButton>
        </div>
      ) : (
        <form className="contact-form request-form" onSubmit={onSubmit} noValidate>
          <ol className="request-steps" aria-label="Request steps">
            {(
              [
                [1, 'Service'],
                [2, 'Details'],
                [3, 'Contact'],
              ] as const
            ).map(([n, label]) => (
              <li key={n}>
                <button
                  type="button"
                  className={`request-step ${step === n ? 'is-on' : ''} ${step > n ? 'is-done' : ''}`}
                  onClick={() => {
                    if (n === 1) setStep(1)
                    if (n === 2 && services.length) setStep(2)
                    if (n === 3 && services.length) goDetails()
                  }}
                  aria-current={step === n ? 'step' : undefined}
                  disabled={n > 1 && !services.length}
                >
                  <span>0{n}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>

          {step === 1 && (
            <fieldset className="service-pick">
              <legend className="visually-hidden">Services</legend>
              <h3 ref={headingRef} tabIndex={-1} className="request-heading">
                Choose a service
              </h3>
              <p className="service-note">
                Choose one or more services. The brief on the left updates as you select. Choose at least one service
                to continue.
              </p>
              <div className="service-grid">
                {requestOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`service-chip ${services.includes(item.value) ? 'is-on' : ''}`}
                    onClick={() => toggleService(item.value)}
                    aria-pressed={services.includes(item.value)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.hint}</span>
                  </button>
                ))}
              </div>
              <div className="form-foot">
                <p className="service-count">
                  {services.length === 0 ? 'None selected yet' : brief ? brief.kicker : `${services.length} selected`}
                </p>
                <MagneticButton className="primary" type="button" onClick={goPath} disabled={!services.length}>
                  CONTINUE
                </MagneticButton>
                {error && (
                  <p ref={errorRef} className="form-note warn" role="alert" tabIndex={-1}>
                    {error}
                  </p>
                )}
              </div>
            </fieldset>
          )}

          {step === 2 && chosen.length > 0 && brief && (
            <div className="request-panel">
              <div className="request-chosen">
                <div>
                  <p className="kicker">{brief.kicker}</p>
                  <h3 ref={headingRef} tabIndex={-1} className="request-heading">
                    {serviceLine(labels)}
                  </h3>
                  {chosen.length === 1 ? (
                    <p>{chosen[0].hint}</p>
                  ) : (
                    <ul className="request-picks">
                      {chosen.map((item) => (
                        <li key={item.value}>{item.label}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button type="button" className="request-change" onClick={() => setStep(1)}>
                  ADD / CHANGE
                </button>
              </div>

              <p className="service-note">
                {hasWeb
                  ? 'Choose the website type and number of pages to continue. Features and budget are optional if you describe the project.'
                  : needChoices.length
                    ? 'Select the options that apply, or write a short description, then continue. Budget is optional.'
                    : 'Describe what you need so we can quote the work, then continue.'}
              </p>

              {hasWeb && (
                <>
                  <ChipRow
                    legend="What do you need? (required)"
                    options={webNeedOptions}
                    value={webNeed}
                    onToggle={(entry) => {
                      setWebNeed(entry)
                      setError('')
                    }}
                  />
                  <ChipRow
                    legend="Approximate number of pages (required)"
                    options={webPageOptions}
                    value={pages}
                    onToggle={(entry) => {
                      setPages(entry)
                      setError('')
                    }}
                  />
                  <ChipRow
                    legend="Features (optional if you describe the project below)"
                    options={webFeatureOptions}
                    value={features}
                    multiple
                    onToggle={toggleFeature}
                  />
                </>
              )}

              {needChoices.map((item) => (
                <fieldset key={item.value} className="need-pick">
                  <legend>{chosen.length === 1 ? 'What is this for?' : item.label}</legend>
                  <div className="need-row">
                    {item.needs.map((entry) => (
                      <button
                        key={entry}
                        type="button"
                        className={`need-chip ${(needs[item.value] ?? []).includes(entry) ? 'is-on' : ''}`}
                        onClick={() => toggleNeed(item.value, entry)}
                        aria-pressed={(needs[item.value] ?? []).includes(entry)}
                      >
                        {entry}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}

              {showBudget && (
                <fieldset className="budget-pick">
                  <legend>
                    {hasWeb
                      ? 'What budget have you allocated for this project? (optional)'
                      : 'Budget (optional) · R (ZAR)'}
                  </legend>
                  {hasWeb && (
                    <p className="field-hint">
                      This helps us understand your expectations. Final pricing is determined after reviewing the
                      project requirements — the budget is not used to calculate a price automatically.
                    </p>
                  )}
                  {services.includes('Advertising') && !hasWeb && (
                    <p className="field-hint">
                      These figures are for management. Advertising spend is paid separately to Meta or Google.
                    </p>
                  )}
                  {hasWeb && services.includes('Advertising') && (
                    <p className="field-hint">
                      Website budget is separate from advertising. Ad spend is paid to Meta or Google; the monthly ads
                      fee is management only.
                    </p>
                  )}
                  <div className="budget-row">
                    {budgets.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`budget-chip ${budget === item ? 'is-on' : ''}`}
                        onClick={() => setBudget(item)}
                        aria-pressed={budget === item}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <label className="full">
                <span>
                  {hasWeb
                    ? 'Description of the project (optional if you selected features)'
                    : needChoices.length
                      ? 'Anything else we should know? (optional if you selected options above)'
                      : 'What are you trying to get done?'}
                </span>
                <textarea
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    hasWeb
                      ? 'What should the site do, who is it for, and what does done look like?'
                      : chosen.length === 1
                        ? chosen[0].prompt
                        : 'What should we know — order, timing, load-shedding, or how the jobs connect?'
                  }
                  required={!hasWeb && needChoices.length === 0}
                />
              </label>

              <div className="form-foot">
                <MagneticButton className="ghost" type="button" onClick={() => setStep(1)}>
                  BACK
                </MagneticButton>
                <MagneticButton className="primary" type="button" onClick={goDetails}>
                  CONTINUE
                </MagneticButton>
                {error && (
                  <p ref={errorRef} className="form-note warn" role="alert" tabIndex={-1}>
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && chosen.length > 0 && (
            <div className="request-panel">
              <h3 ref={headingRef} tabIndex={-1} className="request-heading">
                Where should we reply?
              </h3>
              <dl className="request-recap">
                <div>
                  <dt>{chosen.length === 1 ? 'Service' : 'Services'}</dt>
                  <dd>{joined}</dd>
                </div>
                {webNeed && (
                  <div>
                    <dt>Website</dt>
                    <dd>{webNeed}</dd>
                  </div>
                )}
                {pages && (
                  <div>
                    <dt>Pages</dt>
                    <dd>{pages}</dd>
                  </div>
                )}
                {joinedNeeds && (
                  <div>
                    <dt>Focus</dt>
                    <dd>{joinedNeeds}</dd>
                  </div>
                )}
                {showBudget && (
                  <div>
                    <dt>Budget</dt>
                    <dd>{budget}</dd>
                  </div>
                )}
              </dl>
              <label>
                <span>Name</span>
                <input
                  ref={nameRef}
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-required="true"
                />
              </label>
              <label>
                <span>Business / company name (optional)</span>
                <input
                  name="business"
                  autoComplete="organization"
                  placeholder="Optional"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />
              </label>
              <label>
                <span>Phone / WhatsApp (optional)</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Your phone or WhatsApp number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              {hasWeb && (
                <>
                  <label className="full">
                    <span>Existing website (optional)</span>
                    <input
                      name="website"
                      autoComplete="url"
                      placeholder="https:// — if you already have one"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </label>
                  <label className="full">
                    <span>Preferred launch date / deadline (optional)</span>
                    <input
                      name="deadline"
                      placeholder="When does this need to be live?"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </label>
                </>
              )}
              <input className="hp" name="company" tabIndex={-1} autoComplete="off" />
              <div className="form-foot">
                <MagneticButton className="ghost" type="button" onClick={() => setStep(2)}>
                  BACK
                </MagneticButton>
                <MagneticButton className="primary" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'SENDING' : 'SEND REQUEST'}
                </MagneticButton>
                {status === 'config' && (
                  <div className="form-note">
                    <p>Your brief is ready. Send it on WhatsApp, email, or call.</p>
                    <div className="beat-actions">
                      <ContactActions whatsappHref={whatsapp || undefined} />
                    </div>
                  </div>
                )}
                {status === 'error' && error && (
                  <div className="form-note warn" role="alert">
                    <p>{error}</p>
                    <div className="beat-actions">
                      <ContactActions />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      )}
    </section>
  )
}
