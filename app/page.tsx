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
      console.log('Reindirizzamento in corso per:', userType)
      switch (userType) {
        case 'admin':
          router.replace('/admin/questionari/lista')
          break
        case 'operatore':
          router.replace('/operatore')
          break
        case 'anonimo':
          router.replace('/anonimo')
          break
      }
    }
  }, [userType, isLoading, router])

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

