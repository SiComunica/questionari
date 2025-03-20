'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type QuestionarioWithType } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

export default function DettaglioQuestionario() {
  const { userType } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Gestione sicura dei parametri
  const tipo = searchParams?.get('tipo') as QuestionarioWithType['tipo'] | null
  const id = searchParams?.get('id')
  const [questionario, setQuestionario] = useState<QuestionarioWithType | null>(null)

  useEffect(() => {
    const fetchQuestionario = async () => {
      if (!tipo || !id) {
        router.push('/admin/questionari/lista')
        return
      }
      
      const { data } = await supabase
        .from(tipo)
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        setQuestionario({...data, tipo})
      } else {
        // Se non troviamo il questionario, torniamo alla lista
        router.push('/admin/questionari/lista')
      }
    }

    fetchQuestionario()
  }, [tipo, id, router])

  if (userType !== 'admin') {
    router.push('/')
    return null
  }

  if (!tipo || !id) {
    router.push('/admin/questionari/lista')
    return null
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dettaglio Questionario {tipo}</h1>
        <Button onClick={() => router.push('/admin/questionari/lista')}>
          Torna alla lista
        </Button>
      </div>
      
      {questionario ? (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(questionario, null, 2)}
        </pre>
      ) : (
        <div className="text-center py-4">
          Caricamento...
        </div>
      )}
    </div>
  )
} 