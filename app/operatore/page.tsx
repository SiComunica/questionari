'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function OperatoreDashboardPage() {
  const { loading } = useAuth()

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Operatore</h1>
      <div className="mt-4">
        <Link href="/operatore/questionari/nuovo" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Compila Questionario Operatore
        </Link>
      </div>
    </div>
  )
} 