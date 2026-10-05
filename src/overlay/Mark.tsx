type Props = { className?: string }

const Z_BODY = 'M7 8h18l-8.2 8H25v8H7l8.2-8H7V8Z'
const Z_CORNER = 'M21.5 8h3.5v3.2L21.5 8Z'

/** Geometric ZOAT Z. Body follows `color`; corner is site cyan. */
export function HexMark({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d={Z_BODY} fill="currentColor" />
      <path d={Z_CORNER} fill="var(--mark-accent)" />
    </svg>
  )
}

/** Header, footer, and loader mark: cream Z on dark, charcoal Z on light, cyan corner. */
export function BrandMark({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d={Z_BODY} fill="var(--mark-z)" />
      <path d={Z_CORNER} fill="var(--mark-accent)" />
    </svg>
  )
}
