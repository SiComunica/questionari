'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted') // Debug

    if (!codice) {
      setError('Inserisci un codice')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Chiamata signIn con:', codice) // Debug
      await signIn(codice)
      console.log('SignIn completato') // Debug
    } catch (err) {
      console.error('Errore login:', err)
      setError('Codice di accesso non valido')
    } finally {
      // Non resettiamo loading qui perché verremo reindirizzati
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full p-8">
        <h2 className="text-center text-3xl font-bold mb-6">
          Accedi
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Inserisci il tuo codice di accesso
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              placeholder="Codice di accesso"
              required
              disabled={loading}
              className="w-full"
            />

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 