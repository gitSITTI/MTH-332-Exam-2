import MultipleChoiceQuestion from './MultipleChoiceQuestion.jsx'
import NumericQuestion from './NumericQuestion.jsx'
import ShortAnswerQuestion from './ShortAnswerQuestion.jsx'
import SolutionPanel from './SolutionPanel.jsx'
import HintBadge from './HintBadge.jsx'
import { getProbabilityDisplay } from '../../utils/instructorCatalog.js'
import './Exam2QuestionCard.css'

const KIND_COMPONENTS = {
  mc: MultipleChoiceQuestion,
  numeric: NumericQuestion,
  short: ShortAnswerQuestion,
}

const KIND_LABELS = {
  mc: 'Multiple choice',
  numeric: 'Numeric response',
  short: 'Short answer',
}

function Exam2QuestionCard({
  question,
  index = 0,
  total = 0,
  response,
  onResponseChange,
  mode = 'practice',
  showFeedback = false,
  disabled = false,
}) {
  if (!question) {
    return null
  }

  const KindComponent = KIND_COMPONENTS[question.kind] ?? null
  const kindLabel = KIND_LABELS[question.kind] ?? 'Question'
  const isCorrect = showFeedback && question.answer !== undefined && response === question.answer
  const showCorrectness = showFeedback && question.answer !== undefined

  // Get probability display info if available
  const probabilityDisplay =
    question.probability !== undefined ? getProbabilityDisplay(question.probability) : null

  return (
    <article className="exam2-card" aria-labelledby={`question-${question.id}`}>
      <header className="exam2-card__header">
        <div className="exam2-card__meta">
          <div className="exam2-card__meta-row">
            <span className="exam2-card__number">
              Question {index + 1}
              {total ? ` of ${total}` : ''}
            </span>
            {probabilityDisplay && (
              <span
                className="exam2-card__probability"
                style={{ color: probabilityDisplay.color }}
                title={`Probability: ${probabilityDisplay.percentage}`}
              >
                {probabilityDisplay.emoji} {probabilityDisplay.percentage}
              </span>
            )}
          </div>
          <div className="exam2-card__meta-row">
            <span className="exam2-card__section">Section {question.section}</span>
            {question.label && (
              <span className="exam2-card__label" title={`Type: ${question.label}`}>
                {question.label}
              </span>
            )}
            {question.origin && (
              <span className="exam2-card__origin" title={`Origin: ${question.origin}`}>
                {question.origin === 'instructor' ? '👨‍🏫' : question.origin === 'textbook' ? '📘' : '🧠'}
              </span>
            )}
          </div>
        </div>
        <HintBadge hint={mode === 'practice' ? question.hint : null} />
      </header>

      <div className="exam2-card__body">
        <p id={`question-${question.id}`} className="exam2-card__prompt">
          {question.prompt || question.topic || question.example || 'Question placeholder'}
        </p>
        {question.prompt === '' && (question.topic || question.example) && (
          <p className="exam2-card__topic-info">
            {question.topic && <strong>Topic:</strong>} {question.topic}
            {question.example && question.topic && ' • '}
            {question.example && <strong>Example:</strong>} {question.example}
          </p>
        )}

        <p className="exam2-card__kind">{kindLabel}</p>

        {KindComponent ? (
          <KindComponent
            question={question}
            value={response}
            onChange={onResponseChange}
            disabled={disabled || mode === 'review'}
          />
        ) : (
          <p className="exam2-card__unsupported">Unsupported question type.</p>
        )}

        {showCorrectness && (
          <div
            className={`exam2-card__feedback${
              isCorrect ? ' exam2-card__feedback--correct' : ' exam2-card__feedback--incorrect'
            }`}
            role="status"
          >
            {isCorrect ? 'Correct!' : `Expected answer: ${question.answer ?? 'N/A'}`}
          </div>
        )}
      </div>

      <footer className="exam2-card__footer">
        <SolutionPanel
          solution={question.solution}
          questionId={question.id}
          isLocked={mode === 'exam' && !showFeedback}
          lockMessage="Solutions unlock after submitting in Exam Mode"
        />
      </footer>
    </article>
  )
}

export default Exam2QuestionCard

