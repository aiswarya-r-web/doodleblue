import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [], // { id, title, price, image, category, rating }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload
      if (!product || product.id == null) return
      const index = state.items.findIndex((item) => item.id === product.id)
      if (index === -1) {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating,
        })
      } else {
        state.items.splice(index, 1)
      }
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearWishlist(state) {
      state.items = []
    },
  },
})

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions

export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length
export const selectIsWishlisted = (state, id) =>
  state.wishlist.items.some((item) => item.id === id)

export default wishlistSlice.reducer
