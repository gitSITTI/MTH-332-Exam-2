import { useEffect, useMemo, useState } from 'react'
import VennControls from '../components/venn/VennControls.jsx'
import VennDiagram from '../components/venn/VennDiagram.jsx'
import VennQuestion from '../components/venn/VennQuestion.jsx'
import RegionSelector from '../components/venn/RegionSelector.jsx'
import {
  getOperationPool,
  isSelectionMatch,
  pickRandomOperation,
} from '../utils/vennUtils.js'
import './VennTrainerPage.css'

const STATUS_IDLE = 'idle'
const STATUS_EMPTY = 'empty'
const STATUS_CORRECT = 'correct'
const STATUS_INCORRECT = 'incorrect'
const STATUS_REVEALED = 'revealed'

function createEmptySet() {
  return new Set()
}

function VennTrainerPage() {
  const [setCount, setSetCount] = useState(2)
  const [selectedRegions, setSelectedRegions] = useState(() => createEmptySet())
  const [highlightedRegions, setHighlightedRegions] = useState(() => createEmptySet())
  const [status, setStatus] = useState(STATUS_IDLE)
  const [attempts, setAttempts] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(1)
  const [currentOperation, setCurrentOperation] = useState(() => pickRandomOperation(2))

  const operationPool = useMemo(() => getOperationPool(setCount), [setCount])

  useEffect(() => {
    if (operationPool.length === 0) {
      return
    }
    const nextOperation = pickRandomOperation(setCount)
    setCurrentOperation(nextOperation)
    setSelectedRegions(createEmptySet())
    setHighlightedRegions(createEmptySet())
    setStatus(STATUS_IDLE)
    setAttempts(0)
    setQuestionIndex(1)
  }, [operationPool.length, setCount])

  const showSolution = status === STATUS_CORRECT || status === STATUS_REVEALED

  function toggleSetCount(nextCount) {
    if (nextCount === setCount) {
      return
    }
    setSetCount(nextCount)
  }

  function toggleRegion(regionId) {
    setSelectedRegions(previous => {
      const next = new Set(previous)
      if (next.has(regionId)) {
        next.delete(regionId)
      } else {
        next.add(regionId)
      }
      return next
    })

    if (status !== STATUS_IDLE) {
      setStatus(STATUS_IDLE)
      setHighlightedRegions(createEmptySet())
    }
  }

  function handleReset() {
    setSelectedRegions(createEmptySet())
    setHighlightedRegions(createEmptySet())
    setStatus(STATUS_IDLE)
  }

  function handleAnswer() {
    if (!currentOperation) {
      return
    }

    setAttempts(previous => previous + 1)

    if (selectedRegions.size === 0) {
      setStatus(STATUS_EMPTY)
      setHighlightedRegions(createEmptySet())
      return
    }

    const target = new Set(currentOperation.regions)
    const isCorrect = isSelectionMatch(selectedRegions, target)

    if (isCorrect) {
      setStatus(STATUS_CORRECT)
      setHighlightedRegions(target)
    } else {
      setStatus(STATUS_INCORRECT)
      setHighlightedRegions(createEmptySet())
    }
  }

  function handleNotYet() {
    if (!currentOperation) {
      return
    }
    setStatus(STATUS_REVEALED)
    setHighlightedRegions(new Set(currentOperation.regions))
  }

  function handleNext() {
    if (operationPool.length === 0) {
      return
    }

    const currentId = currentOperation?.id
    let nextOperation = pickRandomOperation(setCount)

    if (operationPool.length > 1) {
      let guard = 0
      while (nextOperation.id === currentId && guard < 10) {
        nextOperation = pickRandomOperation(setCount)
        guard += 1
      }
    }

    setCurrentOperation(nextOperation)
    setSelectedRegions(createEmptySet())
    setHighlightedRegions(createEmptySet())
    setStatus(STATUS_IDLE)
    setAttempts(0)
    setQuestionIndex(previous => previous + 1)
  }

  const answerDisabled = status === STATUS_CORRECT || status === STATUS_REVEALED
  const notYetDisabled = status === STATUS_REVEALED
  const resetDisabled = status === STATUS_IDLE && selectedRegions.size === 0

  return (
    <div className="venn-trainer">
      <header className="venn-trainer__header">
        <div>
          <h1 className="venn-trainer__title">Venn Diagram Trainer</h1>
          <p className="venn-trainer__subtitle">
            Practice set operations visually. Select the regions that match the target expression.
          </p>
        </div>
        <div className="venn-trainer__question-meta">
          <span className="venn-trainer__meta-label">Question</span>
          <span className="venn-trainer__meta-value">{questionIndex}</span>
        </div>
      </header>

      <div className="venn-trainer__controls-bar" role="group" aria-label="Choose number of sets">
        {[2, 3].map(count => (
          <button
            key={count}
            type="button"
            className={[
              'venn-trainer__set-toggle',
              setCount === count ? 'venn-trainer__set-toggle--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => toggleSetCount(count)}
            aria-pressed={setCount === count}
          >
            {count}-Set
          </button>
        ))}
      </div>

      {currentOperation && (
        <div className="venn-trainer__layout">
          <VennQuestion
            expression={currentOperation.expression}
            setCount={setCount}
            attempts={attempts}
            status={status}
            targetRegions={currentOperation.regions}
            showSolution={showSolution}
          />

          <div className="venn-trainer__diagram-card">
            <VennDiagram
              setCount={setCount}
              selectedRegions={selectedRegions}
              highlightRegions={highlightedRegions}
              onRegionToggle={toggleRegion}
            />

            <RegionSelector
              setCount={setCount}
              selectedRegions={selectedRegions}
              onToggleRegion={toggleRegion}
            />
          </div>

          <VennControls
            onReset={handleReset}
            onAnswer={handleAnswer}
            onNotYet={handleNotYet}
            onNext={handleNext}
            isResetDisabled={resetDisabled}
            isAnswerDisabled={answerDisabled}
            isNotYetDisabled={notYetDisabled}
          />
        </div>
      )}
    </div>
  )
}

export default VennTrainerPage


