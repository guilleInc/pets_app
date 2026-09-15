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
        <p>Pet management</p>
        <h1 id="login-title">Log in</h1>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <label>
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
          <label>
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
          {error && (
            <p role="alert">{error}</p>
          )}
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </section>
    </main>
  )
}
