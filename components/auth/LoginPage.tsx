'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Gestisce il reindirizzamento in modo sicuro
  useEffect(() => {
    if (isRedirecting) {
      const userType = localStorage.getItem('userType')
      if (userType === 'admin') {
        window.location.href = '/admin/questionari/lista'
      } else if (userType === 'anonimo') {
        window.location.href = '/anonimo'
      } else if (userType === 'operatore') {
        window.location.href = '/operatore'
      }
    }
  }, [isRedirecting])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Previene la propagazione dell'evento
    
    if (isRedirecting) return
    
    try {
      if (codice === 'admin2025') {
        localStorage.setItem('userType', 'admin')
        localStorage.setItem('codice', codice)
        setIsRedirecting(true)
        return
      }
      
      if (codice === 'anonimo9999') {
        localStorage.setItem('userType', 'anonimo')
        localStorage.setItem('codice', codice)
        setIsRedirecting(true)
        return
      }
      
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (!isNaN(num) && num >= 1 && num <= 300) {
          localStorage.setItem('userType', 'operatore')
          localStorage.setItem('codice', codice)
          setIsRedirecting(true)
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
              disabled={isRedirecting}
            />
          </div>

          <button
            type="submit"
            disabled={isRedirecting}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isRedirecting ? 'Reindirizzamento...' : 'Accedi'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <div>Codice inserito: {codice}</div>
          <div>Stato: {isRedirecting ? 'Reindirizzamento in corso...' : 'Pronto'}</div>
          <div>UserType: {typeof window !== 'undefined' ? localStorage.getItem('userType') : ''}</div>
        </div>
      </div>
    </div>
  )
} 