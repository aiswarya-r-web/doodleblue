import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../constants'

export function roundMoney(value) {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100
}

export function computeSubtotal(items) {
  return roundMoney(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )
}

// The free-shipping threshold is evaluated against the merchandise
// subtotal BEFORE any coupon discount is applied.
export function computeShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
}

// Final payable amount can never go below zero.
export function computeTotal(subtotal, shipping, discount) {
  return roundMoney(Math.max(0, subtotal + shipping - discount))
}

export function computeSummary(items, discount = 0) {
  const subtotal = computeSubtotal(items)
  const shipping = computeShipping(subtotal)
  const total = computeTotal(subtotal, shipping, discount)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  return { subtotal, shipping, discount: roundMoney(discount), total, totalItems }
}
