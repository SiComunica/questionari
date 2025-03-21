'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'

export default function AnonimoDashboard() {
  useEffect(() => {
    // Verifica che l'utente sia anonimo
    const userType = localStorage.getItem('userType')
    if (userType !== 'anonimo') {
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Anonimo</h1>
      <div className="grid gap-4">
        <Card className="p-4">
          <h2 className="font-semibold">Questionario Giovani</h2>
          {/* Contenuto dashboard anonimo */}
        </Card>
      </div>
    </div>
  )
} 