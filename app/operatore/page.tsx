'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew'

export default function OperatoreDashboard() {
  const router = useRouter()
  const [selectedQuestionario, setSelectedQuestionario] = useState<string | null>(null)
  const [operatoreNumber, setOperatoreNumber] = useState<string | null>(null)

  useEffect(() => {
    // Verifica autenticazione
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')
    
    if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
      router.push('/')
      return
    }

    // Estrai il numero operatore
    const match = codice.match(/operatore(\d+)/)
    if (match) {
      setOperatoreNumber(match[1])
    }
  }, [router])

  const renderQuestionario = () => {
    const fonte = `operatore${operatoreNumber}`
    
    switch (selectedQuestionario) {
      case 'giovani':
        return <QuestionarioGiovaniNew fonte={fonte} />
      case 'operatori':
        return <QuestionarioOperatoriNew />
      case 'strutture':
        return <QuestionarioStruttureNew />
      default:
        return null
    }
  }

  if (!operatoreNumber) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Dashboard Operatore {operatoreNumber}
      </h1>

      {!selectedQuestionario ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div 
            onClick={() => setSelectedQuestionario('giovani')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-600">Questionario Giovani</h2>
            <p className="text-gray-600">
              Compila un nuovo questionario per raccogliere informazioni sui giovani seguiti
            </p>
          </div>

          <div 
            onClick={() => setSelectedQuestionario('operatori')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-3 text-green-600">Questionario Operatori</h2>
            <p className="text-gray-600">
              Compila un nuovo questionario per condividere la tua esperienza come operatore
            </p>
          </div>

          <div 
            onClick={() => setSelectedQuestionario('strutture')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-3 text-purple-600">Questionario Strutture</h2>
            <p className="text-gray-600">
              Compila un nuovo questionario per descrivere la struttura in cui operi
            </p>
          </div>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setSelectedQuestionario(null)}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center"
          >
            <span className="mr-2">←</span> Torna alla selezione
          </button>
          {renderQuestionario()}
        </div>
      )}
    </div>
  )
} 