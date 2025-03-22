'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type StorageData = {
  userType: string | null
  codice: string | null
}

export default function LoginPage() {
  const [codice, setCodice] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [storage, setStorage] = useState<StorageData>({ userType: null, codice: null })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
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
    setUrl('')

    try {
      // Verifica codice admin
      if (codice === 'admin2025') {
        window.localStorage.setItem('userType', 'admin')
        window.localStorage.setItem('codice', codice)
        setUrl('/admin')
        updateStorage()
        return
      }

      // Verifica codice anonimo
      if (codice === 'anonimo9999') {
        window.localStorage.setItem('userType', 'anonimo')
        window.localStorage.setItem('codice', codice)
        setUrl('/anonimo')
        updateStorage()
        return
      }

      // Verifica codice operatore
      if (codice.startsWith('operatore')) {
        const num = parseInt(codice.replace('operatore', ''))
        if (num >= 1 && num <= 300) {
          window.localStorage.setItem('userType', 'operatore')
          window.localStorage.setItem('codice', codice)
          setUrl('/operatore')
          updateStorage()
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
          Verifica codice
        </button>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        {url && (
          <Link 
            href={url}
            className="block w-full py-3 px-4 bg-green-600 text-white text-center rounded-md hover:bg-green-700"
          >
            Accedi alla dashboard
          </Link>
        )}

        {/* Debug info */}
        <div className="mt-4 text-sm text-gray-500">
          Codice: {codice}<br />
          URL: {url}<br />
          Storage: {JSON.stringify(storage)}
        </div>
      </div>
    </div>
  )
} 