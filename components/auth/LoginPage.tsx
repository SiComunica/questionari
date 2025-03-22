'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')

  const handleLogin = () => {
    console.log('Tentativo login con:', codice)

    // Admin
    if (codice === 'admin2025') {
      console.log('Login admin...')
      localStorage.setItem('userType', 'admin')
      localStorage.setItem('codice', codice)
      // Forza il reindirizzamento
      const url = '/admin/questionari/lista'
      console.log('Reindirizzamento a:', url)
      setTimeout(() => {
        try {
          window.location.replace(url)
        } catch (e) {
          console.error('Errore replace:', e)
          window.location.href = url
        }
      }, 100)
      return
    }

    // Anonimo
    if (codice === 'anonimo9999') {
      console.log('Login anonimo...')
      localStorage.setItem('userType', 'anonimo')
      localStorage.setItem('codice', codice)
      setTimeout(() => {
        window.location.replace('/anonimo')
      }, 100)
      return
    }

    // Operatore
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        console.log('Login operatore...')
        localStorage.setItem('userType', 'operatore')
        localStorage.setItem('codice', codice)
        setTimeout(() => {
          window.location.replace('/operatore')
        }, 100)
        return
      }
    }

    alert('Codice non valido')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Accedi al questionario
        </h2>

        <div className="mt-8 space-y-6">
          <input
            type="text"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </div>
      </div>
    </div>
  )
} 