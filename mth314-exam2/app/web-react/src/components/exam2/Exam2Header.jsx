import ModeToggle from './ModeToggle.jsx'
import NewSetButton from './NewSetButton.jsx'

const formatTimestamp = timestamp => {
  if (!timestamp) return null

  try {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  } catch {
    return null
  }
}

function Exam2Header({ mode, onModeChange, onGenerateNewSet, isGenerating, lastGeneratedAt }) {
  const formattedTimestamp = formatTimestamp(lastGeneratedAt)

  return (
    <section className="exam2-header">
      <div className="exam2-header__title">
        <h1 className="exam2-header__heading">Exam 2 Prep Lab</h1>
        <p className="exam2-header__subheading">
          Work through randomized practice sets for sections 4.4, 4.5, and 5.1.
        </p>
        {formattedTimestamp && (
          <span className="exam2-header__timestamp">Last generated {formattedTimestamp}</span>
        )}
      </div>
      <div className="exam2-header__actions">
        <ModeToggle value={mode} onChange={onModeChange} />
        <NewSetButton onClick={onGenerateNewSet} busy={isGenerating} />
      </div>
    </section>
  )
}

export default Exam2Header

