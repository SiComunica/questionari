'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    // Log immediato
    console.log('Click sul bottone')
    console.log('Codice:', codice)

    // Imposta loading
    setLoading(true)

    // Verifica codice
    if (codice === 'admin2025') {
      console.log('Reindirizzamento admin...')
      // Forza il reindirizzamento
      window.location.assign('/admin/questionari/lista')
      return
    }

    if (codice === 'anonimo9999') {
      console.log('Reindirizzamento anonimo...')
      window.location.assign('/anonimo')
      return
    }

    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        console.log('Reindirizzamento operatore...')
        window.location.assign('/operatore')
        return
      }
    }

    // Se arriviamo qui, il codice non è valido
    console.log('Codice non valido')
    setError('Codice di accesso non valido')
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleClick()
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
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Inserisci il codice di accesso"
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleClick}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </div>
        </form>

        {/* Debug info */}
        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>Stato: {loading ? 'Caricamento...' : 'Pronto'}</div>
          <div>URL corrente: {typeof window !== 'undefined' ? window.location.pathname : ''}</div>
        </div>
      </div>
    </div>
  )
} 