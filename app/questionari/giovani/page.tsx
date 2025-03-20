'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import QuestionarioGiovani from '@/components/questionari/QuestionarioGiovaniNew'
import { createBrowserClient } from '@supabase/ssr'

export default function QuestionariGiovaniPage() {
  const { user, userType } = useAuth()
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (!user || (userType !== 'anonimo' && userType !== 'operatore')) {
      router.push('/login')
    }
  }, [user, userType, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuestionarioGiovani />
      </div>
    </div>
  )
} 