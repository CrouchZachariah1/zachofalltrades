type Props = { className?: string }

export function HexMark({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
      <polygon
        points="40,6 72,24 72,56 40,74 8,56 8,24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M26 26h28M26 54h28M28 26l24 28" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}

/** Desktop ZOAT icon, site palette: ink tile, dark Z, cyan corner. */
export function BrandMark({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 36 36" aria-hidden="true">
      <rect width="36" height="36" rx="6" fill="#e8eef4" />
      <g transform="translate(8 8) scale(0.625)">
        <path d="M7 8h18l-8.2 8H25v8H7l8.2-8H7V8Z" fill="#07080a" />
        <path d="M21.5 8h3.5v3.2L21.5 8Z" fill="#4ee3ff" />
      </g>
    </svg>
  )
}
