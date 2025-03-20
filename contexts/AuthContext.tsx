'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  userType: 'admin' | 'operatore' | 'anonimo' | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<'admin' | 'operatore' | 'anonimo' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user?.email) {
          if (user.email.includes('admin@')) {
            setUserType('admin')
          } else if (user.email.includes('operatore')) {
            setUserType('operatore')
          } else {
            setUserType('anonimo')
          }
        } else {
          setUserType(null)
        }
      } catch (error) {
        console.error('Errore nel controllo utente:', error)
        setUser(null)
        setUserType(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.email) {
        if (session.user.email.includes('admin@')) {
          setUserType('admin')
        } else if (session.user.email.includes('operatore')) {
          setUserType('operatore')
        } else {
          setUserType('anonimo')
        }
      } else {
        setUserType(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, userType, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di AuthProvider')
  }
  return context
}

