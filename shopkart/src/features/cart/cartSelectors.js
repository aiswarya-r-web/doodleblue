import { createSelector } from '@reduxjs/toolkit'
import {
  computeShipping,
  computeSubtotal,
  computeTotal,
} from '../../utils/cartCalculations'
import { computeCouponDiscount, resolveCoupon } from '../../utils/coupons'

export const selectCartItems = (state) => state.cart.items
export const selectCouponCode = (state) => state.cart.couponCode

export const selectTotalItems = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
)

export const selectTotalPrice = createSelector([selectCartItems], (items) =>
  computeSubtotal(items),
)

export const selectCartItemById = (state, id) =>
  state.cart.items.find((item) => item.id === id)

export const selectAppliedCoupon = createSelector([selectCouponCode], (code) =>
  code ? resolveCoupon(code) : null,
)

export const selectDiscount = createSelector(
  [selectAppliedCoupon, selectTotalPrice],
  (coupon, subtotal) => computeCouponDiscount(coupon, subtotal),
)

export const selectShipping = createSelector([selectTotalPrice], (subtotal) =>
  computeShipping(subtotal),
)

export const selectFinalTotal = createSelector(
  [selectTotalPrice, selectShipping, selectDiscount],
  (subtotal, shipping, discount) => computeTotal(subtotal, shipping, discount),
)
