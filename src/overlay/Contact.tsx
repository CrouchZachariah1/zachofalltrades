import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { requestOptions, resolveBrief } from '../config/request.ts'
import { submitQuote, validateQuote } from '../lib/form.ts'
import { useExperience } from '../store/experience.ts'
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

export function Contact() {
  const prefill = useExperience((s) => s.prefillService)
  const quoteTick = useExperience((s) => s.quoteTick)
  const [step, setStep] = useState<Step>(1)
  const [services, setServices] = useState<string[]>([])
  const [needs, setNeeds] = useState<Record<string, string[]>>({})
  const [budget, setBudget] = useState('Prefer not to say')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'config' | 'error'>('idle')
  const [error, setError] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
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
  const needChoices = chosen.filter((item) => item.needs.length > 0)
  const joined = labels.join(', ')
  const joinedNeeds = formatNeeds(chosen, needs)
  const budgets = brief?.budgets ?? []
  const showBudget = budgets.length > 1

  useEffect(() => {
    if (!quoteTick) return
    if (prefill) {
      setServices((prev) => (prev.includes(prefill) ? prev : [...prev, prefill]))
      setStep(2)
    } else {
      setStep(1)
    }
    setStatus('idle')
    setError('')
  }, [quoteTick, prefill])

  useEffect(() => {
    if (!budgets.includes(budget)) setBudget(budgets[0] ?? 'Prefer not to say')
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

  const goPath = () => {
    if (!services.length) {
      setError('Pick at least one service.')
      return
    }
    setError('')
    setStep(2)
  }

  const goDetails = () => {
    if (!services.length) {
      setError('Pick at least one service.')
      setStep(1)
      return
    }
    if (!hasDetails(needs, message)) {
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
    setStatus('idle')
    setError('')
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
    const payload = {
      name,
      email,
      phone,
      service: joined,
      budget,
      need: joinedNeeds,
      message: [joinedNeeds ? `Focus: ${joinedNeeds}` : '', message.trim()].filter(Boolean).join('\n\n'),
    }
    const invalid = validateQuote(payload)
    if (invalid) {
      setError(invalid)
      setStatus('error')
      if (!payload.service) setStep(1)
      else if (!hasDetails(needs, message)) setStep(2)
      return
    }
    setError('')
    setStatus('sending')
    const result = await submitQuote(payload)
    if (result.ok) setStatus('sent')
    else if (result.reason === 'config') setStatus('config')
    else {
      setStatus('error')
      setError('The request could not be delivered. Try again or email directly.')
    }
  }

  const showBrief = Boolean(brief) && step !== 3

  return (
    <section id="contact" className="contact">
      <div className="contact-copy">
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
                ? 'Name and email are enough. We reply there with a clear next step.'
                : 'Tap one or more paths. Each one opens a brief built for that job — and if you stack them, the work is sequenced as one visit where it can be. Microsoft work always uses your genuine licence or subscription.'}
            </p>
          </>
        )}
        {chosen.length > 0 && step > 1 && (
          <dl className="request-aside">
            <dt>{chosen.length === 1 ? 'Service' : 'Services'}</dt>
            <dd>{joined}</dd>
            {joinedNeeds && (
              <>
                <dt>Focus</dt>
                <dd>{joinedNeeds}</dd>
              </>
            )}
            {showBudget && budget !== 'Prefer not to say' && (
              <>
                <dt>Budget</dt>
                <dd>{budget}</dd>
              </>
            )}
          </dl>
        )}
      </div>

      {status === 'sent' ? (
        <div className="request-done">
          <p className="kicker">RECEIVED</p>
          <h3>We have the request.</h3>
          <p>
            {joined ? `${joined}. ` : ''}
            If you left an email, that is how we will reply.
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
                [1, 'Path'],
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
                Tap everything you need
              </h3>
              <p className="service-note">
                One job, or a stack. The brief on the left updates as you select.
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
                  {services.length === 0
                    ? 'None selected yet'
                    : brief
                      ? brief.kicker
                      : `${services.length} selected`}
                </p>
                <MagneticButton className="primary" type="button" onClick={goPath} disabled={!services.length}>
                  CONTINUE
                </MagneticButton>
                {error && <p className="form-note warn">{error}</p>}
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
                <legend>Budget · R (ZAR)</legend>
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
                <span>{needChoices.length ? 'Anything else we should know?' : 'What are you trying to get done?'}</span>
                <textarea
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    chosen.length === 1
                      ? chosen[0].prompt
                      : 'What should we know — order, timing, load-shedding, or how the jobs connect?'
                  }
                  required={needChoices.length === 0}
                />
              </label>

              <div className="form-foot">
                <MagneticButton className="ghost" type="button" onClick={() => setStep(1)}>
                  BACK
                </MagneticButton>
                <MagneticButton className="primary" type="button" onClick={goDetails}>
                  CONTINUE
                </MagneticButton>
                {error && <p className="form-note warn">{error}</p>}
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
                />
              </label>
              <label className="full">
                <span>Phone · optional</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="082 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <input className="hp" name="company" tabIndex={-1} autoComplete="off" />
              <div className="form-foot">
                <MagneticButton className="ghost" type="button" onClick={() => setStep(2)}>
                  BACK
                </MagneticButton>
                <MagneticButton className="primary" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'SENDING' : 'SEND REQUEST'}
                </MagneticButton>
                {status === 'config' && (
                  <p className="form-note">
                    Form is ready. Add <code>VITE_FORM_ENDPOINT</code>, <code>VITE_FORM_ACCESS_KEY</code>, or{' '}
                    <code>VITE_CONTACT_EMAIL</code> to receive requests.
                  </p>
                )}
                {status === 'error' && error && <p className="form-note warn">{error}</p>}
              </div>
            </div>
          )}
        </form>
      )}
    </section>
  )
}
