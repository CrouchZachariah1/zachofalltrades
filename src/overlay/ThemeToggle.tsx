import { useEffect, useState } from 'react'
import { toggleTheme } from '../lib/theme.ts'

function isLight() {
  return document.documentElement.classList.contains('theme-light')
}

export function ThemeToggle() {
  const [light, setLight] = useState(() => (typeof document === 'undefined' ? false : isLight()))

  useEffect(() => {
    const sync = () => setLight(isLight())
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <button
      type="button"
      className="nav-theme"
      aria-pressed={light}
      aria-label={light ? 'Use dark theme' : 'Use light theme'}
      title={light ? 'Dark theme' : 'Light theme'}
      onClick={() => setLight(toggleTheme() === 'light')}
    >
      {light ? (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.2 1.4a6.2 6.2 0 1 0 7.4 7.6 5.1 5.1 0 0 1-7.4-7.6Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="3.1" fill="currentColor" />
          <path
            fill="currentColor"
            d="M7.4 1h1.2v2.2H7.4zM7.4 12.8h1.2V15H7.4zM1 7.4h2.2v1.2H1zM12.8 7.4H15v1.2h-2.2zM3.05 2.2l.85-.85 1.56 1.56-.85.85zM10.54 12.24l.85-.85 1.56 1.56-.85.85zM2.2 12.95l-.85-.85 1.56-1.56.85.85zM12.24 5.46l-.85-.85 1.56-1.56.85.85z"
          />
        </svg>
      )}
      <span className="nav-theme-label">{light ? 'Dark' : 'Light'}</span>
    </button>
  )
}
