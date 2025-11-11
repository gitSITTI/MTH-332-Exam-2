import { useState, useEffect } from 'react'
import { loadQuizSettings, saveQuizSettings, getDefaultSettings } from '../utils/quizStorage.js'
import './QuizSettings.css'

function QuizSettings({ onSettingsChange }) {
  const [settings, setSettings] = useState(getDefaultSettings())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = loadQuizSettings()
    if (saved) {
      setSettings({ ...getDefaultSettings(), ...saved })
    }
  }, [])

  useEffect(() => {
    saveQuizSettings(settings)
    onSettingsChange?.(settings)
  }, [settings, onSettingsChange])

  const handleToggle = key => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="quiz-settings">
      <button
        type="button"
        className="quiz-settings__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="quiz-settings-panel"
        aria-label="Quiz settings"
      >
        <span className="quiz-settings__icon" aria-hidden="true">
          ⚙️
        </span>
        <span className="quiz-settings__label">Settings</span>
      </button>

      {isOpen && (
        <div
          id="quiz-settings-panel"
          className="quiz-settings__panel"
          role="dialog"
          aria-labelledby="quiz-settings-title"
        >
          <div className="quiz-settings__header">
            <h3 id="quiz-settings-title" className="quiz-settings__title">
              Quiz Settings
            </h3>
            <button
              type="button"
              className="quiz-settings__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close settings"
            >
              ×
            </button>
          </div>

          <div className="quiz-settings__content">
            <label className="quiz-settings__option">
              <input
                type="checkbox"
                checked={settings.shuffleQuestions}
                onChange={() => handleToggle('shuffleQuestions')}
                aria-describedby="shuffle-questions-desc"
              />
              <span className="quiz-settings__option-label">Shuffle questions</span>
              <span id="shuffle-questions-desc" className="quiz-settings__option-desc">
                Randomize the order of questions for each quiz attempt
              </span>
            </label>

            <label className="quiz-settings__option">
              <input
                type="checkbox"
                checked={settings.practiceMode}
                onChange={() => handleToggle('practiceMode')}
                aria-describedby="practice-mode-desc"
              />
              <span className="quiz-settings__option-label">Practice mode</span>
              <span id="practice-mode-desc" className="quiz-settings__option-desc">
                Highlight correct answers and display explanations while you work through questions
              </span>
            </label>

            <label className="quiz-settings__option">
              <input
                type="checkbox"
                checked={settings.showExplanations}
                onChange={() => handleToggle('showExplanations')}
                aria-describedby="show-explanations-desc"
              />
              <span className="quiz-settings__option-label">Show explanations</span>
              <span id="show-explanations-desc" className="quiz-settings__option-desc">
                Display explanations after submitting answers
              </span>
            </label>

            <div className="quiz-settings__section">
              <h4 className="quiz-settings__section-title">Keyboard Shortcuts</h4>
              <dl className="quiz-settings__shortcuts">
                <div className="quiz-settings__shortcut">
                  <dt className="quiz-settings__shortcut-key">← →</dt>
                  <dd className="quiz-settings__shortcut-desc">Navigate questions</dd>
                </div>
                <div className="quiz-settings__shortcut">
                  <dt className="quiz-settings__shortcut-key">1-9</dt>
                  <dd className="quiz-settings__shortcut-desc">Select choice by number</dd>
                </div>
                <div className="quiz-settings__shortcut">
                  <dt className="quiz-settings__shortcut-key">A-I</dt>
                  <dd className="quiz-settings__shortcut-desc">Select choice by letter</dd>
                </div>
                <div className="quiz-settings__shortcut">
                  <dt className="quiz-settings__shortcut-key">Enter</dt>
                  <dd className="quiz-settings__shortcut-desc">Submit quiz</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizSettings

