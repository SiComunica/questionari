'use client'

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

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
      const { data, error } = await supabase
        .from('utenti')
        .select('tipo')
        .eq('codice_accesso', codice)
        .single()

      if (error || !data) {
        throw new Error('Codice di accesso non valido')
      }

      // Imposta il tipo utente e il codice
      setUserType(data.tipo as UserType)
      setCodiceAccesso(codice)

      // Reindirizza in base al tipo utente
      switch (data.tipo) {
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

