'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setError('')
    setLoading(true)
    
    console.log('Form sottomesso')
    console.log('Tentativo di login con codice:', codice)

    // Verifica del codice
    if (codice === 'admin2025') {
      console.log('Codice admin valido')
      window.location.href = '/admin/questionari/lista'
      return
    }

    if (codice === 'anonimo9999') {
      console.log('Codice anonimo valido')
      window.location.href = '/anonimo'
      return
    }

    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        console.log('Codice operatore valido')
        window.location.href = '/operatore'
        return
      }
    }

    console.log('Codice non valido')
    setError('Codice di accesso non valido')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accedi al questionario
          </h2>
          {error && (
            <div className="mt-3 text-red-500 text-sm text-center">{error}</div>
          )}
        </div>
        
        <form className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Inserisci il codice di accesso"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="button"
              disabled={loading}
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </div>
        </form>

        {/* Debug info */}
        <div className="mt-4 text-sm text-gray-500">
          Codice inserito: {codice}
        </div>
      </div>
    </div>
  )
} 