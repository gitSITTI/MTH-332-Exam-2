import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import mockQuestions from '../mocks/questions.json'
import {
  loadQuestionsFromJsonl,
  normalizeQuestion,
  parseLectures,
} from '../utils/questionLoader.js'

const DataContext = createContext({
  loading: true,
  error: null,
  lectures: [],
  videoIndex: {},
  questionBank: [],
  getLectureById: () => undefined,
  getQuestionsByLecture: () => [],
  getQuestionsByModule: () => [],
})

const QUESTION_BANK_PATH = '/qbank/drafts.jsonl'
const LECTURE_INDEX_PATH = '/data/lecture-resources.json'
const VIDEO_INDEX_PATH = '/data/video-index.json'

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lectures, setLectures] = useState([])
  const [videoIndex, setVideoIndex] = useState({})
  const [questionBank, setQuestionBank] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [lectureRes, videoIndexRes] = await Promise.all([
          fetch(LECTURE_INDEX_PATH),
          fetch(VIDEO_INDEX_PATH),
        ])

        if (!lectureRes.ok) throw new Error('Failed to load lecture metadata')
        if (!videoIndexRes.ok) throw new Error('Failed to load video index')

        const lectureJson = await lectureRes.json()
        const videoIndexJson = await videoIndexRes.json()
        const normalizedLectures = parseLectures(lectureJson)

        let questions = []
        try {
          questions = await loadQuestionsFromJsonl(QUESTION_BANK_PATH)
        } catch (questionErr) {
          console.warn(
            'Falling back to embedded mock questions. Reason:',
            questionErr?.message || questionErr,
          )
          questions = mockQuestions.map(normalizeQuestion)
        }

        if (isMounted) {
          setLectures(normalizedLectures)
          setVideoIndex(videoIndexJson)
          setQuestionBank(questions)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load quiz data')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadAll()

    return () => {
      isMounted = false
    }
  }, [])

  const getLectureById = useMemo(
    () => id => lectures.find(item => item.video_id === id),
    [lectures],
  )

  const getQuestionsByLecture = useMemo(
    () => id => questionBank.filter(item => item.video_id === id),
    [questionBank],
  )

  const getQuestionsByModule = useMemo(
    () => moduleId => {
      const target = moduleId?.toString?.()
      return questionBank.filter(item => item.module === target)
    },
    [questionBank],
  )

  const value = useMemo(
    () => ({
      loading,
      error,
      lectures,
      videoIndex,
      questionBank,
      getLectureById,
      getQuestionsByLecture,
      getQuestionsByModule,
    }),
    [
      loading,
      error,
      lectures,
      videoIndex,
      questionBank,
      getLectureById,
      getQuestionsByLecture,
      getQuestionsByModule,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext)


