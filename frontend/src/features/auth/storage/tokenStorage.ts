import type { AuthToken } from '../types/auth'

const TOKEN_STORAGE_KEY = 'pets-app.auth-token'
export const AUTH_EXPIRED_EVENT = 'pets-app.auth-expired'

const isAuthToken = (value: unknown): value is AuthToken => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return (
    'access_token' in value &&
    typeof value.access_token === 'string' &&
    value.access_token.length > 0 &&
    'token_type' in value &&
    typeof value.token_type === 'string' &&
    value.token_type.length > 0
  )
}

export const tokenStorage = {
  get: (): AuthToken | null => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)

    if (!storedToken) {
      return null
    }

    try {
      const parsedToken: unknown = JSON.parse(storedToken)

      if (isAuthToken(parsedToken)) {
        return parsedToken
      }
    } catch {
      // Invalid persisted data is removed below.
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY)
    return null
  },

  set: (token: AuthToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token))
  },

  clear: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  },
}
