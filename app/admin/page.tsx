'use client'

import { useAuth } from '@/contexts/AuthContext'
import QuestionariOperatoriList from '@/components/dashboard/QuestionariOperatoriList'

export default function AdminDashboard() {
  const { loading } = useAuth()

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <QuestionariOperatoriList />
    </div>
  )
} 