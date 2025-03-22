'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const userType = sessionStorage?.getItem('userType')
      const codice = sessionStorage?.getItem('codice')
      
      if (userType !== 'admin' || codice !== 'admin2025') {
        router.replace('/')
        return
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Errore nel controllo accesso:', error)
      router.replace('/')
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Caricamento dashboard admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p className="mb-4">Benvenuto nella dashboard admin</p>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Funzionalità Admin</h2>
        <ul className="space-y-2">
          <li>• Gestione questionari</li>
          <li>• Visualizzazione statistiche</li>
          <li>• Amministrazione utenti</li>
        </ul>
      </div>
    </div>
  )
} 