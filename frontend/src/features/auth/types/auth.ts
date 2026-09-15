export type AuthCredentials = {
  username: string
  password: string
}

export type AuthToken = {
  access_token: string
  token_type: string
}

export type AuthState = {
  token: AuthToken | null
  isAuthenticated: boolean
}
