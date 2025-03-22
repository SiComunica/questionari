'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')

  const redirect = (path: string) => {
    console.log('Tentativo reindirizzamento a:', path)
    
    // Prova tutti i metodi possibili di reindirizzamento
    try {
      window.location.replace(path)
    } catch (e) {
      console.log('Replace fallito, provo href')
      try {
        window.location.href = path
      } catch (e) {
        console.log('Href fallito, provo assign')
        try {
          window.location.assign(path)
        } catch (e) {
          console.log('Assign fallito, ultimo tentativo')
          document.location.href = path
        }
      }
    }
  }

  const handleLogin = () => {
    console.log('Tentativo login con:', codice)

    // Admin
    if (codice === 'admin2025') {
      console.log('Login admin...')
      localStorage.setItem('userType', 'admin')
      localStorage.setItem('codice', codice)
      
      const fullUrl = window.location.origin + '/admin/questionari/lista'
      console.log('URL completo:', fullUrl)
      
      // Forza il reindirizzamento
      redirect(fullUrl)
      return
    }

    // Anonimo
    if (codice === 'anonimo9999') {
      console.log('Login anonimo...')
      localStorage.setItem('userType', 'anonimo')
      localStorage.setItem('codice', codice)
      
      const fullUrl = window.location.origin + '/anonimo'
      redirect(fullUrl)
      return
    }

    // Operatore
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        console.log('Login operatore...')
        localStorage.setItem('userType', 'operatore')
        localStorage.setItem('codice', codice)
        
        const fullUrl = window.location.origin + '/operatore'
        redirect(fullUrl)
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

        <div className="mt-4 text-sm text-gray-500">
          URL corrente: {typeof window !== 'undefined' ? window.location.href : ''}
        </div>
      </div>
    </div>
  )
} 