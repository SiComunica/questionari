'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Questionario {
  id: string
  tipo: 'giovani' | 'operatori' | 'strutture'
  compilatore: string
  dataCompilazione: string
}

export default function QuestionarioPage() {
  const { userType, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [questionari, setQuestionari] = useState<Questionario[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  console.log('QuestionarioPage render:', { userType, authLoading, pageLoading })

  useEffect(() => {
    // Verifica immediata se l'utente non è admin
    if (!authLoading && userType !== 'admin') {
      console.log('Accesso non autorizzato, reindirizzamento...')
      router.replace('/') // Usiamo replace invece di push
      return
    }

    // Carica i dati solo se l'utente è admin
    if (!authLoading && userType === 'admin') {
      console.log('Caricamento dati per admin...')
      
      // Dati di esempio
      const datiQuestionari: Questionario[] = [
        {
          id: '1',
          tipo: 'giovani',
          compilatore: 'anonimo123',
          dataCompilazione: '2024-03-20'
        },
        {
          id: '2',
          tipo: 'operatori',
          compilatore: 'operatore1',
          dataCompilazione: '2024-03-19'
        },
        {
          id: '3',
          tipo: 'strutture',
          compilatore: 'operatore2',
          dataCompilazione: '2024-03-18'
        }
      ]

      setQuestionari(datiQuestionari)
      setPageLoading(false)
      console.log('Dati caricati con successo')
    }
  }, [userType, authLoading, router])

  // Mostra un messaggio di caricamento più informativo
  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">
              {authLoading ? 'Verifica accesso in corso...' : 'Caricamento dashboard admin...'}
            </div>
            <div className="text-gray-500">
              {userType ? `Utente: ${userType}` : 'Verifica credenziali...'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Se non siamo in loading ma non siamo admin, reindirizza
  if (!authLoading && userType !== 'admin') {
    router.replace('/')
    return null
  }

  // Rendering della dashboard solo per admin
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Questionari Ricevuti</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compilatore
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questionari.map((questionario) => (
                  <tr key={questionario.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize">{questionario.tipo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {questionario.compilatore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(questionario.dataCompilazione).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        PDF
                      </button>
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        Excel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 