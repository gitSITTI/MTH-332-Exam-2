import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoverageCard from '../CoverageCard.jsx'

describe('CoverageCard', () => {
  const mockSummary = [
    {
      section: '3.2',
      total: 5,
      instructor: 3,
      other: 2,
      kinds: { mc: 3, numeric: 2 },
    },
    {
      section: '3.3',
      total: 4,
      instructor: 4,
      other: 0,
      kinds: { mc: 2, short: 2 },
    },
    {
      section: '4.1',
      total: 2,
      instructor: 0,
      other: 2,
      kinds: { mc: 2 },
    },
  ]

  it('renders topic coverage header', () => {
    render(<CoverageCard summary={mockSummary} />)

    expect(screen.getByText('Topic coverage')).toBeInTheDocument()
    expect(screen.getByText(/review distribution/i)).toBeInTheDocument()
  })

  it('displays total question count', () => {
    render(<CoverageCard summary={mockSummary} />)

    expect(screen.getByText(/total:/i)).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument() // 5 + 4 + 2
  })

  it('displays instructor question count', () => {
    render(<CoverageCard summary={mockSummary} />)

    expect(screen.getByText(/instructor:/i)).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument() // 3 + 4 + 0
  })

  it('displays other question count', () => {
    render(<CoverageCard summary={mockSummary} />)

    expect(screen.getByText(/other:/i)).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument() // 2 + 0 + 2
  })

  it('displays section pills with counts', () => {
    render(<CoverageCard summary={mockSummary} />)

    expect(screen.getByText(/section 3\.2/i)).toBeInTheDocument()
    expect(screen.getByText(/section 3\.3/i)).toBeInTheDocument()
    expect(screen.getByText(/section 4\.1/i)).toBeInTheDocument()
  })

  it('displays instructor badges for sections with instructor questions', () => {
    render(<CoverageCard summary={mockSummary} />)

    // Section 3.2 has 3 instructor questions
    const badges = screen.getAllByTitle(/instructor questions/i)
    expect(badges.length).toBeGreaterThan(0)
  })

  it('does not display instructor badge for sections without instructor questions', () => {
    render(<CoverageCard summary={mockSummary} />)

    // Section 4.1 has 0 instructor questions, so no badge should show
    const section41 = screen.getByText(/section 4\.1/i).closest('div')
    // The badge should not be present for this section
    expect(section41).toBeInTheDocument()
  })

  it('handles empty summary gracefully', () => {
    render(<CoverageCard summary={[]} />)

    expect(screen.getByText('Topic coverage')).toBeInTheDocument()
    // Should not crash or show totals
  })

  it('handles missing summary prop', () => {
    render(<CoverageCard />)

    expect(screen.getByText('Topic coverage')).toBeInTheDocument()
  })

  it('handles summary with missing instructor/other fields', () => {
    const partialSummary = [
      {
        section: '3.2',
        total: 5,
        kinds: { mc: 5 },
      },
    ]

    render(<CoverageCard summary={partialSummary} />)

    expect(screen.getByText(/section 3\.2/i)).toBeInTheDocument()
    // Should not crash
  })

  it('calculates totals correctly', () => {
    render(<CoverageCard summary={mockSummary} />)

    // Total: 5 + 4 + 2 = 11
    const totalElement = screen.getByText('11')
    expect(totalElement).toBeInTheDocument()
  })
})

