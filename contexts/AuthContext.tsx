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
        setUserType(savedUserType)
        setCodiceAccesso(savedCodice)
        
        // Reindirizza in base al tipo salvato
        switch (savedUserType) {
          case 'admin':
            router.replace('/admin/questionari/lista')
            break
          case 'operatore':
            router.replace('/operatore')
            break
          case 'anonimo':
            router.replace('/anonimo')
            break
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [router])

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

      // Salva lo stato nel localStorage
      localStorage.setItem('userType', tipo)
      localStorage.setItem('codiceAccesso', codice)

      setUserType(tipo)
      setCodiceAccesso(codice)

      // Usa replace invece di push
      switch (tipo) {
        case 'admin':
          router.replace('/admin/questionari/lista')
          break
        case 'operatore':
          router.replace('/operatore')
          break
        case 'anonimo':
          router.replace('/anonimo')
          break
      }
    } catch (error) {
      console.error('Errore nel signIn:', error)
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

