'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const { signIn, loading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn(code)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Accesso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Inserisci il codice di accesso"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
            
            <Button 
              type="submit"
              className="w-full"
              disabled={loading || !code.trim()} // Disabilita se loading o codice vuoto
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