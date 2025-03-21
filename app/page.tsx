'use client'
// Pagina di login
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/components/auth/LoginPage'

export default function HomePage() {
  console.log('HomePage renderizzata') // Debug log
  
  const { userType, isLoading } = useAuth()
  console.log('UserType:', userType, 'isLoading:', isLoading) // Debug log

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

  return null
}

