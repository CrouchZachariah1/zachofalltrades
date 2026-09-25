import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { inBand } from '../../lib/math.ts'
import { live } from '../../store/experience.ts'

export function useMountRange(start: number, end: number, pad = 0.06): boolean {
  const [mounted, setMounted] = useState(() => inBand(live.progress, start, end, pad))
  const last = useRef(mounted)
  const away = useRef(0)
  useFrame(() => {
    const should = inBand(live.progress, start, end, pad)
    if (should) {
      away.current = 0
      if (!last.current) {
        last.current = true
        setMounted(true)
      }
      return
    }
    if (!last.current) return
    away.current += 1
    if (away.current > 40) {
      last.current = false
      setMounted(false)
    }
  })
  return mounted
}
