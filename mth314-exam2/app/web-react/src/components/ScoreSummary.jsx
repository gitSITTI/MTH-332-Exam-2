import './ScoreSummary.css'

function ScoreSummary({ total, correct, onRestart, onExit }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <section className="score-card" aria-live="polite">
      <header className="score-card__header">
        <h2 className="score-card__title">Quiz complete!</h2>
        <p className="score-card__subtitle">Here&apos;s how you did.</p>
      </header>
      <div className="score-card__stats">
        <div className="score-card__stat">
          <span className="score-card__label">Total questions</span>
          <span className="score-card__value">{total}</span>
        </div>
        <div className="score-card__stat">
          <span className="score-card__label">Correct answers</span>
          <span className="score-card__value score-card__value--success">{correct}</span>
        </div>
        <div className="score-card__stat">
          <span className="score-card__label">Accuracy</span>
          <span className="score-card__value">{accuracy}%</span>
        </div>
      </div>
      <footer className="score-card__actions">
        <button type="button" className="score-card__btn" onClick={onRestart}>
          Retry lecture
        </button>
        <button
          type="button"
          className="score-card__btn score-card__btn--secondary"
          onClick={onExit}
        >
          Back to lectures
        </button>
      </footer>
    </section>
  )
}

export default ScoreSummary


