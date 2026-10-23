import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import storage from './storage'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import ordersReducer from '../features/orders/ordersSlice'
import productsReducer from '../features/products/productsSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'

// Cart, wishlist, orders and the auth session survive refresh. The
// products slice holds transient API state (status/error) and is not
// persisted so stale loading or error flags never rehydrate.
const persistConfig = {
  key: 'shopkart',
  storage,
  whitelist: ['cart', 'wishlist', 'orders', 'auth'],
}

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  orders: ordersReducer,
  auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
