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
    let tipo: UserType = null
    let redirectUrl = 'https://questionari.vercel.app'

    if (codice === 'admin2025') {
      tipo = 'admin'
      redirectUrl = 'https://questionari.vercel.app/admin/questionari/lista'
    } else if (codice === 'anonimo9999') {
      tipo = 'anonimo'
      redirectUrl = 'https://questionari.vercel.app/anonimo'
    } else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        tipo = 'operatore'
        redirectUrl = 'https://questionari.vercel.app/operatore'
      }
    }

    if (!tipo) {
      throw new Error('Codice non valido')
    }

    // Prima salviamo lo stato
    localStorage.setItem('userType', tipo)
    localStorage.setItem('codiceAccesso', codice)
    setUserType(tipo)
    setCodiceAccesso(codice)

    // Poi forziamo il reindirizzamento
    console.log('Reindirizzamento a:', redirectUrl)
    window.location.replace(redirectUrl)
  }

  const signOut = async () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('codiceAccesso')
    setUserType(null)
    setCodiceAccesso(null)
    window.location.replace('https://questionari.vercel.app')
  }

  return (
    <AuthContext.Provider value={{ userType, codiceAccesso, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
