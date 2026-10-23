import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [], // { id, placedAt, items, subtotal, shipping, discount, total, shippingAddress, couponCode }
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: {
      reducer(state, action) {
        state.items.unshift(action.payload)
      },
      prepare(order) {
        return {
          payload: {
            ...order,
            id: `SK-${Date.now().toString(36).toUpperCase()}`,
            placedAt: new Date().toISOString(),
          },
        }
      },
    },
    clearOrders(state) {
      state.items = []
    },
  },
})

export const { addOrder, clearOrders } = ordersSlice.actions
export const selectOrders = (state) => state.orders.items

export default ordersSlice.reducer
