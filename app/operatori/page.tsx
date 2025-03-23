'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'
import QuestionarioOperatoriNuovo from '@/components/questionari/QuestionarioOperatoriNuovo'
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew'

type QuestionarioType = 'giovani' | 'operatori' | 'strutture'

export default function OperatoriPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [fonte, setFonte] = useState('')
  const [activeQuestionario, setActiveQuestionario] = useState<QuestionarioType>('giovani')

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

  const renderQuestionario = () => {
    switch (activeQuestionario) {
      case 'giovani':
        return <QuestionarioGiovaniNew fonte={fonte} />
      case 'operatori':
        return <QuestionarioOperatoriNuovo fonte={fonte} />
      case 'strutture':
        return <QuestionarioStruttureNew fonte={fonte} />
    }
  }

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
        
        {/* Tabs di navigazione */}
        <div className="mb-6 flex space-x-4 border-b">
          <button
            className={`py-2 px-4 ${activeQuestionario === 'giovani' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveQuestionario('giovani')}
          >
            Questionario Giovani
          </button>
          <button
            className={`py-2 px-4 ${activeQuestionario === 'operatori' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveQuestionario('operatori')}
          >
            Questionario Operatori
          </button>
          <button
            className={`py-2 px-4 ${activeQuestionario === 'strutture' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveQuestionario('strutture')}
          >
            Questionario Strutture
          </button>
        </div>

        {/* Contenitore del questionario attivo */}
        <div className="bg-white rounded-lg shadow p-6">
          {fonte ? renderQuestionario() : <div>Errore: fonte non disponibile</div>}
        </div>
      </div>
    </div>
  )
} 