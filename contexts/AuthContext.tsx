'use client'

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

type UserType = 'admin' | 'operatore' | 'anonimo' | null

export type AuthContextType = {
  userType: UserType
  codiceAccesso: string | null
  signIn: (codice: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  userType: null,
  codiceAccesso: null,
  signIn: async () => {},
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null)
  const [codiceAccesso, setCodiceAccesso] = useState<string | null>(null)
  const router = useRouter()

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
      // Salviamo lo stato sia in localStorage che nei cookie
      localStorage.setItem('userType', tipo)
      localStorage.setItem('codiceAccesso', codice)
      Cookies.set('userType', tipo, { path: '/' })
      setUserType(tipo)
      setCodiceAccesso(codice)

      // Aspettiamo un attimo per assicurarci che i cookie siano salvati
      await new Promise(resolve => setTimeout(resolve, 100))

      // Usiamo window.location per un reindirizzamento forzato
      console.log('Reindirizzamento a:', redirectPath)
      window.location.href = redirectPath
    } catch (error) {
      console.error('Errore durante il reindirizzamento:', error)
      throw error
    }
  }

  const signOut = async () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('codiceAccesso')
    Cookies.remove('userType', { path: '/' })
    setUserType(null)
    setCodiceAccesso(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ userType, codiceAccesso, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
