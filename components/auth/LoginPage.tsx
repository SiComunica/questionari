'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Pulisci localStorage
    localStorage.clear()

    // Costruisci l'URL base
    const baseUrl = window.location.protocol + '//' + window.location.host

    // Verifica il codice e reindirizza
    let targetUrl = ''
    let userType = ''

    if (codice === 'admin2025') {
      targetUrl = baseUrl + '/admin/questionari/lista'
      userType = 'admin'
    } 
    else if (codice === 'anonimo9999') {
      targetUrl = baseUrl + '/anonimo'
      userType = 'anonimo'
    }
    else if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        targetUrl = baseUrl + '/operatore'
        userType = 'operatore'
      }
    }

    if (targetUrl && userType) {
      // Salva i dati
      localStorage.setItem('userType', userType)
      localStorage.setItem('codice', codice)

      // Crea un form e forzane l'invio
      const form = document.createElement('form')
      form.method = 'GET'
      form.action = targetUrl

      // Aggiungi i dati come campi nascosti
      const typeInput = document.createElement('input')
      typeInput.type = 'hidden'
      typeInput.name = 'userType'
      typeInput.value = userType
      form.appendChild(typeInput)

      const codeInput = document.createElement('input')
      codeInput.type = 'hidden'
      codeInput.name = 'code'
      codeInput.value = codice
      form.appendChild(codeInput)

      // Aggiungi il form al documento e invialo
      document.body.appendChild(form)
      form.submit()
    } else {
      alert('Codice non valido')
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