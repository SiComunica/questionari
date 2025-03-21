'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

type UserType = 'admin' | 'operatore' | 'anonimo' | null

export type AuthContextType = {
  userType: UserType
  codiceAccesso: string | null
  signIn: (codice: string) => Promise<void>
  signOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  userType: null,
  codiceAccesso: null,
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null)
  const [codiceAccesso, setCodiceAccesso] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Carica lo stato iniziale dal localStorage
  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as UserType
    const savedCodice = localStorage.getItem('codiceAccesso')
    
    console.log('Stato iniziale:', { savedUserType, savedCodice })
    
    if (savedUserType) {
      setUserType(savedUserType)
      setCodiceAccesso(savedCodice)
      Cookies.set('userType', savedUserType, { path: '/' })
    }
    
    setIsLoading(false)
  }, [])

  const signIn = async (codice: string) => {
    let tipo: UserType = null
    let redirectPath = '/'

    if (codice === 'admin2025') {
      tipo = 'admin'
      redirectPath = '/admin/questionario'
    } else if (codice === 'anonimo9999') {
      tipo = 'anonimo'
      redirectPath = '/anonimo'
    } else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        tipo = 'operatore'
        redirectPath = '/operatore'
      }
    }

    if (!tipo) {
      throw new Error('Codice non valido')
    }

    try {
      console.log('Login con:', { tipo, codice })
      
      // Salviamo lo stato
      localStorage.setItem('userType', tipo)
      localStorage.setItem('codiceAccesso', codice)
      Cookies.set('userType', tipo, { path: '/' })
      setUserType(tipo)
      setCodiceAccesso(codice)

      // Aspettiamo un attimo per assicurarci che tutto sia salvato
      await new Promise(resolve => setTimeout(resolve, 100))

      console.log('Reindirizzamento a:', redirectPath)
      window.location.href = redirectPath
    } catch (error) {
      console.error('Errore durante il login:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log('Logout in corso...')
    localStorage.removeItem('userType')
    localStorage.removeItem('codiceAccesso')
    Cookies.remove('userType', { path: '/' })
    setUserType(null)
    setCodiceAccesso(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ userType, codiceAccesso, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
