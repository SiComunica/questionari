'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'

// Prima installa il pacchetto necessario con:
// npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

interface AuthContextType {
  session: Session | null
  loading: boolean
  error: string | null
  signIn: (code: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (code: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Verifica il tipo di codice
      if (code === 'admin2025') {
        const { error } = await supabase.auth.signInWithPassword({
          email: 'admin@example.com',
          password: code
        })
        if (error) throw error
        router.push('/dashboard/admin')
      } 
      else if (code === 'anonimo9999') {
        const { error } = await supabase.auth.signInWithPassword({
          email: 'anonimo@example.com',
          password: code
        })
        if (error) throw error
        router.push('/dashboard/anonimo')
      }
      // Verifica se è un operatore (da operatore1 a operatore100)
      else if (/^operatore[1-9][0-9]?$|^operatore100$/.test(code)) {
        const operatoreNum = code.replace('operatore', '')
        const { error } = await supabase.auth.signInWithPassword({
          email: `operatore${operatoreNum}@example.com`,
          password: code
        })
        if (error) throw error
        router.push('/dashboard/operatore')
      }
      else {
        setError('Codice di accesso non valido')
      }
    } catch (err) {
      console.error('Errore di accesso:', err)
      setError('Errore durante l\'accesso. Riprova.')
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
      session,
      loading,
      error,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di AuthProvider')
  }
  return context
} 