import './Exam2QuestionCard.css'

const MODES = [
  {
    value: 'practice',
    label: 'Practice Mode',
    description: 'Immediate feedback & hints',
  },
  {
    value: 'exam',
    label: 'Exam Mode',
    description: 'No hints, solutions after submit',
  },
]

function ModeToggle({ value = 'practice', onChange }) {
  return (
    <div className="exam2-toggle" role="tablist" aria-label="Mode selection">
      {MODES.map(mode => {
        const isActive = value === mode.value
        return (
          <button
            key={mode.value}
            type="button"
            className={`exam2-toggle__option${isActive ? ' is-active' : ''}`}
            onClick={() => onChange?.(mode.value)}
            role="tab"
            aria-selected={isActive}
          >
            <span className="exam2-toggle__label">{mode.label}</span>
            <span className="exam2-toggle__description">{mode.description}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ModeToggle

