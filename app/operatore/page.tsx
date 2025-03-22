'use client'

import { useEffect, useState } from 'react'

export default function OperatoreDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    try {
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      
      console.log('Operatore Check:', { userType, codice })

      if (userType === 'operatore' && codice?.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          console.log('Operatore: Autorizzazione confermata')
          setIsAuthorized(true)
        } else {
          window.location.href = '/'
        }
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Operatore Error:', error)
      window.location.href = '/'
    }
  }, [])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verifica accesso operatore...</p>
        </div>
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