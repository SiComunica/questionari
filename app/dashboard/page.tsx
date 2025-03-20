'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const router = useRouter()
  const { userType } = useAuth()

  useEffect(() => {
    if (!userType) {
      router.push('/')
      return
    }

    switch (userType) {
      case 'admin':
        router.push('/admin/questionari')
        break
      case 'operatore':
        router.push('/operatore')
        break
      case 'anonimo':
        router.push('/anonimo')
        break
    }
  }, [userType, router])

  return <div>Reindirizzamento...</div>
} 