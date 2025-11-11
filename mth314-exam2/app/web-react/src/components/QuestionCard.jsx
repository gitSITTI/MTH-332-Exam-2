import './QuestionCard.css'

const isAnswerCorrect = (question, selectedIndex) =>
  selectedIndex !== null && selectedIndex === question.answer_index

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  onSelectChoice,
  revealAnswer = false,
  showExplanation = false,
  practiceMode = false,
  videoMeta,
}) {
  if (!question) return null

  const answered = selectedIndex !== null && selectedIndex !== undefined
  const isCorrect = isAnswerCorrect(question, selectedIndex)

  return (
    <article className="quiz-card" aria-labelledby={`question-${questionNumber}`}>
      {practiceMode && !revealAnswer && (
        <div className="quiz-card__practice-note" role="status" aria-live="polite">
          Practice mode is on — correct answers are highlighted to guide your review.
        </div>
      )}
      <header className="quiz-card__header">
        <span className="quiz-card__badge quiz-card__badge--module">
          Module {question.module}
        </span>
        <span className="quiz-card__badge quiz-card__badge--type">
          {question.type?.toUpperCase() ?? 'MCQ'}
        </span>
        <div className="quiz-card__position">
          Question {questionNumber} <span aria-hidden="true">/</span> {totalQuestions}
        </div>
      </header>

      <h2 id={`question-${questionNumber}`} className="quiz-card__prompt">
        {question.question}
      </h2>

      <ul
        className="quiz-card__choices"
        role="radiogroup"
        aria-labelledby={`question-${questionNumber}`}
        aria-required="true"
      >
        {question.choices?.map((choice, index) => {
          const isSelected = selectedIndex === index
          const isCorrectChoice = question.answer_index === index
          const isPracticeHighlight = practiceMode && !revealAnswer && isCorrectChoice
          const revealState = revealAnswer || (answered && isCorrectChoice) || isPracticeHighlight
          const optionStatus = revealAnswer
            ? isCorrectChoice
              ? 'correct'
              : isSelected
                ? 'selected'
                : 'default'
            : isPracticeHighlight
              ? 'practice'
              : isSelected
                ? isCorrect
                  ? 'correct'
                  : 'incorrect'
                : 'default'

          const choiceId = `choice-${questionNumber}-${index}`
          const choiceLetter = String.fromCharCode(65 + index)
          const ariaLabelParts = [`Option ${choiceLetter}: ${choice}`]

          if (revealAnswer && isCorrectChoice) {
            ariaLabelParts.push('Correct answer')
          } else if (answered && isCorrectChoice) {
            ariaLabelParts.push('Correct answer')
          }

          if (isPracticeHighlight) {
            ariaLabelParts.push('Highlighted for practice mode')
          }

          return (
            <li key={index}>
              <button
                type="button"
                id={choiceId}
                className={`choice-button choice-button--${optionStatus}`}
                onClick={() => onSelectChoice?.(index)}
                disabled={revealAnswer}
                role="radio"
                aria-checked={isSelected}
                aria-label={ariaLabelParts.join('. ')}
                tabIndex={revealAnswer ? -1 : isSelected ? 0 : -1}
              >
                <span className="choice-button__index" aria-hidden="true">
                  {choiceLetter}
                </span>
                <span className="choice-button__text">{choice}</span>
                {revealState && (
                  <span className="choice-button__result" aria-hidden="true">
                    {isCorrectChoice ? '✓' : ''}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && !revealAnswer && (
        <div
          className={`quiz-card__feedback quiz-card__feedback--${
            isCorrect ? 'correct' : 'incorrect'
          }`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {isCorrect ? 'Nice! That answer is correct.' : 'Not quite. Try another option or skip.'}
        </div>
      )}

      {revealAnswer && (
        <div className="quiz-card__answer">
          <strong>Correct answer:</strong>{' '}
          {question.choices?.[question.answer_index] ?? 'Unavailable'}
        </div>
      )}

      {(showExplanation || revealAnswer) && question.explanation && (
        <div
          className={`quiz-card__explanation${
            practiceMode && !revealAnswer ? ' quiz-card__explanation--practice' : ''
          }`}
        >
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}

      {videoMeta && (
        <div className="quiz-card__sources">
          <div className="quiz-card__source">
            <span className="quiz-card__source-label">Lecture</span>
            <span className="quiz-card__source-value">{videoMeta.title}</span>
          </div>
          {videoMeta.date && (
            <div className="quiz-card__source">
              <span className="quiz-card__source-label">Date</span>
              <span className="quiz-card__source-value">{videoMeta.date}</span>
            </div>
          )}
          {videoMeta.url && (
            <a
              className="quiz-card__source-link"
              href={videoMeta.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open lecture
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default QuestionCard


