'use client'

import { createContext, useContext, useState } from 'react'
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

  const signIn = async (codice: string) => {
    try {
      // Verifica il codice di accesso
      if (codice === 'admin2025') {
        setUserType('admin')
        setCodiceAccesso(codice)
        router.push('/admin/questionari/lista')
        return
      }

      if (codice === 'anonimo9999') {
        setUserType('anonimo')
        setCodiceAccesso(codice)
        router.push('/anonimo')
        return
      }

      // Verifica se è un codice operatore (da 1 a 300)
      const operatoreNum = parseInt(codice.replace('operatore', ''))
      if (codice.startsWith('operatore') && operatoreNum >= 1 && operatoreNum <= 300) {
        setUserType('operatore')
        setCodiceAccesso(codice)
        router.push('/operatore')
        return
      }

      throw new Error('Codice di accesso non valido')
    } catch (error) {
      console.error('Errore durante il login:', error)
      throw error
    }
  }

  const signOut = async () => {
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

