import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { inBand } from '../../lib/math.ts'
import { live } from '../../store/experience.ts'

export function useMountRange(start: number, end: number, pad = 0.06): boolean {
  const [mounted, setMounted] = useState(() => inBand(live.progress, start, end, pad))
  const last = useRef(mounted)
  useFrame(() => {
    const should = inBand(live.progress, start, end, pad)
    if (should !== last.current) {
      last.current = should
      setMounted(should)
    }
  })
  return mounted
}
