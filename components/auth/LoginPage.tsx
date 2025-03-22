'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')

  const handleLogin = () => {
    // Pulisci localStorage
    localStorage.clear()

    // Verifica codice e reindirizza
    if (codice === 'admin2025') {
      localStorage.setItem('userType', 'admin')
      localStorage.setItem('codice', codice)
      window.open('/admin/questionari/lista', '_self')
      return
    }

    if (codice === 'anonimo9999') {
      localStorage.setItem('userType', 'anonimo')
      localStorage.setItem('codice', codice)
      window.open('/anonimo', '_self')
      return
    }

    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        localStorage.setItem('userType', 'operatore')
        localStorage.setItem('codice', codice)
        window.open('/operatore', '_self')
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
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </div>
      </div>
    </div>
  )
} 