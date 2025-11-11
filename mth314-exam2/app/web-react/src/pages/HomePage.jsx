import LectureList from '../components/LectureList.jsx'
import { useDataContext } from '../context/DataProvider.jsx'
import './HomePage.css'

function HomePage() {
  const { loading, error, lectures, questionBank } = useDataContext()

  const questionCounts = questionBank.reduce((acc, question) => {
    if (!question.video_id) return acc
    acc[question.video_id] = (acc[question.video_id] || 0) + 1
    return acc
  }, {})

  return (
    <div className="page page--home">
      <section className="page__intro">
        <h1 className="page__title">Choose a lecture to start practicing</h1>
        <p className="page__subtitle">
          Work through all available multiple-choice questions and track your score before exam
          day.
        </p>
      </section>

      {loading && (
        <div className="page__status">
          <span className="page__spinner" aria-hidden="true" />
          Loading quiz data…
        </div>
      )}

      {error && (
        <div className="page__status page__status--error" role="alert">
          Failed to load quiz resources: {error}
        </div>
      )}

      {!loading && !error && (
        <LectureList lectures={lectures} questionsByLecture={questionCounts} />
      )}
    </div>
  )
}

export default HomePage


