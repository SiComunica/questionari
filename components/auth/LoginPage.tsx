'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')

  const handleLogin = () => {
    // Verifica il codice
    let path = ''
    
    switch(codice) {
      case 'admin2025':
        path = '/admin/questionari/lista'
        break
      case 'anonimo9999':
        path = '/anonimo'
        break
      default:
        if (codice.startsWith('operatore')) {
          const num = parseInt(codice.replace('operatore', ''))
          if (num >= 1 && num <= 300) {
            path = '/operatore'
          }
        }
    }

    if (!path) {
      alert('Codice non valido')
      return
    }

    // Salva i dati
    try {
      localStorage.clear()
      localStorage.setItem('codice', codice)
      localStorage.setItem('userType', path.includes('admin') ? 'admin' : path.includes('operatore') ? 'operatore' : 'anonimo')
    } catch (e) {
      console.error('Errore localStorage:', e)
    }

    // Reindirizza
    try {
      const a = document.createElement('a')
      a.href = path
      a.click()
    } catch (e) {
      console.error('Errore reindirizzamento:', e)
      window.location.href = path
    }
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