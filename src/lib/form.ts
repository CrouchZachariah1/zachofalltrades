import { site } from '../config/site.ts'

export type QuotePayload = {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  need: string
  message: string
}

export type SubmitResult =
  | { ok: true; method: 'endpoint' | 'web3forms' | 'mailto' }
  | { ok: false; reason: 'config' | 'network' | 'validation' }

export function validateQuote(data: QuotePayload): string | null {
  if (!data.service) return 'Please choose at least one service.'
  if (!data.name.trim()) return 'Please add your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return 'Please add a valid email.'
  }
  if (`${data.need} ${data.message}`.trim().length < 4) {
    return 'Add a bit more about what you need — a tap or a sentence is enough.'
  }
  return null
}

export async function submitQuote(data: QuotePayload): Promise<SubmitResult> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim()
  const accessKey = import.meta.env.VITE_FORM_ACCESS_KEY?.trim()
  const email = import.meta.env.VITE_CONTACT_EMAIL?.trim() || site.email

  const payload = {
    ...data,
    source: 'zach-of-all-trades',
    subject: `Quote request — ${data.service}`,
  }

  try {
    if (accessKey) {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: accessKey, ...payload }),
      })
      if (!res.ok) return { ok: false, reason: 'network' }
      return { ok: true, method: 'web3forms' }
    }

    if (endpoint) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) return { ok: false, reason: 'network' }
      return { ok: true, method: 'endpoint' }
    }

    if (email) {
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || '—'}`,
        `Service: ${data.service}`,
        `Focus: ${data.need || '—'}`,
        `Budget: ${data.budget || '—'}`,
        '',
        data.message || '—',
      ].join('\n')
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`
      return { ok: true, method: 'mailto' }
    }
  } catch {
    return { ok: false, reason: 'network' }
  }

  return { ok: false, reason: 'config' }
}
