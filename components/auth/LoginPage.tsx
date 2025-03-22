'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [codice, setCodice] = useState('')

  const handleLogin = () => {
    let path = ''

    switch (codice) {
      case 'admin2025':
        path = '/admin/questionari/lista'
        break
      case 'anonimo9999':
        path = '/anonimo'
        break
      default:
        if (codice.startsWith('operatore')) {
          const num = parseInt(codice.replace('operatore', ''))
          if (num >= 1 && num <= 300) {
            path = '/operatore'
          }
        }
    }

    if (path) {
      // Salva il codice prima di reindirizzare
      sessionStorage.setItem('accessCode', codice)
      router.push(path)
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