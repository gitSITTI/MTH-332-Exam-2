import Exam2QuestionCard from './Exam2QuestionCard.jsx'

function QuestionList({
  questions = [],
  responses = {},
  onResponseChange,
  mode,
  showFeedback,
  lockInteractions = false,
}) {
  if (!questions.length) {
    return (
      <div className="exam2-empty">
        <p>No questions available for this filter. Try generating a new set.</p>
      </div>
    )
  }

  return (
    <div className="exam2-questions">
      {questions.map((question, index) => (
        <Exam2QuestionCard
          key={question.id}
          question={question}
          index={index}
          total={questions.length}
          response={responses[question.id]}
          onResponseChange={value => onResponseChange?.(question.id, value)}
          mode={mode}
          showFeedback={showFeedback}
          disabled={lockInteractions}
        />
      ))}
    </div>
  )
}

export default QuestionList

