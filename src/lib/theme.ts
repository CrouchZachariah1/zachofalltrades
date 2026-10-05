export const THEME_KEY = 'zoat-theme'

export type Theme = 'dark' | 'light'

const LIGHT_COLOR = '#e8eef4'
const DARK_COLOR = '#07080a'

export function readTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('theme-light', theme === 'light')
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'light' ? LIGHT_COLOR : DARK_COLOR)
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* private mode */
  }
  applyTheme(theme)
}

export function toggleTheme(): Theme {
  const next: Theme = readTheme() === 'light' ? 'dark' : 'light'
  setTheme(next)
  return next
}
