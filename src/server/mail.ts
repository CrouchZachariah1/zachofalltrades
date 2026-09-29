export type QuoteMail = {
  name: string
  email: string
  phone?: string
  service: string
  budget?: string
  need?: string
  message: string
  business?: string
  website?: string
  deadline?: string
  webNeed?: string
  pages?: string
  features?: string
}

function esc(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value?: string) {
  const text = value?.trim()
  if (!text) return ''
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(232,238,244,0.12);width:140px;color:#8b919a;font-size:13px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(232,238,244,0.12);color:#e8eef4;font-size:14px;">${esc(text).replace(/\n/g, '<br/>')}</td>
  </tr>`
}

const COVER = 'https://zachofalltrades.co.za/email/cover.jpg'
const WHATSAPP = 'https://wa.me/27603292708'

function layout(opts: { preheader: string; heading: string; kicker: string; inner: string; footer: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(opts.heading)}</title>
</head>
<body style="margin:0;padding:0;background:#07080a;color:#e8eef4;font-family:'Outfit','Segoe UI',Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${esc(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#07080a;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid rgba(232,238,244,0.12);">
          <tr>
            <td style="padding:0 8px 18px;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#4ee3ff;">
              ${esc(opts.kicker)}
            </td>
          </tr>
          <tr>
            <td style="background:#0c0e12;padding:32px 28px;">
              <h1 style="margin:0 0 18px;font-family:'Syne','Segoe UI',Arial,sans-serif;font-size:28px;line-height:1.15;font-weight:700;color:#e8eef4;">${esc(opts.heading)}</h1>
              ${opts.inner}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 8px 0;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.08em;line-height:1.7;color:#8b919a;">
              ${esc(opts.footer)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function clientLayout(opts: { preheader: string; heading: string; kicker: string; inner: string; footer: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(opts.heading)}</title>
</head>
<body style="margin:0;padding:0;background:#07080a;color:#e8eef4;font-family:'Outfit','Segoe UI',Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${esc(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#07080a;padding:0;">
    <tr>
      <td align="center" style="padding:24px 12px 36px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#07080a;border:1px solid rgba(232,238,244,0.12);">
          <tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <img src="${COVER}" alt="Zach of All Trades — Technology. Built right." width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="height:2px;background:#4ee3ff;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-family:'IBM Plex Mono',ui-monospace,Consolas,monospace;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#4ee3ff;">
              ${esc(opts.kicker)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;background:#07080a;">
              <h1 style="margin:0 0 18px;font-family:'Syne','Segoe UI',Arial,sans-serif;font-size:32px;line-height:1.1;font-weight:700;color:#e8eef4;">${esc(opts.heading)}</h1>
              ${opts.inner}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#4ee3ff;">
                    <a href="${WHATSAPP}" style="display:inline-block;padding:12px 22px;font-family:'Outfit','Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#07080a;text-decoration:none;">WhatsApp 060 329 2708</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;border-top:1px solid rgba(232,238,244,0.12);">
              <p style="margin:18px 0 0;font-family:'IBM Plex Mono',ui-monospace,Consolas,monospace;font-size:11px;letter-spacing:0.08em;line-height:1.7;color:#8b919a;">
                ${esc(opts.footer)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function mainInboxEmail(data: QuoteMail) {
  const inner = `
    <p style="margin:0 0 22px;font-size:16px;line-height:1.5;color:#c9cbc7;">New service enquiry from the main site.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('Name', data.name)}${row('Business', data.business)}${row('Email', data.email)}${row('Phone / WhatsApp', data.phone)}${row('Service', data.service)}${row('Website type', data.webNeed)}${row('Pages', data.pages)}${row('Features', data.features)}${row('Focus', data.need)}${row('Budget', data.budget)}${row('Existing website', data.website)}${row('Launch / deadline', data.deadline)}${row('Brief', data.message)}</table>
  `
  const text = [
    'New service enquiry — Zach of All Trades',
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
    data.message,
  ]
    .filter(Boolean)
    .join('\n')
  return {
    subject: `New service enquiry — ${data.service} — ${data.name}`,
    html: layout({
      preheader: `${data.name} asked about ${data.service}.`,
      kicker: 'Zach of All Trades',
      heading: 'New service enquiry',
      inner,
      footer: 'zachofalltrades.co.za',
    }),
    text,
  }
}

export function mainClientEmail(data: QuoteMail) {
  const inner = `
    <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#c5d0da;">Hi ${esc(data.name.split(' ')[0] || data.name)},</p>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#c5d0da;">We have your request for <strong style="color:#e8eef4;">${esc(data.service)}</strong>. We will come back with a clear next step.</p>
    <p style="margin:0 0 22px;font-size:16px;line-height:1.55;color:#c5d0da;">Reply to this email if you want to add anything, or tap WhatsApp below.</p>
    <p style="margin:0;font-size:13px;color:#8b919a;">This is a confirmation only. No payment has been taken.</p>
  `
  return {
    subject: 'We received your request — Zach of All Trades',
    html: clientLayout({
      preheader: 'Your request is in. We will reply with the next step.',
      kicker: 'Technology. Built right.',
      heading: 'We have the request.',
      inner,
      footer: 'Zach of All Trades · Cape Town · zachofalltrades.co.za · clients@zachofalltrades.co.za',
    }),
    text: `Hi ${data.name},\n\nWe have your request for ${data.service}. We will come back with a clear next step.\n\nReply to this email if you want to add anything, or WhatsApp 060 329 2708.\n\nThis is a confirmation only. No payment has been taken.\n\nZach of All Trades\nzachofalltrades.co.za\nclients@zachofalltrades.co.za`,
  }
}

export async function sendResendEmail(
  apiKey: string,
  message: { from: string; to: string; replyTo?: string; subject: string; html: string; text: string },
) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to: [message.to],
      reply_to: message.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail.slice(0, 400))
  }
}
