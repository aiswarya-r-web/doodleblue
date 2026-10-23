import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
import CouponForm from '../components/CouponForm'
import { EmptyState } from '../components/ErrorState'
import PageWrapper from '../components/PageWrapper'
import QuantityStepper from '../components/QuantityStepper'
import { FREE_SHIPPING_THRESHOLD } from '../constants'
import {
  clearCart,
  decrease,
  increase,
  removeFromCart,
} from '../features/cart/cartSlice'
import {
  selectCartItems,
  selectDiscount,
  selectFinalTotal,
  selectShipping,
  selectTotalItems,
  selectTotalPrice,
} from '../features/cart/cartSelectors'
import { formatCurrency } from '../utils/formatCurrency'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const totalItems = useSelector(selectTotalItems)
  const subtotal = useSelector(selectTotalPrice)
  const shipping = useSelector(selectShipping)
  const discount = useSelector(selectDiscount)
  const total = useSelector(selectFinalTotal)

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="container">
          <EmptyState
            icon={<ShoppingCart size={28} />}
            title="Your cart is empty"
            message="You haven't added any products yet. Browse the catalog to find something you like."
            actionLabel="Browse Products"
            actionTo="/"
          />
        </div>
      </PageWrapper>
    )
  }

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  )
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <PageWrapper>
      <div className="container">
        <div className="page-head">
          <h1 className="page-title">Shopping cart</h1>
          <p className="page-subtitle">
            {totalItems} item{totalItems === 1 ? '' : 's'} in your cart
          </p>
        </div>

        <div className="cart-layout">
          <section className="cart-panel" aria-label="Cart items">
            <div className="cart-panel-head">
              <h2>Items</h2>
              <button
                type="button"
                className="btn btn-danger-ghost"
                style={{ minHeight: 36, padding: '0 12px' }}
                onClick={() => dispatch(clearCart())}
              >
                <Trash2 size={15} /> Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <motion.div
                key={item.id}
                className="cart-item"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link
                  to={`/product/${item.id}`}
                  className="cart-item-img"
                  aria-label={`View ${item.title}`}
                >
                  <img src={item.image} alt={item.title} />
                </Link>

                <div className="cart-item-info">
                  <Link to={`/product/${item.id}`} className="cart-item-title">
                    {item.title}
                  </Link>
                  <p className="cart-item-cat">{item.category}</p>
                  <p className="cart-item-unit">
                    {formatCurrency(item.price)} each
                  </p>
                  <div className="cart-item-controls">
                    <QuantityStepper
                      small
                      value={item.quantity}
                      onIncrease={() => dispatch(increase(item.id))}
                      onDecrease={() => dispatch(decrease(item.id))}
                      label={`Quantity of ${item.title}`}
                    />
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="cart-item-right">
                  <span className="line-total">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </motion.div>
            ))}

            <div className="cart-foot">
              <Link to="/" className="btn btn-ghost">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </section>

          <aside className="summary-card" aria-label="Order summary">
            <h2>Order summary</h2>

            <div className="ship-progress">
              <div
                className="ship-progress-bar"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress toward free shipping"
              >
                <div
                  className="ship-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="ship-progress-text">
                {remainingForFreeShipping > 0 ? (
                  <>
                    Add <strong>{formatCurrency(remainingForFreeShipping)}</strong>{' '}
                    more for <strong>FREE shipping</strong>
                  </>
                ) : (
                  <strong>You've unlocked FREE shipping</strong>
                )}
              </p>
            </div>

            <div className="summary-row">
              <span>
                Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'free-ship' : ''}>
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Coupon discount</span>
                <span>−{formatCurrency(discount)}</span>
              </div>
            )}

            <div style={{ margin: '14px 0' }}>
              <CouponForm />
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: 14 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </PageWrapper>
  )
}
