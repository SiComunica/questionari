'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardRouter() {
  const { userType, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!userType) {
      router.push('/login')
      return
    }

    switch (userType) {
      case 'admin':
        router.push('/dashboard/admin')
        break
      case 'operatore':
        router.push('/dashboard/operatore')
        break
      case 'anonimo':
        router.push('/dashboard/anonimo')
        break
      default:
        router.push('/login')
    }
  }, [userType, loading, router])

  return <div>Reindirizzamento...</div>
} 