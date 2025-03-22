'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const verificaCodice = () => {
    if (typeof window === 'undefined') return
    setError('')

    try {
      // Pulisci localStorage
      window.localStorage.clear()

      // Test code
      if (codice === 'test1234') {
        window.localStorage.setItem('userType', 'test')
        window.localStorage.setItem('codice', codice)
        window.location.replace('/test')
        return
      }

      // Verifica codice admin
      if (codice === 'admin2025') {
        window.localStorage.setItem('userType', 'admin')
        window.localStorage.setItem('codice', codice)
        window.location.replace('/admin')
        return
      }

      // Verifica codice anonimo
      if (codice === 'anonimo9999') {
        window.localStorage.setItem('userType', 'anonimo')
        window.localStorage.setItem('codice', codice)
        window.location.replace('/anonimo')
        return
      }

      // Verifica codice operatore
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          window.localStorage.setItem('userType', 'operatore')
          window.localStorage.setItem('codice', codice)
          window.location.replace('/operatore')
          return
        }
      }

      setError('Codice non valido')
    } catch (error) {
      console.error('Errore:', error)
      setError('Errore durante la verifica')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Accedi al questionario
        </h2>

        <input
          type="text"
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          placeholder="Inserisci il codice di accesso"
        />

        <button
          onClick={verificaCodice}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        >
          Accedi
        </button>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}
      </div>
    </div>
  )
} 