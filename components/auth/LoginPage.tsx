'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [codice, setCodice] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form inviato con codice:', codice)

    // Admin
    if (codice === 'admin2025') {
      console.log('Codice admin valido')
      localStorage.setItem('userType', 'admin')
      try {
        await router.push('/admin/questionari/lista')
      } catch (e) {
        console.error('Errore router.push:', e)
        try {
          window.location.assign('/admin/questionari/lista')
        } catch (e) {
          console.error('Errore location.assign:', e)
          window.location.href = '/admin/questionari/lista'
        }
      }
      return
    }

    // Anonimo
    if (codice === 'anonimo9999') {
      console.log('Codice anonimo valido')
      localStorage.setItem('userType', 'anonimo')
      try {
        await router.push('/anonimo')
      } catch (e) {
        window.location.href = '/anonimo'
      }
      return
    }

    // Operatore
    if (codice.startsWith('operatore')) {
      const num = parseInt(codice.replace('operatore', ''))
      if (num >= 1 && num <= 300) {
        console.log('Codice operatore valido')
        localStorage.setItem('userType', 'operatore')
        try {
          await router.push('/operatore')
        } catch (e) {
          window.location.href = '/operatore'
        }
        return
      }
    }

    console.log('Codice non valido:', codice)
    alert('Codice non valido')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('Tasto Enter premuto')
      handleSubmit(e as any)
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
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
          />

          <button
            onClick={(e) => handleSubmit(e)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accedi
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Path corrente: {typeof window !== 'undefined' ? window.location.pathname : ''}
        </div>
      </div>
    </div>
  )
} 