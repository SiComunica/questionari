'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')

  const verificaCodice = () => {
    setError('')
    
    // Verifica e reindirizza direttamente
    if (codice === 'admin2025') {
      try {
        // Salva i dati
        localStorage.setItem('userType', 'admin')
        localStorage.setItem('codice', codice)
        
        // Reindirizza
        const path = '/admin/questionari/lista'
        console.log('Reindirizzamento admin a:', path)
        
        // Forza il reload completo
        window.top.location.href = path
      } catch (err) {
        console.error('Errore reindirizzamento admin:', err)
        setError('Errore durante l\'accesso')
      }
    } 
    else if (codice === 'anonimo9999') {
      try {
        localStorage.setItem('userType', 'anonimo')
        localStorage.setItem('codice', codice)
        console.log('Reindirizzamento anonimo a: /anonimo')
        window.top.location.href = '/anonimo'
      } catch (err) {
        console.error('Errore reindirizzamento anonimo:', err)
        setError('Errore durante l\'accesso')
      }
    }
    else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (!isNaN(num) && num >= 1 && num <= 300) {
        try {
          localStorage.setItem('userType', 'operatore')
          localStorage.setItem('codice', codice)
          console.log('Reindirizzamento operatore a: /operatore')
          window.top.location.href = '/operatore'
        } catch (err) {
          console.error('Errore reindirizzamento operatore:', err)
          setError('Errore durante l\'accesso')
        }
      } else {
        setError('Codice operatore non valido')
      }
    } 
    else {
      setError('Codice non valido')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Accedi al questionario
          </h2>
        </div>
        
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
            onClick={verificaCodice}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>

          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 