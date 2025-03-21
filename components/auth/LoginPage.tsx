'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Tentativo di login con codice:', codice)

    try {
      if (codice === 'admin2025') {
        console.log('Login come admin')
        await router.push('/admin/questionari/lista')
      } 
      else if (codice === 'anonimo9999') {
        console.log('Login come anonimo')
        await router.push('/anonimo')
      }
      else if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          console.log('Login come operatore')
          await router.push('/operatore')
        } else {
          setError('Codice operatore non valido')
        }
      }
      else {
        setError('Codice di accesso non valido')
      }
    } catch (err) {
      console.error('Errore durante il reindirizzamento:', err)
      setError('Errore durante il login')
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