'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function OperatorePage() {
  const router = useRouter()
  const { user, userType, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || userType !== 'operatore')) {
      router.push('/login')
    }
  }, [user, loading, userType, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Area Operatore</h1>
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Questionari</h2>
          <div className="space-y-4">
            <a
              href="/questionari/operatori/nuovo"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Compila Nuovo Questionario
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 