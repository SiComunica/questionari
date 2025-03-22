'use client'

import { useEffect } from 'react'

export default function OperatoreDashboard() {
  useEffect(() => {
    const checkAuth = () => {
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      
      console.log('Operatore Dashboard Check:', { userType, codice })

      if (userType !== 'operatore') {
        console.log('Operatore: Tipo utente non valido')
        window.location.replace('/')
        return
      }

      if (!codice?.startsWith('operatore')) {
        console.log('Operatore: Codice formato non valido')
        window.location.replace('/')
        return
      }

      const num = parseInt(codice.replace('operatore', ''))
      if (isNaN(num) || num < 1 || num > 300) {
        console.log('Operatore: Numero non valido')
        window.location.replace('/')
      }
    }

    // Piccolo delay per assicurarsi che localStorage sia disponibile
    setTimeout(checkAuth, 100)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Operatore</h1>
      <p>Benvenuto nella dashboard operatore</p>
    </div>
  )
} 