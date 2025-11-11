import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearQuizProgress,
  getDefaultSettings,
  loadQuizProgress,
  loadQuizSettings,
  saveQuizProgress,
  saveQuizSettings,
} from './quizStorage.js'

describe('quizStorage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('saves and loads quiz progress with a timestamp', () => {
    saveQuizProgress('lecture-1', { answers: { q1: 0 }, currentIndex: 2 })

    const stored = loadQuizProgress('lecture-1')
    expect(stored).toMatchObject({
      answers: { q1: 0 },
      currentIndex: 2,
    })
    expect(stored.timestamp).toBeTypeOf('number')
  })

  it('expires quiz progress older than 30 days', () => {
    localStorage.setItem(
      'quiz_progress_lecture-2',
      JSON.stringify({
        answers: {},
        timestamp: new Date('2023-01-01T00:00:00Z').getTime(),
      }),
    )

    expect(loadQuizProgress('lecture-2')).toBeNull()
    expect(localStorage.getItem('quiz_progress_lecture-2')).toBeNull()
  })

  it('clears quiz progress', () => {
    saveQuizProgress('lecture-3', { answers: {} })
    clearQuizProgress('lecture-3')
    expect(loadQuizProgress('lecture-3')).toBeNull()
  })

  it('persists and loads quiz settings', () => {
    expect(loadQuizSettings()).toBeNull()
    const defaults = getDefaultSettings()
    expect(defaults).toEqual({
      shuffleQuestions: false,
      showExplanations: true,
    practiceMode: false,
    })

  const newSettings = { shuffleQuestions: true, showExplanations: false, practiceMode: true }
    saveQuizSettings(newSettings)
    expect(loadQuizSettings()).toEqual(newSettings)
  })
})

