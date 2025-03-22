'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const userType = sessionStorage.getItem('userType')
    const codice = sessionStorage.getItem('codice')
    
    if (userType === 'admin' && codice === 'admin2025') {
      setIsAuthorized(true)
    }
  }, [])

  if (!isAuthorized) {
    return (
      <div className="p-8">
        <p>Verifica accesso...</p>
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