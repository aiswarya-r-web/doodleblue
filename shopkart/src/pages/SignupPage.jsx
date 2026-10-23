import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CircleAlert, Eye, EyeOff } from 'lucide-react'
import {
  clearAuthError,
  register as registerAccount,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../features/auth/authSlice'
import { signupSchema } from '../validation/schemas'

function passwordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#edf0f5' }
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  const levels = [
    { label: 'Very weak', color: '#dc2626' },
    { label: 'Weak', color: '#ea580c' },
    { label: 'Fair', color: '#d97706' },
    { label: 'Good', color: '#65a30d' },
    { label: 'Strong', color: '#16a34a' },
    { label: 'Excellent', color: '#1f6f5a' },
  ]
  return { score, ...levels[Math.min(score, levels.length - 1)] }
}

export default function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const status = useSelector(selectAuthStatus)
  const authError = useSelector(selectAuthError)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  const password = watch('password')
  const strength = passwordStrength(password)

  if (isAuthenticated) return <Navigate to="/" replace />

  const pending = isSubmitting || status === 'loading'

  const onSubmit = async ({ fullName, email, password: pwd }) => {
    const result = await dispatch(
      registerAccount({ fullName, email, password: pwd }),
    )
    if (registerAccount.fulfilled.match(result)) {
      navigate('/login', { state: { registered: true } })
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <span className="auth-logo">
          Shop<span className="brand-accent">Kart</span>
          <span className="brand-dot">.</span>
        </span>
        <h1>Create account</h1>
        <p className="auth-sub">
          Demo registration — your account is stored securely on this device.
        </p>

        {authError && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>
            <CircleAlert size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="signup-name">
              Full name
            </label>
            <input
              id="signup-name"
              className="field-input"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="field-error" role="alert">
                <CircleAlert size={13} /> {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="field-input"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
            {errors.email && (
              <p className="field-error" role="alert">
                <CircleAlert size={13} /> {errors.email.message}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="signup-password">
              Password
            </label>
            <div className="input-wrap">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="field-input"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
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
            {password && (
              <>
                <div
                  className="strength-track"
                  role="progressbar"
                  aria-label="Password strength"
                  aria-valuenow={strength.score}
                  aria-valuemin={0}
                  aria-valuemax={5}
                >
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(strength.score / 5) * 100}%`,
                      background: strength.color,
                    }}
                  />
                </div>
                <p className="strength-label">
                  Strength: {strength.label}
                </p>
              </>
            )}
            {errors.password && (
              <p className="field-error" role="alert">
                <CircleAlert size={13} /> {errors.password.message}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="signup-confirm">
              Confirm password
            </label>
            <input
              id="signup-confirm"
              type={showPassword ? 'text' : 'password'}
              className="field-input"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="field-error" role="alert">
                <CircleAlert size={13} /> {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="field">
            <label className="checkbox-row">
              <input
                type="checkbox"
                aria-invalid={Boolean(errors.acceptTerms)}
                {...register('acceptTerms')}
              />
              <span>
                I agree to the demo terms and conditions and privacy policy.
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="field-error" role="alert">
                <CircleAlert size={13} /> {errors.acceptTerms.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={pending}
          >
            {pending ? (
              <>
                <span className="spinner" aria-hidden="true" /> Creating
                account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
