import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const STATUS_LABELS = {
  idle: 'API idle',
  loading: 'API loading',
  succeeded: 'API live',
  failed: 'API error',
}

export default function ApiStatus() {
  const status = useSelector((state) => state.products.status)
  return (
    <Link
      to="/status"
      className="api-status"
      title={`Products API status: ${STATUS_LABELS[status] ?? status}`}
    >
      <span className={`status-dot ${status}`} aria-hidden="true" />
      <span className="api-status-text">
        {STATUS_LABELS[status] ?? status}
      </span>
    </Link>
  )
}
