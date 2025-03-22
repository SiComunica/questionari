'use client'

import { useEffect, useState } from 'react'

export default function AnonimoDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const userType = sessionStorage.getItem('userType')
    const codice = sessionStorage.getItem('codice')
    
    if (userType === 'anonimo' && codice === 'anonimo9999') {
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
      <h1 className="text-2xl font-bold mb-4">Dashboard Anonimo</h1>
      <p>Benvenuto nella dashboard anonimo</p>
    </div>
  )
} 