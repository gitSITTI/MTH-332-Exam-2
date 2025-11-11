import './Exam2QuestionCard.css'

function MultipleChoiceQuestion({ question, value, onChange, disabled = false }) {
  if (!question?.choices) {
    return null
  }

  return (
    <div className="exam2-card__choices" role="radiogroup" aria-label="Multiple choice answers">
      {question.choices.map(choice => {
        const isSelected = value === choice.id
        return (
          <label key={choice.id} className={`exam2-card__choice${isSelected ? ' is-selected' : ''}`}>
            <input
              type="radio"
              name={`question-${question.id}`}
              value={choice.id}
              checked={isSelected}
              onChange={event => onChange?.(event.target.value)}
              disabled={disabled}
            />
            <span>{choice.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export default MultipleChoiceQuestion

