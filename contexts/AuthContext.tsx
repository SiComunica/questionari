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
      throw new Error('Codice non valido')
    }

    // Salva lo stato
    localStorage.setItem('userType', tipo)
    localStorage.setItem('codiceAccesso', codice)
    setUserType(tipo)
    setCodiceAccesso(codice)

    // Forza il reindirizzamento con window.location
    switch (tipo) {
      case 'admin':
        window.location.href = '/admin/questionari/lista'
        break
      case 'operatore':
        window.location.href = '/operatore'
        break
      case 'anonimo':
        window.location.href = '/anonimo'
        break
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

