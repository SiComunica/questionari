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

interface User {
  id: string
  type: string
}

interface AuthContextType {
  user: User | null
  userType: string | null
  signIn: (code: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const signIn = async (code: string) => {
    if (code === 'admin2025') {
      setUser({ id: 'admin-id', type: 'admin' })
      router.push('/admin')
    } else if (code === 'anonimo9999') {
      setUser({ id: 'anonimo-id', type: 'anonimo' })
      router.push('/anonimo')
    } else if (/^operatore([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|300)$/.test(code)) {
      setUser({ id: `operatore-${code}`, type: 'operatore' })
      router.push('/operatore')
    } else {
      throw new Error('Codice di accesso non valido')
    }
  }

  const signOut = () => {
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      userType: user?.type ?? null, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 