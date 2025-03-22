'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setCookieWithOptions = (name: string, value: string) => {
    Cookies.set(name, value, {
      expires: 7, // 7 giorni
      path: '/',
      secure: true,
      sameSite: 'strict'
    })
  }

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      // Rimuovi i cookie esistenti
      Cookies.remove('userType', { path: '/' })
      Cookies.remove('codice', { path: '/' })

      let targetUrl = ''

      if (codice === 'admin2025') {
        setCookieWithOptions('userType', 'admin')
        setCookieWithOptions('codice', codice)
        targetUrl = '/admin/questionari/lista'
      } else if (codice === 'anonimo9999') {
        setCookieWithOptions('userType', 'anonimo')
        setCookieWithOptions('codice', codice)
        targetUrl = '/anonimo'
      } else if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          setCookieWithOptions('userType', 'operatore')
          setCookieWithOptions('codice', codice)
          targetUrl = '/operatore'
        }
      }

      if (targetUrl) {
        // Verifica che i cookie siano stati impostati
        const userType = Cookies.get('userType')
        const savedCodice = Cookies.get('codice')
        
        console.log('Cookie impostati:', { userType, savedCodice })
        
        // Attendi un momento per assicurarsi che i cookie siano salvati
        await new Promise(resolve => setTimeout(resolve, 500))
        
        window.location.href = targetUrl
      } else {
        setError('Codice non valido')
      }
    } catch (e) {
      console.error('Errore durante il login:', e)
      setError('Errore durante l\'accesso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Accedi al questionario
        </h2>

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <input
            type="text"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Inserisci il codice di accesso"
            disabled={loading}
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>

          <div className="text-sm text-gray-500 text-center">
            {Cookies.get('userType') && `Tipo utente: ${Cookies.get('userType')}`}
          </div>
        </div>
      </div>
    </div>
  )
} 