import { useState } from 'react'
import { useAuth } from '../context/useAuth'

type LoginPageProps = {
  onSuccess?: () => void
}

export const LoginPage = ({ onSuccess }: LoginPageProps) => {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ username, password })
      onSuccess?.()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unable to log in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section aria-labelledby="login-title" className="login-card">
        <p className="login-card__eyebrow">Pet management</p>
        <h1 id="login-title">Log in</h1>
        <p className="login-card__description">Sign in to manage your pets.</p>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <label className="login-form__field">
            Username
            <input
              autoComplete="username"
              name="username"
              required
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="login-form__field">
            Password
            <input
              autoComplete="current-password"
              name="password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="login-form__error" role="alert">{error}</p>}
          <button className="login-form__submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </section>
    </main>
  )
}
