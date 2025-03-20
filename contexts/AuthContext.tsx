"use client"

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

// Prima installa il pacchetto necessario con:
// npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AuthContextType {
  userType: string | null
  signIn: (code: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<string | null>(null)
  const router = useRouter()

  const signIn = async (code: string) => {
    switch (code) {
      case 'admin2025':
        setUserType('admin')
        router.push('/admin')
        break
      case 'operatore1':
        setUserType('operatore')
        router.push('/operatore')
        break
      case 'anonimo9999':
        setUserType('anonimo')
        router.push('/anonimo')
        break
      default:
        throw new Error('Codice non valido')
    }
  }

  const signOut = () => {
    setUserType(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ userType, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 