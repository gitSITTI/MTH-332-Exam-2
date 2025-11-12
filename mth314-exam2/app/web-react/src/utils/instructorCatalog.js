const INSTRUCTOR_CATALOG_PATH = '/data/instructor-catalog.json'

let cachedCatalog = null

/**
 * Load instructor catalog from JSON file
 * @returns {Promise<Array>} Array of instructor questions
 */
export async function loadInstructorCatalog() {
  if (cachedCatalog) {
    return cachedCatalog
  }

  try {
    const response = await fetch(INSTRUCTOR_CATALOG_PATH)
    if (!response.ok) {
      throw new Error(`Failed to load instructor catalog: ${response.statusText}`)
    }
    const data = await response.json()
    cachedCatalog = Array.isArray(data) ? data : []
    return cachedCatalog
  } catch (error) {
    console.warn('Failed to load instructor catalog:', error)
    return []
  }
}

/**
 * Filter questions by probability threshold
 * @param {Array} questions - Array of questions
 * @param {number} threshold - Minimum probability (0-100)
 * @returns {Array} Filtered questions
 */
export function filterByProbability(questions, threshold = 0) {
  if (!threshold || threshold <= 0) {
    return questions
  }
  return questions.filter(q => (q.probability || 0) >= threshold)
}

/**
 * Filter questions by label type
 * @param {Array} questions - Array of questions
 * @param {string|Array} labels - Label(s) to filter by
 * @returns {Array} Filtered questions
 */
export function filterByLabel(questions, labels) {
  if (!labels || (Array.isArray(labels) && labels.length === 0)) {
    return questions
  }
  const labelSet = Array.isArray(labels) ? new Set(labels) : new Set([labels])
  return questions.filter(q => labelSet.has(q.label))
}

/**
 * Filter questions by section
 * @param {Array} questions - Array of questions
 * @param {string} section - Section number (e.g., '3.2', 'all')
 * @returns {Array} Filtered questions
 */
export function filterBySection(questions, section) {
  if (!section || section === 'all') {
    return questions
  }
  return questions.filter(q => q.section === section)
}

/**
 * Merge instructor questions with existing question bank
 * @param {Array} existingQuestions - Existing questions
 * @param {Array} instructorQuestions - Instructor catalog questions
 * @returns {Array} Merged array
 */
export function mergeQuestionBanks(existingQuestions = [], instructorQuestions = []) {
  return [...existingQuestions, ...instructorQuestions]
}

/**
 * Get probability display information
 * @param {number} probability - Probability value (0-100)
 * @returns {{emoji: string, percentage: string, color: string}} Display info
 */
export function getProbabilityDisplay(probability) {
  const p = probability || 0
  if (p >= 95) {
    return { emoji: '💣', percentage: '95%', color: '#dc2626' } // red-600
  }
  if (p >= 90) {
    return { emoji: '🔥', percentage: '90%', color: '#ea580c' } // orange-600
  }
  if (p >= 85) {
    return { emoji: '💥', percentage: '85%', color: '#f59e0b' } // amber-500
  }
  if (p >= 70) {
    return { emoji: '💡', percentage: '70%', color: '#3b82f6' } // blue-500
  }
  return { emoji: '💡', percentage: `${p}%`, color: '#6b7280' } // gray-500
}

/**
 * Get all instructor questions with optional filters
 * @param {Object} options - Filter options
 * @param {number} options.probabilityThreshold - Minimum probability
 * @param {string} options.section - Section filter
 * @param {string|Array} options.labels - Label filter(s)
 * @returns {Promise<Array>} Filtered instructor questions
 */
export async function getInstructorQuestions(options = {}) {
  const { probabilityThreshold = 0, section = 'all', labels = null } = options
  const catalog = await loadInstructorCatalog()
  let filtered = catalog

  if (section && section !== 'all') {
    filtered = filterBySection(filtered, section)
  }

  if (probabilityThreshold > 0) {
    filtered = filterByProbability(filtered, probabilityThreshold)
  }

  if (labels) {
    filtered = filterByLabel(filtered, labels)
  }

  return filtered
}

export default {
  loadInstructorCatalog,
  filterByProbability,
  filterByLabel,
  filterBySection,
  mergeQuestionBanks,
  getProbabilityDisplay,
  getInstructorQuestions,
}

