import { useEffect, useLayoutEffect, useRef } from 'react'
import { beats } from '../config/narrative.ts'
import { chipActions } from '../config/site.ts'
import { inspect, openQuote } from '../lib/actions.ts'
import { watchBeats } from '../lib/fitText.ts'
import { sectionAlpha } from '../lib/math.ts'
import { scrollApi } from '../hooks/useSmoothScroll.ts'
import { live, useExperience } from '../store/experience.ts'
import { MagneticButton } from './MagneticButton.tsx'

export function Narrative() {
  const refs = useRef<Array<HTMLElement | null>>([])
  const hoveredNode = useExperience((s) => s.hoveredNode)
  const nodeDesc = useExperience((s) => s.nodeDesc)

  useLayoutEffect(() => watchBeats(() => refs.current), [])

  useEffect(() => {
    let raf = 0
    const loop = () => {
      beats.forEach((beat, i) => {
        const el = refs.current[i]
        if (!el) return
        const a = sectionAlpha(live.progress, beat.range[0], beat.range[1], 0.012)
        el.style.opacity = String(a)
        el.style.transform = `translate3d(0, ${(1 - a) * 12}px, 0)`
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="narrative" aria-live="polite">
      {beats.map((beat, i) => (
        <article
          key={beat.id}
          className={[
            'beat',
            beat.title.length > 2 ? 'beat-tall' : '',
            beat.items ? 'beat-dense' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          ref={(el) => {
            refs.current[i] = el
          }}
          style={{ opacity: 0 }}
        >
          {beat.kicker && <p className="kicker">{beat.kicker}</p>}
          {i === 0 ? (
            <h1>
              {beat.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
          ) : (
            <h2>
              {beat.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          )}
          {beat.body && <p className="body">{beat.body}</p>}
          {beat.items && (
            <ul className="chips">
              {beat.items.map((item) => {
                const meta = chipActions[item]
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!meta) return
                        inspect({ title: item, body: meta.body, service: meta.service })
                      }}
                    >
                      {item}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {(beat.cta || beat.secondary) && (
            <div className="beat-actions">
              {beat.cta && (
                <MagneticButton
                  className="primary"
                  onClick={() => {
                    if (beat.cta?.service) openQuote(beat.cta.service)
                    else if (beat.cta?.href) scrollApi.toElement(beat.cta.href.slice(1))
                    else if (beat.cta?.progress !== undefined) scrollApi.toProgress(beat.cta.progress)
                    else openQuote()
                  }}
                >
                  {beat.cta.label}
                </MagneticButton>
              )}
              {beat.secondary && (
                <MagneticButton
                  className="ghost"
                  onClick={() => {
                    if (beat.secondary?.href) scrollApi.toElement(beat.secondary.href.slice(1))
                    else if (beat.secondary?.progress !== undefined) {
                      scrollApi.toProgress(beat.secondary.progress)
                    }
                  }}
                >
                  {beat.secondary.label}
                </MagneticButton>
              )}
            </div>
          )}
        </article>
      ))}
      {hoveredNode && (
        <aside className="node-card">
          <p className="kicker">DEVICE DETECTED</p>
          <h3>{hoveredNode}</h3>
          <p>{nodeDesc}</p>
        </aside>
      )}
    </div>
  )
}
