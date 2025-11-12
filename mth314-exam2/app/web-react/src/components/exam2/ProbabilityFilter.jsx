import { getProbabilityDisplay } from '../../utils/instructorCatalog.js'
import './ProbabilityFilter.css'

const PROBABILITY_THRESHOLDS = [
  { value: 0, label: 'All', emoji: '📚' },
  { value: 95, label: '≥95%', emoji: '💣' },
  { value: 90, label: '≥90%', emoji: '🔥' },
  { value: 85, label: '≥85%', emoji: '💥' },
  { value: 70, label: '≥70%', emoji: '💡' },
]

function ProbabilityFilter({ value = 0, onChange }) {
  return (
    <div className="probability-filter" role="group" aria-label="Filter by probability">
      <label className="probability-filter__label">Filter by probability:</label>
      <div className="probability-filter__options">
        {PROBABILITY_THRESHOLDS.map(threshold => {
          const display = threshold.value > 0 ? getProbabilityDisplay(threshold.value) : null
          const isActive = value === threshold.value

          return (
            <button
              key={threshold.value}
              type="button"
              className={`probability-filter__button${isActive ? ' probability-filter__button--active' : ''}`}
              onClick={() => onChange?.(threshold.value)}
              aria-pressed={isActive}
            >
              <span className="probability-filter__emoji">
                {threshold.value > 0 ? display?.emoji : threshold.emoji}
              </span>
              <span className="probability-filter__text">{threshold.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProbabilityFilter

