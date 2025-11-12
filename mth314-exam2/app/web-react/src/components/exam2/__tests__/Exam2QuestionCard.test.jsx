import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Exam2QuestionCard from '../Exam2QuestionCard.jsx'

// Mock the question type components
vi.mock('../MultipleChoiceQuestion.jsx', () => ({
  default: ({ question, value, onChange }) => (
    <div data-testid="multiple-choice">
      {question.choices?.map((choice, idx) => (
        <label key={idx}>
          <input
            type="radio"
            checked={value === choice.id}
            onChange={() => onChange?.(choice.id)}
          />
          {choice.label}
        </label>
      ))}
    </div>
  ),
}))

vi.mock('../NumericQuestion.jsx', () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid="numeric-input"
      type="number"
      value={value || ''}
      onChange={e => onChange?.(e.target.value)}
    />
  ),
}))

vi.mock('../ShortAnswerQuestion.jsx', () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid="short-input"
      type="text"
      value={value || ''}
      onChange={e => onChange?.(e.target.value)}
    />
  ),
}))

vi.mock('../SolutionPanel.jsx', () => ({
  default: ({ solution }) => <div data-testid="solution">{solution}</div>,
}))

vi.mock('../HintBadge.jsx', () => ({
  default: () => null,
}))

describe('Exam2QuestionCard', () => {
  const baseQuestion = {
    id: 'test-1',
    section: '3.2',
    kind: 'mc',
    prompt: 'What is 2 + 2?',
    choices: [
      { id: 'a', label: '3' },
      { id: 'b', label: '4' },
      { id: 'c', label: '5' },
    ],
    answer: 'b',
    hint: 'Think about basic arithmetic',
    solution: '2 + 2 = 4',
  }

  it('renders question with basic information', () => {
    render(
      <Exam2QuestionCard
        question={baseQuestion}
        index={0}
        total={5}
        response={null}
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={false}
      />,
    )

    expect(screen.getByText(/question 1/i)).toBeInTheDocument()
    expect(screen.getByText(/of 5/i)).toBeInTheDocument()
    expect(screen.getByText(/section 3\.2/i)).toBeInTheDocument()
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('displays probability indicator when available', () => {
    const questionWithProbability = {
      ...baseQuestion,
      probability: 95,
      probabilityEmoji: '💣',
    }

    render(
      <Exam2QuestionCard
        question={questionWithProbability}
        index={0}
        total={1}
        response={null}
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={false}
      />,
    )

    expect(screen.getByText(/95%/i)).toBeInTheDocument()
  })

  it('displays label badge when available', () => {
    const questionWithLabel = {
      ...baseQuestion,
      label: 'Fair Game',
    }

    render(
      <Exam2QuestionCard
        question={questionWithLabel}
        index={0}
        total={1}
        response={null}
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={false}
      />,
    )

    expect(screen.getByText('Fair Game')).toBeInTheDocument()
  })

  it('displays origin indicator for instructor questions', () => {
    const instructorQuestion = {
      ...baseQuestion,
      origin: 'instructor',
    }

    render(
      <Exam2QuestionCard
        question={instructorQuestion}
        index={0}
        total={1}
        response={null}
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={false}
      />,
    )

    // Check for instructor emoji (👨‍🏫)
    const originElement = screen.getByTitle(/instructor/i)
    expect(originElement).toBeInTheDocument()
  })

  it('displays topic/example when prompt is empty', () => {
    const placeholderQuestion = {
      ...baseQuestion,
      prompt: '',
      topic: 'Division Algorithm basic',
      example: 'Find q,r for 20÷3',
    }

    render(
      <Exam2QuestionCard
        question={placeholderQuestion}
        index={0}
        total={1}
        response={null}
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={false}
      />,
    )

    expect(screen.getByText('Division Algorithm basic')).toBeInTheDocument()
    expect(screen.getByText(/topic:/i)).toBeInTheDocument()
    expect(screen.getByText(/example:/i)).toBeInTheDocument()
  })

  it('shows correct feedback when answer is correct', () => {
    render(
      <Exam2QuestionCard
        question={baseQuestion}
        index={0}
        total={1}
        response="b"
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={true}
      />,
    )

    expect(screen.getByText(/correct/i)).toBeInTheDocument()
  })

  it('shows incorrect feedback with expected answer', () => {
    render(
      <Exam2QuestionCard
        question={baseQuestion}
        index={0}
        total={1}
        response="a"
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={true}
      />,
    )

    expect(screen.getByText(/expected answer/i)).toBeInTheDocument()
  })

  it('handles numeric question type', () => {
    const numericQuestion = {
      ...baseQuestion,
      kind: 'numeric',
      answer: '42',
    }

    render(
      <Exam2QuestionCard
        question={numericQuestion}
        index={0}
        total={1}
        response={null}
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={false}
      />,
    )

    expect(screen.getByTestId('numeric-input')).toBeInTheDocument()
  })

  it('handles short answer question type', () => {
    const shortQuestion = {
      ...baseQuestion,
      kind: 'short',
      answer: 'A ∩ B = ∅',
    }

    render(
      <Exam2QuestionCard
        question={shortQuestion}
        index={0}
        total={1}
        response={null}
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={false}
      />,
    )

    expect(screen.getByTestId('short-input')).toBeInTheDocument()
  })

  it('returns null when question is not provided', () => {
    const { container } = render(
      <Exam2QuestionCard
        question={null}
        index={0}
        total={1}
        response={null}
        onResponseChange={() => {}}
        mode="practice"
        showFeedback={false}
      />,
    )

    expect(container.firstChild).toBeNull()
  })
})

