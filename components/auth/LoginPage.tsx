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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Tentativo di login con codice:', codice) // Debug log
      
      if (!codice) {
        throw new Error('Inserisci un codice di accesso')
      }

      // Per operatore, verifichiamo che il formato sia corretto
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (isNaN(num) || num < 1 || num > 300) {
          throw new Error('Codice operatore non valido')
        }
      }

      await signIn(codice)
    } catch (err) {
      console.error('Errore durante il login:', err) // Debug log
      setError(err instanceof Error ? err.message : 'Codice di accesso non valido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accedi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inserisci il tuo codice di accesso
          </p>
          <div className="mt-2 text-center text-xs text-gray-500">
            Codici validi:<br />
            - admin2025 (per amministratori)<br />
            - anonimo9999 (per accesso anonimo)<br />
            - operatore1 fino a operatore300 (per operatori)
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              placeholder="Codice di accesso"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 