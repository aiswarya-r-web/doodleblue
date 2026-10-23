import { useSelector } from 'react-redux'
import { Package } from 'lucide-react'
import { EmptyState } from '../components/ErrorState'
import PageWrapper from '../components/PageWrapper'
import { selectOrders } from '../features/orders/ordersSlice'
import { formatCurrency } from '../utils/formatCurrency'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function OrdersPage() {
  const orders = useSelector(selectOrders)

  return (
    <PageWrapper>
      <div className="container">
        <div className="page-head">
          <h1 className="page-title">Your orders</h1>
          <p className="page-subtitle">
            Demo order history stored in this browser.
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={<Package size={28} />}
            title="No orders yet"
            message="Orders you place through the demo checkout will appear here."
            actionLabel="Browse Products"
            actionTo="/"
          />
        ) : (
          <div>
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-head">
                  <div>
                    <span className="order-label">Order</span>
                    {order.id}
                  </div>
                  <div>
                    <span className="order-label">Placed</span>
                    {formatDate(order.placedAt)}
                  </div>
                  <div>
                    <span className="order-label">Ship to</span>
                    {order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.country}
                  </div>
                  <div>
                    <span className="order-label">Items</span>
                    {order.totalItems}
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item" key={item.id}>
                      <img src={item.image} alt={item.title} />
                      <span className="oi-title">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="muted">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="order-foot">
                  <span className="muted" style={{ fontSize: 13 }}>
                    {order.couponCode
                      ? `Coupon ${order.couponCode} applied`
                      : 'No coupon applied'}
                  </span>
                  <strong>Total: {formatCurrency(order.total)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
