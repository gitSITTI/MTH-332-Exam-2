import TopicPill from './TopicPill.jsx'

function CoverageCard({ summary = [] }) {
  return (
    <section className="exam2-coverage">
      <div className="exam2-coverage__header">
        <h2 className="exam2-coverage__title">Topic coverage</h2>
        <p className="exam2-coverage__subtitle">Review distribution across the Exam 2 sections.</p>
      </div>
      <div className="exam2-coverage__grid">
        {summary.map(section => (
          <TopicPill
            key={section.section}
            label={`Section ${section.section}`}
            value={section.total}
          />
        ))}
      </div>
    </section>
  )
}

export default CoverageCard

