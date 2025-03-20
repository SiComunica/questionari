'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import QuestionariOperatoriList from '@/components/dashboard/QuestionariOperatoriList'

export default function AdminPage() {
  const { userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (userType !== 'admin') {
      router.push('/login')
    }
  }, [userType, router])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid gap-6">
        <QuestionariOperatoriList />
      </div>
    </div>
  )
} 