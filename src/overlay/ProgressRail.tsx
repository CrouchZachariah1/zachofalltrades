import { useEffect, useRef } from 'react'
import { jumpTo } from '../lib/actions.ts'
import { live } from '../store/experience.ts'

export function ProgressRail() {
  const bar = useRef<HTMLSpanElement>(null)
  const cue = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${live.progress})`
      if (cue.current) cue.current.style.opacity = String(Math.max(0, 1 - live.progress * 22))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div
        className="progress-rail"
        role="slider"
        aria-label="Move through the workshop"
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          jumpTo((e.clientX - r.left) / r.width)
        }}
      >
        <span ref={bar} />
      </div>
      <p ref={cue} className="scroll-cue">
        SCROLL
      </p>
    </>
  )
}
