import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useExperience } from '../store/experience.ts'

function isNativeZone(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return Boolean(target.closest('.contact, .footer, input, textarea, select'))
}

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const label = useExperience((s) => s.hoveredLabel)
  const status = useExperience((s) => s.hoveredStatus)
  const node = useExperience((s) => s.hoveredNode)
  const text = label || node
  const kicker = status || (node ? 'DEVICE DETECTED' : null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    document.documentElement.classList.add('has-cursor')
    const xTo = gsap.quickTo(el, 'left', { duration: 0.06, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'top', { duration: 0.06, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      el.classList.add('is-on')
      xTo(e.clientX)
      yTo(e.clientY)
      const native = isNativeZone(e.target)
      el.classList.toggle('is-hidden', native)
      document.documentElement.classList.toggle('is-native-cursor', native)
    }
    const leave = () => el.classList.add('is-hidden')

    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.classList.remove('has-cursor', 'is-native-cursor')
    }
  }, [])

  return (
    <div ref={ref} className={`cursor${text ? ' is-hot' : ''}`} aria-hidden>
      <span className="cursor-ring" />
      <span className="cursor-cross" />
      {text && (
        <span className="cursor-tag">
          {kicker && <em>{kicker}</em>}
          {text}
        </span>
      )}
    </div>
  )
}
