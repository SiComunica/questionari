"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Prima installa il pacchetto necessario con:
// npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

interface User {
  id: string
  type: string
}

interface AuthContextType {
  user: User | null
  userType: string | null
  loading: boolean
  signIn: (code: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const signIn = async (code: string) => {
    setLoading(true)
    try {
      let userData: User | null = null;

      if (code === 'admin2025') {
        userData = { id: 'admin-id', type: 'admin' };
      } else if (code === 'anonimo9999') {
        userData = { id: 'anonimo-id', type: 'anonimo' };
      } else if (/^operatore([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|300)$/.test(code)) {
        userData = { id: `operatore-${code}`, type: 'operatore' };
      } else {
        throw new Error('Codice di accesso non valido');
      }

      // Prima settiamo l'utente
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Poi facciamo il redirect in base al tipo
      switch (userData.type) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'operatore':
          router.push('/dashboard/operatore');
          break;
        case 'anonimo':
          router.push('/dashboard/anonimo');
          break;
      }

    } catch (error) {
      console.error('Errore login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  // Recupera l'utente dal localStorage all'avvio
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Errore nel parsing dell\'utente salvato:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      userType: user?.type ?? null, 
      loading,
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 