# React Quiz App Plan

## Application Structure

### Main Categories
- **Exam 2** (Primary focus) - Sections 3.2 through 6.2
  - 3.2: Divisibility & Division Algorithm
  - 3.3: Modular Arithmetic
  - 4.1: Division Algorithm (Formal)
  - 4.2: Prime Numbers
  - 4.3: GCD, LCM & Linear Combinations
  - 4.4: Congruence Properties
  - 4.5: Euclidean Algorithm, Bézout, Lemmas
  - 5.1: Mathematical Induction
  - 5.2: Strong Induction & Recursion
  - 6.1-6.2: Sequences & Recurrence Relations
- **Exam 1** (Future) - Can be collected later, not priority

### Tools Architecture
- **Venn Diagram Tool** - General-purpose tool used throughout the program, not section-specific
- **Future Tools Section** - Centralized location where users can:
  - Select which tool to use (Venn, Number Theory calculators, etc.)
  - Choose which Exam 2 section to test on
  - Filter questions by tool compatibility

### Memory/Answer Display Setting
- When enabled: Shows answers on all questions where an answer has been selected
- Allows students to review their work and see correct answers after attempting

## 1. Requirements & UX Definition

- Confirm desired quiz flows (section selection, question answering, scoring feedback).
- Produce wireframes for landing, Exam 2 prep, and results views.
- Define data contract for questions (id, section, prompt, options, correctIndex, explanation, toolCompatibility).
- Design Exam 2 section navigation structure.

## 2. Frontend Foundations

- Initialize (or verify) Vite + React project in `app/web-react/` with linting and testing (ESLint, Prettier, Vitest, React Testing Library).
- Establish routing: `/` for home, `/exam2` for Exam 2 prep, `/exam2/:section` for specific sections, `/tools` for tools section (future).
- Configure global styles and shared layout components.
- Set up Exam 2 as main category with section navigation.

## 3. Data Preparation

- Transform existing question sources (e.g., `public/qbank/drafts.jsonl`, transcripts) into normalized JSON accessible to the client.
- Organize questions by Exam 2 sections (3.2-6.2).
- Implement a loader/util in `src/utils/` to fetch and map questions by section.
- Add `toolCompatibility` field to questions (e.g., ["venn", "number-theory", "none"]).
- Provide mock dataset for development and unit tests.

## 4. Feature Implementation

### Exam 2 Integration (Phase 1 - Current Priority)
- Integrate 4 existing interactive modules into Exam2PrepPage:
  - Linear Congruence Solver (Section 4.4)
  - CRT Module (Section 4.4)
  - GCD/LCM Module (Section 4.5)
  - Induction Fill-ins (Section 5.1)
- Add Tailwind CSS support and shadcn/ui components
- Convert TypeScript modules to JavaScript
- Create section-specific tool containers (Section4_4Tools, Section4_5Tools, Section5_1Tools)
- Integrate tools to show when corresponding sections are selected

### Question Bank Components
- Build UI components: `SectionList`, `QuestionCard`, `QuizControls`, `ProgressBar`, `ScoreSummary` in `src/components/exam2/`.
- Implement quiz state management (React Context) to track current question, selected answers, and score.
- Add answer selection handling, navigation (next/previous), and immediate or post-quiz feedback.
- Create results screen summarizing correct/incorrect answers and offering restart.

### Tools Integration
- Refactor Venn Diagram tool to be section-agnostic
- Add tool compatibility metadata to questions
- Prepare foundation for future Tools section

## 5. Enhancements & Persistence

- Store quiz progress in `localStorage` to resume sessions.
- Add settings:
  - Memory/Answer display toggle (show answers when selected)
  - Shuffle questions toggle
  - Show explanations toggle
- Ensure accessibility (keyboard navigation, ARIA roles).

## 6. Question Bank Expansion (Phase 2)

- Add questions for sections 3.2-3.3 (Divisibility & Modular Arithmetic)
- Add questions for sections 4.1-4.3 (Division Algorithm, Primes, GCD/LCM)
- Add questions for section 5.2 (Strong Induction)
- Add questions for sections 6.1-6.2 (Sequences & Recurrences)
- Base questions on professor's suggested exercises from m314book1-25.pdf

## 7. Future Tools Section (Phase 3)

- Create centralized Tools page
- Allow tool selection (Venn Diagram, Number Theory calculators, etc.)
- Filter questions by tool compatibility and Exam 2 section
- Enable section-specific tool practice

## 8. Testing & QA

- Write unit tests for state logic and key components.
- Add integration test covering full quiz flow with Vitest/RTL.
- Test Exam 2 section navigation and tool integration.
- Conduct manual QA per browser (Chrome, Firefox, Safari) and document findings.

## 9. Documentation & Release

- Update `README.md` with setup, scripts, and usage instructions.
- Document architecture and future improvements in `docs/roadmap.md`.
- Document Exam 2 structure and section organization.
- Prepare demo script and gather feedback before declaring v1 complete.

## Progress Log

- **2025-11-11:** Delivered the Venn diagram trainer feature set.
  - Implemented `src/utils/vennUtils.js` with region metadata, expression parsing, selection helpers, and randomized 2- / 3-set operations.
  - Built trainer UI components (`VennDiagram`, `RegionSelector`, `VennQuestion`, `VennControls`) plus dedicated styling under `src/components/venn/`.
  - Added the routed `VennTrainerPage` with layout/styles and surfaced it through new navigation links (`App.jsx`, `AppHeader.jsx`).
  - Cleaned up supporting utilities (keyboard navigation hook, exam header) to satisfy ESLint and verified the suite with `npm run lint` and `npm test`.

### To-dos

- [ ] Integrate 4 existing modules into Exam2PrepPage (Phase 1)
- [ ] Expand question bank for sections 3.2-6.2 (Phase 2)
- [ ] Refactor Venn Diagram as general tool (Phase 3)
- [ ] Create Tools section for centralized tool access (Phase 3)
