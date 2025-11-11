const STORAGE_KEY = 'exam2_prep_progress'
const MODE_KEY = 'exam2_prep_mode'
const QUESTION_SET_KEY = 'exam2_last_question_set'

const withTimestamp = state => ({
  ...state,
  timestamp: Date.now(),
})

/**
 * Persist the Exam 2 Prep progress structure to localStorage.
 *
 * @param {{
 *   answers?: Record<string, string>,
 *   sectionFilter?: string,
 *   completedSetIds?: string[],
 *   activeQuestionId?: string | null
 * }} progress
 */
export const saveExam2Progress = progress => {
  try {
    const sanitized = {
      answers: progress?.answers ?? {},
      sectionFilter: progress?.sectionFilter ?? 'all',
      completedSetIds: progress?.completedSetIds ?? [],
      activeQuestionId: progress?.activeQuestionId ?? null,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamp(sanitized)))
  } catch (error) {
    console.warn('Failed to save Exam 2 progress', error)
  }
}

/**
 * Load the Exam 2 Prep progress structure from localStorage.
 * Automatically drops data older than 21 days to prevent stale states.
 */
export const loadExam2Progress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return null
    }

    const parsed = JSON.parse(data)
    const threeWeeksAgo = Date.now() - 21 * 24 * 60 * 60 * 1000

    if (parsed.timestamp && parsed.timestamp < threeWeeksAgo) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return {
      answers: parsed.answers ?? {},
      sectionFilter: parsed.sectionFilter ?? 'all',
      completedSetIds: parsed.completedSetIds ?? [],
      activeQuestionId: parsed.activeQuestionId ?? null,
      timestamp: parsed.timestamp ?? Date.now(),
    }
  } catch (error) {
    console.warn('Failed to load Exam 2 progress', error)
    return null
  }
}

export const clearExam2Progress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear Exam 2 progress', error)
  }
}

export const saveExam2Mode = mode => {
  try {
    localStorage.setItem(MODE_KEY, mode)
  } catch (error) {
    console.warn('Failed to persist Exam 2 mode', error)
  }
}

export const loadExam2Mode = () => {
  try {
    return localStorage.getItem(MODE_KEY)
  } catch (error) {
    console.warn('Failed to load Exam 2 mode', error)
    return null
  }
}

export const saveLastQuestionSet = setMetadata => {
  try {
    localStorage.setItem(QUESTION_SET_KEY, JSON.stringify(withTimestamp(setMetadata)))
  } catch (error) {
    console.warn('Failed to persist Exam 2 question set metadata', error)
  }
}

export const loadLastQuestionSet = () => {
  try {
    const data = localStorage.getItem(QUESTION_SET_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.warn('Failed to load Exam 2 question set metadata', error)
    return null
  }
}

export const clearLastQuestionSet = () => {
  try {
    localStorage.removeItem(QUESTION_SET_KEY)
  } catch (error) {
    console.warn('Failed to clear Exam 2 question set metadata', error)
  }
}

export const getDefaultExam2State = () => ({
  answers: {},
  sectionFilter: 'all',
  completedSetIds: [],
  activeQuestionId: null,
})

export default {
  saveExam2Progress,
  loadExam2Progress,
  clearExam2Progress,
  saveExam2Mode,
  loadExam2Mode,
  saveLastQuestionSet,
  loadLastQuestionSet,
  clearLastQuestionSet,
  getDefaultExam2State,
}

