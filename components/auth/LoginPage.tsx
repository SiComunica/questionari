'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    // Admin
    if (codice === 'admin2025') {
      localStorage.setItem('userType', 'admin')
      document.location.href = '/admin/questionari/lista'
      return
    }

    // Anonimo
    if (codice === 'anonimo9999') {
      localStorage.setItem('userType', 'anonimo')
      document.location.href = '/anonimo'
      return
    }

    // Operatore
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        localStorage.setItem('userType', 'operatore')
        document.location.href = '/operatore'
        return
      }
    }

    setError('Codice non valido')
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

        <div className="mt-8 space-y-4">
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

          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>Codici di accesso:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Admin: admin2025</li>
            <li>Operatore: operatore1 fino a operatore300</li>
            <li>Anonimo: anonimo9999</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 