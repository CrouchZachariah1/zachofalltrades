export function fitBeat(el: HTMLElement): void {
  const h2 = el.querySelector('h2')
  if (!(h2 instanceof HTMLElement)) return

  const spans = Array.from(h2.querySelectorAll('span'))
  if (spans.length === 0) return

  spans.forEach((span) => {
    span.style.whiteSpace = 'nowrap'
    span.style.display = 'block'
    span.style.width = 'max-content'
    span.style.maxWidth = 'none'
    span.style.overflow = 'visible'
  })

  let extraH = 0
  Array.from(el.children).forEach((child) => {
    if (child === h2) return
    const node = child as HTMLElement
    const cs = getComputedStyle(node)
    extraH += node.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom)
  })

  const maxW = el.clientWidth
  const maxH = Math.max(64, el.clientHeight - extraH)
  if (maxW < 48) return

  h2.style.fontSize = '100px'
  const textW = Math.max(1, ...spans.map((span) => span.scrollWidth))
  const textH = Math.max(1, h2.scrollHeight)
  const size = 100 * Math.min(maxW / textW, maxH / textH) * 0.96
  h2.style.fontSize = `${Math.max(16, Math.min(size, 140))}px`
}

export function watchBeats(getElements: () => Array<HTMLElement | null>): () => void {
  let frame = 0
  const run = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      getElements().forEach((el) => {
        if (el) fitBeat(el)
      })
    })
  }

  const observer = new ResizeObserver(run)
  getElements().forEach((el) => {
    if (el) observer.observe(el)
  })
  window.addEventListener('resize', run)
  const fonts = document.fonts?.ready.then(run)
  const later = window.setTimeout(run, 400)

  run()

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('resize', run)
    window.clearTimeout(later)
    void fonts
  }
}
