'use client'

import { useEffect, useState } from 'react'

export default function OperatoreDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const userType = sessionStorage.getItem('userType')
    const codice = sessionStorage.getItem('codice')
    
    if (userType === 'operatore' && codice?.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        setIsAuthorized(true)
      }
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
      <h1 className="text-2xl font-bold mb-4">Dashboard Operatore</h1>
      <p>Benvenuto nella dashboard operatore</p>
    </div>
  )
} 