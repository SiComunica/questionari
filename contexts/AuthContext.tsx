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

  const handleRedirect = (tipo: UserType) => {
    if (!tipo) return

    let path = '/'
    switch (tipo) {
      case 'admin':
        path = '/admin/questionario'
        break
      case 'operatore':
        path = '/operatore'
        break
      case 'anonimo':
        path = '/anonimo'
        break
    }

    console.log('Reindirizzamento forzato a:', path)
    window.location.replace(path)
  }

  useEffect(() => {
    try {
      // Prima pulisci tutto
      localStorage.removeItem('userType')
      localStorage.removeItem('codiceAccesso')
      setUserType(null)
      setCodiceAccesso(null)
      setIsLoading(false)
    } catch (error) {
      console.error('Errore nel reset:', error)
      setIsLoading(false)
    }
  }, [])

  const signIn = async (codice: string) => {
    console.log('Tentativo di login con:', codice)
    
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

    try {
      // Salva lo stato
      localStorage.setItem('userType', tipo)
      localStorage.setItem('codiceAccesso', codice)
      setUserType(tipo)
      setCodiceAccesso(codice)

      console.log('Login effettuato come:', tipo)
      
      // Forza il reindirizzamento
      handleRedirect(tipo)
    } catch (error) {
      console.error('Errore durante il login:', error)
      throw error
    }
  }

  const signOut = async () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('codiceAccesso')
    setUserType(null)
    setCodiceAccesso(null)
    window.location.replace('/')
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
