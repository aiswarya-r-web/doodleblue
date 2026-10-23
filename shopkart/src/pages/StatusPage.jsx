import { useDispatch, useSelector } from 'react-redux'
import { Activity, RotateCcw } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { API_BASE_URL } from '../constants'
import { fetchProducts } from '../features/products/productsSlice'

const STATUS_LABELS = {
  idle: 'Idle',
  loading: 'Loading',
  succeeded: 'Connected',
  failed: 'Error',
}

function StatusPill({ status }) {
  return (
    <span className="status-pill">
      <span className={`status-dot ${status}`} aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function formatTime(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return '—'
  }
}

export default function StatusPage() {
  const dispatch = useDispatch()
  const { status, error, items, lastFetchedAt, selected } = useSelector(
    (state) => state.products,
  )
  const authStatus = useSelector((state) => state.auth.status)
  const cartCount = useSelector((state) => state.cart.items.length)

  const productSelectedStatus =
    selected.status === 'idle'
      ? 'idle'
      : selected.status === 'succeeded'
        ? 'succeeded'
        : selected.status

  return (
    <PageWrapper>
      <div className="container">
        <div className="page-head">
          <h1 className="page-title">
            <Activity size={22} style={{ verticalAlign: -3, marginRight: 8 }} />
            Network status
          </h1>
          <p className="page-subtitle">
            Live request state for the Fake Store API. Open browser DevTools →
            Network to inspect the raw requests.
          </p>
        </div>

        <div className="cart-panel" style={{ padding: '4px 0 8px' }}>
          <table className="status-table">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>GET {API_BASE_URL}/products</code>
                </td>
                <td>
                  <StatusPill status={status} />
                </td>
                <td>
                  {status === 'succeeded' && (
                    <span className="muted">
                      {items.length} products · last fetch{' '}
                      {formatTime(lastFetchedAt)}
                    </span>
                  )}
                  {status === 'loading' && (
                    <span className="muted">Request in flight…</span>
                  )}
                  {status === 'failed' && (
                    <span style={{ color: 'var(--color-danger)' }}>{error}</span>
                  )}
                  {status === 'idle' && (
                    <span className="muted">Not requested yet</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <code>GET {API_BASE_URL}/products/:id</code>
                </td>
                <td>
                  <StatusPill status={productSelectedStatus} />
                </td>
                <td>
                  {selected.status === 'succeeded' && selected.item && (
                    <span className="muted">
                      Product #{selected.item.id} loaded
                    </span>
                  )}
                  {selected.status === 'loading' && (
                    <span className="muted">Request in flight…</span>
                  )}
                  {selected.status === 'failed' && (
                    <span style={{ color: 'var(--color-danger)' }}>
                      {selected.error}
                    </span>
                  )}
                  {selected.status === 'idle' && (
                    <span className="muted">Fetched when a product page opens</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <code>GET {API_BASE_URL}/users</code> +{' '}
                  <code>/auth/login</code>
                </td>
                <td>
                  <StatusPill
                    status={
                      authStatus === 'succeeded'
                        ? 'succeeded'
                        : authStatus === 'loading'
                          ? 'loading'
                          : authStatus === 'failed'
                            ? 'failed'
                            : 'idle'
                    }
                  />
                </td>
                <td>
                  <span className="muted">
                    Used during sign-in · cart has {cartCount}{' '}
                    {cartCount === 1 ? 'line' : 'lines'} persisted locally
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="state-actions" style={{ justifyContent: 'flex-start', marginTop: 18 }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => dispatch(fetchProducts())}
            disabled={status === 'loading'}
          >
            <RotateCcw size={16} /> Refetch products
          </button>
        </div>
      </div>
    </PageWrapper>
  )
}
