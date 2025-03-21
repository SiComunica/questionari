'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    try {
      const savedUserType = localStorage.getItem('userType') as UserType
      const savedCodice = localStorage.getItem('codiceAccesso')
      
      if (savedUserType && savedCodice) {
        console.log('Stato recuperato:', savedUserType)
        setUserType(savedUserType)
        setCodiceAccesso(savedCodice)
      }
    } catch (error) {
      console.error('Errore nel recupero dello stato:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signIn = async (codice: string) => {
    console.log('Tentativo di login con codice:', codice)
    try {
      let tipo: UserType = null

      if (codice === 'admin2025') {
        tipo = 'admin'
      } else if (codice === 'anonimo9999') {
        tipo = 'anonimo'
      } else if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          tipo = 'operatore'
        }
      }

      if (!tipo) {
        throw new Error('Codice di accesso non valido')
      }

      console.log('Login effettuato come:', tipo)
      localStorage.setItem('userType', tipo)
      localStorage.setItem('codiceAccesso', codice)

      setUserType(tipo)
      setCodiceAccesso(codice)
    } catch (error) {
      console.error('Errore nel login:', error)
      throw error
    }
  }

  const signOut = async () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('codiceAccesso')
    setUserType(null)
    setCodiceAccesso(null)
    router.replace('/')
  }

  return (
    <AuthContext.Provider value={{ userType, codiceAccesso, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

