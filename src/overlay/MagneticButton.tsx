import gsap from 'gsap'
import { useRef, type MouseEvent, type ReactNode, type RefObject } from 'react'
import { scrollApi } from '../hooks/useSmoothScroll.ts'

type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  title?: string
  'aria-label'?: string
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  type = 'button',
  disabled,
  title,
  'aria-label': ariaLabel,
}: Props) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  const move = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.22,
      y: (e.clientY - (r.top + r.height / 2)) * 0.22,
      duration: 0.35,
      ease: 'power3.out',
    })
  }

  const leave = () => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' })
  }

  if (href) {
    const hash = href.startsWith('#')
    const external = href.startsWith('http')
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={`magnet ${className}`}
        onMouseMove={move}
        onMouseLeave={leave}
        onClick={(e) => {
          if (hash) {
            e.preventDefault()
            const id = href.slice(1)
            if (window.location.hash !== href) history.pushState(null, '', href)
            scrollApi.toElement(id)
          }
          onClick?.()
        }}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        title={title}
        aria-label={ariaLabel}
      >
        <span>{children}</span>
      </a>
    )
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      className={`magnet ${className}`}
      onMouseMove={move}
      onMouseLeave={leave}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
    </button>
  )
}
