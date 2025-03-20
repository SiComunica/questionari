'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole: string
}) {
  const router = useRouter()
  const { user, userType, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || userType !== requiredRole)) {
      router.push('/login')
    }
  }, [user, loading, userType, router, requiredRole])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Caricamento...</div>
      </div>
    )
  }

  return <>{children}</>
} 