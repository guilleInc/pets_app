import { useEffect, useState } from 'react'
import { AuthProvider } from '../features/auth/context/AuthProvider'
import { useAuth } from '../features/auth/context/useAuth'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { PetsPage } from '../features/pets/pages/PetsPage'

const AppContent = () => {
  const { isAuthenticated } = useAuth()
  const [pathname, setPathname] = useState(() => window.location.pathname || '/')

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/')
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const expectedPath = isAuthenticated ? '/' : '/login'

    if (pathname === expectedPath) {
      return
    }
    window.history.replaceState({}, '', expectedPath)
    window.history.replaceState({}, '', expectedPath)
  }, [isAuthenticated, pathname])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  return isAuthenticated ? (
    <PetsPage />
  ) : (
    <LoginPage onSuccess={() => navigate('/')} />
  )
}

export const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
)
