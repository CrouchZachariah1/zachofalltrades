import { config } from './config.js'
import { clamp, drawFrame } from './render.js'

const canvas = document.querySelector('#stage')
const ctx = canvas.getContext('2d', { alpha: false })
const playBtn = document.querySelector('#play')
const pauseBtn = document.querySelector('#pause')
const replayBtn = document.querySelector('#replay')
const scrub = document.querySelector('#scrub')
const timeLabel = document.querySelector('#time')
const muteBtn = document.querySelector('#mute')
const exportBtn = document.querySelector('#export')
const exportNote = document.querySelector('#export-note')
const statusEl = document.querySelector('#status')
const readyGate = document.querySelector('#ready-gate')

canvas.width = config.width
canvas.height = config.height

let time = 0
let playing = false
let origin = 0
let originMs = 0
let recording = false
let muted = true
let audio = null
ctx.imageSmoothingEnabled = true
ctx.imageSmoothingQuality = 'high'

function fmt(t) {
  const s = Math.max(0, Math.min(config.duration, t))
  return `0:${s.toFixed(1).padStart(4, '0')}`
}

function setupAudio() {
  const ctxA = new AudioContext()
  const master = ctxA.createGain()
  master.gain.value = 0
  master.connect(ctxA.destination)
  const osc = ctxA.createOscillator()
  const gain = ctxA.createGain()
  osc.type = 'sine'
  osc.frequency.value = 92
  gain.gain.value = 0.035
  osc.connect(gain)
  gain.connect(master)
  osc.start()
  const click = () => {
    if (muted) return
    const o = ctxA.createOscillator()
    const g = ctxA.createGain()
    o.type = 'triangle'
    o.frequency.value = 420
    g.gain.setValueAtTime(0.04, ctxA.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctxA.currentTime + 0.12)
    o.connect(g)
    g.connect(master)
    o.start()
    o.stop(ctxA.currentTime + 0.14)
  }
  return {
    ctx: ctxA,
    master,
    click,
    setMuted(v) {
      muted = v
      master.gain.value = v ? 0 : 0.8
      if (!v && ctxA.state === 'suspended') ctxA.resume()
    },
  }
}

function render() {
  drawFrame(ctx, time)
  scrub.value = String(time)
  timeLabel.textContent = `${fmt(time)} / 0:${config.duration}.0`
}

function tick(now) {
  if (!playing) return
  time = origin + (now - originMs) / 1000
  if (time >= config.duration) {
    time = config.duration
    playing = false
    render()
    return
  }
  render()
  requestAnimationFrame(tick)
}

function play() {
  if (time >= config.duration) time = 0
  playing = true
  origin = time
  originMs = performance.now()
  if (audio && !muted) audio.setMuted(false)
  requestAnimationFrame(tick)
}

function pause() {
  playing = false
}

function seek(t) {
  time = clamp(Number(t), 0, config.duration)
  render()
}

playBtn.addEventListener('click', play)
pauseBtn.addEventListener('click', pause)
replayBtn.addEventListener('click', () => {
  time = 0
  play()
})
scrub.min = '0'
scrub.max = String(config.duration)
scrub.step = '0.05'
scrub.addEventListener('input', () => {
  pause()
  seek(scrub.value)
})
muteBtn.addEventListener('click', () => {
  if (!audio) audio = setupAudio()
  audio.setMuted(!muted)
  muteBtn.textContent = muted ? 'Sound off' : 'Sound on'
  muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false')
})

function pickMime() {
  const types = [
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8',
    'video/webm',
  ]
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || ''
}

async function exportVideo() {
  if (recording) return
  const mime = pickMime()
  if (!mime || typeof canvas.captureStream !== 'function') {
    exportNote.textContent = 'This browser cannot record canvas video. Open in Chrome or Edge, then export.'
    return
  }
  const ext = mime.includes('mp4') ? 'mp4' : 'webm'
  exportNote.textContent = `Recording ${ext.toUpperCase()} at 1080×1920, 30fps — 20 seconds. Keep this tab visible.`
  exportBtn.disabled = true
  recording = true
  pause()
  time = 0
  render()

  const stream =
    typeof canvas.captureStream === 'function' ? canvas.captureStream(config.fps) : null
  if (!stream) {
    exportNote.textContent = 'This browser cannot record canvas video. Open in Chrome or Edge, then export.'
    exportBtn.disabled = false
    recording = false
    return
  }
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 14_000_000 })
  const chunks = []
  rec.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data)
  }
  const done = new Promise((resolve) => {
    rec.onstop = resolve
  })
  rec.start(100)
  const frames = config.duration * config.fps
  const track = stream.getVideoTracks()[0]
  playing = false
  for (let i = 0; i <= frames; i += 1) {
    time = i / config.fps
    render()
    if (typeof track.requestFrame === 'function') track.requestFrame()
    await new Promise((r) => setTimeout(r, 1000 / config.fps))
  }
  rec.stop()
  await done
  const blob = new Blob(chunks, { type: mime })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `zoat-web-ad-20s.${ext}`
  a.click()
  URL.revokeObjectURL(a.href)
  exportNote.textContent = `Saved zoat-web-ad-20s.${ext} (${ext === 'mp4' ? 'MP4' : 'WebM, not MP4'}).`
  exportBtn.disabled = false
  recording = false
}

exportBtn.addEventListener('click', () => {
  exportVideo().catch((err) => {
    recording = false
    exportBtn.disabled = false
    exportNote.textContent = err.message || 'Export failed.'
  })
})

function fit() {
  const wrap = document.querySelector('.stage-wrap')
  const frame = document.querySelector('.stage-frame')
  const pad = 24
  const availW = wrap.clientWidth - pad
  const availH = wrap.clientHeight - pad
  const scale = Math.min(availW / config.width, availH / config.height)
  frame.style.width = `${config.width * scale}px`
  frame.style.height = `${config.height * scale}px`
  canvas.style.transform = `scale(${scale})`
}

window.addEventListener('resize', fit)

async function boot() {
  statusEl.textContent = 'Loading fonts…'
  try {
    await document.fonts.ready
  } catch {
    /* system fonts */
  }
  render()
  fit()
  const q = new URLSearchParams(location.search)
  if (q.has('t')) seek(q.get('t'))
  readyGate.hidden = true
  statusEl.textContent = 'Ready'
}

boot()
