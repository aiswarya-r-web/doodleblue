import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { CircleAlert, Eye, EyeOff } from 'lucide-react'
import {
  clearAuthError,
  login,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../features/auth/authSlice'
import { loginSchema } from '../validation/schemas'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const status = useSelector(selectAuthStatus)
  const authError = useSelector(selectAuthError)
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from?.pathname || '/'
  const registered = Boolean(location.state?.registered)

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  })

  // Clear the server error as soon as the user edits the form, and when
  // leaving the page, so stale errors never linger over new input.
  useEffect(() => {
    const subscription = watch(() => dispatch(clearAuthError()))
    return () => subscription.unsubscribe()
  }, [watch, dispatch])

  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const pending = isSubmitting || status === 'loading'

  const onSubmit = async ({ email, password }) => {
    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <span className="auth-logo">
          Shop<span className="brand-accent">Kart</span>
          <span className="brand-dot">.</span>
        </span>
        <h1>Sign in</h1>
        <p className="auth-sub">Welcome back. Enter your account details.</p>

        {registered && (
          <div className="alert alert-success" role="status" style={{ marginBottom: 16 }}>
            Account created. Sign in with your new credentials below.
          </div>
        )}

        {authError && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>
            <CircleAlert size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="login-email">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              className="field-input"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              {...registerField('email')}
            />
            {errors.email && (
              <p className="field-error" id="login-email-error" role="alert">
                <CircleAlert size={13} /> {errors.email.message}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="field-input"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? 'login-password-error' : undefined
                }
                {...registerField('password')}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && (
              <p className="field-error" id="login-password-error" role="alert">
                <CircleAlert size={13} /> {errors.password.message}
              </p>
            )}
          </div>

          <div className="auth-row-between">
            <label className="checkbox-row" style={{ alignItems: 'center' }}>
              <input type="checkbox" {...registerField('rememberMe')} />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={pending}
          >
            {pending ? (
              <>
                <span className="spinner" aria-hidden="true" /> Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="auth-alt">
          New to ShopKart? <Link to="/signup">Create an account</Link>
        </p>

        <div className="demo-credentials">
          Demo account:
          <br />
          Email <code>aiswarya@gmail.com</code> · Password{' '}
          <code>Shopkart@123</code>
          <br />
          Accounts created on this device work here too.
        </div>
      </div>
    </main>
  )
}
