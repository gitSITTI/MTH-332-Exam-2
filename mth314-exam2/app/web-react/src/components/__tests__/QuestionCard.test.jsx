import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuestionCard from '../QuestionCard.jsx'

const baseQuestion = {
  id: 'q1',
  module: '6',
  type: 'mcq',
  question: 'What is the base case in induction?',
  choices: ['Show n = 1 works', 'Assume n = k', 'Assume n = k + 1', 'None of the above'],
  answer_index: 0,
  explanation: 'An induction proof must start by proving the proposition for the first n.',
  video_id: 'induction-basics',
}

describe('QuestionCard', () => {
  it('renders supplied metadata and propagates choice selections', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()

    render(
      <QuestionCard
        question={baseQuestion}
        questionNumber={1}
        totalQuestions={4}
        selectedIndex={null}
        onSelectChoice={handleSelect}
        revealAnswer={false}
        showExplanation={false}
        videoMeta={{ title: 'Induction Foundations', url: 'https://example.com' }}
      />,
    )

    expect(screen.getByText(/question 1/i)).toBeInTheDocument()
    expect(screen.getByText(/module 6/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open lecture/i })).toHaveAttribute(
      'href',
      'https://example.com',
    )

    await user.click(screen.getByRole('radio', { name: /option a/i }))
    expect(handleSelect).toHaveBeenCalledWith(0)
  })

  it('shows feedback and explanation when results are revealed', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        questionNumber={2}
        totalQuestions={4}
        selectedIndex={1}
        onSelectChoice={() => {}}
        revealAnswer
        showExplanation
      />,
    )

    expect(screen.getByText(/correct answer/i)).toBeInTheDocument()
    expect(screen.getByText(baseQuestion.explanation)).toBeInTheDocument()

    const choiceButton = screen.getByRole('radio', { name: /option b/i })
    expect(choiceButton).toBeDisabled()
  })

  it('highlights correct answers and shows explanation in practice mode', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        questionNumber={3}
        totalQuestions={4}
        selectedIndex={null}
        onSelectChoice={() => {}}
        revealAnswer={false}
        showExplanation
        practiceMode
      />,
    )

    expect(screen.getByText(/practice mode is on/i)).toBeInTheDocument()
    const correctButton = screen.getByRole('radio', { name: /option a/i })
    expect(correctButton).toHaveClass('choice-button--practice')
    expect(screen.getByText(baseQuestion.explanation)).toBeInTheDocument()
  })
})

