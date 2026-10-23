import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { selectIsAuthenticated } from '../features/auth/authSlice'

// Returns a guard function: true when authenticated, otherwise it
// redirects to /login preserving the current location so the user is
// sent back after signing in.
export function useRequireAuth() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const location = useLocation()

  return () => {
    if (isAuthenticated) return true
    toast.error('Sign in to add items to your cart')
    navigate('/login', { state: { from: location } })
    return false
  }
}
