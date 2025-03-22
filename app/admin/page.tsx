'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let mounted = true

    const checkAuth = () => {
      try {
        if (typeof window === 'undefined') return

        const userType = window.sessionStorage.getItem('userType')
        const codice = window.sessionStorage.getItem('codice')
        
        console.log('Admin Check:', { userType, codice })

        if (userType === 'admin' && codice === 'admin2025') {
          if (mounted) setStatus('authorized')
        } else {
          window.location.href = '/'
        }
      } catch (error) {
        console.error('Errore admin:', error)
        if (mounted) setStatus('error')
      }
    }

    // Piccolo delay per assicurarsi che sessionStorage sia disponibile
    setTimeout(checkAuth, 100)

    return () => {
      mounted = false
    }
  }, [])

  if (status === 'loading' || status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{status === 'error' ? 'Errore di accesso' : 'Verifica accesso...'}</p>
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