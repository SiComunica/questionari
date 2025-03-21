'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

type UserType = 'admin' | 'operatore' | 'anonimo' | null

type AuthContextType = {
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

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as UserType
    const savedCodice = localStorage.getItem('codiceAccesso')
    
    if (savedUserType && savedCodice) {
      setUserType(savedUserType)
      setCodiceAccesso(savedCodice)
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

    localStorage.setItem('userType', tipo)
    localStorage.setItem('codiceAccesso', codice)
    setUserType(tipo)
    setCodiceAccesso(codice)

    await new Promise(resolve => setTimeout(resolve, 100))
    window.location.href = redirectPath
  }

  const signOut = async () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('codiceAccesso')
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

export default AuthContext
