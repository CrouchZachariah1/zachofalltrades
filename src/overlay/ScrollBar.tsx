import { useEffect, useRef } from 'react'
import { jumpTo } from '../lib/actions.ts'
import { live } from '../store/experience.ts'

function progressFromY(el: HTMLElement, clientY: number) {
  const r = el.getBoundingClientRect()
  if (r.height <= 0) return 0
  return Math.max(0, Math.min(1, (clientY - r.top) / r.height))
}

export function ScrollBar() {
  const rail = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const el = thumb.current
      const track = rail.current
      if (el && track) {
        const page = Math.max(window.innerHeight, document.documentElement.scrollHeight)
        const size = Math.max(0.08, Math.min(0.32, window.innerHeight / page))
        el.style.height = `${size * 100}%`
        el.style.top = `${live.progress * (1 - size) * 100}%`
        track.setAttribute('aria-valuenow', String(Math.round(live.progress * 100)))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={rail}
      className="scroll-bar"
      role="scrollbar"
      aria-label="Page position"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      tabIndex={0}
      onClick={(e) => jumpTo(progressFromY(e.currentTarget, e.clientY))}
    >
      <span ref={thumb} />
    </div>
  )
}
