"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'

// Prima installa il pacchetto necessario con:
// npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

type UserType = 'admin' | 'operatore' | 'anonimo' | null

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  userType: UserType
  signIn: (code: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  userType: null,
  signIn: async () => {},
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<UserType>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Controlla la sessione iniziale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) {
        const email = session.user.email
        if (email?.includes('admin')) setUserType('admin')
        else if (email?.includes('operatore')) setUserType('operatore')
        else if (email?.includes('anonimo')) setUserType('anonimo')
        else setUserType(null)
      } else {
        setUserType(null)
      }
    })

    // Ascolta i cambiamenti di auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) {
        const email = session.user.email
        if (email?.includes('admin')) setUserType('admin')
        else if (email?.includes('operatore')) setUserType('operatore')
        else if (email?.includes('anonimo')) setUserType('anonimo')
        else setUserType(null)
      } else {
        setUserType(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (code: string) => {
    try {
      setLoading(true)
      setError(null)
      
      let email: string
      if (code === 'admin2025') {
        email = 'admin@ferro.com'
      } else if (code === 'anonimo9999') {
        email = 'anonimo@ferro.com'
      } else if (code.match(/^operatore[1-9][0-9]?$|^operatore100$/)) {
        const num = code.replace('operatore', '')
        email = `operatore${num}@ferro.com`
      } else {
        throw new Error('Codice non valido')
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: code
      })

      if (error) throw error

      // Reindirizza in base al tipo di utente
      if (email.includes('admin')) router.push('/dashboard/admin')
      else if (email.includes('operatore')) router.push('/dashboard/operatore')
      else if (email.includes('anonimo')) router.push('/dashboard/anonimo')

    } catch (err: any) {
      console.error('Errore di login:', err)
      setError(err?.message || 'Errore durante l\'accesso')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      console.error('Errore durante il logout:', err)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      userType,
      signIn,
      signOut
    }}>
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