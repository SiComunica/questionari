'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew'

interface PageProps {
  params: {
    id: string
  }
}

export default function ViewQuestionario({ params }: PageProps) {
  const router = useRouter()
  const [questionario, setQuestionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestionario = async () => {
      try {
        // L'ID sarà nel formato "tipo-id" (es: "giovani-123")
        const [tipo, realId] = params.id.split('-')
        
        const { data, error } = await supabase
          .from(tipo)
          .select('*')
          .eq('id', realId)
          .single()

        if (error) throw error
        setQuestionario({ ...data, tipo })
      } catch (error) {
        console.error('Errore nel caricamento del questionario:', error)
        router.push('/dashboard/admin')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionario()
  }, [params.id])

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
        return <div>Tipo questionario non valido</div>
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Dettaglio Questionario {questionario.tipo.charAt(0).toUpperCase() + questionario.tipo.slice(1)}
        </h1>
        <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
          Torna alla lista
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informazioni Generali</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Data compilazione</p>
              <p>{new Date(questionario.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Fonte</p>
              <p>{questionario.fonte}</p>
            </div>
            <div>
              <p className="font-semibold">Stato</p>
              <p>{questionario.stato}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {renderQuestionario()}
    </div>
  )
} 