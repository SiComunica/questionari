'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const verificaCodice = () => {
    setError('')
    setUrl('')
    localStorage.clear() // Pulisci sempre prima

    try {
      // Verifica codice admin
      if (codice === 'admin2025') {
        localStorage.setItem('userType', 'admin')
        localStorage.setItem('codice', codice)
        setUrl('/admin')
        return
      }

      // Verifica codice anonimo
      if (codice === 'anonimo9999') {
        localStorage.setItem('userType', 'anonimo')
        localStorage.setItem('codice', codice)
        setUrl('/anonimo')
        return
      }

      // Verifica codice operatore
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          localStorage.setItem('userType', 'operatore')
          localStorage.setItem('codice', codice)
          setUrl('/operatore')
          return
        }
      }

      setError('Codice non valido')
    } catch (error) {
      console.error('Errore:', error)
      setError('Errore durante la verifica')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Accedi al questionario
        </h2>

        <input
          type="text"
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          placeholder="Inserisci il codice di accesso"
        />

        <button
          onClick={verificaCodice}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        >
          Verifica codice
        </button>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        {url && (
          <Link 
            href={url}
            className="block w-full py-3 px-4 bg-green-600 text-white text-center rounded-md hover:bg-green-700"
          >
            Accedi alla dashboard
          </Link>
        )}

        {/* Debug info */}
        <div className="mt-4 text-sm text-gray-500">
          Codice: {codice}<br />
          URL: {url}<br />
          Storage: {JSON.stringify({
            userType: localStorage.getItem('userType'),
            codice: localStorage.getItem('codice')
          })}
        </div>
      </div>
    </div>
  )
} 