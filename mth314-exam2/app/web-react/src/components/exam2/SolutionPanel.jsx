import { useState } from 'react'
import './Exam2QuestionCard.css'

function SolutionPanel({
  solution,
  questionId,
  isLocked = false,
  lockMessage = 'Available in practice mode',
}) {
  const [isOpen, setIsOpen] = useState(false)

  if (!solution) {
    return null
  }

  if (isLocked) {
    return (
      <div className="exam2-card__solution exam2-card__solution--locked" role="note">
        <span className="exam2-card__solution-lock">{lockMessage}</span>
      </div>
    )
  }

  return (
    <div className="exam2-card__solution">
      <button
        type="button"
        className="exam2-card__solution-toggle"
        onClick={() => setIsOpen(open => !open)}
        aria-expanded={isOpen}
        aria-controls={`solution-${questionId}`}
      >
        {isOpen ? 'Hide solution' : 'Show solution'}
      </button>
      {isOpen && (
        <p id={`solution-${questionId}`} className="exam2-card__solution-text">
          {solution}
        </p>
      )}
    </div>
  )
}

export default SolutionPanel

