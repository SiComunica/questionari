"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Prima installa il pacchetto necessario con:
// npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

type UserType = 'admin' | 'operatore' | 'anonimo' | null
interface AuthUser {
  id: string
  type: UserType
}

interface AuthContextType {
  user: AuthUser | null
  userType: UserType
  loading: boolean
  error: string | null
  signIn: (accessCode: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signIn = async (accessCode: string) => {
    console.log('Tentativo di login con codice:', accessCode) // Debug
    
    try {
      switch (accessCode) {
        case 'admin2025':
          setUser({ id: 'admin-id', type: 'admin' })
          router.push('/admin')
          break
        case 'operatore1':
          setUser({ id: 'operatore-id', type: 'operatore' })
          router.push('/operatore')
          break
        case 'anonimo9999':
          setUser({ id: 'anonimo-id', type: 'anonimo' })
          router.push('/anonimo')
          break
        default:
          throw new Error('Codice di accesso non valido')
      }
    } catch (err) {
      console.error('Errore nel login:', err) // Debug
      throw err
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, userType: user?.type ?? null, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 