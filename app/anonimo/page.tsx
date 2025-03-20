'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function AnonimoPage() {
  const { user, userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || userType !== 'anonimo') {
      router.push('/login')
    }
  }, [user, userType, router])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Anonimo</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Questionari Disponibili</h2>
        <div className="space-y-4">
          <Link 
            href="/questionari/giovani/nuovo"
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Compila Questionario Giovani
          </Link>
        </div>
      </div>
    </div>
  )
} 