import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuizControls from '../QuizControls.jsx'

describe('QuizControls', () => {
  it('disables navigation buttons when movement is not allowed', () => {
    render(
      <QuizControls
        canGoBack={false}
        canGoForward={false}
        onPrev={() => {}}
        onNext={() => {}}
        onSubmit={() => {}}
        showSubmit={false}
        isSubmitting={false}
      />,
    )

    expect(screen.getByRole('button', { name: /previous question/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next question/i })).toBeDisabled()
  })

  it('invokes callbacks and handles submit state', async () => {
    const user = userEvent.setup()
    const handlePrev = vi.fn()
    const handleNext = vi.fn()
    const handleSubmit = vi.fn()

    render(
      <QuizControls
        canGoBack
        canGoForward
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
        showSubmit
        isSubmitting={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: /previous question/i }))
    await user.click(screen.getByRole('button', { name: /next question/i }))
    await user.click(screen.getByRole('button', { name: /submit quiz/i }))

    expect(handlePrev).toHaveBeenCalledTimes(1)
    expect(handleNext).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('displays submitting label when isSubmitting is true', () => {
    render(
      <QuizControls
        canGoBack
        canGoForward
        onPrev={() => {}}
        onNext={() => {}}
        onSubmit={() => {}}
        showSubmit
        isSubmitting
      />,
    )

    expect(
      screen.getByRole('button', { name: /submitting quiz/i }),
    ).toHaveTextContent('Submitting…')
  })
})

