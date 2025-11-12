import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  loadInstructorCatalog,
  filterByProbability,
  filterByLabel,
  filterBySection,
  mergeQuestionBanks,
  getProbabilityDisplay,
  getInstructorQuestions,
} from '../instructorCatalog.js'

// Mock fetch globally
global.fetch = vi.fn()

describe('instructorCatalog utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear module cache to reset cached catalog
    vi.resetModules()
  })

  describe('loadInstructorCatalog', () => {
    it('loads and caches catalog from JSON', async () => {
      const mockCatalog = [
        { id: 'inst-1', section: '3.2', probability: 90 },
        { id: 'inst-2', section: '3.3', probability: 85 },
      ]

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      })

      const result = await loadInstructorCatalog()
      expect(result).toEqual(mockCatalog)
      expect(global.fetch).toHaveBeenCalledWith('/data/instructor-catalog.json')
    })

    it('returns cached catalog on subsequent calls', async () => {
      const mockCatalog = [{ id: 'inst-1' }]
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      })

      await loadInstructorCatalog()
      const result2 = await loadInstructorCatalog()
      expect(result2).toEqual(mockCatalog)
      expect(global.fetch).toHaveBeenCalledTimes(1) // Only called once
    })

    it('returns empty array on fetch error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await loadInstructorCatalog()
      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('returns empty array on non-ok response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      })
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await loadInstructorCatalog()
      expect(result).toEqual([])
      consoleSpy.mockRestore()
    })
  })

  describe('filterByProbability', () => {
    const questions = [
      { id: '1', probability: 95 },
      { id: '2', probability: 90 },
      { id: '3', probability: 85 },
      { id: '4', probability: 70 },
      { id: '5', probability: 65 },
      { id: '6' }, // No probability
    ]

    it('returns all questions when threshold is 0', () => {
      const result = filterByProbability(questions, 0)
      expect(result).toEqual(questions)
    })

    it('filters questions by probability threshold', () => {
      const result = filterByProbability(questions, 90)
      expect(result).toHaveLength(2)
      expect(result.map(q => q.id)).toEqual(['1', '2'])
    })

    it('handles questions without probability field', () => {
      const result = filterByProbability(questions, 50)
      expect(result).toHaveLength(5) // Excludes question 6 (no probability)
    })

    it('returns empty array when no questions match', () => {
      const result = filterByProbability(questions, 100)
      expect(result).toEqual([])
    })
  })

  describe('filterByLabel', () => {
    const questions = [
      { id: '1', label: 'Fair Game' },
      { id: '2', label: 'Example' },
      { id: '3', label: 'Fair Game' },
      { id: '4', label: 'Suggested Exercise' },
    ]

    it('returns all questions when labels is null', () => {
      const result = filterByLabel(questions, null)
      expect(result).toEqual(questions)
    })

    it('returns all questions when labels is empty array', () => {
      const result = filterByLabel(questions, [])
      expect(result).toEqual(questions)
    })

    it('filters by single label', () => {
      const result = filterByLabel(questions, 'Fair Game')
      expect(result).toHaveLength(2)
      expect(result.map(q => q.id)).toEqual(['1', '3'])
    })

    it('filters by multiple labels', () => {
      const result = filterByLabel(questions, ['Fair Game', 'Example'])
      expect(result).toHaveLength(3)
      expect(result.map(q => q.id)).toEqual(['1', '2', '3'])
    })
  })

  describe('filterBySection', () => {
    const questions = [
      { id: '1', section: '3.2' },
      { id: '2', section: '3.3' },
      { id: '3', section: '3.2' },
      { id: '4', section: '4.1' },
    ]

    it('returns all questions when section is "all"', () => {
      const result = filterBySection(questions, 'all')
      expect(result).toEqual(questions)
    })

    it('returns all questions when section is null', () => {
      const result = filterBySection(questions, null)
      expect(result).toEqual(questions)
    })

    it('filters by section', () => {
      const result = filterBySection(questions, '3.2')
      expect(result).toHaveLength(2)
      expect(result.map(q => q.id)).toEqual(['1', '3'])
    })
  })

  describe('mergeQuestionBanks', () => {
    it('merges two question arrays', () => {
      const existing = [{ id: '1' }, { id: '2' }]
      const instructor = [{ id: '3' }, { id: '4' }]
      const result = mergeQuestionBanks(existing, instructor)
      expect(result).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }])
    })

    it('handles empty arrays', () => {
      const result = mergeQuestionBanks([], [])
      expect(result).toEqual([])
    })

    it('handles undefined arrays', () => {
      const result = mergeQuestionBanks(undefined, undefined)
      expect(result).toEqual([])
    })

    it('handles mixed empty/undefined arrays', () => {
      const existing = [{ id: '1' }]
      const result = mergeQuestionBanks(existing, undefined)
      expect(result).toEqual([{ id: '1' }])
    })
  })

  describe('getProbabilityDisplay', () => {
    it('returns correct display for 95%+', () => {
      const result = getProbabilityDisplay(95)
      expect(result).toEqual({
        emoji: '💣',
        percentage: '95%',
        color: '#dc2626',
      })
    })

    it('returns correct display for 90%+', () => {
      const result = getProbabilityDisplay(90)
      expect(result).toEqual({
        emoji: '🔥',
        percentage: '90%',
        color: '#ea580c',
      })
    })

    it('returns correct display for 85%+', () => {
      const result = getProbabilityDisplay(85)
      expect(result).toEqual({
        emoji: '💥',
        percentage: '85%',
        color: '#f59e0b',
      })
    })

    it('returns correct display for 70%+', () => {
      const result = getProbabilityDisplay(70)
      expect(result).toEqual({
        emoji: '💡',
        percentage: '70%',
        color: '#3b82f6',
      })
    })

    it('returns correct display for <70%', () => {
      const result = getProbabilityDisplay(65)
      expect(result).toEqual({
        emoji: '💡',
        percentage: '65%',
        color: '#6b7280',
      })
    })

    it('handles undefined probability', () => {
      const result = getProbabilityDisplay(undefined)
      expect(result).toEqual({
        emoji: '💡',
        percentage: '0%',
        color: '#6b7280',
      })
    })

    it('handles 0 probability', () => {
      const result = getProbabilityDisplay(0)
      expect(result).toEqual({
        emoji: '💡',
        percentage: '0%',
        color: '#6b7280',
      })
    })
  })

  describe('getInstructorQuestions', () => {
    const mockCatalog = [
      { id: '1', section: '3.2', probability: 95, label: 'Fair Game' },
      { id: '2', section: '3.2', probability: 85, label: 'Example' },
      { id: '3', section: '3.3', probability: 90, label: 'Fair Game' },
      { id: '4', section: '4.1', probability: 70, label: 'Suggested Exercise' },
    ]

    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCatalog,
      })
    })

    it('returns all questions with no filters', async () => {
      const result = await getInstructorQuestions({})
      expect(result).toHaveLength(4)
    })

    it('filters by section', async () => {
      const result = await getInstructorQuestions({ section: '3.2' })
      expect(result).toHaveLength(2)
      expect(result.map(q => q.id)).toEqual(['1', '2'])
    })

    it('filters by probability threshold', async () => {
      const result = await getInstructorQuestions({ probabilityThreshold: 90 })
      expect(result).toHaveLength(2)
      expect(result.map(q => q.id)).toEqual(['1', '3'])
    })

    it('filters by label', async () => {
      const result = await getInstructorQuestions({ labels: 'Fair Game' })
      expect(result).toHaveLength(2)
      expect(result.map(q => q.id)).toEqual(['1', '3'])
    })

    it('applies multiple filters', async () => {
      const result = await getInstructorQuestions({
        section: '3.2',
        probabilityThreshold: 90,
        labels: 'Fair Game',
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('handles "all" section filter', async () => {
      const result = await getInstructorQuestions({ section: 'all' })
      expect(result).toHaveLength(4)
    })
  })
})

