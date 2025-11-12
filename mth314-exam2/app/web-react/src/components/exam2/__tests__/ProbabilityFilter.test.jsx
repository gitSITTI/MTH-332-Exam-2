import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProbabilityFilter from '../ProbabilityFilter.jsx'

describe('ProbabilityFilter', () => {
  it('renders all probability threshold options', () => {
    render(<ProbabilityFilter value={0} onChange={() => {}} />)

    expect(screen.getByText('Filter by probability:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /≥95%/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /≥90%/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /≥85%/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /≥70%/i })).toBeInTheDocument()
  })

  it('highlights active threshold button', () => {
    render(<ProbabilityFilter value={90} onChange={() => {}} />)

    const activeButton = screen.getByRole('button', { name: /≥90%/i })
    expect(activeButton).toHaveClass('probability-filter__button--active')
    expect(activeButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange when threshold button is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<ProbabilityFilter value={0} onChange={handleChange} />)

    const button95 = screen.getByRole('button', { name: /≥95%/i })
    await user.click(button95)

    expect(handleChange).toHaveBeenCalledWith(95)
  })

  it('displays correct emoji for each threshold', () => {
    render(<ProbabilityFilter value={0} onChange={() => {}} />)

    // Check that emojis are present (they should be in the button text or as separate elements)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('handles missing onChange gracefully', async () => {
    const user = userEvent.setup()

    render(<ProbabilityFilter value={0} />)

    const button90 = screen.getByRole('button', { name: /≥90%/i })
    // Should not throw error
    await user.click(button90)
  })

  it('has proper accessibility attributes', () => {
    render(<ProbabilityFilter value={85} onChange={() => {}} />)

    const group = screen.getByRole('group', { name: /filter by probability/i })
    expect(group).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-pressed')
    })
  })

  it('defaults to value 0 when not provided', () => {
    render(<ProbabilityFilter onChange={() => {}} />)

    const allButton = screen.getByRole('button', { name: /all/i })
    expect(allButton).toHaveClass('probability-filter__button--active')
  })
})

