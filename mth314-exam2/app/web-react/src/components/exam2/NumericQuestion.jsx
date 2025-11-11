import './Exam2QuestionCard.css'

function NumericQuestion({ question, value, onChange, disabled = false }) {
  return (
    <div className="exam2-card__input">
      <label htmlFor={`numeric-${question.id}`} className="exam2-card__input-label">
        Enter numeric answer
      </label>
      <input
        id={`numeric-${question.id}`}
        type="number"
        inputMode="numeric"
        className="exam2-card__field"
        value={value ?? ''}
        onChange={event => onChange?.(event.target.value)}
        disabled={disabled}
        placeholder="Type value"
      />
    </div>
  )
}

export default NumericQuestion

