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
  risposte: any // TODO: definire meglio il tipo delle risposte
}

export default function QuestionarioPage() {
  const { userType } = useAuth()
  const router = useRouter()
  const [questionari, setQuestionari] = useState<Questionario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userType !== 'admin') {
      router.push('/')
      return
    }

    // TODO: Sostituire con la vera chiamata API a Supabase
    const fetchQuestionari = async () => {
      try {
        // Simula il caricamento dei dati
        const datiSimulati: Questionario[] = [
          {
            id: '1',
            tipo: 'giovani',
            compilatore: 'anonimo123',
            dataCompilazione: '2024-03-20',
            risposte: {}
          },
          {
            id: '2',
            tipo: 'operatori',
            compilatore: 'operatore1',
            dataCompilazione: '2024-03-19',
            risposte: {}
          },
          {
            id: '3',
            tipo: 'strutture',
            compilatore: 'operatore2',
            dataCompilazione: '2024-03-18',
            risposte: {}
          }
        ]
        setQuestionari(datiSimulati)
        setLoading(false)
      } catch (error) {
        console.error('Errore nel caricamento dei questionari:', error)
        setLoading(false)
      }
    }

    fetchQuestionari()
  }, [userType, router])

  const handleDownloadPDF = (id: string) => {
    // TODO: Implementare il download PDF
    console.log('Download PDF per questionario:', id)
  }

  const handleDownloadExcel = (id: string) => {
    // TODO: Implementare il download Excel
    console.log('Download Excel per questionario:', id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Caricamento...</div>
        </div>
      </div>
    )
  }

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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDownloadPDF(questionario.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleDownloadExcel(questionario.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
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