'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import QuestionarioGiovani from '@/components/questionari/QuestionarioGiovani'

export default function QuestionarioGiovaniPage() {
  const router = useRouter()
  const { userType } = useAuth()

  useEffect(() => {
    // Reindirizza alla home se non autenticato
    if (!userType) {
      router.push('/')
    }
  }, [userType, router])

  if (!userType) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuestionarioGiovani />
      </div>
    </div>
  )
} 