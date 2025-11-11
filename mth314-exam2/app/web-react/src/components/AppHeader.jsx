import { Link, NavLink } from 'react-router-dom'
import './AppHeader.css'

const navLinkClass = ({ isActive }) =>
  `app-nav__link${isActive ? ' app-nav__link--active' : ''}`

function AppHeader({ theme = 'midnight', onThemeChange, themeOptions = [] }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <Link to="/" className="brand-link">
          <span className="brand-title">MTH 314 Quiz Trainer</span>
          <span className="brand-subtitle">Exam 2 practice sessions</span>
        </Link>
      </div>
      <div className="app-header__actions">
        <nav className="app-nav" aria-label="Primary">
          <NavLink to="/" className={navLinkClass} end>
            Lectures
          </NavLink>
        </nav>
        {themeOptions.length > 0 && (
          <select
            id="theme-selector"
            className="theme-switcher"
            value={theme}
            onChange={event => onThemeChange?.(event.target.value)}
            aria-label="Change visual theme"
          >
            {themeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </header>
  )
}

export default AppHeader


