import { useState } from 'react'
import './Exam2QuestionCard.css'

function HintBadge({ hint }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!hint) {
    return null
  }

  return (
    <div className="exam2-card__hint">
      <button
        type="button"
        className="exam2-card__hint-badge"
        onClick={() => setIsOpen(open => !open)}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Hide hint' : 'Show hint'}
      </button>
      {isOpen && <p className="exam2-card__hint-text">{hint}</p>}
    </div>
  )
}

export default HintBadge

