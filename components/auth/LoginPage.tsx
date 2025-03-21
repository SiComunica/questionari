'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted')

    if (!codice) {
      setError('Inserisci un codice')
      return
    }

    setLoading(true)
    setError('')

    try {
      let redirectUrl = '/'

      // Verifica diretta del codice
      if (codice === 'admin2025') {
        redirectUrl = '/admin/questionari/lista'
        localStorage.setItem('userType', 'admin')
      } else if (codice === 'anonimo9999') {
        redirectUrl = '/anonimo'
        localStorage.setItem('userType', 'anonimo')
      } else if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          redirectUrl = '/operatore'
          localStorage.setItem('userType', 'operatore')
        } else {
          throw new Error('Codice operatore non valido')
        }
      } else {
        throw new Error('Codice non valido')
      }

      localStorage.setItem('codiceAccesso', codice)
      console.log('Reindirizzamento a:', redirectUrl)
      
      // Forza il reindirizzamento
      window.location.replace(redirectUrl)
      
    } catch (err) {
      console.error('Errore login:', err)
      setError('Codice di accesso non valido')
      setLoading(false)
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