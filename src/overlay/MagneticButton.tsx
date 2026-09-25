import gsap from 'gsap'
import { useRef, type MouseEvent, type ReactNode, type RefObject } from 'react'

type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  type = 'button',
  disabled,
}: Props) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  const move = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
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
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' })
  }

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={`magnet ${className}`}
        onMouseMove={move}
        onMouseLeave={leave}
        onClick={onClick}
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
    >
      <span>{children}</span>
    </button>
  )
}
