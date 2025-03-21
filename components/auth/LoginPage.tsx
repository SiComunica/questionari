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

  const handleClick = async () => {
    console.log('Bottone cliccato')
    console.log('Tentativo di login con codice:', codice)
    
    if (loading) {
      console.log('Già in caricamento')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Verifica codice e reindirizza
      if (codice === 'admin2025') {
        console.log('Codice admin valido')
        // Forza il reindirizzamento
        const url = '/admin/questionari/lista'
        console.log('Reindirizzamento a:', url)
        window.open(url, '_self')
        return
      }

      if (codice === 'anonimo9999') {
        console.log('Codice anonimo valido')
        window.open('/anonimo', '_self')
        return
      }

      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          console.log('Codice operatore valido')
          window.open('/operatore', '_self')
          return
        }
      }

      console.log('Codice non valido')
      setError('Codice di accesso non valido')
    } catch (e) {
      console.error('Errore durante il login:', e)
      setError('Errore durante l\'accesso')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('Invio premuto')
      handleClick()
    }
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
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
            disabled={loading}
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              console.log('Click sul bottone')
              handleClick()
            }}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>Stato: {loading ? 'In caricamento' : 'Pronto'}</div>
          <div>URL corrente: {typeof window !== 'undefined' ? window.location.pathname : ''}</div>
          {error && <div>Errore: {error}</div>}
        </div>
      </div>
    </div>
  )
} 