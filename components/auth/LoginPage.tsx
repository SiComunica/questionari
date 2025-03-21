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
    console.log('Form submitted')
    console.log('Codice inserito:', codice)

    try {
      if (codice === 'admin2025') {
        console.log('Login come admin')
        localStorage.setItem('userType', 'admin')
        window.location.replace('/admin/questionari/lista')
        return
      } 
      
      if (codice === 'anonimo9999') {
        console.log('Login come anonimo')
        localStorage.setItem('userType', 'anonimo')
        window.location.replace('/anonimo')
        return
      }
      
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          console.log('Login come operatore')
          localStorage.setItem('userType', 'operatore')
          window.location.replace('/operatore')
          return
        }
      }

      console.log('Codice non valido')
      setError('Codice di accesso non valido')
    } catch (err) {
      console.error('Errore durante il login:', err)
      setError('Errore durante il login')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input cambiato:', e.target.value)
    setCodice(e.target.value)
    setError('') // Pulisce l'errore quando l'utente inizia a digitare
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
              onChange={handleInputChange}
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
              onClick={() => console.log('Button clicked')}
            >
              Accedi
            </Button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Stato corrente: {localStorage.getItem('userType') || 'non autenticato'}
        </div>
      </Card>
    </div>
  )
} 