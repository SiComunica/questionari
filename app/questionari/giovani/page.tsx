'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import QuestionarioGiovani from '@/components/questionari/QuestionarioGiovaniNew'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function QuestionarioGiovaniPage() {
  const router = useRouter()
  const { userType } = useAuth()
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

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