import { useCallback, useEffect, useMemo, useState } from 'react'
import Exam2Header from '../components/exam2/Exam2Header.jsx'
import CoverageCard from '../components/exam2/CoverageCard.jsx'
import SectionTabs from '../components/exam2/SectionTabs.jsx'
import QuestionList from '../components/exam2/QuestionList.jsx'
import {
  generateExam2QuestionSet,
  getQuestionById,
  getQuestionBankSummary,
} from '../utils/exam2Questions.js'
import {
  clearLastQuestionSet,
  loadExam2Mode,
  loadExam2Progress,
  loadLastQuestionSet,
  saveExam2Mode,
  saveExam2Progress,
  saveLastQuestionSet,
} from '../utils/exam2Storage.js'
import './Exam2PrepPage.css'

const DEFAULT_SECTION = SectionTabs.ALL
const QUESTIONS_PER_SET = 6

function Exam2PrepPage() {
  const [mode, setMode] = useState('practice')
  const [section, setSection] = useState(DEFAULT_SECTION)
  const [questions, setQuestions] = useState([])
  const [responses, setResponses] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGeneratedAt, setLastGeneratedAt] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)

  const summary = useMemo(() => getQuestionBankSummary(), [])

  const filteredQuestions = useMemo(
    () =>
      section === DEFAULT_SECTION
        ? questions
        : questions.filter(question => question.section === section),
    [questions, section],
  )

  const scorableQuestions = useMemo(
    () => filteredQuestions.filter(question => question.answer !== undefined),
    [filteredQuestions],
  )

  const answeredCount = useMemo(
    () =>
      filteredQuestions.filter(question => {
        const answer = responses[question.id]
        return typeof answer === 'string' && answer.trim() !== ''
      }).length,
    [filteredQuestions, responses],
  )

  const shouldShowFeedback = mode === 'practice' || showFeedback
  const correctCount = useMemo(() => {
    if (!shouldShowFeedback) return 0
    return scorableQuestions.filter(question => responses[question.id] === question.answer).length
  }, [responses, scorableQuestions, shouldShowFeedback])

  const handleGenerateSet = useCallback(
    (targetSection = section, options = {}) => {
      try {
        setIsGenerating(true)

        const seed = Date.now()
        const nextQuestions = generateExam2QuestionSet({
          section: targetSection,
          seed,
          count: QUESTIONS_PER_SET,
        })

        setQuestions(nextQuestions)
        setResponses({})
        setShowFeedback(false)
        const metadata = {
          section: targetSection,
          seed,
          questionIds: nextQuestions.map(question => question.id),
          generatedAt: Date.now(),
        }
        setLastGeneratedAt(metadata.generatedAt)

        if (!options.skipPersistence && typeof window !== 'undefined') {
          saveLastQuestionSet(metadata)
          saveExam2Progress({
            answers: {},
            sectionFilter: targetSection,
            completedSetIds: [],
            activeQuestionId: nextQuestions[0]?.id ?? null,
          })
        }
      } finally {
        setIsGenerating(false)
      }
    },
    [section],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const storedMode = loadExam2Mode()
    if (storedMode) {
      setMode(storedMode)
    }

    const storedProgress = loadExam2Progress()
    const storedSet = loadLastQuestionSet()

    let nextSection = DEFAULT_SECTION
    if (storedProgress?.sectionFilter) {
      nextSection = storedProgress.sectionFilter
      setSection(storedProgress.sectionFilter)
      setResponses(storedProgress.answers ?? {})
    }

    if (storedSet?.questionIds?.length) {
      const hydratedQuestions = storedSet.questionIds
        .map(questionId => getQuestionById(questionId))
        .filter(Boolean)

      if (hydratedQuestions.length) {
        setQuestions(hydratedQuestions)
        setLastGeneratedAt(storedSet.generatedAt ?? null)
        if (storedSet.section) {
          setSection(storedSet.section)
          nextSection = storedSet.section
        }
        setIsHydrated(true)
        return undefined
      }
      clearLastQuestionSet()
    }

    handleGenerateSet(nextSection, { skipPersistence: true })
    setIsHydrated(true)

    return undefined
  }, [handleGenerateSet])

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return
    saveExam2Mode(mode)
  }, [mode, isHydrated])

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return
    saveExam2Progress({
      answers: responses,
      sectionFilter: section,
      completedSetIds: [],
      activeQuestionId: filteredQuestions[0]?.id ?? null,
    })
  }, [responses, section, filteredQuestions, isHydrated])

  const handleResponseChange = (questionId, value) => {
    setResponses(previous => ({
      ...previous,
      [questionId]: value,
    }))

    if (mode === 'exam' && showFeedback) {
      setShowFeedback(false)
    }
  }

  const handleSubmitForScoring = () => {
    setShowFeedback(true)
  }

  const handleModeChange = nextMode => {
    setMode(nextMode)
    setShowFeedback(nextMode === 'practice')
  }

  const handleSectionChange = nextSection => {
    setSection(nextSection)
    handleGenerateSet(nextSection)
  }

  const scoreSummary =
    shouldShowFeedback && scorableQuestions.length > 0
      ? `${correctCount} / ${scorableQuestions.length} correct`
      : `${answeredCount} / ${filteredQuestions.length} answered`

  return (
    <div className="exam2-page">
      <Exam2Header
        mode={mode}
        onModeChange={handleModeChange}
        onGenerateNewSet={() => handleGenerateSet(section)}
        isGenerating={isGenerating}
        lastGeneratedAt={lastGeneratedAt}
      />

      <CoverageCard summary={summary} />

      <SectionTabs activeSection={section} onChange={handleSectionChange} />

      <QuestionList
        questions={filteredQuestions}
        responses={responses}
        onResponseChange={handleResponseChange}
        mode={mode}
        showFeedback={shouldShowFeedback}
        lockInteractions={mode === 'exam' && showFeedback}
      />

      <div className="exam2-actions">
        <span className="exam2-score">{scoreSummary}</span>
        {mode === 'exam' && (
          <button
            type="button"
            className="exam2-submit"
            onClick={handleSubmitForScoring}
            disabled={answeredCount < filteredQuestions.length}
          >
            Submit answers
          </button>
        )}
      </div>
    </div>
  )
}

export default Exam2PrepPage

