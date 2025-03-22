'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'

export default function OperatoriPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [fonte, setFonte] = useState('')

  useEffect(() => {
    try {
      console.log('OperatoriPage: Component mounted')
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      console.log('Auth check:', { userType, codice })

      if (!userType || !codice) {
        console.log('No auth data found')
        router.push('/')
        return
      }

      if (userType === 'operatore' && codice.startsWith('operatore')) {
        console.log('User authorized')
        setFonte(codice)
        setIsAuthorized(true)
      } else {
        console.log('User not authorized')
        router.push('/')
      }
    } catch (error) {
      console.error('Error in auth check:', error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  console.log('Rendering with state:', { isLoading, isAuthorized, fonte })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-2xl font-bold">Caricamento...</h2>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-2xl font-bold text-red-600">Accesso non autorizzato</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Operatori</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {fonte ? (
            <QuestionarioGiovaniNew fonte={fonte} />
          ) : (
            <div>Errore: fonte non disponibile</div>
          )}
        </div>
      </div>
    </div>
  )
} 