import { useState } from 'react'
import { site } from '../config/site.ts'
import { MagneticButton } from './MagneticButton.tsx'

type Props = {
  className?: string
  whatsappHref?: string
}

export function ContactActions({ className = 'ghost', whatsappHref }: Props) {
  const [copied, setCopied] = useState(false)

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
        title={copied ? 'Email address copied' : site.email}
        aria-label={copied ? 'Email address copied' : `Copy ${site.email}`}
        onClick={() => {
          void navigator.clipboard.writeText(site.email).then(
            () => {
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1600)
            },
            () => {},
          )
        }}
      >
        {copied ? 'Copied' : 'Email'}
      </MagneticButton>
    </>
  )
}
