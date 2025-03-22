'use client'

import { useEffect, useState } from 'react'

export default function OperatoreDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [codiceOperatore, setCodiceOperatore] = useState('')

  useEffect(() => {
    const userType = sessionStorage.getItem('userType')
    const codice = sessionStorage.getItem('codice')
    
    console.log('Operatore Check:', { userType, codice })
    
    if (userType === 'operatore' && codice?.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        setIsAuthorized(true)
        setCodiceOperatore(codice)
      } else {
        window.location.href = '/'
      }
    } else {
      window.location.href = '/'
    }
  }, [])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verifica accesso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Operatore</h1>
      <p className="mb-4">Benvenuto operatore {codiceOperatore}</p>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Funzionalità Operatore</h2>
        <ul className="space-y-2">
          <li>• Compilazione questionari</li>
          <li>• Visualizzazione report</li>
          <li>• Gestione profilo</li>
        </ul>
      </div>
    </div>
  )
} 