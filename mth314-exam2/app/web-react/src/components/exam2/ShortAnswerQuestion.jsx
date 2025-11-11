import './Exam2QuestionCard.css'

function ShortAnswerQuestion({ question, value, onChange, disabled = false }) {
  return (
    <div className="exam2-card__input">
      <label htmlFor={`short-${question.id}`} className="exam2-card__input-label">
        Enter short response
      </label>
      <input
        id={`short-${question.id}`}
        type="text"
        className="exam2-card__field"
        value={value ?? ''}
        onChange={event => onChange?.(event.target.value)}
        disabled={disabled}
        placeholder="Type answer"
      />
    </div>
  )
}

export default ShortAnswerQuestion

