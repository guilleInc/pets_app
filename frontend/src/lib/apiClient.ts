import { AUTH_EXPIRED_EVENT, tokenStorage } from '../features/auth/storage/tokenStorage'

const apiUrl = import.meta.env.VITE_API_URL?.trim()

if (!apiUrl) {
  throw new Error('VITE_API_URL is not configured')
}

const baseUrl = apiUrl.replace(/\/+$/, '')

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

const getErrorMessage = (responseBody: unknown, status: number) => {
  if (typeof responseBody !== 'object' || responseBody === null) {
    return `Request failed with status ${status}`
  }

  if ('detail' in responseBody && typeof responseBody.detail === 'string') {
    return responseBody.detail
  }

  if ('message' in responseBody && typeof responseBody.message === 'string') {
    return responseBody.message
  }

  return `Request failed with status ${status}`
}

const request = async <T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<T> => {
  const token = tokenStorage.get()
  const isFormData = body instanceof FormData
  const response = await fetch(`${baseUrl}/${path.replace(/^\/+/, '')}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(body === undefined || isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token
        ? { Authorization: `${token.token_type} ${token.access_token}` }
        : {}),
      ...headers,
    },
    ...(body === undefined
      ? {}
      : { body: isFormData ? body : JSON.stringify(body) }),
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
    if (response.status === 401) {
      tokenStorage.clear()
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    }

    const message = getErrorMessage(responseBody, response.status)

    throw new Error(message)
  }

  return responseBody as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}
