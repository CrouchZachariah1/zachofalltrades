import type { BriefView } from '../config/request.ts'

type Props = {
  brief: BriefView
}

export function RequestBrief({ brief }: Props) {
  return (
    <div className={`brief brief-${brief.tone}`}>
      <p className="kicker">{brief.kicker}</p>
      <h2>
        {brief.headline.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      <p className="body">{brief.promise}</p>
      {brief.sequence && brief.sequence.length > 0 && (
        <ol className="brief-sequence">
          {brief.sequence.map((step, i) => (
            <li key={`${i}-${step}`}>
              <span>0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      )}
      <ul className="brief-includes">
        {brief.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {brief.range ? <p className="brief-range">{brief.range}</p> : null}
      <p className="brief-note">{brief.note}</p>
    </div>
  )
}
