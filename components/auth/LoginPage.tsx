'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Tentativo di login con codice:', codice)
    
    try {
      if (codice === 'admin2025') {
        console.log('Codice admin valido, salvo userType...')
        // Salva il tipo utente prima del reindirizzamento
        localStorage.setItem('userType', 'admin')
        console.log('UserType salvato:', localStorage.getItem('userType'))
        
        // Reindirizza
        console.log('Reindirizzamento alla dashboard...')
        router.push('/admin/questionari/lista')
        return
      }
      
      if (codice === 'anonimo9999') {
        localStorage.setItem('userType', 'anonimo')
        router.push('/anonimo')
        return
      }
      
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          localStorage.setItem('userType', 'operatore')
          router.push('/operatore')
          return
        }
      }
      
      setError('Codice di accesso non valido')
    } catch (e) {
      console.error('Errore durante il login:', e)
      setError('Errore durante l\'accesso')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Accedi al questionario
          </h2>
          {error && (
            <div className="mt-3 text-red-500 text-center" role="alert">
              {error}
            </div>
          )}
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="mt-8 space-y-6"
          id="loginForm"
        >
          <div>
            <label 
              htmlFor="codiceAccesso" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Codice di accesso
            </label>
            <input
              id="codiceAccesso"
              type="text"
              value={codice}
              onChange={(e) => {
                setCodice(e.target.value)
                setError('')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Inserisci il codice di accesso"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>UserType: {typeof window !== 'undefined' ? localStorage.getItem('userType') : ''}</div>
        </div>
      </div>
    </div>
  )
} 