'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verifica il codice e reindirizza
    if (codice === 'admin2025') {
      // Crea e invia un form
      const form = document.createElement('form')
      form.style.display = 'none'
      form.method = 'GET'
      form.action = '/admin/questionari/lista'
      
      // Aggiungi il codice come parametro
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'code'
      input.value = codice
      form.appendChild(input)
      
      // Invia il form
      document.body.appendChild(form)
      form.submit()
      return
    }
    
    if (codice === 'anonimo9999') {
      window.location.replace('/anonimo')
      return
    }
    
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        window.location.replace('/operatore')
        return
      }
    }
    
    setError('Codice di accesso non valido')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Accedi al questionario
          </h2>
          {error && (
            <div className="mt-3 text-red-500 text-center">{error}</div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>
            <a href="/admin/questionari/lista" className="text-blue-600 hover:underline">
              Vai direttamente alla dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 