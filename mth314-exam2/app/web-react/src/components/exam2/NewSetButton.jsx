import './Exam2QuestionCard.css'

function NewSetButton({ onClick, busy = false }) {
  return (
    <button
      type="button"
      className="exam2-button"
      onClick={onClick}
      disabled={busy}
      aria-busy={busy}
    >
      {busy ? 'Generating…' : 'New Question Set'}
    </button>
  )
}

export default NewSetButton

