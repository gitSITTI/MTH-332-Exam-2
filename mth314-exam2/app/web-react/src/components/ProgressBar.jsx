import './ProgressBar.css'

function ProgressBar({ current, total }) {
  const clampedTotal = Math.max(total, 1)
  const percentage = Math.min(100, Math.max(0, (current / clampedTotal) * 100))

  return (
    <div className="progress" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={clampedTotal}>
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="progress__label">
        {current} of {clampedTotal} answered
      </span>
    </div>
  )
}

export default ProgressBar


