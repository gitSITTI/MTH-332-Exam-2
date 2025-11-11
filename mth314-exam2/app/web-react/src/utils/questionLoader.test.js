import { describe, expect, it } from 'vitest'
import {
  normalizeQuestion,
  parseQuestionsFromJsonl,
} from './questionLoader.js'

describe('questionLoader utilities', () => {
  it('normalizes question objects consistently', () => {
    const normalized = normalizeQuestion({
      id: 'sample',
      module: 3,
      question: 'What is 2 + 2?',
      choices: ['3', '4'],
      answer_index: 1,
    })

    expect(normalized).toEqual(
      expect.objectContaining({
        id: 'sample',
        module: '3',
        question: 'What is 2 + 2?',
        choices: ['3', '4'],
        answer_index: 1,
      }),
    )
  })

  it('parses JSONL text into normalized questions', () => {
    const jsonl = [
      JSON.stringify({
        id: 'q1',
        module: 6,
        type: 'tf',
        question: 'Induction requires a base case.',
        answer_index: 0,
      }),
      '',
    ].join('\n')

    const parsed = parseQuestionsFromJsonl(jsonl)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toEqual(
      expect.objectContaining({
        id: 'q1',
        module: '6',
        choices: ['True', 'False'],
        answer_index: 0,
      }),
    )
  })
})


