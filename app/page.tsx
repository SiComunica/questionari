'use client'
// Pagina di login
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoginPage from '@/components/auth/LoginPage'

export default function HomePage() {
  const { userType } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    if (userType) {
      switch (userType) {
        case 'admin':
          router.push('/admin/questionari/lista')
          break
        case 'operatore':
          router.push('/operatore')
          break
        case 'anonimo':
          router.push('/anonimo')
          break
      }
    }
  }, [userType, router])

  if (!isMounted) {
    return null
  }

  // Se l'utente non è loggato, mostra la pagina di login
  if (!userType) {
    return <LoginPage />
  }

  return null
}

