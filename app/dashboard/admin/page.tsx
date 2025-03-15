'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import DettaglioQuestionario from '@/components/DettaglioQuestionario'
import { exportToExcel, exportToPDF } from '@/utils/export'
import { ArrowDownIcon } from '@heroicons/react/24/solid'

type Struttura = Database['public']['Tables']['strutture']['Row']
type Operatore = Database['public']['Tables']['operatori']['Row']
type Giovane = Database['public']['Tables']['giovani']['Row']

type Submission = {
  id: string
  tipo: 'struttura' | 'operatore' | 'giovane'
  created_at: string
  created_by: string
  data: Struttura | Operatore | Giovane
}

export default function AdminDashboard() {
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

    if (userType !== 'admin') {
      router.push(`/dashboard/${userType}`)
      return
    }

    const fetchData = async () => {
      try {
        const [strutture, operatori, giovani] = await Promise.all([
          supabase.from('strutture').select('*'),
          supabase.from('operatori').select('*'),
          supabase.from('giovani').select('*')
        ])

        const allSubmissions: Submission[] = [
          ...(strutture.data?.map(s => ({
            id: s.id,
            tipo: 'struttura' as const,
            created_at: s.created_at,
            created_by: s.created_by,
            data: s
          })) || []),
          ...(operatori.data?.map(o => ({
            id: o.id,
            tipo: 'operatore' as const,
            created_at: o.created_at,
            created_by: o.created_by,
            data: o
          })) || []),
          ...(giovani.data?.map(g => ({
            id: g.id,
            tipo: 'giovane' as const,
            created_at: g.created_at,
            created_by: g.created_by,
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

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      const [strutture, operatori, giovani] = await Promise.all([
        supabase.from('strutture').select('*'),
        supabase.from('operatori').select('*'),
        supabase.from('giovani').select('*')
      ])

      const data = {
        strutture: strutture.data || [],
        operatori: operatori.data || [],
        giovani: giovani.data || []
      }

      if (format === 'excel') {
        exportToExcel(data)
      } else {
        exportToPDF(data)
      }
    } catch (error) {
      console.error('Errore durante l\'esportazione:', error)
      // TODO: Mostrare un messaggio di errore all'utente
    }
  }

  if (!userType || userType !== 'admin') return null
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
                  Dashboard Admin
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Visualizza tutti i questionari compilati
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-4">
                <button
                  onClick={() => handleExport('excel')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <ArrowDownIcon className="h-5 w-5 mr-2" />
                  Esporta Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowDownIcon className="h-5 w-5 mr-2" />
                  Esporta PDF
                </button>
              </div>
            </div>

            <div className="mt-6">
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
                      Compilato da
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
                        {submission.created_by}
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
      </div>

      {selectedSubmission && (
        <DettaglioQuestionario
          data={selectedSubmission.data}
          tipo={selectedSubmission.tipo}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  )
} 