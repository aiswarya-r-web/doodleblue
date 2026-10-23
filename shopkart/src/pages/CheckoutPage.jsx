import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, CircleAlert, Info, ShoppingCart } from 'lucide-react'
import { EmptyState } from '../components/ErrorState'
import PageWrapper from '../components/PageWrapper'
import { clearCart } from '../features/cart/cartSlice'
import {
  selectCartItems,
  selectCouponCode,
  selectDiscount,
  selectFinalTotal,
  selectShipping,
  selectTotalItems,
  selectTotalPrice,
} from '../features/cart/cartSelectors'
import { addOrder } from '../features/orders/ordersSlice'
import { selectAuthUser } from '../features/auth/authSlice'
import { celebrateOrder } from '../utils/confettiBlast'
import { formatCurrency } from '../utils/formatCurrency'
import { checkoutSchema } from '../validation/schemas'

function CheckoutField({ id, label, error, registration, ...rest }) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="field-input"
        aria-invalid={Boolean(error)}
        {...registration}
        {...rest}
      />
      {error && (
        <p className="field-error" role="alert">
          <CircleAlert size={13} /> {error.message}
        </p>
      )}
    </div>
  )
}

function OrderSummary({ compact = false }) {
  const items = useSelector(selectCartItems)
  const totalItems = useSelector(selectTotalItems)
  const subtotal = useSelector(selectTotalPrice)
  const shipping = useSelector(selectShipping)
  const discount = useSelector(selectDiscount)
  const total = useSelector(selectFinalTotal)
  const couponCode = useSelector(selectCouponCode)

  return (
    <aside className="summary-card" aria-label="Order summary">
      <h2>Order summary</h2>
      {!compact &&
        items.map((item) => (
          <div className="summary-row" key={item.id}>
            <span
              style={{
                maxWidth: 220,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.title} × {item.quantity}
            </span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
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
          <span>Coupon {couponCode}</span>
          <span>−{formatCurrency(discount)}</span>
        </div>
      )}
      <div className="summary-row total">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </aside>
  )
}

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const totalItems = useSelector(selectTotalItems)
  const subtotal = useSelector(selectTotalPrice)
  const shipping = useSelector(selectShipping)
  const discount = useSelector(selectDiscount)
  const total = useSelector(selectFinalTotal)
  const couponCode = useSelector(selectCouponCode)
  const user = useSelector(selectAuthUser)
  const [placedOrder, setPlacedOrder] = useState(null)

  useEffect(() => {
    if (placedOrder) celebrateOrder()
  }, [placedOrder])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name ?? '',
      email: user?.email ?? '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  })

  // Demo checkout: simulate a short network delay, snapshot the order,
  // then clear the cart only after the order is stored.
  const onSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const order = {
      items: items.map((item) => ({ ...item })),
      subtotal,
      shipping,
      discount,
      total,
      totalItems,
      couponCode,
      shippingAddress: {
        fullName: values.fullName,
        email: values.email,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
      },
    }
    const action = dispatch(addOrder(order))
    dispatch(clearCart())
    setPlacedOrder(action.payload)
  }

  if (placedOrder) {
    return (
      <PageWrapper>
        <div className="container">
          <motion.div
            className="state-panel confirm-panel"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="state-icon" style={{ background: '#ecfdf5', color: 'var(--color-success)' }}>
              <CheckCircle2 size={30} />
            </span>
            <h1 className="state-title">Order placed</h1>
            <p className="state-text">
              Demo order <strong>{placedOrder.id}</strong> for{' '}
              {formatCurrency(placedOrder.total)} was recorded locally. No real
              payment was processed.
            </p>
            <div className="state-actions">
              <Link to="/orders" className="btn btn-primary">
                View orders
              </Link>
              <Link to="/" className="btn btn-outline">
                Continue shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    )
  }

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="container">
          <EmptyState
            icon={<ShoppingCart size={28} />}
            title="Nothing to check out"
            message="Your cart is empty. Add some products before checking out."
            actionLabel="Browse Products"
            actionTo="/"
          />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="container">
        <div className="page-head">
          <h1 className="page-title">Checkout</h1>
         
        </div>

        <div className="checkout-layout">
          <section className="checkout-panel" aria-label="Shipping details">
            <div
              className="alert alert-info"
              role="note"
              style={{ marginBottom: 20 }}
            >
              <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                This is a demo flow. The order is stored in your browser only.
              </span>
            </div>

            <h2>Shipping details</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <CheckoutField
                id="co-name"
                label="Full name"
                autoComplete="name"
                error={errors.fullName}
                registration={register('fullName')}
              />
              <CheckoutField
                id="co-email"
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.email}
                registration={register('email')}
              />
              <CheckoutField
                id="co-address"
                label="Street address"
                autoComplete="street-address"
                error={errors.address}
                registration={register('address')}
              />
              <div className="form-grid-2">
                <CheckoutField
                  id="co-city"
                  label="City"
                  autoComplete="address-level2"
                  error={errors.city}
                  registration={register('city')}
                />
                <CheckoutField
                  id="co-zip"
                  label="Postal code"
                  autoComplete="postal-code"
                  error={errors.postalCode}
                  registration={register('postalCode')}
                />
              </div>
              <CheckoutField
                id="co-country"
                label="Country"
                autoComplete="country-name"
                error={errors.country}
                registration={register('country')}
              />

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                style={{ marginTop: 8 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Placing
                    order...
                  </>
                ) : (
                  `Place demo order — ${formatCurrency(total)}`
                )}
              </button>
            </form>
          </section>

          <OrderSummary />
        </div>
      </div>
    </PageWrapper>
  )
}
