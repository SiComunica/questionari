'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading) return
    
    setLoading(true)
    setError('')

    // Reindirizzamento diretto basato sul codice
    switch (codice) {
      case 'admin2025':
        document.location.href = '/admin/questionari/lista'
        break
      case 'anonimo9999':
        document.location.href = '/anonimo'
        break
      default:
        if (codice.startsWith('operatore')) {
          const num = parseInt(codice.replace('operatore', ''))
          if (!isNaN(num) && num >= 1 && num <= 300) {
            document.location.href = '/operatore'
            break
          }
        }
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
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          Codice: {codice}
        </div>
      </div>
    </div>
  )
} 