'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type UserType = 'admin' | 'operatore' | 'anonimo'

type AuthContextType = {
  userType: UserType | null
  signIn: (code: string) => Promise<void>
  signOut: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  userType: null,
  signIn: async () => {},
  signOut: () => {},
  loading: false,
  error: null
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Recupera il tipo di utente dal localStorage al caricamento
    const savedUserType = localStorage.getItem('userType') as UserType | null
    if (savedUserType) {
      setUserType(savedUserType)
    }
  }, [])

  const signIn = async (code: string) => {
    setLoading(true)
    setError(null)

    try {
      // Verifica il codice di accesso
      if (code === 'admin2025') {
        setUserType('admin')
        localStorage.setItem('userType', 'admin')
        router.push('/dashboard/admin')
      } else if (code === 'anonimo9999') {
        setUserType('anonimo')
        localStorage.setItem('userType', 'anonimo')
        router.push('/dashboard/anonimo')
      } else {
        // Verifica se è un codice operatore (da 1 a 300)
        const operatorNumber = parseInt(code)
        if (!isNaN(operatorNumber) && operatorNumber >= 1 && operatorNumber <= 300) {
          setUserType('operatore')
          localStorage.setItem('userType', 'operatore')
          router.push('/dashboard/operatore')
        } else {
          throw new Error('Codice non valido')
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Errore durante il login')
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    setUserType(null)
    localStorage.removeItem('userType')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ userType, signIn, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di AuthProvider')
  }
  return context
} 