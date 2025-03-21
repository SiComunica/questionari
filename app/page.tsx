'use client'

import { useEffect, useState } from 'react'
import LoginPage from '@/components/auth/LoginPage'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType')
    setUserType(savedUserType)
    setIsLoading(false)

    if (savedUserType) {
      switch (savedUserType) {
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
  }, [])

  if (isLoading) {
    return <div>Caricamento...</div>
  }

  if (!userType) {
    return <LoginPage />
  }

  return <div>Reindirizzamento...</div>
}

