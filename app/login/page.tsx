'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    switch (code) {
      case 'admin2025':
        router.push('/admin')
        break
      case 'operatore1':
        router.push('/operatore')
        break
      case 'anonimo9999':
        router.push('/anonimo')
        break
      default:
        setError('Codice di accesso non valido')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Accesso</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Inserisci il codice di accesso"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Accedi
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p className="text-center">Codici di accesso:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Admin: admin2025</li>
            <li>Operatore: operatore1</li>
            <li>Anonimo: anonimo9999</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 