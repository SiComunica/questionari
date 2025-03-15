'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import DettaglioQuestionario from '@/components/DettaglioQuestionario'

type Struttura = Database['public']['Tables']['strutture']['Row']
type Operatore = Database['public']['Tables']['operatori']['Row']
type Giovane = Database['public']['Tables']['giovani']['Row']

type Submission = {
  id: string
  tipo: 'struttura' | 'operatore' | 'giovane'
  created_at: string
  data: Struttura | Operatore | Giovane
}

const QUESTIONARI = [
  {
    id: 'strutture',
    title: 'Questionario Strutture',
    description: 'Compila il questionario per le strutture di accoglienza',
    color: 'blue',
    href: '/questionari/strutture'
  },
  {
    id: 'operatori',
    title: 'Questionario Operatori',
    description: 'Compila il questionario per gli operatori',
    color: 'green',
    href: '/questionari/operatori'
  },
  {
    id: 'giovani',
    title: 'Questionario Giovani',
    description: 'Compila il questionario per i giovani',
    color: 'yellow',
    href: '/questionari/giovani'
  }
]

export default function AnonimoDashboard() {
  const router = useRouter()
  const { userType } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    if (!userType) {
      router.push('/')
      return
    }

    if (userType !== 'anonimo') {
      router.push(`/dashboard/${userType}`)
      return
    }

    const fetchData = async () => {
      try {
        const [strutture, operatori, giovani] = await Promise.all([
          supabase
            .from('strutture')
            .select('*')
            .eq('created_by', 'anonimo'),
          supabase
            .from('operatori')
            .select('*')
            .eq('created_by', 'anonimo'),
          supabase
            .from('giovani')
            .select('*')
            .eq('created_by', 'anonimo')
        ])

        const allSubmissions: Submission[] = [
          ...(strutture.data?.map(s => ({
            id: s.id,
            tipo: 'struttura' as const,
            created_at: s.created_at,
            data: s
          })) || []),
          ...(operatori.data?.map(o => ({
            id: o.id,
            tipo: 'operatore' as const,
            created_at: o.created_at,
            data: o
          })) || []),
          ...(giovani.data?.map(g => ({
            id: g.id,
            tipo: 'giovane' as const,
            created_at: g.created_at,
            data: g
          })) || [])
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setSubmissions(allSubmissions)
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error)
        setError('Errore nel caricamento dei dati')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userType, router])

  if (!userType || userType !== 'anonimo') return null
  if (loading) return <div>Caricamento...</div>
  if (error) return <div>Errore: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-lg font-medium text-gray-900">
                  Dashboard Anonimo
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  I tuoi questionari compilati
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <div className="space-x-4">
                  <button
                    onClick={() => router.push('/questionari/strutture')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Nuovo Questionario Strutture
                  </button>
                  <button
                    onClick={() => router.push('/questionari/operatori')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Nuovo Questionario Operatori
                  </button>
                  <button
                    onClick={() => router.push('/questionari/giovani')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Nuovo Questionario Giovani
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
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
                  {submissions.map(submission => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Visualizza
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedSubmission && (
          <DettaglioQuestionario
            data={selectedSubmission.data}
            tipo={selectedSubmission.tipo}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </div>
    </div>
  )
} 