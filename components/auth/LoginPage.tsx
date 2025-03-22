'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    // Pulisci localStorage
    localStorage.clear()
    
    try {
      if (codice === 'admin2025') {
        // Salva i dati
        localStorage.setItem('userType', 'admin')
        localStorage.setItem('codice', codice)
        
        // Reindirizza
        console.log('Reindirizzamento admin...')
        window.location.assign('/admin/questionari/lista')
        return
      }
      
      if (codice === 'anonimo9999') {
        localStorage.setItem('userType', 'anonimo')
        localStorage.setItem('codice', codice)
        console.log('Reindirizzamento anonimo...')
        window.location.assign('/anonimo')
        return
      }
      
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          localStorage.setItem('userType', 'operatore')
          localStorage.setItem('codice', codice)
          console.log('Reindirizzamento operatore...')
          window.location.assign('/operatore')
          return
        }
      }
      
      setError('Codice non valido')
    } catch (e) {
      console.error('Errore:', e)
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
            <div className="mt-3 text-red-500 text-center">
              {error}
            </div>
          )}
        </div>
        
        <div className="mt-8 space-y-6">
          <input
            type="text"
            value={codice}
            onChange={(e) => {
              setCodice(e.target.value)
              setError('')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
          />

          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice: {codice}</div>
          <div>UserType: {typeof window !== 'undefined' ? localStorage.getItem('userType') : ''}</div>
          <div>Path: {typeof window !== 'undefined' ? window.location.pathname : ''}</div>
        </div>
      </div>
    </div>
  )
} 