'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function QuestionariPage() {
  const { userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (userType === 'admin') {
      router.push('/admin/questionari/lista')
    }
  }, [userType, router])

  return null
} 