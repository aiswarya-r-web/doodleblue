import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { CircleAlert, Info } from 'lucide-react'
import { forgotPasswordSchema } from '../validation/schemas'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  // The demo backend (Fake Store API) exposes no password-recovery
  // endpoint, so submission surfaces an honest limitation instead of
  // pretending an email was sent.
  const onSubmit = () => setSubmitted(true)

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <span className="auth-logo">
          Shop<span className="brand-accent">Kart</span>
          <span className="brand-dot">.</span>
        </span>
        <h1>Reset password</h1>
        <p className="auth-sub">
          Enter your email and we'll help you get back in.
        </p>

        {submitted ? (
          <div className="alert alert-info" role="status">
            <Info size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              The demo backend doesn't support password recovery emails. Use
              the seeded demo account on the sign-in page instead.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="forgot-email">
                Email address
              </label>
              <input
                id="forgot-email"
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
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isSubmitting}
            >
              Send reset link
            </button>
          </form>
        )}

        <p className="auth-alt">
          Remembered it? <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </main>
  )
}
