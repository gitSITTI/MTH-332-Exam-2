import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from '../ProgressBar.jsx'

describe('ProgressBar', () => {
  it('renders current progress and clamps values', () => {
    render(<ProgressBar current={3} total={5} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5')
    expect(screen.getByText('3 of 5 answered')).toBeInTheDocument()

    const fill = screen.getByRole('progressbar').querySelector('.progress__fill')
    expect(fill?.style.width).toBe('60%')
  })

  it('handles totals less than one gracefully', () => {
    render(<ProgressBar current={2} total={0} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '1')
    expect(screen.getByText('2 of 1 answered')).toBeInTheDocument()
    const fill = screen.getByRole('progressbar').querySelector('.progress__fill')
    expect(fill?.style.width).toBe('100%')
  })
})

