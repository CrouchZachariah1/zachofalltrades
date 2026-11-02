import { site } from '../config/site.ts'
import { MagneticButton } from './MagneticButton.tsx'

type Props = {
  className?: string
  whatsappHref?: string
}

export function ContactActions({ className = 'ghost', whatsappHref }: Props) {
  return (
    <>
      <MagneticButton
        className={className}
        href={whatsappHref || `https://wa.me/${site.whatsapp}`}
        aria-label={`WhatsApp ${site.phoneDisplay}`}
      >
        WhatsApp
      </MagneticButton>
      <MagneticButton
        className={className}
        href={`tel:${site.phoneTel}`}
        aria-label={`Call ${site.phoneDisplay}`}
      >
        Call
      </MagneticButton>
      <MagneticButton
        className={className}
        href={`mailto:${site.email}`}
        aria-label={`Email ${site.email}`}
      >
        Email
      </MagneticButton>
    </>
  )
}
