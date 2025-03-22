'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Pulisci localStorage
      window.localStorage.clear()
      
      console.log('Tentativo di accesso con codice:', codice)

      // Admin
      if (codice === 'admin2025') {
        window.localStorage.setItem('userType', 'admin')
        window.localStorage.setItem('codice', codice)
        console.log('Accesso admin valido, reindirizzamento...')
        window.location.replace('/admin')
        return
      }

      // Anonimo
      if (codice === 'anonimo9999') {
        window.localStorage.setItem('userType', 'anonimo')
        window.localStorage.setItem('codice', codice)
        console.log('Accesso anonimo valido, reindirizzamento...')
        window.location.replace('/anonimo')
        return
      }

      // Operatore
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          window.localStorage.setItem('userType', 'operatore')
          window.localStorage.setItem('codice', codice)
          console.log('Accesso operatore valido, reindirizzamento...')
          window.location.replace('/operatore')
          return
        }
      }

      setError('Codice non valido')
    } catch (error) {
      console.error('Errore:', error)
      setError('Errore durante la verifica')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Accedi al questionario
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="text"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>

          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

          <div className="text-sm text-gray-500 mt-2">
            Codice inserito: {codice}
          </div>
        </form>
      </div>
    </div>
  )
} 