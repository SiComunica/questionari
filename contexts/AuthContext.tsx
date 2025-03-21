'use client'

import { createContext, useContext, useState } from 'react'

type UserType = 'admin' | 'operatore' | 'anonimo' | null

type AuthContextType = {
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
  isLoading: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null)
  const [codiceAccesso, setCodiceAccesso] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async (codice: string) => {
    setIsLoading(true)
    console.log('Tentativo di login con:', codice)

    try {
      if (codice === 'admin2025') {
        setUserType('admin')
        setCodiceAccesso(codice)
        console.log('Login admin riuscito, reindirizzamento...')
        window.location.href = '/admin/questionari/lista'
        return
      } 
      
      if (codice === 'anonimo9999') {
        setUserType('anonimo')
        setCodiceAccesso(codice)
        console.log('Login anonimo riuscito, reindirizzamento...')
        window.location.href = '/anonimo'
        return
      } 
      
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          setUserType('operatore')
          setCodiceAccesso(codice)
          console.log('Login operatore riuscito, reindirizzamento...')
          window.location.href = '/operatore'
          return
        }
      }

      throw new Error('Codice non valido')
    } catch (error) {
      console.error('Errore login:', error)
      setIsLoading(false)
      throw error
    }
  }

  const signOut = async () => {
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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider')
  }
  return context
}

export default AuthContext
