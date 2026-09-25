import * as THREE from 'three'

function canvasTexture(
  size: number,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  linear = false,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  draw(ctx, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.minFilter = linear ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter
  tex.needsUpdate = true
  return tex
}

export function makeMotherboardTexture(): THREE.CanvasTexture {
  return canvasTexture(2048, (ctx, s) => {
    ctx.fillStyle = '#07140f'
    ctx.fillRect(0, 0, s, s)

    const gold = '#c9a227'
    const trace = '#1a6b48'
    const traceHi = '#2a8f62'
    const silk = '#d5ddd6'
    const mask = '#0b1c16'

    ctx.fillStyle = mask
    for (let i = 0; i < 80; i += 1) {
      const x = (i * 73) % s
      const y = (i * 41) % s
      ctx.fillRect(x, y, 90, 18)
    }

    ctx.lineCap = 'square'
    for (let i = 0; i < 120; i += 1) {
      ctx.strokeStyle = i % 3 === 0 ? gold : i % 2 === 0 ? traceHi : trace
      ctx.globalAlpha = 0.35 + (i % 5) * 0.08
      ctx.lineWidth = i % 7 === 0 ? 3 : 1.5
      const x = 24 + ((i * 97) % (s - 48))
      const y = 24 + ((i * 53) % (s - 48))
      ctx.beginPath()
      ctx.moveTo(x, y)
      if (i % 2 === 0) {
        ctx.lineTo(x + 40 + (i % 6) * 28, y)
        ctx.lineTo(x + 40 + (i % 6) * 28, y + 50 + (i % 4) * 20)
      } else {
        ctx.lineTo(x, y + 36 + (i % 5) * 22)
        ctx.lineTo(x + 70, y + 36 + (i % 5) * 22)
      }
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    ctx.fillStyle = gold
    for (let i = 0; i < 220; i += 1) {
      const x = 20 + ((i * 137) % (s - 40))
      const y = 20 + ((i * 89) % (s - 40))
      ctx.beginPath()
      ctx.arc(x, y, i % 9 === 0 ? 3.2 : 1.6, 0, Math.PI * 2)
      ctx.fill()
    }

    const socketX = s * 0.34
    const socketY = s * 0.28
    const socket = s * 0.22
    ctx.fillStyle = '#12181a'
    ctx.fillRect(socketX, socketY, socket, socket)
    ctx.strokeStyle = gold
    ctx.lineWidth = 6
    ctx.strokeRect(socketX, socketY, socket, socket)
    ctx.fillStyle = gold
    const pitch = 11
    for (let x = 0; x < 16; x += 1) {
      for (let y = 0; y < 16; y += 1) {
        if ((x + y) % 2 === 0) ctx.fillRect(socketX + 18 + x * pitch, socketY + 18 + y * pitch, 4, 4)
      }
    }

    ctx.fillStyle = '#0d241c'
    ctx.fillRect(s * 0.08, s * 0.68, s * 0.84, 70)
    ctx.fillStyle = gold
    for (let i = 0; i < 22; i += 1) ctx.fillRect(s * 0.1 + i * 34, s * 0.7, 16, 12)

    ctx.fillStyle = '#141414'
    for (let i = 0; i < 4; i += 1) {
      const y = s * 0.14 + i * 52
      ctx.fillRect(s * 0.72, y, 210, 40)
      ctx.fillStyle = gold
      ctx.fillRect(s * 0.72, y, 210, 5)
      ctx.fillStyle = '#141414'
    }

    const holes = [
      [0.06, 0.08],
      [0.94, 0.08],
      [0.06, 0.92],
      [0.94, 0.92],
      [0.06, 0.5],
      [0.5, 0.92],
    ]
    holes.forEach(([hx, hy]) => {
      ctx.fillStyle = gold
      ctx.beginPath()
      ctx.arc(s * hx, s * hy, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#05080a'
      ctx.beginPath()
      ctx.arc(s * hx, s * hy, 7, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.fillStyle = silk
    ctx.font = '700 42px sans-serif'
    ctx.fillText('ZACH OF ALL TRADES', 70, 80)
    ctx.font = '22px monospace'
    ctx.fillText('ATX  ·  DDR5  ·  PCIe 5.0  ·  Z3 BOARD', 70, 118)
    ctx.fillText('CPU_0', socketX, socketY - 16)
    ctx.fillText('DIMM_A1  A2  B1  B2', s * 0.72, s * 0.12)
    ctx.fillText('PCIEX16', s * 0.08, s * 0.66)
    ctx.fillText('24PIN', s * 0.08, s * 0.55)
    ctx.fillText('EPS 8PIN', s * 0.08, s * 0.22)
    ctx.fillText('M.2_1', s * 0.42, s * 0.84)
  })
}

export function makeBrushedMetal(): THREE.CanvasTexture {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#1a1e26'
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < s; i += 1) {
      ctx.fillStyle = `rgba(220,230,245,${0.015 + Math.random() * 0.04})`
      ctx.fillRect(0, i, s, 1)
      if (i % 7 === 0) {
        ctx.fillStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.08})`
        ctx.fillRect(0, i, s, 1)
      }
    }
  })
}

export function makeGpuShroudTexture(): THREE.CanvasTexture {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#0c0d11'
    ctx.fillRect(0, 0, s, s)
    ctx.fillStyle = '#15171c'
    for (let y = 8; y < s; y += 14) {
      for (let x = 8; x < s; x += 10) {
        ctx.beginPath()
        ctx.ellipse(x, y, 3.2, 1.4, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.strokeStyle = 'rgba(78,227,255,0.12)'
    ctx.strokeRect(12, 12, s - 24, s - 24)
  })
}

export function makeGrilleTexture(): THREE.CanvasTexture {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#0c0e12'
    ctx.fillRect(0, 0, s, s)
    ctx.fillStyle = '#07080b'
    const step = 10
    for (let y = 4; y < s; y += step) {
      for (let x = 4; x < s; x += step) {
        ctx.beginPath()
        ctx.arc(x, y, 3.1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  })
}

export function makeCarbonTexture(): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#12141a'
    ctx.fillRect(0, 0, s, s)
    ctx.strokeStyle = '#1c2028'
    ctx.lineWidth = 3
    for (let i = -s; i < s * 2; i += 10) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + s, s)
      ctx.stroke()
    }
    ctx.strokeStyle = '#0a0b0e'
    for (let i = -s; i < s * 2; i += 10) {
      ctx.beginPath()
      ctx.moveTo(i, s)
      ctx.lineTo(i + s, 0)
      ctx.stroke()
    }
  })
}

export function makeWindowTexture(): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#0a1428'
    ctx.fillRect(0, 0, s, s)
    for (let y = 6; y < s; y += 14) {
      for (let x = 6; x < s; x += 10) {
        const on = ((x * 13 + y * 7) % 17) > 6
        ctx.fillStyle = on ? (y % 28 === 6 ? '#ffd08a' : '#9ecbff') : '#071018'
        ctx.globalAlpha = on ? 0.85 : 0.4
        ctx.fillRect(x, y, 6, 9)
      }
    }
    ctx.globalAlpha = 1
  })
}

export function makeLabelTexture(text: string, accent = '#4ee3ff'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 96
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.clearRect(0, 0, 512, 96)
  ctx.fillStyle = 'rgba(8,10,14,0.78)'
  ctx.fillRect(10, 22, 492, 52)
  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.45
  ctx.lineWidth = 1
  ctx.strokeRect(10.5, 22.5, 491, 51)
  ctx.globalAlpha = 1
  ctx.fillStyle = accent
  ctx.font = '500 26px "IBM Plex Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 256, 48)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export function makeHudTexture(
  rows: { label: string; value: string; warn?: boolean }[],
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.fillStyle = 'rgba(8, 10, 14, 0.88)'
  ctx.fillRect(0, 0, 512, 512)
  ctx.strokeStyle = 'rgba(78,227,255,0.35)'
  ctx.strokeRect(10, 10, 492, 492)
  ctx.fillStyle = '#4ee3ff'
  ctx.font = '500 20px "IBM Plex Mono", monospace'
  ctx.fillText('DIAGNOSTICS', 28, 48)
  ctx.font = '16px "IBM Plex Mono", monospace'
  rows.forEach((row, i) => {
    const y = 96 + i * 58
    ctx.fillStyle = row.warn ? '#c45a52' : '#c5d0da'
    ctx.fillText(row.label, 28, y)
    ctx.fillText(row.value, 300, y)
    ctx.fillStyle = row.warn ? '#c45a52' : '#4ee3ff'
    ctx.globalAlpha = 0.55
    ctx.fillRect(28, y + 10, row.warn ? 280 : 180, 2)
    ctx.globalAlpha = 1
  })
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export function makeScreenTexture(mode: 'idle' | 'error' | 'on'): THREE.CanvasTexture {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = mode === 'error' ? '#1a0508' : '#05070d'
    ctx.fillRect(0, 0, s, s)
    if (mode === 'error') {
      ctx.fillStyle = '#ff5a4a'
      ctx.font = '700 48px sans-serif'
      ctx.fillText('MEMORY', 70, 220)
      ctx.fillText('ERROR', 90, 280)
      ctx.fillRect(0, 40, s, 6)
      ctx.fillRect(0, s - 46, s, 6)
      return
    }
    if (mode === 'on') {
      ctx.fillStyle = '#4ee3ff'
      ctx.font = '700 42px sans-serif'
      ctx.fillText('ZACH', 160, 200)
      ctx.font = '28px sans-serif'
      ctx.fillStyle = '#eef4ff'
      ctx.fillText('OF ALL TRADES', 110, 250)
      ctx.strokeStyle = '#4ee3ff'
      ctx.strokeRect(80, 140, 352, 160)
      return
    }
    ctx.fillStyle = '#4ee3ff'
    ctx.globalAlpha = 0.4
    ctx.fillRect(s * 0.2, s * 0.48, s * 0.6, 4)
  }, true)
}

export function makeGradientRay(): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, s) => {
    const g = ctx.createLinearGradient(s / 2, 0, s / 2, s)
    g.addColorStop(0, 'rgba(180,220,255,0.55)')
    g.addColorStop(0.4, 'rgba(80,160,255,0.12)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
  }, true)
}

export function makeOpsTexture(title: string, lines: string[]): THREE.CanvasTexture {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#080a0e'
    ctx.fillRect(0, 0, s, s)
    ctx.strokeStyle = 'rgba(78,227,255,0.08)'
    ctx.lineWidth = 1
    for (let x = 0; x < s; x += 32) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, s)
      ctx.stroke()
    }
    for (let y = 0; y < s; y += 32) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(s, y)
      ctx.stroke()
    }
    ctx.fillStyle = '#4ee3ff'
    ctx.font = '500 26px "IBM Plex Mono", monospace'
    ctx.fillText(title, 28, 52)
    ctx.fillStyle = '#8b919a'
    ctx.font = '18px "IBM Plex Mono", monospace'
    lines.forEach((line, i) => {
      ctx.fillText(line, 28, 100 + i * 34)
    })
    ctx.fillStyle = 'rgba(78,227,255,0.35)'
    ctx.fillRect(28, s - 48, 180, 2)
  }, true)
}

export function makeSiteScreen(): THREE.CanvasTexture {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#0b0d11'
    ctx.fillRect(0, 0, s, s)
    ctx.fillStyle = '#14181e'
    ctx.fillRect(24, 24, s - 48, 36)
    ctx.fillStyle = '#4ee3ff'
    ctx.fillRect(36, 36, 48, 12)
    ctx.fillStyle = '#2a3038'
    ctx.fillRect(96, 36, 80, 12)
    ctx.fillRect(188, 36, 64, 12)
    ctx.fillStyle = '#4ee3ff'
    ctx.globalAlpha = 0.22
    ctx.fillRect(24, 84, s - 48, 120)
    ctx.globalAlpha = 1
    ctx.fillStyle = '#dfe6ef'
    ctx.font = '600 36px sans-serif'
    ctx.fillText('ZACH OF ALL TRADES', 40, 150)
    ctx.fillStyle = '#8b919a'
    ctx.font = '16px "IBM Plex Mono", monospace'
    ctx.fillText('BUILD IT  ·  CONNECT IT  ·  PROTECT IT  ·  FIX IT', 40, 182)
    ctx.fillStyle = '#16191e'
    ctx.fillRect(24, 230, 140, 90)
    ctx.fillRect(180, 230, 140, 90)
    ctx.fillRect(336, 230, 140, 90)
    ctx.fillStyle = '#4ee3ff'
    ctx.globalAlpha = 0.18
    ctx.fillRect(24, 340, s - 48, 8)
    ctx.globalAlpha = 1
  }, true)
}

export function makeNoiseTexture(): THREE.CanvasTexture {
  return canvasTexture(128, (ctx, s) => {
    const img = ctx.createImageData(s, s)
    for (let i = 0; i < img.data.length; i += 4) {
      const n = 180 + Math.random() * 75
      img.data[i] = n
      img.data[i + 1] = n
      img.data[i + 2] = n
      img.data[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }, true)
}
