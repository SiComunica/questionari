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

  const redirect = (path: string) => {
    console.log('Tentativo di reindirizzamento a:', path)
    try {
      // Prova tutti i metodi di reindirizzamento possibili
      window.location.assign(path)
      console.log('Reindirizzamento con assign')
    } catch (e) {
      console.error('Errore con assign:', e)
      try {
        window.location.href = path
        console.log('Reindirizzamento con href')
      } catch (e) {
        console.error('Errore con href:', e)
        try {
          window.location.replace(path)
          console.log('Reindirizzamento con replace')
        } catch (e) {
          console.error('Errore con replace:', e)
        }
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form sottomesso')
    
    if (loading) {
      console.log('Già in caricamento, ignoro')
      return
    }
    
    setLoading(true)
    setError('')
    
    console.log('Verifica codice:', codice)

    try {
      if (codice === 'admin2025') {
        console.log('Codice admin valido')
        redirect('/admin/questionari/lista')
        return
      } 
      
      if (codice === 'anonimo9999') {
        console.log('Codice anonimo valido')
        redirect('/anonimo')
        return
      } 
      
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          console.log('Codice operatore valido')
          redirect('/operatore')
          return
        }
      }

      console.log('Codice non valido')
      setError('Codice di accesso non valido')
    } catch (e) {
      console.error('Errore durante la verifica:', e)
      setError('Errore durante la verifica del codice')
    } finally {
      setLoading(false)
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
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => console.log('Click sul bottone')}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>Stato: {loading ? 'In caricamento' : 'Pronto'}</div>
          {error && <div>Errore: {error}</div>}
        </div>
      </div>
    </div>
  )
} 