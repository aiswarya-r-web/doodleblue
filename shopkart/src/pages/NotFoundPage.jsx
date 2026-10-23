import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <div className="container">
        <div className="state-panel">
          <div className="notfound-code">404</div>
          <h1 className="state-title">Page not found</h1>
          <p className="state-text">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="state-actions">
            <Link to="/" className="btn btn-primary">
              Back to products
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
