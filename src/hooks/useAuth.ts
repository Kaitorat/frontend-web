import { useEffect, useState } from 'react'
import { login, isAuthenticated } from '../lib/auth'

// Credenciales para pruebas (deberían estar en variables de entorno en producción)
const TEST_EMAIL = import.meta.env.VITE_POCKETBASE_EMAIL || 'hiont16@gmail.com'
const TEST_PASSWORD = import.meta.env.VITE_POCKETBASE_PASSWORD || 'pCltlc3gCo2DUg4'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const authenticate = async () => {
      try {
        // Verificar si ya está autenticado
        if (isAuthenticated()) {
          setIsAuth(true)
          setIsLoading(false)
          return
        }

        // Intentar autenticarse automáticamente
        await login(TEST_EMAIL, TEST_PASSWORD)
        setIsAuth(true)
      } catch (error) {
        console.error('Authentication failed:', error)
        setIsAuth(false)
      } finally {
        setIsLoading(false)
      }
    }

    authenticate()
  }, [])

  return { isLoading, isAuth }
}
