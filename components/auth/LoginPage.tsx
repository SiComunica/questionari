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

    // Verifica codice admin
    if (codice === 'admin2025') {
      sessionStorage.setItem('userType', 'admin')
      sessionStorage.setItem('codice', codice)
      setUrl('/admin/questionari/lista')
      return
    }

    // Verifica codice anonimo
    if (codice === 'anonimo9999') {
      sessionStorage.setItem('userType', 'anonimo')
      sessionStorage.setItem('codice', codice)
      setUrl('/anonimo')
      return
    }

    // Verifica codice operatore
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        sessionStorage.setItem('userType', 'operatore')
        sessionStorage.setItem('codice', codice)
        setUrl('/operatore')
        return
      }
    }

    // Se arriviamo qui, il codice non è valido
    setError('Codice non valido')
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
          Codice inserito: {codice}<br />
          URL generato: {url}<br />
          Tipo utente: {sessionStorage.getItem('userType')}
        </div>
      </div>
    </div>
  )
} 