export function fitBeat(el: HTMLElement): void {
  const heading = el.querySelector('h1, h2')
  if (!(heading instanceof HTMLElement)) return

  const spans = Array.from(heading.querySelectorAll('span'))
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
    if (child === heading) return
    const node = child as HTMLElement
    const cs = getComputedStyle(node)
    extraH += node.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom)
  })

  const maxW = el.clientWidth
  const maxH = Math.max(64, el.clientHeight - extraH)
  if (maxW < 48) return

  heading.style.fontSize = '100px'
  const textW = Math.max(1, ...spans.map((span) => span.scrollWidth))
  const textH = Math.max(1, heading.scrollHeight)
  const size = 100 * Math.min(maxW / textW, maxH / textH) * 0.96
  heading.style.fontSize = `${Math.max(16, Math.min(size, 140))}px`
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
