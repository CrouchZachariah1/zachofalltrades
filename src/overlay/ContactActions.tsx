import { useState } from 'react'
import { site } from '../config/site.ts'
import { MagneticButton } from './MagneticButton.tsx'

type Props = {
  className?: string
  whatsappHref?: string
}

export function copySupportEmail(): Promise<boolean> {
  return navigator.clipboard.writeText(site.email).then(
    () => true,
    () => false,
  )
}

export function ContactActions({ className = 'ghost', whatsappHref }: Props) {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    void copySupportEmail().then((ok) => {
      if (!ok) return
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <MagneticButton
        className={className}
        href={whatsappHref || `https://wa.me/${site.whatsapp}`}
        title={`WhatsApp ${site.phoneDisplay}`}
        aria-label={`WhatsApp ${site.phoneDisplay}`}
      >
        WhatsApp
      </MagneticButton>
      <MagneticButton
        className={className}
        href={`tel:${site.phoneTel}`}
        title={`Call ${site.phoneDisplay}`}
        aria-label={`Call ${site.phoneDisplay}`}
      >
        Call
      </MagneticButton>
      <MagneticButton
        className={className}
        href={`mailto:${site.email}`}
        title={site.email}
        aria-label={`Email us at ${site.email}`}
      >
        Email us
      </MagneticButton>
      <MagneticButton
        className={className}
        title={copied ? 'Email address copied' : `Copy ${site.email}`}
        aria-label={copied ? 'Email address copied' : `Copy email address ${site.email}`}
        onClick={copyEmail}
      >
        {copied ? 'Copied' : 'Copy email address'}
      </MagneticButton>
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </span>
    </>
  )
}
