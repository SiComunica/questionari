'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OperatorePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [operatoreNumber, setOperatoreNumber] = useState<string | null>(null)

  useEffect(() => {
    console.log('OperatorePage: Component mounted')
    const checkAuth = () => {
      console.log('OperatorePage: Checking auth...')
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      console.log('OperatorePage: Auth data:', { userType, codice })
      
      if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
        console.log('OperatorePage: Unauthorized, redirecting...')
        router.push('/')
        return
      }

      const match = codice.match(/operatore(\d+)/)
      if (match) {
        console.log('OperatorePage: Setting operatore number:', match[1])
        setOperatoreNumber(match[1])
      }
      console.log('OperatorePage: Setting loading false')
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  console.log('OperatorePage: Rendering with state:', { isLoading, operatoreNumber })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h2 className="text-2xl">Caricamento dashboard operatore...</h2>
      </div>
    )
  }

  if (!operatoreNumber) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h2 className="text-2xl text-red-600">Accesso non autorizzato</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard Operatore {operatoreNumber}
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            Questionario Giovani
          </h2>
          <p className="text-gray-600 mb-4">
            Compila un nuovo questionario per i giovani
          </p>
          <Link 
            href="/operatore/giovani"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Compila Questionario
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-green-600 mb-4">
            Questionario Operatori
          </h2>
          <p className="text-gray-600 mb-4">
            Compila un nuovo questionario per gli operatori
          </p>
          <Link 
            href="/operatore/operatori"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Compila Questionario
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-purple-600 mb-4">
            Questionario Strutture
          </h2>
          <p className="text-gray-600 mb-4">
            Compila un nuovo questionario per le strutture
          </p>
          <Link 
            href="/operatore/strutture"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Compila Questionario
          </Link>
        </div>
      </div>
    </div>
  )
} 