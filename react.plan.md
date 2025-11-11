# React Quiz App Plan

## 1. Requirements & UX Definition

- Confirm desired quiz flows (lecture selection, question answering, scoring feedback).
- Produce wireframes for landing, quiz, and results views.
- Define data contract for questions (id, lectureId, prompt, options, correctIndex, explanation).

## 2. Frontend Foundations

- Initialize (or verify) Vite + React project in `app/web-react/` with linting and testing (ESLint, Prettier, Vitest, React Testing Library).
- Establish routing: `/` for lecture list, `/quiz/:lectureId` for sessions.
- Configure global styles and shared layout components.

## 3. Data Preparation

- Transform existing question sources (e.g., `public/qbank/drafts.jsonl`, transcripts) into normalized JSON accessible to the client.
- Implement a loader/util in `src/utils/` to fetch and map questions by lecture.
- Provide mock dataset for development and unit tests.

## 4. Feature Implementation

- Build UI components: `LectureList`, `QuestionCard`, `QuizControls`, `ProgressBar`, `ScoreSummary` in `src/components/`.
- Implement quiz state management (React Context or Zustand) to track current question, selected answers, and score.
- Add answer selection handling, navigation (next/previous), and immediate or post-quiz feedback.
- Create results screen summarizing correct/incorrect answers and offering restart.

## 5. Enhancements & Persistence (Optional)

- Store quiz progress in `localStorage` to resume sessions.
- Add settings (shuffle questions, show explanations toggles).
- Ensure accessibility (keyboard navigation, ARIA roles).

## 6. Testing & QA

- Write unit tests for state logic and key components.
- Add integration test covering full quiz flow with Vitest/RTL (or Cypress if chosen).
- Conduct manual QA per browser (Chrome, Firefox, Safari) and document findings.

## 7. Documentation & Release

- Update `README.md` with setup, scripts, and usage instructions.
- Document architecture and future improvements in `docs/roadmap.md`.
- Prepare demo script and gather feedback before declaring v1 complete.

## Progress Log

- **2025-11-11:** Added a Venn diagram trainer experience with supportive utilities (`vennUtils.js`), UI components (diagram, region selector, question, controls), a routed `VennTrainerPage`, navigation entry, and styling; lint/tests green.

