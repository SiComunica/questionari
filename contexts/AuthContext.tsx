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
    if (savedType) {
      setUserType(savedType)
    }
    if (savedCodice) {
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

    // Reindirizza
    switch (tipo) {
      case 'admin':
        router.push('/admin/questionari/lista')
        break
      case 'operatore':
        router.push('/operatore')
        break
      case 'anonimo':
        router.push('/anonimo')
        break
    }
  }

  const signOut = async () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('codiceAccesso')
    setUserType(null)
    setCodiceAccesso(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ userType, codiceAccesso, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

