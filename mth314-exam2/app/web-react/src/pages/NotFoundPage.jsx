import { Link } from 'react-router-dom'
import './NotFoundPage.css'

function NotFoundPage() {
  return (
    <div className="page page--notfound">
      <h1>Page not found</h1>
      <p>We couldn&apos;t find that view. Head back to the lecture list to continue studying.</p>
      <Link to="/" className="page--notfound__link">
        Back to lectures
      </Link>
    </div>
  )
}

export default NotFoundPage


