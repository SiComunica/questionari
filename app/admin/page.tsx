'use client'

import { useEffect } from 'react'

export default function AdminDashboard() {
  useEffect(() => {
    const checkAuth = () => {
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      
      console.log('Admin Dashboard Check:', { userType, codice })
      
      if (userType !== 'admin' || codice !== 'admin2025') {
        console.log('Admin: Accesso non autorizzato')
        window.location.replace('/')
      }
    }

    // Piccolo delay per assicurarsi che localStorage sia disponibile
    setTimeout(checkAuth, 100)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Benvenuto nella dashboard admin</p>
    </div>
  )
} 