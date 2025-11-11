import { useMemo } from 'react'
import { getRegionMetadata } from '../../utils/vennUtils.js'
import './VennQuestion.css'

const STATUS_COPY = {
  correct: 'Correct! Great job identifying the regions.',
  incorrect: 'Not quite. Adjust your selections and try again.',
  revealed: 'Study the highlighted regions and try another question.',
  empty: 'Select at least one region before checking your answer.',
}

function VennQuestion({
  expression,
  setCount = 2,
  attempts = 0,
  status = 'idle',
  targetRegions = [],
  showSolution = false,
}) {
  const metadata = useMemo(() => {
    const map = new Map()
    for (const item of getRegionMetadata(setCount)) {
      map.set(item.id, item)
    }
    return map
  }, [setCount])

  const targetLabels = useMemo(() => {
    return targetRegions
      .map(regionId => metadata.get(regionId))
      .filter(Boolean)
      .map(entry => entry.label)
  }, [metadata, targetRegions])

  const statusMessage = STATUS_COPY[status]

  return (
    <section className="venn-question" aria-live="polite">
      <header className="venn-question__header">
        <span className="venn-question__eyebrow">Select all regions representing:</span>
        <div className="venn-question__prompt" role="heading" aria-level={2}>
          {expression}
        </div>
      </header>

      <div className="venn-question__meta">
        <span className="venn-question__meta-item">
          Sets:{' '}
          <strong className="venn-question__meta-value">{setCount === 3 ? 'A, B, C' : 'A, B'}</strong>
        </span>
        <span className="venn-question__meta-separator" aria-hidden="true">
          •
        </span>
        <span className="venn-question__meta-item">
          Attempts:{' '}
          <strong className="venn-question__meta-value">{attempts}</strong>
        </span>
      </div>

      {statusMessage && (
        <div
          className={[
            'venn-question__status',
            status === 'correct' ? 'venn-question__status--success' : '',
            status === 'incorrect' ? 'venn-question__status--error' : '',
            status === 'revealed' ? 'venn-question__status--note' : '',
        status === 'empty' ? 'venn-question__status--warning' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {statusMessage}
        </div>
      )}

      {showSolution && targetLabels.length > 0 && (
        <div className="venn-question__solution">
          <span className="venn-question__solution-label">Correct regions:</span>
          <div className="venn-question__solution-tags">
            {targetLabels.map(label => (
              <span key={label} className="venn-question__solution-tag">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default VennQuestion


