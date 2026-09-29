import { site } from '../config/site.ts'

export type QuotePayload = {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  need: string
  message: string
  business?: string
  website?: string
  deadline?: string
  webNeed?: string
  pages?: string
  features?: string
}

export type SubmitResult =
  | { ok: true; method: 'endpoint' | 'web3forms' }
  | { ok: false; reason: 'config' | 'network' | 'validation'; whatsapp?: string }

export function quoteWhatsAppHref(data: QuotePayload): string {
  const body = [
    'Hi Zach — request from zachofalltrades.co.za.',
    `Name: ${data.name}`,
    data.business ? `Business: ${data.business}` : null,
    `Email: ${data.email}`,
    data.phone ? `Phone / WhatsApp: ${data.phone}` : null,
    `Service: ${data.service}`,
    data.webNeed ? `Website type: ${data.webNeed}` : null,
    data.pages ? `Pages: ${data.pages}` : null,
    data.features ? `Features: ${data.features}` : null,
    data.need ? `Focus: ${data.need}` : null,
    data.budget ? `Budget: ${data.budget}` : null,
    data.website ? `Existing website: ${data.website}` : null,
    data.deadline ? `Launch / deadline: ${data.deadline}` : null,
    '',
    data.message || '—',
  ]
    .filter(Boolean)
    .join('\n')
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(body)}`
}

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
  try {
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
    const json = (await res.json()) as { ok?: boolean; reason?: string }
    if (json.ok) return { ok: true, method: 'endpoint' }
    if (json.reason === 'config') {
      return { ok: false, reason: 'config', whatsapp: quoteWhatsAppHref(data) }
    }
    return { ok: false, reason: 'network' }
  } catch {
    return { ok: false, reason: 'network', whatsapp: quoteWhatsAppHref(data) }
  }
}
