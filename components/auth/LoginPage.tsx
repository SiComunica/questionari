'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Tentativo login con:', codice)

    // Login diretto senza context
    if (codice === 'admin2025') {
      localStorage.setItem('userType', 'admin')
      window.location.href = '/admin/questionari/lista'
    } 
    else if (codice === 'anonimo9999') {
      localStorage.setItem('userType', 'anonimo')
      window.location.href = '/anonimo'
    }
    else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        localStorage.setItem('userType', 'operatore')
        window.location.href = '/operatore'
      } else {
        setError('Codice operatore non valido')
      }
    }
    else {
      setError('Codice di accesso non valido')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full p-8">
        <h2 className="text-center text-3xl font-bold mb-6">
          Accedi
        </h2>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              type="text"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              placeholder="Inserisci il codice di accesso"
              required
            />

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Accedi
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 