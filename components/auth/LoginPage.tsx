'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Click sul bottone')
    
    if (loading) {
      console.log('Già in caricamento')
      return
    }
    
    console.log('Tentativo login con codice:', codice)
    setLoading(true)

    // Determina l'URL di destinazione
    let destinationUrl = ''
    
    if (codice === 'admin2025') {
      destinationUrl = '/admin/questionari/lista'
    } else if (codice === 'anonimo9999') {
      destinationUrl = '/anonimo'
    } else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        destinationUrl = '/operatore'
      }
    }

    if (destinationUrl) {
      console.log('Reindirizzamento a:', destinationUrl)
      // Crea un link e fai click
      const link = document.createElement('a')
      link.href = destinationUrl
      link.click()
    } else {
      console.log('Codice non valido')
      setError('Codice di accesso non valido')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Accedi al questionario
          </h2>
          {error && (
            <div className="mt-3 text-red-500 text-center">{error}</div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>Stato: {loading ? 'In caricamento' : 'Pronto'}</div>
          <div>URL corrente: {typeof window !== 'undefined' ? window.location.pathname : ''}</div>
        </div>
      </div>
    </div>
  )
} 