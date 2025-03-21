'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function QuestionarioPage() {
  const { userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (userType !== 'admin') {
      router.push('/')
    }
  }, [userType, router])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Gestione Questionari</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Lista Questionari</h2>
        {/* Qui andrà la lista dei questionari */}
      </div>
    </div>
  )
} 