import './VennControls.css'

function VennControls({
  onReset,
  onAnswer,
  onNotYet,
  onNext,
  isResetDisabled = false,
  isAnswerDisabled = false,
  isNotYetDisabled = false,
  isNextDisabled = false,
}) {
  return (
    <div className="venn-controls">
      <button
        type="button"
        className="venn-controls__button venn-controls__button--ghost"
        onClick={onReset}
        disabled={isResetDisabled}
      >
        Reset
      </button>
      <div className="venn-controls__spacer" aria-hidden="true" />
      <button
        type="button"
        className="venn-controls__button venn-controls__button--primary"
        onClick={onAnswer}
        disabled={isAnswerDisabled}
      >
        Answer
      </button>
      <button
        type="button"
        className="venn-controls__button venn-controls__button--outline"
        onClick={onNotYet}
        disabled={isNotYetDisabled}
      >
        Not Yet
      </button>
      <button
        type="button"
        className="venn-controls__button venn-controls__button--secondary"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  )
}

export default VennControls


