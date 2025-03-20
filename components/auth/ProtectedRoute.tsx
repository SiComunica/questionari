'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedTypes: ('admin' | 'operatore' | 'anonimo')[]
}

export default function ProtectedRoute({ children, allowedTypes }: ProtectedRouteProps) {
  const { userType, codiceAccesso } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!codiceAccesso || !userType || !allowedTypes.includes(userType)) {
      router.push('/')
    }
  }, [codiceAccesso, userType, allowedTypes, router])

  if (!codiceAccesso || !userType || !allowedTypes.includes(userType)) {
    return null
  }

  return <>{children}</>
} 