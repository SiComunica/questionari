'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function VerificaAccesso() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  useEffect(() => {
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')

    if (userType && codice && redirect) {
      // Imposta i cookie
      document.cookie = `userType=${userType}; path=/; max-age=604800; secure; samesite=strict`
      document.cookie = `codice=${codice}; path=/; max-age=604800; secure; samesite=strict`

      // Reindirizza dopo un breve delay
      setTimeout(() => {
        window.location.replace(redirect)
      }, 500)
    } else {
      window.location.replace('/')
    }
  }, [redirect])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl mb-4">Verifica accesso in corso...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  )
} 