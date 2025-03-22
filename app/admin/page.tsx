'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Verifica se siamo nel browser
    if (typeof window === 'undefined') {
      console.log('Admin: Non siamo nel browser')
      return
    }

    try {
      const userType = sessionStorage.getItem('userType')
      const codice = sessionStorage.getItem('codice')
      
      console.log('Admin Check:', { userType, codice })

      if (!userType || !codice) {
        console.log('Admin: Credenziali mancanti')
        window.location.replace('/')
        return
      }

      if (userType === 'admin' && codice === 'admin2025') {
        console.log('Admin: Autorizzazione confermata')
        setIsAuthorized(true)
      } else {
        console.log('Admin: Credenziali non valide')
        window.location.replace('/')
      }
    } catch (error) {
      console.error('Admin Error:', error)
      window.location.replace('/')
    }
  }, [])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verifica accesso admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Benvenuto nella dashboard admin</p>
    </div>
  )
} 