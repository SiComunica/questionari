'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import LoginPage from '@/components/auth/LoginPage'

export default function HomePage() {
  const { userType } = useAuth()

  useEffect(() => {
    // Se siamo su /login, non facciamo nulla
    if (window.location.pathname === '/login') {
      return
    }

    if (userType) {
      switch (userType) {
        case 'admin':
          window.location.href = '/admin/questionari/lista'
          break
        case 'operatore':
          window.location.href = '/operatore'
          break
        case 'anonimo':
          window.location.href = '/anonimo'
          break
      }
    }
  }, [userType])

  // Mostra direttamente il LoginPage sulla home
  return <LoginPage />
}

