import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard.jsx'
import QuizControls from '../components/QuizControls.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import ScoreSummary from '../components/ScoreSummary.jsx'
import QuizSettings from '../components/QuizSettings.jsx'
import { useDataContext } from '../context/DataProvider.jsx'
import {
  saveQuizProgress,
  loadQuizProgress,
  clearQuizProgress,
  loadQuizSettings,
  getDefaultSettings,
} from '../utils/quizStorage.js'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js'
import './QuizPage.css'

function QuizPage() {
  const { lectureId } = useParams()
  const navigate = useNavigate()
  const { loading, error, getLectureById, getQuestionsByLecture, videoIndex } = useDataContext()

  const lecture = getLectureById(lectureId)
  const rawQuestions = useMemo(
    () => getQuestionsByLecture(lectureId) ?? [],
    [lectureId, getQuestionsByLecture],
  )

  const [settings, setSettings] = useState(() => {
    const saved = loadQuizSettings()
    return saved ? { ...getDefaultSettings(), ...saved } : getDefaultSettings()
  })
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false)
  const [progressRestored, setProgressRestored] = useState(false)

  // Shuffle questions if setting is enabled
  useEffect(() => {
    if (rawQuestions.length === 0) {
      setQuestions([])
      return
    }

    let processedQuestions = [...rawQuestions]

    if (settings.shuffleQuestions) {
      // Create a seeded shuffle based on lectureId for consistency within a session
      const seed = lectureId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      let currentSeed = seed

      // Simple seeded random function
      const seededRandom = () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280
        return currentSeed / 233280
      }

      // Fisher-Yates shuffle with seed
      for (let i = processedQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1))
        ;[processedQuestions[i], processedQuestions[j]] = [
          processedQuestions[j],
          processedQuestions[i],
        ]
      }
    }

    setQuestions(processedQuestions)
  }, [rawQuestions, settings.shuffleQuestions, lectureId])

  // Load progress from localStorage on mount
  useEffect(() => {
    if (questions.length === 0 || hasRestoredProgress) return

    const savedProgress = loadQuizProgress(lectureId)
    if (savedProgress) {
      // Restore answers, but only if question IDs match
      const validAnswers = {}
      const questionIds = new Set(questions.map(q => q.id))

      Object.entries(savedProgress.answers || {}).forEach(([questionId, answer]) => {
        if (questionIds.has(questionId)) {
          validAnswers[questionId] = answer
        }
      })

      if (Object.keys(validAnswers).length > 0 || savedProgress.currentIndex !== undefined) {
        setAnswers(validAnswers)
        if (
          savedProgress.currentIndex !== undefined &&
          savedProgress.currentIndex >= 0 &&
          savedProgress.currentIndex < questions.length
        ) {
          setCurrentIndex(savedProgress.currentIndex)
        }
        if (savedProgress.showResults) {
          setShowResults(true)
        }
        setProgressRestored(true)
        // Hide notification after 5 seconds
        setTimeout(() => setProgressRestored(false), 5000)
      }
    }

    setHasRestoredProgress(true)
  }, [questions, lectureId, hasRestoredProgress])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!hasRestoredProgress || questions.length === 0) return

    const progress = {
      answers,
      currentIndex,
      showResults,
      questionIds: questions.map(q => q.id),
    }

    saveQuizProgress(lectureId, progress)
  }, [answers, currentIndex, showResults, lectureId, questions, hasRestoredProgress])

  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length
  const currentQuestion = questions[currentIndex]
  const selectedIndex = answers[currentQuestion?.id] ?? null
  const practiceModeActive = settings.practiceMode

  const questionVideoMeta =
    (currentQuestion?.video_id && videoIndex?.[currentQuestion.video_id]) || lecture

  const correctAnswers = useMemo(
    () =>
      questions.reduce((acc, question) => {
        const userAnswer = answers[question.id]
        if (userAnswer !== undefined && userAnswer === question.answer_index) {
          return acc + 1
        }
        return acc
      }, 0),
    [questions, answers],
  )

  const handleSelectChoice = index => {
    if (!currentQuestion || showResults) return
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: index,
    }))
  }

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    // simulate processing to allow UI feedback
    await new Promise(resolve => setTimeout(resolve, 180))
    setShowResults(true)
    setSubmitting(false)
  }

  const handleRestart = () => {
    setAnswers({})
    setShowResults(false)
    setCurrentIndex(0)
    clearQuizProgress(lectureId)
  }

  const handleSettingsChange = newSettings => {
    setSettings(newSettings)
  }

  // Keyboard navigation
  useKeyboardNavigation({
    onPrev: handlePrev,
    onNext: handleNext,
    onSubmit: showResults ? undefined : () => handleSubmit(),
    onSelectChoice: showResults ? undefined : handleSelectChoice,
    canGoBack: currentIndex > 0,
    canGoForward: currentIndex < totalQuestions - 1,
    showSubmit: !showResults && answeredCount === totalQuestions,
    totalChoices: currentQuestion?.choices?.length || 0,
    currentSelectedIndex: selectedIndex,
    disabled: showResults || submitting,
  })

  const handleExit = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="page page--quiz">
        <div className="page__status">
          <span className="page__spinner" aria-hidden="true" />
          Loading quiz…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page page--quiz">
        <div className="page__status page__status--error" role="alert">
          Failed to load quiz resources: {error}
        </div>
      </div>
    )
  }

  if (!lecture || totalQuestions === 0) {
    return (
      <div className="page page--quiz">
        <div className="page__status page__status--error" role="alert">
          We don&apos;t have quiz material for this lecture yet.
        </div>
        <button type="button" className="page__back" onClick={() => navigate('/')}>
          Back to lectures
        </button>
      </div>
    )
  }

  return (
    <div className="page page--quiz" role="main" aria-label="Quiz">
      {progressRestored && (
        <div
          className="quiz-progress-notification"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="quiz-progress-notification__icon" aria-hidden="true">
            ↻
          </span>
          <span className="quiz-progress-notification__text">
            Quiz progress restored from previous session
          </span>
        </div>
      )}
      <header className="quiz-header">
        <div>
          <h1 className="quiz-header__title">{lecture.title}</h1>
          <p className="quiz-header__meta">
            Module {lecture.module} · {totalQuestions} question{totalQuestions === 1 ? '' : 's'}
          </p>
        </div>
        <div className="quiz-header__actions">
          <ProgressBar current={answeredCount} total={totalQuestions} />
          <QuizSettings onSettingsChange={handleSettingsChange} />
        </div>
      </header>

      {showResults && (
        <ScoreSummary
          total={totalQuestions}
          correct={correctAnswers}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}

      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          selectedIndex={selectedIndex}
          onSelectChoice={handleSelectChoice}
          revealAnswer={showResults}
          showExplanation={practiceModeActive || (showResults && settings.showExplanations)}
          practiceMode={practiceModeActive}
          videoMeta={questionVideoMeta}
        />
      )}

      <QuizControls
        canGoBack={currentIndex > 0}
        canGoForward={currentIndex < totalQuestions - 1}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={() => handleSubmit()}
        showSubmit={!showResults && answeredCount === totalQuestions}
        isSubmitting={submitting}
      />
    </div>
  )
}

export default QuizPage


