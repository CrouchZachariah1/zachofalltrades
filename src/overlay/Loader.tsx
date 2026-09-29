import { useEffect, useState } from 'react'
import { useExperience } from '../store/experience.ts'
import { BrandMark } from './Mark.tsx'

export function Loader() {
  const ready = useExperience((s) => s.ready)
  const [phase, setPhase] = useState<'boot' | 'ready' | 'gone'>('boot')
  const [line, setLine] = useState('INITIALIZING SYSTEM')

  useEffect(() => {
    const a = window.setTimeout(() => setLine('MAPPING HARDWARE'), 420)
    const b = window.setTimeout(() => setLine('LINKING NETWORK'), 820)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    setLine('SYSTEMS ONLINE')
    setPhase('ready')
    const t = window.setTimeout(() => setPhase('gone'), 700)
    return () => window.clearTimeout(t)
  }, [ready])

  if (phase === 'gone') return null

  return (
    <div className={`loader ${phase === 'ready' ? 'is-ready' : ''}`}>
      <div className="loader-mark">
        <BrandMark />
      </div>
      <p className="loader-brand">ZACH OF ALL TRADES</p>
      <p className="loader-line">{line}</p>
      <div className="loader-bar">
        <span className={ready ? 'done' : ''} />
      </div>
    </div>
  )
}
