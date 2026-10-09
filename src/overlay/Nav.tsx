import { useState } from 'react'
import { isHomePath } from '../config/pages.ts'
import { navLinks, site } from '../config/site.ts'
import { followHash, onSiteLinkClick, openQuote } from '../lib/actions.ts'
import { scrollApi } from '../hooks/useSmoothScroll.ts'
import { useExperience } from '../store/experience.ts'
import { BrandMark } from './Mark.tsx'
import { MagneticButton } from './MagneticButton.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'

export function Nav() {
  const compact = useExperience((s) => s.compactNav)
  const [open, setOpen] = useState(false)
  const home = isHomePath()

  return (
    <header className={`nav ${compact ? 'is-compact' : ''} ${open ? 'is-open' : ''}`}>
      <a
        className="nav-logo"
        href={home ? '#top' : '/'}
        onClick={(e) => {
          setOpen(false)
          if (!home) return
          e.preventDefault()
          const twoD = document.documentElement.classList.contains('is-2d')
          if (twoD) {
            followHash('#top')
            return
          }
          scrollApi.toProgress(0)
        }}
        aria-label="Zach of All Trades — back to start"
      >
        <span className="nav-mark">
          <BrandMark />
        </span>
        <span className="nav-word">{site.name}</span>
      </a>
      <span className="nav-status">SYSTEMS ONLINE</span>
      <nav className="nav-links" aria-label="Primary">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => {
              setOpen(false)
              const pathOnly = link.href.startsWith('/') && !link.href.startsWith('/#')
              if (pathOnly) return
              if (!home && link.href.startsWith('/#')) return
              e.preventDefault()
              const twoD = document.documentElement.classList.contains('is-2d')
              if (twoD) {
                onSiteLinkClick(e)
                return
              }
              if ('progress' in link) scrollApi.toProgress(link.progress)
              else followHash(link.href.includes('#') ? `#${link.href.split('#')[1]}` : link.href)
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
