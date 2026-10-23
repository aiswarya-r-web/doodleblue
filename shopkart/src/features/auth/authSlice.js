import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginWithCredentials, registerAccount } from './authService'

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await loginWithCredentials(email, password)
    } catch (error) {
      return rejectWithValue(error.message || 'Sign in failed.')
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      await registerAccount(payload)
      return true
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed.')
    }
  },
)

const initialState = {
  user: null, // { id, email, name }
  token: null, // demo JWT returned by the API — never a password
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
      if (state.status === 'failed') state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Sign in failed.'
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Registration failed.'
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions

export const selectIsAuthenticated = (state) => Boolean(state.auth.token)
export const selectAuthUser = (state) => state.auth.user
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
