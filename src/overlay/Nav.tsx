import { useState } from 'react'
import { navLinks, site } from '../config/site.ts'
import { openQuote } from '../lib/actions.ts'
import { scrollApi } from '../hooks/useSmoothScroll.ts'
import { useExperience } from '../store/experience.ts'
import { BrandMark } from './Mark.tsx'
import { MagneticButton } from './MagneticButton.tsx'

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
          <button
            key={link.id}
            type="button"
            onClick={() => {
              setOpen(false)
              const twoD = document.documentElement.classList.contains('is-2d')
              if (twoD && 'href' in link && link.href) scrollApi.toElement(link.href.slice(1))
              else if ('progress' in link) scrollApi.toProgress(link.progress)
              else if ('href' in link && link.href) scrollApi.toElement(link.href.slice(1))
            }}
          >
            {link.label}
          </button>
        ))}
      </nav>
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
