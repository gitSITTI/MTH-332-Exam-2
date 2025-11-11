import { mod } from './mathUtils.js'

export const EXAM2_SECTIONS = ['4.4', '4.5', '5.1']
export const QUESTION_KINDS = ['mc', 'numeric', 'short']

const questionBank = [
  {
    id: 'mc-44-1',
    section: '4.4',
    kind: 'mc',
    prompt:
      'Suppose a sequence is defined recursively by a₀ = 2, a₁ = 5, and aₙ = 3aₙ₋₁ - 2aₙ₋₂ for n ≥ 2. What is a₂?',
    choices: [
      { id: 'a', label: 'a₂ = 11' },
      { id: 'b', label: 'a₂ = 13' },
      { id: 'c', label: 'a₂ = 15' },
      { id: 'd', label: 'a₂ = 19' },
    ],
    answer: 'a',
    hint: 'Apply the recurrence with the two most recent terms.',
    solution: 'Compute a₂ = 3a₁ - 2a₀ = 3(5) - 2(2) = 15 - 4 = 11, so choice (a) is correct.',
  },
  {
    id: 'mc-44-2',
    section: '4.4',
    kind: 'mc',
    prompt: 'Which of the following solves the recurrence T(n) = 2T(n/2) + n with T(1) = 1?',
    choices: [
      { id: 'a', label: 'T(n) = Θ(n)' },
      { id: 'b', label: 'T(n) = Θ(n log n)' },
      { id: 'c', label: 'T(n) = Θ(n²)' },
      { id: 'd', label: 'T(n) = Θ(log n)' },
    ],
    answer: 'b',
    hint: 'Use the Master Theorem with a = 2, b = 2, f(n) = n.',
    solution: 'Since f(n) = n and n^{log_b a} = n, the Master Theorem gives T(n) = Θ(n log n).',
  },
  {
    id: 'numeric-45-1',
    section: '4.5',
    kind: 'numeric',
    prompt:
      'How many distinct permutations exist for the multiset {1, 1, 2, 2, 2, 3}? Provide the exact count as an integer.',
    answer: '60',
    hint: 'Use the multinomial coefficient formula for repeated elements.',
    solution:
      'The total permutations equal 6! / (2! · 3! · 1!) = 720 / (2 · 6) = 720 / 12 = 60.',
  },
  {
    id: 'numeric-45-2',
    section: '4.5',
    kind: 'numeric',
    prompt:
      'In how many ways can a committee of 4 be chosen from 7 people if two specific people refuse to serve together?',
    answer: '25',
    hint: 'Compute total combinations and subtract the invalid pairs.',
    solution:
      'Total committees: C(7,4) = 35. Committees containing both restricted members: C(5,2) = 10. Valid committees: 35 − 10 = 25.',
  },
  {
    id: 'short-51-1',
    section: '5.1',
    kind: 'short',
    prompt:
      'State the definition of disjoint events A and B in probability theory using set notation.',
    answer: 'A ∩ B = ∅',
    hint: 'Think about whether the events can occur simultaneously.',
    solution: 'Events A and B are disjoint exactly when A ∩ B = ∅, meaning they share no outcomes.',
  },
  {
    id: 'mc-51-2',
    section: '5.1',
    kind: 'mc',
    prompt:
      'A fair six-sided die is rolled twice. What is the probability that the sum is at least 10?',
    choices: [
      { id: 'a', label: '1/6' },
      { id: 'b', label: '1/9' },
      { id: 'c', label: '1/12' },
      { id: 'd', label: '1/3' },
    ],
    answer: 'a',
    hint: 'Count outcomes with sums 10, 11, 12 out of 36 total.',
    solution:
      'There are 3 + 2 + 1 = 6 favorable outcomes (10: {4,6},{5,5},{6,4}; 11: {5,6},{6,5}; 12: {6,6}). Probability = 6 / 36 = 1/6.',
  },
]

const seededRandom = seed => {
  let state = Math.abs(seed || 1) % 2147483647
  if (state === 0) {
    state = 1
  }

  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

const computeSeedFromString = input => {
  if (!input) return Date.now()
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
    hash = mod(hash, 2147483647)
  }
  return hash
}

/**
 * Generate a reproducible question set from the Exam 2 bank.
 *
 * @param {{
 *   section?: '4.4' | '4.5' | '5.1' | 'all',
 *   count?: number,
 *   seed?: number | string
 * }} options
 */
export const generateExam2QuestionSet = (options = {}) => {
  const { section = 'all', count = 6, seed } = options
  const normalizedSection = section === 'all' ? null : section
  const candidateQuestions = normalizedSection
    ? questionBank.filter(question => question.section === normalizedSection)
    : questionBank.slice()

  if (candidateQuestions.length === 0) {
    return []
  }

  const resolvedSeed = typeof seed === 'string' ? computeSeedFromString(seed) : seed
  const random = seededRandom(resolvedSeed ?? Date.now())
  const selected = []
  const usedIndexes = new Set()

  while (selected.length < count && usedIndexes.size < candidateQuestions.length) {
    const index = Math.floor(random() * candidateQuestions.length)
    if (!usedIndexes.has(index)) {
      usedIndexes.add(index)
      selected.push(candidateQuestions[index])
    }
  }

  return selected
}

export const exam2QuestionBank = questionBank

export const getQuestionsBySection = section =>
  section === 'all'
    ? questionBank.slice()
    : questionBank.filter(question => question.section === section)

export const getQuestionById = id => questionBank.find(question => question.id === id) ?? null

export const getQuestionBankSummary = () =>
  EXAM2_SECTIONS.map(section => ({
    section,
    total: questionBank.filter(question => question.section === section).length,
    kinds: QUESTION_KINDS.reduce(
      (acc, kind) => ({
        ...acc,
        [kind]: questionBank.filter(
          question => question.section === section && question.kind === kind,
        ).length,
      }),
      {},
    ),
  }))

export default {
  questionBank,
  generateExam2QuestionSet,
  getQuestionsBySection,
  getQuestionById,
  getQuestionBankSummary,
  EXAM2_SECTIONS,
  QUESTION_KINDS,
}

