import { Link, NavLink } from 'react-router-dom'
import './AppHeader.css'

const navLinkClass = ({ isActive }) =>
  `app-nav__link${isActive ? ' app-nav__link--active' : ''}`

function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <Link to="/" className="brand-link">
          <span className="brand-title">MTH 314 Quiz Trainer</span>
          <span className="brand-subtitle">Exam 2 practice sessions</span>
        </Link>
      </div>
      <nav className="app-nav" aria-label="Primary">
        <NavLink to="/" className={navLinkClass} end>
          Lectures
        </NavLink>
      </nav>
    </header>
  )
}

export default AppHeader


