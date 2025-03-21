'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')

  const checkCode = () => {
    if (codice === 'admin2025') {
      setDestinationUrl('/admin/questionari/lista')
      return true
    }
    if (codice === 'anonimo9999') {
      setDestinationUrl('/anonimo')
      return true
    }
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        setDestinationUrl('/operatore')
        return true
      }
    }
    setError('Codice di accesso non valido')
    return false
  }

  const handleRedirect = () => {
    if (destinationUrl) {
      window.location.href = destinationUrl
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
            onChange={(e) => {
              setCodice(e.target.value)
              setError('')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
          />

          {destinationUrl ? (
            <button
              onClick={handleRedirect}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Clicca qui per entrare
            </button>
          ) : (
            <button
              type="button"
              onClick={checkCode}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Verifica codice
            </button>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          {destinationUrl && (
            <div>
              URL di destinazione: {destinationUrl}
              <Link 
                href={destinationUrl}
                className="ml-2 text-blue-600 hover:underline"
              >
                (link diretto)
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 