export type QuoteMail = {
  name: string
  email: string
  phone?: string
  service: string
  budget?: string
  need?: string
  message: string
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
    <td style="padding:10px 0;border-bottom:1px solid #2a2d34;width:140px;color:#9aa0ab;font-size:13px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #2a2d34;color:#edecea;font-size:14px;">${esc(text).replace(/\n/g, '<br/>')}</td>
  </tr>`
}

function layout(opts: { preheader: string; heading: string; kicker: string; inner: string; footer: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(opts.heading)}</title>
</head>
<body style="margin:0;padding:0;background:#07080a;color:#edecea;font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${esc(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#07080a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:0 8px 28px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#cbb48c;">
              ${esc(opts.kicker)}
            </td>
          </tr>
          <tr>
            <td style="background:#12141a;border:1px solid #2a2d34;border-radius:16px;padding:36px 32px;">
              <h1 style="margin:0 0 18px;font-size:28px;line-height:1.2;font-weight:normal;">${esc(opts.heading)}</h1>
              ${opts.inner}
            </td>
          </tr>
          <tr>
            <td style="padding:22px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#9aa0ab;">
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

export function mainInboxEmail(data: QuoteMail) {
  const inner = `
    <p style="margin:0 0 22px;font-size:16px;line-height:1.5;color:#c9cbc7;">New service enquiry from the main site.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('Name', data.name)}${row('Email', data.email)}${row('Phone', data.phone)}${row('Service', data.service)}${row('Focus', data.need)}${row('Budget', data.budget)}${row('Brief', data.message)}</table>
  `
  const text = [
    'New service enquiry — Zach of All Trades',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    `Service: ${data.service}`,
    data.need ? `Focus: ${data.need}` : null,
    data.budget ? `Budget: ${data.budget}` : null,
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
    <p style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#c9cbc7;">Hi ${esc(data.name.split(' ')[0] || data.name)},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#c9cbc7;">We have your request for <strong style="color:#edecea;">${esc(data.service)}</strong>. We will reply with a clear next step.</p>
    <p style="margin:0 0 22px;font-size:16px;line-height:1.55;color:#c9cbc7;">If you need to add anything, reply to this email or WhatsApp 067 008 3909.</p>
    <p style="margin:0;font-size:14px;color:#9aa0ab;">This is a confirmation only. No payment has been taken.</p>
  `
  return {
    subject: 'We received your request — Zach of All Trades',
    html: layout({
      preheader: 'Your request is in. We will reply with the next step.',
      kicker: 'Zach of All Trades',
      heading: 'We have the request.',
      inner,
      footer: 'Zach of All Trades · Cape Town · clients@zachofalltrades.co.za',
    }),
    text: `Hi ${data.name},\n\nWe have your request for ${data.service}. We will reply with a clear next step.\n\nIf you need to add anything, reply to this email or WhatsApp 067 008 3909.\n\nThis is a confirmation only. No payment has been taken.\n\nZach of All Trades\nclients@zachofalltrades.co.za`,
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
