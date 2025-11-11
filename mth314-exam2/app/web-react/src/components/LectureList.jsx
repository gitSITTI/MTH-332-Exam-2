import { Link } from 'react-router-dom'
import './LectureList.css'

function LectureList({ lectures, questionsByLecture }) {
  if (!lectures?.length) {
    return (
      <div className="lecture-list__empty">
        <p>No lectures available yet. Check back after syncing transcripts.</p>
      </div>
    )
  }

  return (
    <ul className="lecture-list" aria-label="Available lectures">
      {lectures.map(lecture => {
        const questionCount = questionsByLecture?.[lecture.video_id] ?? 0
        return (
          <li key={lecture.video_id} className="lecture-card">
            <div className="lecture-card__meta">
              <span className="lecture-card__module">Module {lecture.module}</span>
              <span className="lecture-card__topic">{lecture.topic}</span>
            </div>
            <h2 className="lecture-card__title">{lecture.title}</h2>
            <p className="lecture-card__description">
              {questionCount > 0
                ? `${questionCount} question${questionCount === 1 ? '' : 's'} available`
                : 'Questions coming soon'}
            </p>
            <div className="lecture-card__actions">
              <Link
                to={`/quiz/${encodeURIComponent(lecture.video_id)}`}
                className="lecture-card__link"
                aria-label={`Start quiz for ${lecture.title}`}
              >
                Start quiz
              </Link>
              {lecture.url && (
                <a
                  href={lecture.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lecture-card__secondary"
                >
                  Watch lecture
                </a>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default LectureList


