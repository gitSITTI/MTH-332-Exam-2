import './Exam2QuestionCard.css'

function TopicPill({ label, value, isActive = false, onClick }) {
  const Component = onClick ? 'button' : 'span'
  const componentProps = onClick
    ? { type: 'button', onClick }
    : {
        role: 'text',
      }

  return (
    <Component className={`exam2-pill${isActive ? ' exam2-pill--active' : ''}`} {...componentProps}>
      <span className="exam2-pill__label">{label}</span>
      {typeof value === 'number' && <span className="exam2-pill__value">{value}</span>}
    </Component>
  )
}

export default TopicPill

