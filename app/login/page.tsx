'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(code)
    } catch (err) {
      setError('Codice non valido')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Accesso</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Inserisci il codice di accesso"
            className="w-full p-2 border rounded mb-4"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  )
} 