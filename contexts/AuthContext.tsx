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

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUserType = localStorage.getItem('userType') as UserType
        const savedCodice = localStorage.getItem('codiceAccesso')
        
        if (savedUserType && savedCodice) {
          setUserType(savedUserType)
          setCodiceAccesso(savedCodice)
        }
      } catch (error) {
        console.error('Errore nel recupero dello stato:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (codice: string) => {
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

      // Salva lo stato
      localStorage.setItem('userType', tipo)
      localStorage.setItem('codiceAccesso', codice)

      // Aggiorna lo stato
      setUserType(tipo)
      setCodiceAccesso(codice)

      // Reindirizza usando window.location
      let path = '/'
      switch (tipo) {
        case 'admin':
          path = '/admin/questionari/lista'
          break
        case 'operatore':
          path = '/operatore'
          break
        case 'anonimo':
          path = '/anonimo'
          break
      }
      window.location.href = path

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
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ userType, codiceAccesso, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

