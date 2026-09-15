import { createContext } from 'react'
import type { AuthCredentials, AuthToken } from '../types/auth'

export type AuthContextValue = {
  isAuthenticated: boolean
  token: AuthToken | null
  login: (credentials: AuthCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
