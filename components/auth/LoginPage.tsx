'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')

  const handleLogin = () => {
    if (codice === 'admin2025') {
      window.location.href = '/admin/questionari/lista'
    } else if (codice === 'anonimo9999') {
      window.location.href = '/anonimo'
    } else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        window.location.href = '/operatore'
      }
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
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Accedi
        </button>
      </div>
    </div>
  )
} 