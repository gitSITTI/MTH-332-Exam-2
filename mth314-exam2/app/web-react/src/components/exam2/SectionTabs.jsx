import TopicPill from './TopicPill.jsx'
import { EXAM2_SECTIONS } from '../../utils/exam2Questions.js'

const ALL_OPTION = 'all'

function SectionTabs({ activeSection = ALL_OPTION, onChange }) {
  const options = [ALL_OPTION, ...EXAM2_SECTIONS]

  return (
    <nav className="exam2-tabs" aria-label="Exam 2 sections">
      {options.map(option => (
        <TopicPill
          key={option}
          label={option === ALL_OPTION ? 'All sections' : `Section ${option}`}
          isActive={activeSection === option}
          onClick={() => onChange?.(option)}
        />
      ))}
    </nav>
  )
}

SectionTabs.ALL = ALL_OPTION

export default SectionTabs

