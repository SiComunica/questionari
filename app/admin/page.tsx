'use client'

import { useAuth } from '@/contexts/AuthContext'
import QuestionariOperatoriList from '@/components/dashboard/QuestionariOperatoriList'

export default function AdminDashboardPage() {
  const { loading } = useAuth()

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Questionari Operatori</h2>
        <QuestionariOperatoriList />
      </div>
    </div>
  )
} 