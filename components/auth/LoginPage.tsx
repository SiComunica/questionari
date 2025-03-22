'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [validUrl, setValidUrl] = useState('')

  const verificaCodice = () => {
    // Pulisci stato
    localStorage.clear()
    setValidUrl('')

    // Verifica codice
    if (codice === 'admin2025') {
      localStorage.setItem('userType', 'admin')
      localStorage.setItem('codice', codice)
      setValidUrl('/admin/questionari/lista')
      return
    }

    if (codice === 'anonimo9999') {
      localStorage.setItem('userType', 'anonimo')
      localStorage.setItem('codice', codice)
      setValidUrl('/anonimo')
      return
    }

    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        localStorage.setItem('userType', 'operatore')
        localStorage.setItem('codice', codice)
        setValidUrl('/operatore')
        return
      }
    }

    alert('Codice non valido')
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
          />

          <button
            type="button"
            onClick={verificaCodice}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Verifica codice
          </button>

          {validUrl && (
            <div className="text-center space-y-4">
              <p className="text-green-600">Codice valido! Scegli come accedere:</p>
              
              <a 
                href={validUrl}
                className="block w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Link diretto
              </a>
              
              <button
                onClick={() => window.location.href = validUrl}
                className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Bottone window.location
              </button>
              
              <button
                onClick={() => window.open(validUrl, '_self')}
                className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Bottone window.open
              </button>

              <div className="mt-4 text-sm text-gray-500">
                <p>UserType: {localStorage.getItem('userType')}</p>
                <p>Codice: {localStorage.getItem('codice')}</p>
                <p>URL: {validUrl}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 