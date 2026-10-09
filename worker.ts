import { mainClientEmail, mainInboxEmail, sendResendEmail } from './src/server/mail.ts'

export interface Env {
  ASSETS: Fetcher
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  RESEND_FROM?: string
  RESEND_CLIENT_FROM?: string
}

const hits = new Map<string, { n: number; t: number }>()
const CANONICAL_HOST = 'zachofalltrades.co.za'
const LEGACY_HOSTS = new Set(['zachofalltrades.crouchariah.workers.dev'])

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function withHeaders(response: Response, extra: Record<string, string>) {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(extra)) headers.set(key, value)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function isHttp(request: Request, url: URL) {
  if (request.headers.get('x-forwarded-proto') === 'http') return true
  const visitor = request.headers.get('cf-visitor')
  if (visitor) {
    try {
      return (JSON.parse(visitor) as { scheme?: string }).scheme === 'http'
    } catch {
      return false
    }
  }
  return url.protocol === 'http:'
}

function limited(ip: string) {
  const now = Date.now()
  const current = hits.get(ip)
  if (!current || now - current.t > 10 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now })
    return false
  }
  current.n += 1
  return current.n > 8
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (isHttp(request, url)) {
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }
    if (LEGACY_HOSTS.has(url.hostname)) {
      url.hostname = CANONICAL_HOST
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }
    if (url.pathname === '/api/quote' && request.method === 'POST') {
      return handleQuote(request, env)
    }
    const asset = await env.ASSETS.fetch(request)
    if (url.hostname !== CANONICAL_HOST) {
      return withHeaders(asset, { 'X-Robots-Tag': 'noindex, follow' })
    }
    return withHeaders(asset, { 'Strict-Transport-Security': 'max-age=31536000' })
  },
}

async function handleQuote(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown'
  if (limited(ip)) {
    return json({ ok: false, reason: 'network', error: 'Too many requests.' }, 429)
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ ok: false, reason: 'validation', error: 'Invalid request.' }, 400)
  }

  const text = (value: unknown) => (typeof value === 'string' ? value : '')
  if (text(body.company).trim() || text(body.fax).trim()) {
    return json({ ok: true, method: 'resend' })
  }

  const payload = {
    name: text(body.name),
    email: text(body.email),
    phone: text(body.phone),
    service: text(body.service),
    budget: text(body.budget),
    need: text(body.need),
    message: text(body.message),
    business: text(body.business),
    website: text(body.website),
    deadline: text(body.deadline),
    webNeed: text(body.webNeed),
    pages: text(body.pages),
    features: text(body.features),
  }

  if (!payload.service || !payload.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    return json({ ok: false, reason: 'validation', error: 'Add your name, email, and a service.' }, 400)
  }
  if (`${payload.need} ${payload.message}`.trim().length < 4) {
    return json({ ok: false, reason: 'validation', error: 'Add a bit more about what you need.' }, 400)
  }

  const apiKey = env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    return json({ ok: false, reason: 'config' }, 503)
  }

  const to = env.CONTACT_TO_EMAIL?.trim() || 'support@zachofalltrades.co.za'
  const from = env.RESEND_FROM?.trim() || 'Zach of All Trades <support@zachofalltrades.co.za>'
  const clientFrom =
    env.RESEND_CLIENT_FROM?.trim() || 'Zach of All Trades <clients@zachofalltrades.co.za>'
  const inbox = mainInboxEmail(payload)
  const client = mainClientEmail(payload)

  try {
    await sendResendEmail(apiKey, {
      from,
      to,
      replyTo: payload.email.trim(),
      subject: inbox.subject,
      html: inbox.html,
      text: inbox.text,
    })
    await sendResendEmail(apiKey, {
      from: clientFrom,
      to: payload.email.trim(),
      replyTo: to,
      subject: client.subject,
      html: client.html,
      text: client.text,
    })
    return json({ ok: true, method: 'resend' })
  } catch {
    return json({ ok: false, reason: 'network', error: 'Mail could not be sent.' }, 502)
  }
}
