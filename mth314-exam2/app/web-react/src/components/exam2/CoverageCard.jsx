import TopicPill from './TopicPill.jsx'

function CoverageCard({ summary = [] }) {
  const totalInstructor = summary.reduce((sum, s) => sum + (s.instructor || 0), 0)
  const totalOther = summary.reduce((sum, s) => sum + (s.other || 0), 0)
  const totalQuestions = summary.reduce((sum, s) => sum + (s.total || 0), 0)

  return (
    <section className="exam2-coverage">
      <div className="exam2-coverage__header">
        <h2 className="exam2-coverage__title">Topic coverage</h2>
        <p className="exam2-coverage__subtitle">Review distribution across the Exam 2 sections.</p>
        {totalQuestions > 0 && (
          <div className="exam2-coverage__stats">
            <span className="exam2-coverage__stat">
              <span className="exam2-coverage__stat-label">Total:</span>{' '}
              <span className="exam2-coverage__stat-value">{totalQuestions}</span>
            </span>
            {totalInstructor > 0 && (
              <span className="exam2-coverage__stat">
                <span className="exam2-coverage__stat-label">👨‍🏫 Instructor:</span>{' '}
                <span className="exam2-coverage__stat-value">{totalInstructor}</span>
              </span>
            )}
            {totalOther > 0 && (
              <span className="exam2-coverage__stat">
                <span className="exam2-coverage__stat-label">Other:</span>{' '}
                <span className="exam2-coverage__stat-value">{totalOther}</span>
              </span>
            )}
          </div>
        )}
      </div>
      <div className="exam2-coverage__grid">
        {summary.map(section => (
          <div key={section.section} className="exam2-coverage__section">
            <TopicPill
              label={`Section ${section.section}`}
              value={section.total}
            />
            {section.instructor !== undefined && section.instructor > 0 && (
              <span className="exam2-coverage__section-badge" title="Instructor questions">
                👨‍🏫 {section.instructor}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CoverageCard

