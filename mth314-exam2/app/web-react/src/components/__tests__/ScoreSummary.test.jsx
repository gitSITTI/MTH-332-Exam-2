import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScoreSummary from '../ScoreSummary.jsx'

describe('ScoreSummary', () => {
  it('renders computed statistics and triggers callbacks', async () => {
    const user = userEvent.setup()
    const handleRestart = vi.fn()
    const handleExit = vi.fn()

    render(
      <ScoreSummary total={5} correct={3} onRestart={handleRestart} onExit={handleExit} />,
    )

    expect(screen.getByText('Total questions')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /retry lecture/i }))
    await user.click(screen.getByRole('button', { name: /back to lectures/i }))

    expect(handleRestart).toHaveBeenCalledTimes(1)
    expect(handleExit).toHaveBeenCalledTimes(1)
  })
})

