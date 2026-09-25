import { useEffect } from 'react'
import { live } from '../store/experience.ts'

export function usePointer(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      live.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      live.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])
}
