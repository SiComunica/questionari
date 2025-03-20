'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import QuestionarioGiovani from '@/components/questionari/QuestionarioGiovaniNew'

export default function QuestionarioGiovaniPage() {
  const { userType, codiceAccesso } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!codiceAccesso || !['operatore', 'anonimo'].includes(userType || '')) {
      router.push('/')
    }
  }, [codiceAccesso, userType, router])

  if (!codiceAccesso || !userType) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuestionarioGiovani />
      </div>
    </div>
  )
} 