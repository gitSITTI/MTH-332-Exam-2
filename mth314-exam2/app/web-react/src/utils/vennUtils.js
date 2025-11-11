const REGION_CONFIG = {
  2: {
    regionIds: ['A_only', 'B_only', 'AB', 'outside'],
    baseSets: {
      A: ['A_only', 'AB'],
      B: ['B_only', 'AB'],
    },
  },
  3: {
    regionIds: ['A_only', 'B_only', 'C_only', 'AB', 'AC', 'BC', 'ABC', 'outside'],
    baseSets: {
      A: ['A_only', 'AB', 'AC', 'ABC'],
      B: ['B_only', 'AB', 'BC', 'ABC'],
      C: ['C_only', 'AC', 'BC', 'ABC'],
    },
  },
}

const REGION_METADATA = {
  2: {
    A_only: {
      id: 'A_only',
      label: 'Only A',
      description: 'Elements that belong to A but not B.',
    },
    B_only: {
      id: 'B_only',
      label: 'Only B',
      description: 'Elements that belong to B but not A.',
    },
    AB: {
      id: 'AB',
      label: 'A ∩ B',
      description: 'Elements shared between A and B.',
    },
    outside: {
      id: 'outside',
      label: 'Outside',
      description: 'Elements in the universal set but not in A or B.',
    },
  },
  3: {
    A_only: {
      id: 'A_only',
      label: 'Only A',
      description: 'Elements that belong to A but not B or C.',
    },
    B_only: {
      id: 'B_only',
      label: 'Only B',
      description: 'Elements that belong to B but not A or C.',
    },
    C_only: {
      id: 'C_only',
      label: 'Only C',
      description: 'Elements that belong to C but not A or B.',
    },
    AB: {
      id: 'AB',
      label: 'A ∩ B (not C)',
      description: 'Elements shared between A and B, excluding C.',
    },
    AC: {
      id: 'AC',
      label: 'A ∩ C (not B)',
      description: 'Elements shared between A and C, excluding B.',
    },
    BC: {
      id: 'BC',
      label: 'B ∩ C (not A)',
      description: 'Elements shared between B and C, excluding A.',
    },
    ABC: {
      id: 'ABC',
      label: 'A ∩ B ∩ C',
      description: 'Elements shared by all three sets.',
    },
    outside: {
      id: 'outside',
      label: 'Outside',
      description: 'Elements outside of A, B, and C.',
    },
  },
}

const TWO_SET_OPERATIONS = [
  { id: 'A_INTER_B', expression: 'A ∩ B' },
  { id: 'A_UNION_B', expression: 'A ∪ B' },
  { id: 'A_MINUS_B', expression: 'A - B' },
  { id: 'B_MINUS_A', expression: 'B - A' },
  { id: 'A_COMPLEMENT', expression: "A'" },
  { id: 'B_COMPLEMENT', expression: "B'" },
  { id: 'A_INTER_B_COMPLEMENT', expression: 'A ∩ B′' },
  { id: 'A_UNION_B_COMPLEMENT', expression: 'A ∪ B′' },
  { id: 'A_INTER_B_COMPLEMENTED', expression: "(A ∩ B)'" },
  { id: 'A_UNION_B_COMPLEMENTED', expression: "(A ∪ B)'" },
]

const THREE_SET_OPERATIONS = [
  { id: 'A_INTER_B_INTER_C', expression: 'A ∩ B ∩ C' },
  { id: 'A_UNION_B_UNION_C', expression: 'A ∪ B ∪ C' },
  { id: 'A_INTER_B', expression: 'A ∩ B' },
  { id: 'A_INTER_C', expression: 'A ∩ C' },
  { id: 'B_INTER_C', expression: 'B ∩ C' },
  { id: 'A_MINUS_B', expression: 'A - B' },
  { id: 'A_MINUS_C', expression: 'A - C' },
  { id: 'B_MINUS_C', expression: 'B - C' },
  { id: 'A_MINUS_BC', expression: 'A - (B ∪ C)' },
  { id: 'B_MINUS_AC', expression: 'B - (A ∪ C)' },
  { id: 'C_MINUS_AB', expression: 'C - (A ∪ B)' },
  { id: 'A_SYMDIFF_B', expression: '(A - B) ∪ (B - A)' },
  { id: 'A_INTER_B_MINUS_C', expression: '(A ∩ B) - C' },
  { id: 'A_INTER_C_MINUS_B', expression: '(A ∩ C) - B' },
  { id: 'B_INTER_C_MINUS_A', expression: '(B ∩ C) - A' },
  { id: 'A_PRIME', expression: "A'" },
  { id: 'B_PRIME', expression: "B'" },
  { id: 'C_PRIME', expression: "C'" },
  { id: 'A_INTER_B_COMPLEMENT', expression: 'A ∩ B′' },
  { id: 'A_INTER_C_COMPLEMENT', expression: 'A ∩ C′' },
  { id: 'B_INTER_C_COMPLEMENT', expression: 'B ∩ C′' },
  { id: 'TRIPLE_COMPLEMENT', expression: "(A ∩ B ∩ C)'" },
  { id: 'UNION_COMPLEMENT', expression: "(A ∪ B ∪ C)'" },
]

function createContext(setCount = 2) {
  const base = REGION_CONFIG[setCount]

  if (!base) {
    throw new Error(`Unsupported set count: ${setCount}`)
  }

  return {
    setCount,
    regionIds: base.regionIds,
    baseSets: base.baseSets,
    universal: new Set(base.regionIds),
  }
}

function cloneSet(input) {
  return new Set(input)
}

function ensureSet(value) {
  if (value instanceof Set) {
    return value
  }

  return new Set(value)
}

function union(left, right) {
  const result = cloneSet(left)
  for (const item of right) {
    result.add(item)
  }
  return result
}

function intersection(left, right) {
  const result = new Set()
  for (const item of left) {
    if (right.has(item)) {
      result.add(item)
    }
  }
  return result
}

function difference(left, right) {
  const result = new Set()
  for (const item of left) {
    if (!right.has(item)) {
      result.add(item)
    }
  }
  return result
}

function complement(set, context) {
  const result = new Set()

  for (const region of context.universal) {
    if (!set.has(region)) {
      result.add(region)
    }
  }

  return result
}

export function parseVennExpression(expression, options = {}) {
  const { setCount = 2 } = options
  const context = createContext(setCount)
  const input = expression.replace(/\s+/g, '')

  let index = 0

  function peek() {
    return input[index] ?? ''
  }

  function consume() {
    return input[index++] ?? ''
  }

  function expect(char) {
    const token = consume()
    if (token !== char) {
      throw new Error(`Expected "${char}" but found "${token || 'end of input'}"`)
    }
  }

  function parseUnion() {
    let value = parseDifference()

    while (true) {
      const token = peek()

      if (token === '∪' || token === 'U' || token === '+') {
        consume()
        const right = parseDifference()
        value = union(value, right)
      } else {
        break
      }
    }

    return value
  }

  function parseDifference() {
    let value = parseIntersection()

    while (true) {
      const token = peek()

      if (token === '-') {
        consume()
        const right = parseIntersection()
        value = difference(value, right)
      } else {
        break
      }
    }

    return value
  }

  function parseIntersection() {
    let value = parseComplement()

    while (true) {
      const token = peek()

      if (token === '∩' || token === '∧' || token === '^') {
        consume()
        const right = parseComplement()
        value = intersection(value, right)
      } else {
        break
      }
    }

    return value
  }

  function parseComplement() {
    let value = parsePrimary()

    while (true) {
      const token = peek()

      if (token === "'" || token === '′') {
        consume()
        value = complement(value, context)
      } else {
        break
      }
    }

    return value
  }

  function parsePrimary() {
    const token = peek()

    if (token === '(') {
      consume()
      const value = parseUnion()
      expect(')')
      return value
    }

    if (token === '∅') {
      consume()
      return new Set()
    }

    if (token === 'U' && peekAhead(1) === 'n') {
      // Accept "Univ" for universal, fallback
      consume()
      expect('n')
      expect('i')
      expect('v')
      return cloneSet(context.universal)
    }

    if (token === 'U' && peekAhead(1) !== 'n') {
      throw new Error('Ambiguous use of "U". Use "Univ" for universal set.')
    }

    return parseOperand()
  }

  function parseOperand() {
    const token = consume()

    if (!token) {
      throw new Error('Unexpected end of expression')
    }

    if (!/[ABC]/.test(token)) {
      throw new Error(`Unsupported symbol "${token}" in expression "${expression}"`)
    }

    if (!context.baseSets[token]) {
      throw new Error(
        `Symbol "${token}" is not available for a ${context.setCount}-set Venn diagram`,
      )
    }

    return new Set(context.baseSets[token])
  }

  function peekAhead(offset) {
    return input[index + offset] ?? ''
  }

  const result = parseUnion()

  if (index < input.length) {
    throw new Error(`Unexpected token "${input[index]}" at position ${index}`)
  }

  return result
}

export function getVennRegionsForExpression(expression, options = {}) {
  const { setCount = 2 } = options
  const result = parseVennExpression(expression, { setCount })
  return Array.from(result.values()).sort()
}

export function getVennRegionIds(setCount = 2) {
  return [...REGION_CONFIG[setCount]?.regionIds ?? []]
}

export function getRegionMetadata(setCount = 2) {
  const catalog = REGION_METADATA[setCount]
  if (!catalog) {
    return []
  }

  return Object.values(catalog)
}

export function isSelectionMatch(selection, target) {
  if (!selection || !target) {
    return false
  }

  const selectionSet = ensureSet(selection)
  const targetSet = ensureSet(target)

  if (selectionSet.size !== targetSet.size) {
    return false
  }

  for (const region of selectionSet) {
    if (!targetSet.has(region)) {
      return false
    }
  }

  return true
}

export function getOperationPool(setCount = 2) {
  if (setCount === 2) {
    return TWO_SET_OPERATIONS.map(operation => ({
      ...operation,
      regions: getVennRegionsForExpression(operation.expression, { setCount: 2 }),
    }))
  }

  if (setCount === 3) {
    return THREE_SET_OPERATIONS.map(operation => ({
      ...operation,
      regions: getVennRegionsForExpression(operation.expression, { setCount: 3 }),
    }))
  }

  throw new Error(`Unsupported set count: ${setCount}`)
}

export function pickRandomOperation(setCount = 2, random = Math.random) {
  const pool = getOperationPool(setCount)
  const index = Math.floor(random() * pool.length)
  return pool[index]
}


