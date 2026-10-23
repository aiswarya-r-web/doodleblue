import { DEMO_COUPONS } from '../constants'
import { roundMoney } from './cartCalculations'

export function normalizeCouponCode(code) {
  return (code ?? '').trim().toUpperCase()
}

// Resolves a raw user-entered code to a demo coupon definition, or null
// when the code is unknown. Coupons are demo offers only.
export function resolveCoupon(code) {
  const normalized = normalizeCouponCode(code)
  if (!normalized) return null
  return DEMO_COUPONS[normalized] ?? null
}

// Returns the discount amount for a coupon applied to a merchandise
// subtotal. The discount is clamped so it never exceeds the subtotal.
export function computeCouponDiscount(coupon, subtotal) {
  if (!coupon || !Number.isFinite(subtotal) || subtotal <= 0) return 0
  const raw =
    coupon.type === 'percent'
      ? (subtotal * coupon.value) / 100
      : coupon.value
  return roundMoney(Math.min(subtotal, Math.max(0, raw)))
}
