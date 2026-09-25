import { config as C } from './config.js'

const { colors: COL, fonts: F, copy: COPY, concept: K, scenes: S } = C

export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v))
}
export function lerp(a, b, t) {
  return a + (b - a) * t
}
export function clamp01(t) {
  return clamp(t, 0, 1)
}
export function easeOutCubic(t) {
  const x = clamp01(t)
  return 1 - (1 - x) ** 3
}
export function easeOutExpo(t) {
  const x = clamp01(t)
  return x === 1 ? 1 : 1 - 2 ** (-10 * x)
}
export function easeInOut(t) {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2
}
export function appear(t, start, dur = 0.45) {
  return easeOutCubic((t - start) / dur)
}
export function hold(t, start, end, fadeIn = 0.35, fadeOut = 0.28) {
  if (t < start) return appear(t, start - fadeIn, fadeIn)
  if (t > end) return 1 - appear(t, end, fadeOut)
  return 1
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function fillRound(ctx, x, y, w, h, r, fill) {
  roundRect(ctx, x, y, w, h, r)
  ctx.fillStyle = fill
  ctx.fill()
}

function strokeRound(ctx, x, y, w, h, r, stroke, width = 1) {
  roundRect(ctx, x, y, w, h, r)
  ctx.strokeStyle = stroke
  ctx.lineWidth = width
  ctx.stroke()
}

function tracked(ctx, text, x, y, tracking, align = 'left') {
  const chars = [...text]
  let width = 0
  const widths = chars.map((ch) => {
    const w = ctx.measureText(ch).width + tracking
    width += w
    return w
  })
  let cx = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x
  for (let i = 0; i < chars.length; i += 1) {
    ctx.fillText(chars[i], cx, y)
    cx += widths[i]
  }
}

function drawGrid(ctx, t) {
  ctx.save()
  ctx.strokeStyle = 'rgba(243,245,247,0.035)'
  ctx.lineWidth = 1
  for (let x = 0; x <= C.width; x += 80) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, C.height)
    ctx.stroke()
  }
  for (let y = 0; y <= C.height; y += 80) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(C.width, y)
    ctx.stroke()
  }
  const pulse = 0.035 + 0.025 * (0.5 + 0.5 * Math.sin(t * 2.2))
  const g = ctx.createRadialGradient(540, 960, 40, 540, 960, 820)
  g.addColorStop(0, `rgba(78,227,255,${pulse})`)
  g.addColorStop(1, 'rgba(78,227,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, C.width, C.height)
  ctx.restore()
}

function labelConcept(ctx, x, y, a = 1) {
  ctx.save()
  ctx.globalAlpha = a
  ctx.font = `500 18px ${F.mono}`
  ctx.fillStyle = COL.cyan
  ctx.fillText(K.label.toUpperCase(), x, y)
  ctx.restore()
}

function browserChrome(ctx, x, y, w, h, url, a = 1) {
  ctx.save()
  ctx.globalAlpha = a
  fillRound(ctx, x, y, w, h, 22, COL.charcoal)
  strokeRound(ctx, x, y, w, h, 22, COL.line, 1.5)
  fillRound(ctx, x, y, w, 52, 22, '#101218')
  ctx.fillStyle = '#101218'
  ctx.fillRect(x, y + 26, w, 26)
  const dots = ['#c45a52', '#c9a227', '#3fa66b']
  dots.forEach((c, i) => {
    ctx.beginPath()
    ctx.fillStyle = c
    ctx.arc(x + 28 + i * 22, y + 26, 6, 0, Math.PI * 2)
    ctx.fill()
  })
  fillRound(ctx, x + 110, y + 14, w - 150, 26, 8, '#0b0c0f')
  ctx.font = `500 16px ${F.mono}`
  ctx.fillStyle = COL.mute
  ctx.fillText(url, x + 124, y + 32)
  ctx.restore()
  return { bx: x + 10, by: y + 58, bw: w - 20, bh: h - 70 }
}

function drawHomePage(ctx, x, y, w, h, build, scroll = 0) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.translate(0, -scroll)
  ctx.fillStyle = '#0e1014'
  ctx.fillRect(x, y, w, h + 400)

  ctx.fillStyle = COL.ink
  ctx.font = `700 22px ${F.display}`
  ctx.fillText(K.name, x + 28, y + 42)
  if (w > 420) {
    ctx.font = `500 14px ${F.sans}`
    ctx.fillStyle = COL.mute
    K.nav.forEach((n, i) => ctx.fillText(n, x + w - 220 + i * 72, y + 42))
  }

  const hero = appear(build, 0.08, 0.32)
  ctx.save()
  ctx.globalAlpha = hero
  ctx.translate(0, lerp(36, 0, hero))
  fillRound(ctx, x + 24, y + 64, w - 48, h * 0.32, 14, '#15181f')
  const imgH = Math.min(86, h * 0.1)
  const g = ctx.createLinearGradient(x + 24, y + 64, x + w - 24, y + 64 + imgH)
  g.addColorStop(0, '#1a3240')
  g.addColorStop(1, '#0f1c22')
  ctx.fillStyle = g
  ctx.fillRect(x + 24, y + 64, w - 48, imgH)
  ctx.fillStyle = COL.cyan
  ctx.font = `800 ${Math.max(28, w * 0.055)}px ${F.display}`
  ctx.fillText(K.hero, x + 48, y + 64 + imgH + 52)
  ctx.fillStyle = COL.mute
  ctx.font = `400 18px ${F.sans}`
  ctx.fillText(K.tag, x + 48, y + 64 + imgH + 82)
  fillRound(ctx, x + 48, y + 64 + h * 0.32 - 52, 150, 36, 8, COL.cyan)
  ctx.fillStyle = '#0b0c0f'
  ctx.font = `600 16px ${F.sans}`
  ctx.fillText('Enquire', x + 84, y + 64 + h * 0.32 - 28)
  ctx.restore()

  const cards = appear(build, 0.34, 0.32)
  const cw = (w - 72) / 3
  K.cards.forEach((c, i) => {
    const a = appear(build, 0.34 + i * 0.08, 0.28)
    ctx.save()
    ctx.globalAlpha = a
    ctx.translate(0, lerp(28, 0, a))
    const cx = x + 24 + i * (cw + 12)
    fillRound(ctx, cx, y + 64 + h * 0.32 + 20, cw, 110, 12, '#15181f')
    ctx.fillStyle = COL.cyanDim
    ctx.fillRect(cx, y + 64 + h * 0.32 + 20, cw, 8)
    ctx.fillStyle = COL.ink
    ctx.font = `600 18px ${F.sans}`
    ctx.fillText(c, cx + 16, y + 64 + h * 0.32 + 78)
    ctx.restore()
  })

  const contact = appear(build, 0.62, 0.28)
  ctx.save()
  ctx.globalAlpha = contact
  ctx.translate(0, lerp(24, 0, contact))
  fillRound(ctx, x + 24, y + h * 0.78, w - 48, 90, 12, '#12151b')
  ctx.fillStyle = COL.ink
  ctx.font = `600 20px ${F.sans}`
  ctx.fillText('Start a piece', x + 48, y + h * 0.78 + 40)
  ctx.fillStyle = COL.mute
  ctx.font = `400 16px ${F.sans}`
  ctx.fillText('Sea Point  ·  By appointment', x + 48, y + h * 0.78 + 66)
  ctx.restore()
  ctx.restore()
}

function drawStore(ctx, x, y, w, h, build) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.fillStyle = '#0e1014'
  ctx.fillRect(x, y, w, h)
  ctx.fillStyle = COL.ink
  ctx.font = `700 22px ${F.display}`
  ctx.fillText(K.name, x + 28, y + 42)
  ctx.fillStyle = COL.mute
  ctx.font = `500 14px ${F.sans}`
  ctx.fillText('Shop', x + w - 80, y + 42)
  const cols = 2
  const gap = 16
  const pw = (w - 48 - gap) / cols
  const ph = 200
  K.products.forEach((p, i) => {
    const a = appear(build, 0.12 + i * 0.08, 0.3)
    ctx.globalAlpha = a
    const cx = x + 24 + (i % cols) * (pw + gap)
    const cy = y + 70 + Math.floor(i / cols) * (ph + gap)
    fillRound(ctx, cx, cy, pw, ph, 14, '#15181f')
    fillRound(ctx, cx + 12, cy + 12, pw - 24, 110, 10, '#10131a')
    ctx.fillStyle = COL.cyan
    ctx.globalAlpha = a * 0.35
    ctx.fillRect(cx + 12, cy + 12, pw - 24, 8)
    ctx.globalAlpha = a
    ctx.fillStyle = COL.ink
    ctx.font = `600 18px ${F.sans}`
    ctx.fillText(p, cx + 16, cy + 150)
    ctx.fillStyle = COL.mute
    ctx.font = `400 14px ${F.sans}`
    ctx.fillText('Made to order', cx + 16, cy + 174)
  })
  ctx.restore()
}

function drawDash(ctx, x, y, w, h, build) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.fillStyle = '#0c0e12'
  ctx.fillRect(x, y, w, h)
  fillRound(ctx, x, y, 180, h, 0, '#101318')
  ctx.fillStyle = COL.cyan
  ctx.font = `700 16px ${F.mono}`
  ctx.fillText('APP', x + 24, y + 40)
  K.dash.forEach((n, i) => {
    const a = appear(build, 0.1 + i * 0.08, 0.25)
    ctx.globalAlpha = a
    fillRound(ctx, x + 16, y + 70 + i * 52, 148, 40, 8, i === 0 ? COL.cyanDim : 'transparent')
    ctx.fillStyle = i === 0 ? COL.cyan : COL.mute
    ctx.font = `500 15px ${F.sans}`
    ctx.fillText(n, x + 28, y + 96 + i * 52)
  })
  ctx.globalAlpha = 1
  const cards = [
    { n: '12', l: 'Open jobs' },
    { n: '4', l: 'Due this week' },
    { n: '9', l: 'New enquiries' },
  ]
  const cardW = 210
  const cardGap = 16
  cards.forEach((c, i) => {
    const a = appear(build, 0.12 + i * 0.06, 0.22)
    ctx.globalAlpha = a
    const cx = x + 200 + i * (cardW + cardGap)
    fillRound(ctx, cx, y + 36, cardW, 120, 14, '#15181f')
    ctx.fillStyle = COL.ink
    ctx.font = `800 42px ${F.display}`
    ctx.fillText(c.n, cx + 20, y + 92)
    ctx.fillStyle = COL.mute
    ctx.font = `500 16px ${F.sans}`
    ctx.fillText(c.l, cx + 20, y + 126)
  })
  const chartA = appear(build, 0.28, 0.28)
  ctx.globalAlpha = chartA
  fillRound(ctx, x + 200, y + 176, 686, 280, 14, '#15181f')
  ctx.strokeStyle = COL.cyan
  ctx.lineWidth = 3
  ctx.beginPath()
  const pts = [40, 160, 90, 120, 150, 140, 210, 80, 280, 100, 360, 60, 460, 90, 580, 48]
  pts.forEach((py, i) => {
    const px = x + 240 + i * 70
    const yy = y + 200 + py
    if (i === 0) ctx.moveTo(px, yy)
    else ctx.lineTo(px, yy)
  })
  ctx.stroke()
  ctx.restore()
}

function wireSite(ctx, x, y, w, h, t) {
  ctx.save()
  ctx.strokeStyle = `rgba(78,227,255,${0.25 + 0.1 * Math.sin(t * 6)})`
  ctx.lineWidth = 1.5
  const blocks = [
    [24, 20, w - 48, 40],
    [24, 80, w - 48, h * 0.28],
    [24, 80 + h * 0.28 + 16, (w - 72) / 3, 90],
    [24 + (w - 72) / 3 + 12, 80 + h * 0.28 + 16, (w - 72) / 3, 90],
    [24 + 2 * ((w - 72) / 3 + 12), 80 + h * 0.28 + 16, (w - 72) / 3, 90],
  ]
  blocks.forEach(([bx, by, bw, bh]) => strokeRound(ctx, x + bx, y + by, bw, bh, 10, ctx.strokeStyle, 1.5))
  ctx.restore()
}

function drawPhone(ctx, x, y, w, h, build, scroll) {
  ctx.save()
  fillRound(ctx, x, y, w, h, 36, '#0a0b0e')
  strokeRound(ctx, x, y, w, h, 36, 'rgba(243,245,247,0.25)', 3)
  fillRound(ctx, x + w / 2 - 40, y + 12, 80, 18, 10, '#1a1d24')
  const ix = x + 10
  const iy = y + 40
  const iw = w - 20
  const ih = h - 52
  ctx.beginPath()
  roundRect(ctx, ix, iy, iw, ih, 18)
  ctx.clip()
  drawHomePage(ctx, ix, iy, iw, ih, build, scroll)
  ctx.restore()
}

export function drawFrame(ctx, t) {
  const { width: W, height: H } = C
  ctx.save()
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = COL.bg
  ctx.fillRect(0, 0, W, H)
  drawGrid(ctx, t >= S.stillFrom ? S.stillFrom : t)

  const hook = hold(t, S.hook[0] + 0.05, S.hook[1] - 0.15, 0.2, 0.25)
  if (hook > 0.01) {
    ctx.save()
    ctx.globalAlpha = hook
    const a1 = appear(t, 0.0, 0.32)
    const a2 = appear(t, 0.95, 0.4)
    ctx.fillStyle = COL.ink
    ctx.font = `800 78px ${F.display}`
    ctx.globalAlpha = hook * a1
    tracked(ctx, COPY.hookA, 540, 860, 3, 'center')
    ctx.fillStyle = COL.cyan
    ctx.globalAlpha = hook * a2
    tracked(ctx, COPY.hookB, 540, 980, 3, 'center')
    ctx.restore()
  }

  const offer = hold(t, S.offer[0] + 0.05, S.offer[1] - 0.12, 0.22, 0.22)
  if (offer > 0.01) {
    ctx.save()
    ctx.globalAlpha = offer
    const ta = appear(t, 3.05, 0.4)
    ctx.fillStyle = COL.ink
    ctx.font = `800 64px ${F.display}`
    ctx.globalAlpha = offer * ta
    tracked(ctx, COPY.offer, 540, 300, 2, 'center')
    const build = easeInOut((t - 3.2) / 2.4)
    const chrome = appear(t, 3.15, 0.35)
    ctx.globalAlpha = offer * chrome
    const frame = browserChrome(ctx, 90, 360, 900, 1180, 'saltandcedar.example', offer * chrome)
    wireSite(ctx, frame.bx, frame.by, frame.bw, frame.bh, t)
    ctx.globalAlpha = offer * build
    drawHomePage(ctx, frame.bx, frame.by, frame.bw, frame.bh, build, 0)
    labelConcept(ctx, 110, 1520, offer)
    ctx.restore()
  }

  const demo = hold(t, S.demo[0] + 0.04, S.demo[1] - 0.12, 0.22, 0.22)
  if (demo > 0.01) {
    ctx.save()
    ctx.globalAlpha = demo
    const a1 = appear(t, 6.05, 0.4)
    const a2 = appear(t, 6.55, 0.4)
    ctx.font = `800 52px ${F.display}`
    ctx.fillStyle = COL.ink
    ctx.globalAlpha = demo * a1
    tracked(ctx, COPY.demoA, 540, 280, 2, 'center')
    ctx.fillStyle = COL.cyan
    ctx.globalAlpha = demo * a2
    tracked(ctx, COPY.demoB, 540, 350, 2, 'center')
    const desk = appear(t, 6.3, 0.45)
    ctx.globalAlpha = demo * desk
    const frame = browserChrome(ctx, 48, 420, 700, 980, 'saltandcedar.example', demo * desk)
    const scroll = lerp(0, 220, easeInOut((t - 7.2) / 3.2))
    drawHomePage(ctx, frame.bx, frame.by, frame.bw, frame.bh, 1, scroll)
    const phoneX = lerp(1180, 690, easeOutCubic((t - 7.0) / 0.8))
    drawPhone(ctx, phoneX, 560, 340, 700, 1, scroll * 0.6)
    labelConcept(ctx, 70, 1450, demo)
    ctx.restore()
  }

  const svc = hold(t, S.services[0] + 0.04, S.services[1] - 0.1, 0.2, 0.22)
  if (svc > 0.01) {
    const local = t - 11
    const idx = local < 1.35 ? 0 : local < 2.7 ? 1 : 2
    const localIn = idx === 0 ? local : idx === 1 ? local - 1.35 : local - 2.7
    const titleA = appear(t, 11 + idx * 1.35, 0.28)
    ctx.save()
    ctx.globalAlpha = svc * titleA
    ctx.fillStyle = COL.cyan
    ctx.font = `800 48px ${F.display}`
    tracked(ctx, COPY.services[idx], 540, 300, 2, 'center')
    ctx.globalAlpha = svc
    const frame = browserChrome(ctx, 70, 360, 940, 1180, 'app.saltandcedar.example', svc)
    const build = easeOutCubic(localIn / 0.55)
    if (idx === 0) drawHomePage(ctx, frame.bx, frame.by, frame.bw, frame.bh, Math.max(build, 0.75), 0)
    if (idx === 1) drawStore(ctx, frame.bx, frame.by, frame.bw, frame.bh, Math.max(build, 0.75))
    if (idx === 2) drawDash(ctx, frame.bx, frame.by, frame.bw, frame.bh, Math.max(build, 0.85))
    labelConcept(ctx, 90, 1524, svc)
    ctx.restore()
  }

  const end = hold(t, S.end[0], S.end[1] + 0.2, 0.45, 0)
  if (end > 0.01) {
    ctx.save()
    ctx.globalAlpha = end
    const still = t >= S.stillFrom
    const drift = still ? 0 : (1 - appear(t, 15, 0.8)) * 16
    ctx.translate(0, drift)
    ctx.fillStyle = COL.ink
    ctx.font = `800 52px ${F.display}`
    tracked(ctx, COPY.brand, 540, 620, 2, 'center')
    ctx.fillStyle = COL.mute
    ctx.font = `500 26px ${F.sans}`
    ctx.textAlign = 'center'
    ctx.fillText(COPY.sub, 540, 680)
    ctx.fillStyle = COL.ink
    ctx.font = `600 36px ${F.sans}`
    ctx.fillText(COPY.lineA, 540, 820)
    ctx.fillStyle = COL.cyan
    ctx.fillText(COPY.lineB, 540, 880)

    const bw = 720
    const bh = 96
    const bx = (1080 - bw) / 2
    const by = 1020
    fillRound(ctx, bx, by, bw, bh, 12, COL.cyan)
    ctx.fillStyle = '#0b0c0f'
    ctx.font = `800 32px ${F.sans}`
    ctx.fillText(COPY.cta, 540, by + 62)

    ctx.fillStyle = COL.mute
    ctx.font = `500 22px ${F.sans}`
    ctx.fillText(COPY.footer, 540, 1580)
    ctx.textAlign = 'left'
    ctx.restore()
  }

  ctx.restore()
}
