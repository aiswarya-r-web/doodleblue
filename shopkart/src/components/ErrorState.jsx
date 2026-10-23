import { AlertTriangle, RotateCcw, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <motion.div
      className="state-panel"
      role="alert"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="state-icon error">
        <AlertTriangle size={28} />
      </span>
      <h2 className="state-title">{title}</h2>
      {message && <p className="state-text">{message}</p>}
      {onRetry && (
        <div className="state-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            <RotateCcw size={16} /> Try again
          </button>
        </div>
      )}
    </motion.div>
  )
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  actionTo = '/',
  onClear,
}) {
  return (
    <motion.div
      className="state-panel"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="state-icon">{icon ?? <ShoppingCart size={28} />}</span>
      <h2 className="state-title">{title}</h2>
      {message && <p className="state-text">{message}</p>}
      <div className="state-actions">
        {actionLabel && (
          <Link to={actionTo} className="btn btn-primary">
            {actionLabel}
          </Link>
        )}
        {onClear && (
          <button type="button" className="btn btn-outline" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </motion.div>
  )
}
