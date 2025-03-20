"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

// Prima installa il pacchetto necessario con:
// npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

type UserType = 'admin' | 'operatore' | 'anonimo' | null
type User = { id: string; type: UserType } | null

interface AuthContextType {
  user: User
  userType: UserType
  loading: boolean
  error: string | null
  signIn: (accessCode: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const signIn = async (accessCode: string) => {
    // Logica di autenticazione basata sui codici di accesso
    switch (accessCode) {
      case 'admin2025':
        setUser({ id: 'admin-id', type: 'admin' })
        router.push('/admin')
        break
      case 'operatore1':
      case 'operatore2':
      case 'operatore3':
        setUser({ id: `operatore-${accessCode}`, type: 'operatore' })
        router.push('/operatore')
        break
      case 'anonimo9999':
        setUser({ id: 'anonimo-id', type: 'anonimo' })
        router.push('/dashboard/anonimo')
        break
      default:
        throw new Error('Codice di accesso non valido')
    }
  }

  const signOut = () => {
    setUser(null)
    router.push('/login')
  }

  useEffect(() => {
    // Controlla se c'è un utente salvato nel localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Salva l'utente nel localStorage quando cambia
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, userType: user?.type ?? null, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 