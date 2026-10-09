import { useState } from 'react'
import { navLinks, site } from '../config/site.ts'
import { openQuote } from '../lib/actions.ts'
import { scrollApi } from '../hooks/useSmoothScroll.ts'
import { useExperience } from '../store/experience.ts'
import { BrandMark } from './Mark.tsx'
import { MagneticButton } from './MagneticButton.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'

export function Nav() {
  const compact = useExperience((s) => s.compactNav)
  const [open, setOpen] = useState(false)

  return (
    <header className={`nav ${compact ? 'is-compact' : ''} ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="nav-logo"
        onClick={() => {
          setOpen(false)
          scrollApi.toProgress(0)
        }}
        aria-label="Back to start"
      >
        <span className="nav-mark">
          <BrandMark />
        </span>
        <span className="nav-word">{site.name}</span>
      </button>
      <span className="nav-status">SYSTEMS ONLINE</span>
      <nav className="nav-links" aria-label="Primary">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => {
              e.preventDefault()
              setOpen(false)
              const twoD = document.documentElement.classList.contains('is-2d')
              if (twoD) {
                if (window.location.hash !== link.href) history.pushState(null, '', link.href)
                scrollApi.toElement(link.href.slice(1))
                return
              }
              if ('progress' in link) scrollApi.toProgress(link.progress)
              else scrollApi.toElement(link.href.slice(1))
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <ThemeToggle />
      <button
        type="button"
        className="nav-menu"
        aria-expanded={open}
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        MENU
      </button>
      <MagneticButton
        className="nav-cta"
        onClick={() => {
          setOpen(false)
          openQuote()
        }}
      >
        GET A QUOTE
      </MagneticButton>
    </header>
  )
}
