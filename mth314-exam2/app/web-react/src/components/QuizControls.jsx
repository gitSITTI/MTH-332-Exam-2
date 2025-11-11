import './QuizControls.css'

function QuizControls({
  canGoBack,
  canGoForward,
  onPrev,
  onNext,
  onSubmit,
  showSubmit,
  isSubmitting,
}) {
  return (
    <nav className="quiz-controls" role="navigation" aria-label="Quiz navigation">
      <button
        type="button"
        className="quiz-controls__button"
        onClick={onPrev}
        disabled={!canGoBack}
        aria-label="Previous question"
        title="Previous question (Left Arrow)"
      >
        ← Previous
      </button>
      <div className="quiz-controls__spacer" />
      <button
        type="button"
        className="quiz-controls__button"
        onClick={onNext}
        disabled={!canGoForward}
        aria-label="Next question"
        title="Next question (Right Arrow)"
      >
        Next →
      </button>
      {showSubmit && (
        <button
          type="button"
          className="quiz-controls__button quiz-controls__button--primary"
          onClick={onSubmit}
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Submitting quiz' : 'Submit quiz'}
          title="Submit quiz (Enter)"
        >
          {isSubmitting ? 'Submitting…' : 'Finish quiz'}
        </button>
      )}
    </nav>
  )
}

export default QuizControls


