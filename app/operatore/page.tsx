'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OperatorePage() {
  const router = useRouter()
  const [operatoreNumber, setOperatoreNumber] = useState<string | null>(null)

  useEffect(() => {
    console.log('Mounting OperatorePage')
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')
    console.log('Auth check:', { userType, codice })

    if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
      console.log('Unauthorized, redirecting...')
      router.push('/')
      return
    }

    const match = codice.match(/operatore(\d+)/)
    if (match) {
      console.log('Setting operatore number:', match[1])
      setOperatoreNumber(match[1])
    }
  }, [router])

  const handleSelectQuestionario = (tipo: string) => {
    console.log('Selected questionario:', tipo)
    router.push(`/operatore/${tipo}`)
  }

  if (!operatoreNumber) {
    return (
      <div className="p-8">
        <h1 className="text-2xl">Verifica accesso...</h1>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">
        Dashboard Operatore {operatoreNumber}
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <button
          onClick={() => handleSelectQuestionario('giovani')}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-bold text-blue-600 mb-2">
            Questionario Giovani
          </h2>
          <p className="text-gray-600">
            Compila un nuovo questionario per i giovani
          </p>
        </button>

        <button
          onClick={() => handleSelectQuestionario('operatori')}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-bold text-green-600 mb-2">
            Questionario Operatori
          </h2>
          <p className="text-gray-600">
            Compila un nuovo questionario per gli operatori
          </p>
        </button>

        <button
          onClick={() => handleSelectQuestionario('strutture')}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h2 className="text-xl font-bold text-purple-600 mb-2">
            Questionario Strutture
          </h2>
          <p className="text-gray-600">
            Compila un nuovo questionario per le strutture
          </p>
        </button>
      </div>
    </div>
  )
} 