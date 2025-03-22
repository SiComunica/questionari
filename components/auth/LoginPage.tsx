'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')

  const verificaCodice = () => {
    // Resetta
    setError('')
    setUrl('')
    
    // Verifica e imposta URL
    if (codice === 'admin2025') {
      localStorage.setItem('userType', 'admin')
      setUrl('/admin/questionari/lista')
    } 
    else if (codice === 'anonimo9999') {
      localStorage.setItem('userType', 'anonimo')
      setUrl('/anonimo')
    }
    else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        localStorage.setItem('userType', 'operatore')
        setUrl('/operatore')
      } else {
        setError('Codice operatore non valido')
      }
    } 
    else {
      setError('Codice non valido')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Accedi al questionario
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          <input
            type="text"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
          />

          <button
            type="button"
            onClick={verificaCodice}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Verifica codice
          </button>

          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

          {url && (
            <div className="text-center">
              <p className="text-green-600 mb-4">Codice valido!</p>
              <a 
                href={url}
                className="inline-block bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
              >
                Clicca qui per entrare
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 