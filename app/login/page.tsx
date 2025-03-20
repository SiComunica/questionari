'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await signIn(codice)
    } catch (err) {
      setError('Codice di accesso non valido')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Accedi</h2>
          <p className="mt-2 text-gray-600">Inserisci il tuo codice di accesso</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Input
              type="text"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              placeholder="Codice di accesso"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button type="submit" className="w-full">
            Accedi
          </Button>
        </form>
      </div>
    </div>
  )
} 