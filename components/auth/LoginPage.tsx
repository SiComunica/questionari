'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('Tentativo di login con codice: ' + codice) // Debug con alert

    // Verifica il codice e reindirizza
    if (codice === 'admin2025') {
      alert('Login come admin') // Debug
      window.location.href = '/admin/questionari/lista'
    } 
    else if (codice === 'anonimo9999') {
      alert('Login come anonimo') // Debug
      window.location.href = '/anonimo'
    }
    else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        alert('Login come operatore') // Debug
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
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              placeholder="Inserisci il codice di accesso"
              required
              className="w-full p-2 border rounded"
            />

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Accedi
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 