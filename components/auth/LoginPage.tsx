'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setError('')
    setLoading(true)

    try {
      let userType = ''
      let targetUrl = ''

      if (codice === 'admin2025') {
        userType = 'admin'
        targetUrl = '/admin/questionari/lista'
      } else if (codice === 'anonimo9999') {
        userType = 'anonimo'
        targetUrl = '/anonimo'
      } else if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          userType = 'operatore'
          targetUrl = '/operatore'
        }
      }

      if (userType && targetUrl) {
        // Pulisci localStorage
        localStorage.clear()
        
        // Salva nel localStorage
        localStorage.setItem('userType', userType)
        localStorage.setItem('codice', codice)

        // Reindirizza alla pagina di verifica
        window.location.href = '/verifica-accesso?redirect=' + encodeURIComponent(targetUrl)
      } else {
        setError('Codice non valido')
        setLoading(false)
      }
    } catch (e) {
      console.error('Errore:', e)
      setError('Errore durante l\'accesso')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Accedi al questionario
        </h2>

        <div className="mt-8 space-y-6">
          <input
            type="text"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
            disabled={loading}
          />

          <button
            onClick={handleLogin}
            disabled={loading || !codice}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>

          {error && (
            <div className="text-red-500 text-center mt-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 