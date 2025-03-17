'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Verifica il codice direttamente con una RPC (funzione database)
      const { data, error: rpcError } = await supabase
        .rpc('verify_user_code', {
          user_code: codice
        })

      if (rpcError || !data) {
        console.error('Errore di login:', rpcError)
        setError('Codice non valido')
        return
      }

      // Reindirizza in base al codice
      if (codice === 'admin2025') {
        router.push('/dashboard/admin')
      } else if (codice === 'anonimo9999') {
        router.push('/dashboard/anonimo')
      } else if (codice.startsWith('operatore')) {
        router.push('/dashboard/operatore')
      } else {
        setError('Codice non valido')
      }

    } catch (err) {
      console.error('Errore:', err)
      setError('Errore durante l\'accesso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Accesso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Inserisci il codice di accesso"
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              disabled={loading}
            />
            
            <Button 
              type="submit"
              className="w-full"
              disabled={loading || !codice.trim()}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 