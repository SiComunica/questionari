'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  console.log('LoginPage renderizzato') // Debug log
  
  const { signIn } = useAuth()
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted, codice:', codice) // Debug log
    
    if (!codice) {
      console.log('Codice vuoto') // Debug log
      return
    }
    
    setError('')
    setLoading(true)
    console.log('Tentativo di login con:', codice) // Debug log

    // Rimuoviamo async/await per semplificare
    signIn(codice).catch((err) => {
      console.error('Errore login:', err)
      setError('Codice di accesso non valido')
    }).finally(() => {
      setLoading(false)
    })
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
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Input
              type="text"
              value={codice}
              onChange={(e) => {
                console.log('Input changed:', e.target.value) // Debug log
                setCodice(e.target.value)
              }}
              placeholder="Codice di accesso"
              disabled={loading}
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
              disabled={loading || !codice}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 