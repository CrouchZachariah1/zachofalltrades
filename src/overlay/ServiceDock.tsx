import { services } from '../config/site.ts'
import { inspect } from '../lib/actions.ts'

export function ServiceDock() {
  return (
    <div className="dock" role="navigation" aria-label="Services">
      {services.map((s) => (
        <button
          key={s.id}
          type="button"
          className="dock-item"
          onClick={() =>
            inspect({
              title: s.title,
              body: s.body,
              service: s.formValue,
              progress: s.progress,
            })
          }
        >
          {s.title}
        </button>
      ))}
    </div>
  )
}
