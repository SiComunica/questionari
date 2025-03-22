'use client'

import { useState, useEffect } from 'react'

export default function OperatoreDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      
      console.log('Operatore Check:', { userType, codice })

      if (userType !== 'operatore') {
        console.log('Operatore: Tipo utente non valido')
        window.location.href = '/'
        return
      }

      if (!codice?.startsWith('operatore')) {
        console.log('Operatore: Codice formato non valido')
        window.location.href = '/'
        return
      }

      const num = parseInt(codice.replace('operatore', ''))
      if (isNaN(num) || num < 1 || num > 300) {
        console.log('Operatore: Numero non valido')
        window.location.href = '/'
        return
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Operatore Error:', error)
      window.location.href = '/'
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Caricamento dashboard operatore...</p>
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