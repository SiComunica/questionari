'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reindirizzamento diretto basato sul codice
    if (codice === 'admin2025') {
      // Salva i dati e reindirizza
      localStorage.setItem('userType', 'admin')
      localStorage.setItem('codice', codice)
      document.location.replace('/admin/questionari/lista')
      return
    }
    
    if (codice === 'anonimo9999') {
      localStorage.setItem('userType', 'anonimo')
      localStorage.setItem('codice', codice)
      document.location.replace('/anonimo')
      return
    }
    
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        localStorage.setItem('userType', 'operatore')
        localStorage.setItem('codice', codice)
        document.location.replace('/operatore')
        return
      }
    }
    
    setError('Codice di accesso non valido')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Accedi al questionario
          </h2>
          {error && (
            <div className="mt-3 text-red-500 text-center">
              {error}
            </div>
          )}
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="mt-8 space-y-6"
        >
          <div>
            <label 
              htmlFor="codiceAccesso" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Codice di accesso
            </label>
            <input
              id="codiceAccesso"
              type="text"
              value={codice}
              onChange={(e) => {
                setCodice(e.target.value)
                setError('')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Inserisci il codice di accesso"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
        </div>
      </div>
    </div>
  )
} 