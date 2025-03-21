'use client'

import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Log all'avvio del componente
  useEffect(() => {
    console.log('LoginPage montato')
  }, [])

  const handleClick = () => {
    console.log('Bottone cliccato')
    console.log('Codice:', codice)
    
    if (loading) return
    setLoading(true)
    
    // Verifica diretta del codice
    if (codice === 'admin2025') {
      console.log('Codice admin valido')
      // Prova tutti i metodi di reindirizzamento
      try {
        const baseUrl = window.location.origin
        const targetUrl = `${baseUrl}/admin/questionari/lista`
        console.log('Reindirizzamento a:', targetUrl)
        window.location.href = targetUrl
      } catch (e) {
        console.error('Errore reindirizzamento:', e)
      }
      return
    }
    
    if (codice === 'anonimo9999') {
      const baseUrl = window.location.origin
      window.location.href = `${baseUrl}/anonimo`
      return
    }
    
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        const baseUrl = window.location.origin
        window.location.href = `${baseUrl}/operatore`
        return
      }
    }

    console.log('Codice non valido')
    setError('Codice di accesso non valido')
    setLoading(false)
  }

  // Log quando il componente viene aggiornato
  useEffect(() => {
    console.log('Stato attuale:', { codice, loading, error })
  }, [codice, loading, error])

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
            onClick={handleClick}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>Stato: {loading ? 'In caricamento' : 'Pronto'}</div>
          {error && <div>Errore: {error}</div>}
        </div>
      </div>
    </div>
  )
} 