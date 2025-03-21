'use client'

import { createContext, useContext, useState, useEffect } from 'react'

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
  isLoading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null)
  const [codiceAccesso, setCodiceAccesso] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as UserType
    const savedCodice = localStorage.getItem('codiceAccesso')
    
    console.log('Controllo stato salvato:', { savedUserType, savedCodice })
    
    if (savedUserType && savedCodice) {
      setUserType(savedUserType)
      setCodiceAccesso(savedCodice)
    }
    
    setIsLoading(false)
  }, [])

  const signIn = async (codice: string) => {
    console.log('SignIn chiamato con codice:', codice)
    
    try {
      let tipo: UserType = null
      let redirectPath = '/'

      if (codice === 'admin2025') {
        tipo = 'admin'
        redirectPath = '/admin/questionario'
      } else if (codice === 'anonimo9999') {
        tipo = 'anonimo'
        redirectPath = '/anonimo'
      } else if (codice.match(/^operatore[1-9][0-9]{0,2}$/)) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          tipo = 'operatore'
          redirectPath = '/operatore'
        }
      }

      if (!tipo) {
        console.error('Codice non valido:', codice)
        throw new Error('Codice di accesso non valido')
      }

      console.log('Login valido:', { tipo, redirectPath })

      // Salva lo stato
      localStorage.setItem('userType', tipo)
      localStorage.setItem('codiceAccesso', codice)
      setUserType(tipo)
      setCodiceAccesso(codice)

      // Aspetta un momento per assicurarsi che lo stato sia salvato
      await new Promise(resolve => setTimeout(resolve, 100))

      console.log('Reindirizzamento a:', redirectPath)
      window.location.href = redirectPath

    } catch (error) {
      console.error('Errore durante il login:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log('Logout in corso...')
    localStorage.removeItem('userType')
    localStorage.removeItem('codiceAccesso')
    setUserType(null)
    setCodiceAccesso(null)
    window.location.href = '/'
  }

  const value = {
    userType,
    codiceAccesso,
    signIn,
    signOut,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
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
