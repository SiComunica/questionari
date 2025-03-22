'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Importiamo i componenti in modo dinamico
const QuestionarioGiovaniNew = dynamic(() => import('@/components/questionari/QuestionarioGiovaniNew'), {
  loading: () => <p>Caricamento questionario...</p>
})

const QuestionarioOperatoriNew = dynamic(() => import('@/components/questionari/QuestionarioOperatoriNew'), {
  loading: () => <p>Caricamento questionario...</p>
})

const QuestionarioStruttureNew = dynamic(() => import('@/components/questionari/QuestionarioStruttureNew'), {
  loading: () => <p>Caricamento questionario...</p>
})

export default function OperatoreDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuestionario, setSelectedQuestionario] = useState<string | null>(null)
  const [operatoreNumber, setOperatoreNumber] = useState<string | null>(null)

  useEffect(() => {
    try {
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      
      console.log('Auth check:', { userType, codice })

      if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
        router.push('/')
        return
      }

      const match = codice.match(/operatore(\d+)/)
      if (match) {
        setOperatoreNumber(match[1])
      }
    } catch (err) {
      console.error('Error in auth check:', err)
      setError('Errore durante la verifica dell\'autenticazione')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl">Caricamento...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl text-red-600">Errore</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!operatoreNumber) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl">Accesso non autorizzato</h1>
      </div>
    )
  }

  const handleQuestionarioSelect = (tipo: string) => {
    try {
      setSelectedQuestionario(tipo)
    } catch (err) {
      console.error('Error selecting questionario:', err)
      setError('Errore nella selezione del questionario')
    }
  }

  const renderQuestionario = () => {
    const fonte = `operatore${operatoreNumber}`
    
    try {
      switch (selectedQuestionario) {
        case 'giovani':
          return <QuestionarioGiovaniNew fonte={fonte} />
        case 'operatori':
          return <QuestionarioOperatoriNew fonte={fonte} />
        case 'strutture':
          return <QuestionarioStruttureNew fonte={fonte} />
        default:
          return null
      }
    } catch (err) {
      console.error('Error rendering questionario:', err)
      return <p className="text-red-600">Errore nel caricamento del questionario</p>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Operatore {operatoreNumber}</h1>

      {!selectedQuestionario ? (
        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={() => handleQuestionarioSelect('giovani')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-blue-600">Questionario Giovani</h2>
            <p className="mt-2 text-gray-600">Compila questionario per i giovani</p>
          </button>

          <button
            onClick={() => handleQuestionarioSelect('operatori')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-green-600">Questionario Operatori</h2>
            <p className="mt-2 text-gray-600">Compila questionario per gli operatori</p>
          </button>

          <button
            onClick={() => handleQuestionarioSelect('strutture')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-purple-600">Questionario Strutture</h2>
            <p className="mt-2 text-gray-600">Compila questionario per le strutture</p>
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedQuestionario(null)}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            ← Torna indietro
          </button>
          {renderQuestionario()}
        </div>
      )}
    </div>
  )
} 