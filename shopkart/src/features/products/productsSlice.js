import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../../constants'
import { apiProductListSchema, apiProductSchema } from '../../validation/schemas'

async function fetchJson(url) {
  let response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Network error. Check your connection and try again.')
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`)
  }
  return response.json()
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchJson(`${API_BASE_URL}/products`)
      const parsed = apiProductListSchema.safeParse(data)
      if (!parsed.success) {
        return rejectWithValue('Received invalid product data from the server.')
      }
      return parsed.data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load products.')
    }
  },
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchJson(`${API_BASE_URL}/products/${id}`)
      const parsed = apiProductSchema.safeParse(data)
      if (!parsed.success) {
        return rejectWithValue('Received invalid product data from the server.')
      }
      return parsed.data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load the product.')
    }
  },
)

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  selected: {
    item: null,
    status: 'idle',
    error: null,
  },
  searchQuery: '',
  category: 'all',
  sort: 'featured',
  lastFetchedAt: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload ?? ''
    },
    setCategory(state, action) {
      state.category = action.payload || 'all'
    },
    setSort(state, action) {
      state.sort = action.payload || 'featured'
    },
    clearSelected(state) {
      state.selected = { item: null, status: 'idle', error: null }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.lastFetchedAt = new Date().toISOString()
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to load products.'
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selected = { item: null, status: 'loading', error: null }
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selected = { item: action.payload, status: 'succeeded', error: null }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selected = {
          item: null,
          status: 'failed',
          error: action.payload || 'Failed to load the product.',
        }
      })
  },
})

export const { setSearchQuery, setCategory, setSort, clearSelected } =
  productsSlice.actions

export default productsSlice.reducer
