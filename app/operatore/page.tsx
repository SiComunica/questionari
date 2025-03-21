'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'

export default function OperatoreDashboard() {
  useEffect(() => {
    // Verifica che l'utente sia operatore
    const userType = localStorage.getItem('userType')
    if (userType !== 'operatore') {
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Operatore</h1>
      <div className="grid gap-4">
        <Card className="p-4">
          <h2 className="font-semibold">Questionari Disponibili</h2>
          {/* Contenuto dashboard operatore */}
        </Card>
      </div>
    </div>
  )
} 