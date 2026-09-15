import { useEffect, useState } from 'react'
import { authApi } from '../api/authApi'
import { AUTH_EXPIRED_EVENT, tokenStorage } from '../storage/tokenStorage'
import { AuthContext } from './authContext'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(() => tokenStorage.get())

  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null)
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    }
  }, [])

  const login = async (credentials: Parameters<typeof authApi.login>[0]) => {
    const nextToken = await authApi.login(credentials)
    tokenStorage.set(nextToken)
    setToken(nextToken)
  }

  const logout = () => {
    tokenStorage.clear()
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: token !== null,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
