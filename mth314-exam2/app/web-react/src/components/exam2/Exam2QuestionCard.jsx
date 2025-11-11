import MultipleChoiceQuestion from './MultipleChoiceQuestion.jsx'
import NumericQuestion from './NumericQuestion.jsx'
import ShortAnswerQuestion from './ShortAnswerQuestion.jsx'
import SolutionPanel from './SolutionPanel.jsx'
import HintBadge from './HintBadge.jsx'
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

  return (
    <article className="exam2-card" aria-labelledby={`question-${question.id}`}>
      <header className="exam2-card__header">
        <div className="exam2-card__meta">
          <span className="exam2-card__number">
            Question {index + 1}
            {total ? ` of ${total}` : ''}
          </span>
          <span className="exam2-card__section">Section {question.section}</span>
        </div>
        <HintBadge hint={mode === 'practice' ? question.hint : null} />
      </header>

      <div className="exam2-card__body">
        <p id={`question-${question.id}`} className="exam2-card__prompt">
          {question.prompt}
        </p>

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

