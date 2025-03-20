'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew'

export default function VisualizzaQuestionario() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams?.get('tipo')
  const id = searchParams?.get('id')
  const [questionario, setQuestionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestionario = async () => {
      if (!tipo || !id) {
        router.push('/admin-dashboard')
        return
      }

      try {
        const { data, error } = await supabase
          .from(tipo)
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setQuestionario({ ...data, tipo })
      } catch (error) {
        console.error('Errore:', error)
        router.push('/admin-dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionario()
  }, [tipo, id, router])

  if (loading) return <div>Caricamento...</div>
  if (!questionario) return <div>Questionario non trovato</div>

  const renderQuestionario = () => {
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dettaglio Questionario</h1>
        <Button onClick={() => router.push('/admin-dashboard')}>
          Torna indietro
        </Button>
      </div>
      {renderQuestionario()}
    </div>
  )
} 