import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const saveQuizSettings = vi.fn()
const loadQuizSettings = vi.fn(() => null)
const getDefaultSettings = vi.fn(() => ({
  shuffleQuestions: false,
  showExplanations: true,
  practiceMode: false,
}))

vi.mock('../../utils/quizStorage.js', () => ({
  saveQuizSettings: (...args) => saveQuizSettings(...args),
  loadQuizSettings: (...args) => loadQuizSettings(...args),
  getDefaultSettings: (...args) => getDefaultSettings(...args),
}))

import QuizSettings from '../QuizSettings.jsx'

describe('QuizSettings', () => {
  beforeEach(() => {
    saveQuizSettings.mockClear()
    loadQuizSettings.mockClear()
  })

  it('toggles visibility of the settings panel', async () => {
    const user = userEvent.setup()
    render(<QuizSettings onSettingsChange={() => {}} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /quiz settings/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close settings/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('persists toggled settings and notifies parent', async () => {
    const user = userEvent.setup()
    const handleSettingsChange = vi.fn()
    render(<QuizSettings onSettingsChange={handleSettingsChange} />)

    await user.click(screen.getByRole('button', { name: /quiz settings/i }))

    const shuffleToggle = screen.getByLabelText(/shuffle questions/i)
    const practiceToggle = screen.getByLabelText(/practice mode/i)
    const showExplanationsToggle = screen.getByLabelText(/show explanations/i)

    await user.click(practiceToggle)
    await user.click(shuffleToggle)
    await user.click(showExplanationsToggle)

    expect(saveQuizSettings).toHaveBeenCalledTimes(4) // initial + three toggles
    const latestSettings = handleSettingsChange.mock.calls.at(-1)?.[0]
    expect(latestSettings).toEqual({
      shuffleQuestions: true,
      showExplanations: false,
      practiceMode: true,
    })
  })
})

