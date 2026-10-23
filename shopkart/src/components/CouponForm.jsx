import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { CircleAlert, Tag, X } from 'lucide-react'
import { applyCoupon, removeCoupon } from '../features/cart/cartSlice'
import { selectAppliedCoupon } from '../features/cart/cartSelectors'
import { resolveCoupon } from '../utils/coupons'
import { couponSchema } from '../validation/schemas'

export default function CouponForm() {
  const dispatch = useDispatch()
  const appliedCoupon = useSelector(selectAppliedCoupon)
  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', message }

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: '' },
  })

  const onSubmit = ({ code }) => {
    const coupon = resolveCoupon(code)
    if (!coupon) {
      setFeedback(null)
      setError('code', { message: 'This coupon code is not valid.' })
      return
    }
    if (appliedCoupon?.code === coupon.code) {
      setFeedback({ type: 'error', message: `${coupon.code} is already applied.` })
      return
    }
    dispatch(applyCoupon(coupon.code))
    setFeedback({ type: 'success', message: `${coupon.code} applied — ${coupon.description}.` })
    reset({ code: '' })
  }

  const handleRemove = () => {
    dispatch(removeCoupon())
    setFeedback(null)
  }

  if (appliedCoupon) {
    return (
      <div>
        <div className="applied-coupon">
          <span>
            <Tag size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            {appliedCoupon.code} — {appliedCoupon.description}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove coupon"
          >
            <X size={15} />
          </button>
        </div>
        <p className="field-hint" style={{ marginTop: 6 }}>
          Demo coupon — not provided by the Fake Store API.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="coupon-code" className="field-label">
        Coupon code
      </label>
      <div className="coupon-row">
        <input
          id="coupon-code"
          className="field-input"
          placeholder="e.g. WELCOME10"
          autoComplete="off"
          aria-invalid={Boolean(errors.code)}
          aria-describedby={errors.code ? 'coupon-error' : 'coupon-hint'}
          {...register('code')}
        />
        <button
          type="submit"
          className="btn btn-outline"
          disabled={isSubmitting}
          style={{ height: 42 }}
        >
          Apply
        </button>
      </div>
      {errors.code ? (
        <p className="field-error" id="coupon-error" role="alert">
          <CircleAlert size={13} /> {errors.code.message}
        </p>
      ) : (
        <p className="field-hint" id="coupon-hint" style={{ marginTop: 6 }}>
          Demo coupons: WELCOME10 (10% off), SHOP5 ($5 off).
        </p>
      )}
      {feedback && (
        <p
          className={feedback.type === 'success' ? 'field-hint' : 'field-error'}
          style={feedback.type === 'success' ? { color: 'var(--color-success)', marginTop: 6 } : { marginTop: 6 }}
          role="status"
        >
          {feedback.message}
        </p>
      )}
    </form>
  )
}
