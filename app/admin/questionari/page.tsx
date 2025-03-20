'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface Questionario {
  id: string
  tipo: 'giovani' | 'operatori' | 'strutture'
  created_at: string
  fonte: string
  stato: string
}

export default function QuestionariList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams?.get('tipo') as 'giovani' | 'operatori' | 'strutture' | null
  const id = searchParams?.get('id')
  const [questionario, setQuestionario] = useState<Questionario | null>(null)
  const [loading, setLoading] = useState(true)
  const { userType } = useAuth()
  const [questionari, setQuestionari] = useState<any[]>([])

  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        const { data, error } = await supabase
          .from('questionari')
          .select('*')

        if (error) throw error
        setQuestionari(data)
      } catch (error) {
        console.error('Errore nel caricamento dei questionari:', error)
      }
    }

    fetchQuestionari()
  }, [])

  function renderQuestionarioContent(questionario: Questionario) {
    switch (questionario.tipo) {
      case 'giovani':
        return <QuestionarioGiovaniNew readOnly initialData={questionario} />
      case 'operatori':
        return <QuestionarioOperatoriNew readOnly initialData={questionario} />
      case 'strutture':
        return <QuestionarioStruttureNew readOnly initialData={questionario} />
      default:
        return null
    }
  }

  if (loading) {
    return <div>Caricamento...</div>
  }

  if (!questionario) {
    return <div>Questionario non trovato</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Lista Questionari
        </h1>
        <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
          Torna alla lista
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista Questionari</CardTitle>
        </CardHeader>
        <CardContent>
          {questionari.map(q => (
            <Link 
              key={q.id} 
              href={`/admin/questionari/dettaglio?tipo=${q.tipo}&id=${q.id}`}
            >
              Visualizza
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 