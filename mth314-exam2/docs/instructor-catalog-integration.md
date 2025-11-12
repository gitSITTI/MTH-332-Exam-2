# Instructor Question Catalog Integration

## Overview

This document describes the implementation of the instructor question catalog system, which integrates 28 instructor-linked questions with probability tracking, filtering capabilities, and provenance indicators.

## Architecture

### Data Layer

#### `instructor-catalog.json`
- **Location**: `public/data/instructor-catalog.json`
- **Purpose**: Master catalog of 28 instructor-linked questions
- **Structure**: JSON array of question objects with metadata:
  - `id`: Unique identifier (e.g., "inst-3.2-1")
  - `section`: Section number (3.2-6.2)
  - `label`: Type (Example, Suggested Exercise, Fair Game, Counter-Example)
  - `topic`: Topic/question summary
  - `example`: Example/problem description
  - `probability`: Numeric value (65-95)
  - `probabilityEmoji`: Emoji indicator (💣, 🔥, 💥, 💡)
  - `notes`: Notes & mnemonics
  - `origin`: "instructor" (to distinguish from other sources)
  - Placeholder fields: `prompt`, `choices`, `answer`, `hint`, `solution`

### Utility Layer

#### `instructorCatalog.js`
- **Location**: `src/utils/instructorCatalog.js`
- **Purpose**: Core utilities for loading and filtering instructor questions
- **Exports**:
  - `loadInstructorCatalog()`: Loads and caches catalog from JSON
  - `filterByProbability(questions, threshold)`: Filters by probability threshold
  - `filterByLabel(questions, labels)`: Filters by label type(s)
  - `filterBySection(questions, section)`: Filters by section
  - `mergeQuestionBanks(existing, instructor)`: Merges question arrays
  - `getProbabilityDisplay(probability)`: Returns display info (emoji, percentage, color)
  - `getInstructorQuestions(options)`: High-level filtered query function

#### `exam2Questions.js` (Updated)
- **Location**: `src/utils/exam2Questions.js`
- **Changes**:
  - Expanded `EXAM2_SECTIONS` to include all sections 3.2-6.2
  - Added `loadInstructorQuestions()`: Async loader with caching
  - Added `getMergedQuestionBank()`: Merge utility
  - Updated `generateExam2QuestionSet()`: Now async, supports probability filtering and weighting
  - Updated `getQuestionById()`: Now async, searches both banks
  - Updated `getQuestionBankSummary()`: Now async, includes instructor counts

### Component Layer

#### `ProbabilityFilter.jsx`
- **Location**: `src/components/exam2/ProbabilityFilter.jsx`
- **Purpose**: UI component for filtering questions by probability threshold
- **Props**:
  - `value`: Current threshold (0-95)
  - `onChange`: Callback when threshold changes
- **Features**:
  - Visual buttons for thresholds: All, ≥95%, ≥90%, ≥85%, ≥70%
  - Active state styling
  - Accessibility (ARIA roles, labels)

#### `Exam2QuestionCard.jsx` (Updated)
- **Location**: `src/components/exam2/Exam2QuestionCard.jsx`
- **Changes**:
  - Displays probability indicators (emoji + percentage) with color coding
  - Shows label badges (Fair Game, Example, etc.)
  - Shows origin indicators (👨‍🏫 instructor, 📘 textbook, 🧠 custom)
  - Fallback display for placeholder questions (shows topic/example when prompt is empty)

#### `CoverageCard.jsx` (Updated)
- **Location**: `src/components/exam2/CoverageCard.jsx`
- **Changes**:
  - Displays total question counts per section
  - Shows breakdown by origin (instructor vs other)
  - Shows instructor question badges per section

#### `Exam2PrepPage.jsx` (Updated)
- **Location**: `src/pages/Exam2PrepPage.jsx`
- **Changes**:
  - Added probability threshold state management
  - Integrated `ProbabilityFilter` component
  - Updated question generation to use async functions
  - Passes probability threshold to question generator
  - Loads summary asynchronously

## Probability System

### Thresholds and Indicators

| Threshold | Emoji | Color | Meaning |
|-----------|-------|-------|---------|
| ≥95% | 💣 | Red (#dc2626) | Almost guaranteed (Fair Game) |
| ≥90% | 🔥 | Orange (#ea580c) | High likelihood (emphasized) |
| ≥85% | 💥 | Amber (#f59e0b) | Moderate probability (suggested) |
| ≥70% | 💡 | Blue (#3b82f6) | Low probability (review) |
| <70% | 💡 | Gray (#6b7280) | Very low probability |

### Question Weighting

Questions with higher probability values are weighted more heavily during random selection:
- Probability is divided by 10 and used as a multiplier
- Example: 95% probability = weight of 9.5 (rounded to 9)
- Questions appear multiple times in the weighted pool

## Section Coverage

The system now supports all Exam 2 sections:
- **3.2**: Divisibility & Division Algorithm
- **3.3**: Modular Arithmetic
- **4.1**: Division Algorithm (Formal)
- **4.3**: GCD, LCM & Linear Combinations
- **4.4**: Recurrence Relations (existing questions)
- **4.5**: Euclidean Algorithm, Bézout, Lemmas
- **5.1**: Mathematical Induction
- **5.2**: Strong Induction & Recursion
- **6.1**: Linear Congruences
- **6.2**: Chinese Remainder Theorem

## Data Flow

1. **Initial Load**:
   - `Exam2PrepPage` mounts
   - `getQuestionBankSummary()` loads asynchronously
   - Instructor catalog is lazy-loaded on first question generation

2. **Question Generation**:
   - User selects section and/or probability threshold
   - `generateExam2QuestionSet()` is called with filters
   - Instructor questions are loaded and filtered
   - Questions are merged with existing bank
   - Weighted random selection occurs
   - Results are displayed

3. **Filtering**:
   - Probability filter updates trigger regeneration
   - Section filter updates trigger regeneration
   - Both filters can be active simultaneously

## File Structure

```
mth314-exam2/app/web-react/
├── public/
│   └── data/
│       └── instructor-catalog.json          # Master catalog (28 questions)
├── src/
│   ├── components/
│   │   └── exam2/
│   │       ├── ProbabilityFilter.jsx        # Filter UI component
│   │       ├── ProbabilityFilter.css        # Filter styles
│   │       ├── Exam2QuestionCard.jsx         # Updated with metadata display
│   │       ├── Exam2QuestionCard.css        # Updated styles
│   │       └── CoverageCard.jsx             # Updated with stats
│   ├── pages/
│   │   ├── Exam2PrepPage.jsx                # Updated integration
│   │   └── Exam2PrepPage.css                # Updated styles
│   └── utils/
│       ├── instructorCatalog.js            # Core utilities
│       └── exam2Questions.js                # Updated with async functions
└── docs/
    └── instructor-catalog-integration.md    # This file
```

## Usage Examples

### Filtering by Probability

```javascript
import { getInstructorQuestions } from '../utils/instructorCatalog.js'

// Get only high-probability questions (≥90%)
const highProbQuestions = await getInstructorQuestions({
  probabilityThreshold: 90
})
```

### Displaying Probability

```javascript
import { getProbabilityDisplay } from '../utils/instructorCatalog.js'

const display = getProbabilityDisplay(95)
// Returns: { emoji: '💣', percentage: '95%', color: '#dc2626' }
```

### Merging Question Banks

```javascript
import { mergeQuestionBanks } from '../utils/instructorCatalog.js'

const allQuestions = mergeQuestionBanks(existingQuestions, instructorQuestions)
```

## Future Enhancements

- [ ] Add filtering by label type in UI
- [ ] Add search functionality for topics/examples
- [ ] Add question editing interface for placeholders
- [ ] Add export functionality for Canvas import
- [ ] Add analytics tracking for question usage
- [ ] Add bookmarking/favorites for questions

## Testing

See `docs/testing-guide.md` for test coverage details.

## Related Documentation

- `docs/roadmap.md`: Overall project roadmap
- `docs/acceptance-criteria.md`: Feature acceptance criteria
- `docs/style-guide.md`: Code style guidelines

