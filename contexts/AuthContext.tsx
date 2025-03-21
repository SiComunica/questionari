'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

  // Carica lo stato all'avvio
  useEffect(() => {
    const savedType = localStorage.getItem('userType') as UserType
    const savedCodice = localStorage.getItem('codiceAccesso')
    if (savedType && savedCodice) {
      setUserType(savedType)
      setCodiceAccesso(savedCodice)
    }
  }, [])

  const signIn = async (codice: string) => {
    console.log('Tentativo di login con:', codice) // Debug

    try {
      let tipo: UserType = null
      let redirectUrl = '/'

      if (codice === 'admin2025') {
        tipo = 'admin'
        redirectUrl = '/admin/questionari/lista'
      } else if (codice === 'anonimo9999') {
        tipo = 'anonimo'
        redirectUrl = '/anonimo'
      } else if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          tipo = 'operatore'
          redirectUrl = '/operatore'
        }
      }

      if (!tipo) {
        console.log('Codice non valido') // Debug
        throw new Error('Codice non valido')
      }

      console.log('Tipo utente rilevato:', tipo) // Debug

      // Salva lo stato
      localStorage.setItem('userType', tipo)
      localStorage.setItem('codiceAccesso', codice)
      
      setUserType(tipo)
      setCodiceAccesso(codice)

      console.log('Reindirizzamento a:', redirectUrl) // Debug
      
      // Forza il reindirizzamento
      setTimeout(() => {
        window.location.href = redirectUrl
      }, 100)

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
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ userType, codiceAccesso, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

