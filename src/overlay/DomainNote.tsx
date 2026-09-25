import { useEffect, useState } from 'react'

const KEY = 'zoat-domain-note'

export function DomainNote() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === '1') return
    } catch {
      /* private mode */
    }
    if (!/\.vercel\.app$/i.test(window.location.hostname)) return
    setOpen(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('has-domain-note', open)
    return () => document.documentElement.classList.remove('has-domain-note')
  }, [open])

  if (!open) return null

  const dismiss = () => {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode */
    }
    setOpen(false)
  }

  return (
    <div className="domain-note" role="status">
      <p>
        <strong>Why vercel.app?</strong> We are just getting started. Every job is going toward a
        real domain and our own hosting — a small shop earning its name on the internet, one PC
        at a time. Thank you for looking past the URL.
      </p>
      <button type="button" onClick={dismiss} aria-label="Dismiss notice">
        Close
      </button>
    </div>
  )
}
