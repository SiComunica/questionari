'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    setError('')
    
    // Rimuovi i cookie esistenti
    Cookies.remove('userType')
    Cookies.remove('codice')

    try {
      if (codice === 'admin2025') {
        // Imposta i cookie
        Cookies.set('userType', 'admin')
        Cookies.set('codice', codice)
        // Reindirizza
        window.location.href = '/admin/questionari/lista'
        return
      }

      if (codice === 'anonimo9999') {
        Cookies.set('userType', 'anonimo')
        Cookies.set('codice', codice)
        window.location.href = '/anonimo'
        return
      }

      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          Cookies.set('userType', 'operatore')
          Cookies.set('codice', codice)
          window.location.href = '/operatore'
          return
        }
      }

      setError('Codice non valido')
    } catch (e) {
      console.error('Errore:', e)
      setError('Errore durante l\'accesso')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Accedi al questionario
        </h2>

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <input
            type="text"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </div>
      </div>
    </div>
  )
} 