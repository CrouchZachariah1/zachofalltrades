import type { ReactNode } from 'react'
import { useExperience } from '../../store/experience.ts'

type Props = {
  children: ReactNode
  onSelect: () => void
  label?: string
  status?: string
}

export function Hit({ children, onSelect, label, status }: Props) {
  const setHover = useExperience((s) => s.setHover)
  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (label) setHover(label, status)
      }}
      onPointerOut={() => {
        if (label) setHover(null)
      }}
    >
      {children}
    </group>
  )
}
