'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Submission = {
  id: string
  tipo: 'struttura' | 'operatore' | 'giovane'
  utente: string
  data: string
  contenuto: any
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const { userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (userType !== 'admin') {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      const fetchStrutture = supabase.from('strutture').select('*')
      const fetchOperatori = supabase.from('operatori').select('*')
      const fetchGiovani = supabase.from('giovani').select('*')

      const [struttureRes, operatoriRes, giovaniRes] = await Promise.all([
        fetchStrutture,
        fetchOperatori,
        fetchGiovani
      ])

      const allSubmissions: Submission[] = [
        ...(struttureRes.data || []).map(s => ({
          id: s.id,
          tipo: 'struttura' as const,
          utente: s.id_struttura,
          data: s.created_at,
          contenuto: s
        })),
        ...(operatoriRes.data || []).map(o => ({
          id: o.id,
          tipo: 'operatore' as const,
          utente: o.id_struttura,
          data: o.created_at,
          contenuto: o
        })),
        ...(giovaniRes.data || []).map(g => ({
          id: g.id,
          tipo: 'giovane' as const,
          utente: 'anonimo',
          data: g.created_at,
          contenuto: g
        }))
      ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

      setSubmissions(allSubmissions)
    }

    fetchData()
  }, [userType, router])

  const exportToExcel = () => {
    // TODO: Implementare l'esportazione in Excel
  }

  const exportToPDF = () => {
    // TODO: Implementare l'esportazione in PDF
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <div className="space-x-4">
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Esporta Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Esporta PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utente
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
            {submissions.map((submission, index) => (
              <tr key={submission.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {submission.tipo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {submission.utente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(submission.data).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => console.log(submission.contenuto)}
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
  )
} 