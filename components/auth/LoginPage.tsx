'use client'

import { useState, useEffect } from 'react'

type StorageData = {
  userType: string | null
  codice: string | null
}

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [error, setError] = useState('')
  const [storage, setStorage] = useState<StorageData>({ userType: null, codice: null })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateStorage()
    }
  }, [])

  const updateStorage = () => {
    if (typeof window !== 'undefined') {
      setStorage({
        userType: window.localStorage.getItem('userType'),
        codice: window.localStorage.getItem('codice')
      })
    }
  }

  const verificaCodice = () => {
    if (typeof window === 'undefined') return

    setError('')
    window.localStorage.clear()

    try {
      // Verifica codice admin
      if (codice === 'admin2025') {
        window.localStorage.setItem('userType', 'admin')
        window.localStorage.setItem('codice', codice)
        console.log('Admin storage set:', {
          userType: window.localStorage.getItem('userType'),
          codice: window.localStorage.getItem('codice')
        })
        window.location.href = '/admin'
        return
      }

      // Verifica codice anonimo
      if (codice === 'anonimo9999') {
        window.localStorage.setItem('userType', 'anonimo')
        window.localStorage.setItem('codice', codice)
        console.log('Anonimo storage set:', {
          userType: window.localStorage.getItem('userType'),
          codice: window.localStorage.getItem('codice')
        })
        window.location.href = '/anonimo'
        return
      }

      // Verifica codice operatore
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          window.localStorage.setItem('userType', 'operatore')
          window.localStorage.setItem('codice', codice)
          console.log('Operatore storage set:', {
            userType: window.localStorage.getItem('userType'),
            codice: window.localStorage.getItem('codice')
          })
          window.location.href = '/operatore'
          return
        }
      }

      setError('Codice non valido')
    } catch (error) {
      console.error('Errore:', error)
      setError('Errore durante la verifica')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Accedi al questionario
        </h2>

        <input
          type="text"
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          placeholder="Inserisci il codice di accesso"
        />

        <button
          onClick={verificaCodice}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        >
          Accedi
        </button>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        {/* Debug info */}
        <div className="mt-4 text-sm text-gray-500">
          Codice: {codice}<br />
          Storage: {JSON.stringify(storage)}<br />
          LocalStorage: {typeof window !== 'undefined' ? JSON.stringify({
            userType: window.localStorage.getItem('userType'),
            codice: window.localStorage.getItem('codice')
          }) : 'non disponibile'}
        </div>
      </div>
    </div>
  )
} 