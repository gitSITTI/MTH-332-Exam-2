/**
 * Utility functions for persisting quiz progress in localStorage
 */

const STORAGE_KEY_PREFIX = 'quiz_progress_'
const SETTINGS_KEY = 'quiz_settings'

/**
 * Get the storage key for a specific lecture
 */
const getStorageKey = lectureId => `${STORAGE_KEY_PREFIX}${lectureId}`

/**
 * Save quiz progress for a lecture
 */
export const saveQuizProgress = (lectureId, progress) => {
  try {
    const key = getStorageKey(lectureId)
    const data = {
      ...progress,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save quiz progress:', error)
  }
}

/**
 * Load quiz progress for a lecture
 */
export const loadQuizProgress = lectureId => {
  try {
    const key = getStorageKey(lectureId)
    const data = localStorage.getItem(key)
    if (!data) return null

    const parsed = JSON.parse(data)
    // Check if data is older than 30 days, if so, clear it
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    if (parsed.timestamp && parsed.timestamp < thirtyDaysAgo) {
      localStorage.removeItem(key)
      return null
    }

    return parsed
  } catch (error) {
    console.warn('Failed to load quiz progress:', error)
    return null
  }
}

/**
 * Clear quiz progress for a lecture
 */
export const clearQuizProgress = lectureId => {
  try {
    const key = getStorageKey(lectureId)
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to clear quiz progress:', error)
  }
}

/**
 * Save quiz settings
 */
export const saveQuizSettings = settings => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('Failed to save quiz settings:', error)
  }
}

/**
 * Load quiz settings
 */
export const loadQuizSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    if (!data) return null
    return JSON.parse(data)
  } catch (error) {
    console.warn('Failed to load quiz settings:', error)
    return null
  }
}

/**
 * Get default settings
 */
export const getDefaultSettings = () => ({
  shuffleQuestions: false,
  showExplanations: true,
})

