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
    console.log('Verifica codice:', codice) // Debug log

    try {
      let tipo: UserType = null

      // Verifica codice admin
      if (codice === 'admin2025') {
        tipo = 'admin'
      }
      // Verifica codice anonimo
      else if (codice === 'anonimo9999') {
        tipo = 'anonimo'
      }
      // Verifica codice operatore
      else if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          tipo = 'operatore'
        }
      }

      if (!tipo) {
        throw new Error('Codice di accesso non valido')
      }

      console.log('Tipo utente rilevato:', tipo) // Debug log

      setUserType(tipo)
      setCodiceAccesso(codice)

      // Reindirizzamento
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

      console.log('Reindirizzamento completato') // Debug log
    } catch (error) {
      console.error('Errore nel signIn:', error)
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

