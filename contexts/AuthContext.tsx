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
    try {
      let userData: AuthUser | null = null;
      let redirectPath = '';

      switch (accessCode) {
        case 'admin2025':
          userData = { id: 'admin-id', type: 'admin' };
          redirectPath = '/admin';
          break;
        case 'operatore1':
        case 'operatore2':
        case 'operatore3':
          userData = { id: `operatore-${accessCode}`, type: 'operatore' };
          redirectPath = '/operatore';
          break;
        case 'anonimo9999':
          userData = { id: 'anonimo-id', type: 'anonimo' };
          redirectPath = '/anonimo';
          break;
        default:
          throw new Error('Codice di accesso non valido');
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Aggiungi un piccolo ritardo per assicurarti che lo stato sia aggiornato
      setTimeout(() => {
        router.push(redirectPath);
      }, 100);

    } catch (err) {
      setError('Codice di accesso non valido');
      throw err;
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

  return (
    <AuthContext.Provider value={{ user, userType: user?.type ?? null, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 