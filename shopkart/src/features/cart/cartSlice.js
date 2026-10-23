import { createSlice } from '@reduxjs/toolkit'
import { normalizeCouponCode, resolveCoupon } from '../../utils/coupons'

const toValidQuantity = (value, fallback = 1) => {
  const qty = Math.floor(Number(value))
  if (!Number.isFinite(qty) || qty < 1) return fallback
  return Math.min(qty, 99)
}

const initialState = {
  items: [], // { id, title, price, image, category, quantity }
  couponCode: null, // normalized demo coupon code or null
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, title, price, image, category } = action.payload || {}
      const quantity = toValidQuantity(action.payload?.quantity)
      if (id == null || !Number.isFinite(Number(price))) return
      const existing = state.items.find((item) => item.id === id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, 99)
      } else {
        state.items.push({ id, title, price, image, category, quantity })
      }
    },
    increase(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload)
      if (item) item.quantity = Math.min(item.quantity + 1, 99)
    },
    decrease(state, action) {
      const index = state.items.findIndex((entry) => entry.id === action.payload)
      if (index === -1) return
      if (state.items[index].quantity <= 1) {
        state.items.splice(index, 1)
      } else {
        state.items[index].quantity -= 1
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((entry) => entry.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
      state.couponCode = null
    },
    applyCoupon(state, action) {
      const coupon = resolveCoupon(action.payload)
      if (coupon) state.couponCode = coupon.code
    },
    removeCoupon(state) {
      state.couponCode = null
    },
  },
})

export const {
  addToCart,
  increase,
  decrease,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions

export default cartSlice.reducer

export { normalizeCouponCode }
