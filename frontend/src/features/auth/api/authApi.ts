import type { AuthCredentials, AuthToken } from '../types/auth'

const apiUrl = import.meta.env.VITE_API_URL?.trim()

if (!apiUrl) {
  throw new Error('VITE_API_URL is not configured')
}

const baseUrl = apiUrl.replace(/\/+$/, '')

const getErrorMessage = (responseBody: unknown, status: number) => {
  if (
    typeof responseBody === 'object' &&
    responseBody !== null &&
    'detail' in responseBody &&
    typeof responseBody.detail === 'string'
  ) {
    return responseBody.detail
  }

  if (
    typeof responseBody === 'object' &&
    responseBody !== null &&
    'message' in responseBody &&
    typeof responseBody.message === 'string'
  ) {
    return responseBody.message
  }

  return `Request failed with status ${status}`
}

export const authApi = {
  login: async ({ username, password }: AuthCredentials): Promise<AuthToken> => {
    const response = await fetch(`${baseUrl}/auth/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password }),
    })

    const responseText = await response.text()
    let responseBody: unknown

    if (responseText) {
      try {
        responseBody = JSON.parse(responseText)
      } catch {
        responseBody = responseText
      }
    }

    if (!response.ok) {
      throw new Error(getErrorMessage(responseBody, response.status))
    }

    return responseBody as AuthToken
  },
}
