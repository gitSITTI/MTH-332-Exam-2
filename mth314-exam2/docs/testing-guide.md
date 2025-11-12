# Testing Guide - Instructor Catalog Integration

## Overview

This guide documents the test coverage for the instructor question catalog integration feature.

## Test Structure

Tests are organized following the existing project structure:
- Utility tests: `src/utils/__tests__/`
- Component tests: `src/components/exam2/__tests__/`

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Test Coverage

### Utility Tests

#### `instructorCatalog.test.js`
**Location**: `src/utils/__tests__/instructorCatalog.test.js`

Tests for core utility functions:

- **`loadInstructorCatalog()`**
  - ✅ Loads and caches catalog from JSON
  - ✅ Returns cached catalog on subsequent calls
  - ✅ Handles fetch errors gracefully
  - ✅ Handles non-ok responses

- **`filterByProbability()`**
  - ✅ Returns all questions when threshold is 0
  - ✅ Filters questions by probability threshold
  - ✅ Handles questions without probability field
  - ✅ Returns empty array when no matches

- **`filterByLabel()`**
  - ✅ Returns all questions when labels is null/empty
  - ✅ Filters by single label
  - ✅ Filters by multiple labels

- **`filterBySection()`**
  - ✅ Returns all questions when section is "all"
  - ✅ Filters by section number

- **`mergeQuestionBanks()`**
  - ✅ Merges two question arrays
  - ✅ Handles empty/undefined arrays

- **`getProbabilityDisplay()`**
  - ✅ Returns correct display for 95%+ (💣 red)
  - ✅ Returns correct display for 90%+ (🔥 orange)
  - ✅ Returns correct display for 85%+ (💥 amber)
  - ✅ Returns correct display for 70%+ (💡 blue)
  - ✅ Returns correct display for <70% (💡 gray)
  - ✅ Handles undefined/0 probability

- **`getInstructorQuestions()`**
  - ✅ Returns all questions with no filters
  - ✅ Filters by section
  - ✅ Filters by probability threshold
  - ✅ Filters by label
  - ✅ Applies multiple filters simultaneously

### Component Tests

#### `ProbabilityFilter.test.jsx`
**Location**: `src/components/exam2/__tests__/ProbabilityFilter.test.jsx`

Tests for the probability filter UI component:

- ✅ Renders all probability threshold options
- ✅ Highlights active threshold button
- ✅ Calls onChange when threshold button is clicked
- ✅ Displays correct emoji for each threshold
- ✅ Handles missing onChange gracefully
- ✅ Has proper accessibility attributes
- ✅ Defaults to value 0 when not provided

#### `Exam2QuestionCard.test.jsx`
**Location**: `src/components/exam2/__tests__/Exam2QuestionCard.test.jsx`

Tests for the updated question card component:

- ✅ Renders question with basic information
- ✅ Displays probability indicator when available
- ✅ Displays label badge when available
- ✅ Displays origin indicator for instructor questions
- ✅ Displays topic/example when prompt is empty
- ✅ Shows correct feedback when answer is correct
- ✅ Shows incorrect feedback with expected answer
- ✅ Handles numeric question type
- ✅ Handles short answer question type
- ✅ Returns null when question is not provided

#### `CoverageCard.test.jsx`
**Location**: `src/components/exam2/__tests__/CoverageCard.test.jsx`

Tests for the updated coverage card component:

- ✅ Renders topic coverage header
- ✅ Displays total question count
- ✅ Displays instructor question count
- ✅ Displays other question count
- ✅ Displays section pills with counts
- ✅ Displays instructor badges for sections with instructor questions
- ✅ Does not display instructor badge for sections without instructor questions
- ✅ Handles empty summary gracefully
- ✅ Handles missing summary prop
- ✅ Handles summary with missing instructor/other fields
- ✅ Calculates totals correctly

## Test Utilities

### Mocking

The tests use Vitest's mocking capabilities:

```javascript
// Mock fetch for API calls
global.fetch = vi.fn()

// Mock React components
vi.mock('../SomeComponent.jsx', () => ({
  default: ({ prop }) => <div>{prop}</div>
}))
```

### Test Data

Common test data patterns:

```javascript
const mockQuestion = {
  id: 'test-1',
  section: '3.2',
  probability: 95,
  label: 'Fair Game',
  origin: 'instructor',
  prompt: 'Test question',
  // ...
}
```

## Testing Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Clear Names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert**: Follow the AAA pattern for test structure
4. **Mock External Dependencies**: Mock fetch, localStorage, etc.
5. **Test Edge Cases**: Include tests for null, undefined, empty arrays, etc.
6. **Accessibility**: Test ARIA attributes and keyboard navigation where applicable

## Future Test Additions

- [ ] Integration tests for Exam2PrepPage with instructor catalog
- [ ] E2E tests for filtering workflow
- [ ] Performance tests for large question banks
- [ ] Visual regression tests for UI components

## Related Documentation

- `docs/instructor-catalog-integration.md`: Feature documentation
- `docs/acceptance-criteria.md`: Acceptance criteria
- `docs/style-guide.md`: Code style guidelines

