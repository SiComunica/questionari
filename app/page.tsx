'use client'
// Pagina di login
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoginPage from '@/components/auth/LoginPage'

export default function HomePage() {
  console.log('HomePage renderizzata') // Debug log
  
  const { userType, isLoading } = useAuth()
  const router = useRouter()
  
  console.log('UserType:', userType, 'isLoading:', isLoading) // Debug log

  useEffect(() => {
    if (!isLoading && userType) {
      let path = '/'
      
      switch (userType) {
        case 'admin':
          path = '/admin/questionari/lista'
          break
        case 'operatore':
          path = '/operatore'
          break
        case 'anonimo':
          path = '/anonimo'
          break
      }

      // Forza il reindirizzamento con window.location
      window.location.href = path
    }
  }, [userType, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Caricamento...</p>
      </div>
    )
  }

  if (!userType) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Reindirizzamento in corso...</p>
    </div>
  )
}

