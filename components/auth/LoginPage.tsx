'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (loading) return
    setLoading(true)
    
    try {
      if (codice === 'admin2025') {
        // Usa un form per il reindirizzamento
        const form = document.createElement('form')
        form.method = 'GET'
        form.action = '/admin/questionari/lista'
        document.body.appendChild(form)
        form.submit()
        return
      }

      if (codice === 'anonimo9999') {
        const form = document.createElement('form')
        form.method = 'GET'
        form.action = '/anonimo'
        document.body.appendChild(form)
        form.submit()
        return
      }

      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          const form = document.createElement('form')
          form.method = 'GET'
          form.action = '/operatore'
          document.body.appendChild(form)
          form.submit()
          return
        }
      }

      setError('Codice di accesso non valido')
    } catch (e) {
      setError('Errore durante l\'accesso')
    } finally {
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
            type="button"
            disabled={loading}
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>Stato: {loading ? 'In caricamento' : 'Pronto'}</div>
        </div>
      </div>
    </div>
  )
} 