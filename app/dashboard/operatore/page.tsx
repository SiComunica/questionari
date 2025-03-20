'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function OperatoreDashboard() {
  const { userType, user } = useAuth()
  const [questionari, setQuestionari] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userType !== 'operatore') return

    const fetchQuestionari = async () => {
      try {
        const { data, error } = await supabase
          .from('operatori')
          .select('*')
          .eq('created_by', user?.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setQuestionari(data || [])
      } catch (error) {
        console.error('Errore nel caricamento dei questionari:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionari()
  }, [userType, user])

  if (userType !== 'operatore') {
    return null
  }

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Operatore</h1>
        <Link 
          href="/questionari/operatori/nuovo"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuovo Questionario
        </Link>
      </div>

      <div className="grid gap-6">
        {questionari.map((questionario) => (
          <Card key={questionario.id}>
            <CardHeader>
              <CardTitle>Questionario Operatore</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p>Stato: {questionario.stato}</p>
                  <p>Data: {new Date(questionario.created_at).toLocaleDateString()}</p>
                  <p>Struttura: {questionario.id_struttura}</p>
                </div>
                <Link 
                  href={`/operatore/questionari/${questionario.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Visualizza
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 