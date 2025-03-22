'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew'
import { QuestionarioProps } from '@/types/questionari'

export default function OperatoreDashboard() {
  const router = useRouter()
  const [selectedQuestionario, setSelectedQuestionario] = useState<string | null>(null)
  const [operatoreNumber, setOperatoreNumber] = useState<string | null>(null)

  useEffect(() => {
    // Aggiungiamo log per debug
    console.log('Checking authentication...')
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')
    
    console.log('userType:', userType)
    console.log('codice:', codice)

    if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
      console.log('Authentication failed, redirecting...')
      router.push('/')
      return
    }

    const match = codice.match(/operatore(\d+)/)
    if (match) {
      console.log('Operatore number:', match[1])
      setOperatoreNumber(match[1])
    }
  }, [router])

  const renderQuestionario = () => {
    const fonte = `operatore${operatoreNumber}`
    const props: QuestionarioProps = { fonte }
    
    switch (selectedQuestionario) {
      case 'giovani':
        return <QuestionarioGiovaniNew {...props} />
      case 'operatori':
        return <QuestionarioOperatoriNew {...props} />
      case 'strutture':
        return <QuestionarioStruttureNew {...props} />
      default:
        return null
    }
  }

  // Se non c'è il numero operatore, mostriamo un messaggio invece di null
  if (!operatoreNumber) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Verifica accesso in corso...
        </h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Dashboard Operatore {operatoreNumber}
      </h1>

      {!selectedQuestionario ? (
        <>
          <p className="mb-6 text-gray-600">
            Seleziona il tipo di questionario che desideri compilare:
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div 
              onClick={() => setSelectedQuestionario('giovani')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-500"
            >
              <h2 className="text-xl font-semibold mb-3 text-blue-600">Questionario Giovani</h2>
              <p className="text-gray-600">
                Compila un nuovo questionario per raccogliere informazioni sui giovani seguiti
              </p>
            </div>

            <div 
              onClick={() => setSelectedQuestionario('operatori')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-green-500"
            >
              <h2 className="text-xl font-semibold mb-3 text-green-600">Questionario Operatori</h2>
              <p className="text-gray-600">
                Compila un nuovo questionario per condividere la tua esperienza come operatore
              </p>
            </div>

            <div 
              onClick={() => setSelectedQuestionario('strutture')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-purple-500"
            >
              <h2 className="text-xl font-semibold mb-3 text-purple-600">Questionario Strutture</h2>
              <p className="text-gray-600">
                Compila un nuovo questionario per descrivere la struttura in cui operi
              </p>
            </div>
          </div>
        </>
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