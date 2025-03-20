'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function VisualizzaQuestionarioPage() {
  const router = useRouter()
  const { userType } = useAuth()
  const searchParams = useSearchParams()
  
  // Redirect to appropriate dashboard
  if (userType === 'admin') {
    router.push('/admin/questionari/lista')
    return null
  }
  
  return null
} 