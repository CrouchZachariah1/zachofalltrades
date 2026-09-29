import { jumpTo, openQuote } from '../lib/actions.ts'
import { useExperience } from '../store/experience.ts'
import { MagneticButton } from './MagneticButton.tsx'

export function InspectCard() {
  const item = useExperience((s) => s.inspectItem)
  const setInspect = useExperience((s) => s.setInspect)
  if (!item) return null

  return (
    <aside className="inspect" role="dialog" aria-label={item.title}>
      <button type="button" className="inspect-close" onClick={() => setInspect(null)} aria-label="Close">
        CLOSE
      </button>
      <p className="kicker">{item.status ?? 'DEVICE DETECTED'}</p>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
      <div className="inspect-actions">
        {item.service && (
          <MagneticButton className="primary" onClick={() => openQuote(item.service)}>
            GET A QUOTE
          </MagneticButton>
        )}
        {item.progress !== undefined && (
          <MagneticButton
            className="ghost"
            onClick={() => {
              jumpTo(item.progress as number)
              setInspect(null)
            }}
          >
            SHOW ME
          </MagneticButton>
        )}
      </div>
    </aside>
  )
}
