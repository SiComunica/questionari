'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [codice, setCodice] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Pulisci storage
    localStorage.clear()
    
    // Admin
    if (codice === 'admin2025') {
      localStorage.setItem('userType', 'admin')
      window.location.href = 'https://questionari-git-main-sicomunica-cf8f98ae.vercel.app/admin/questionari/lista'
      return
    }

    // Anonimo
    if (codice === 'anonimo9999') {
      localStorage.setItem('userType', 'anonimo')
      window.location.href = 'https://questionari-git-main-sicomunica-cf8f98ae.vercel.app/anonimo'
      return
    }

    // Operatore
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        localStorage.setItem('userType', 'operatore')
        window.location.href = 'https://questionari-git-main-sicomunica-cf8f98ae.vercel.app/operatore'
        return
      }
    }

    alert('Codice non valido')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <form 
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-8"
      >
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Accedi al questionario
        </h2>

        <input
          type="text"
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Inserisci il codice di accesso"
          required
        />

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Accedi
        </button>

        <div className="mt-4 text-sm text-gray-500">
          URL Dashboard: https://questionari-git-main-sicomunica-cf8f98ae.vercel.app/admin/questionari/lista
        </div>
      </form>
    </div>
  )
} 