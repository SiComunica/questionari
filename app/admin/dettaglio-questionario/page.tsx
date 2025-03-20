'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew'

export default function DettaglioQuestionario() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams?.get('tipo')
  const id = searchParams?.get('id')
  const [questionario, setQuestionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestionario = async () => {
      if (!tipo || !id) {
        router.push('/dashboard/admin')
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
        console.error('Errore nel caricamento del questionario:', error)
        router.push('/dashboard/admin')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionario()
  }, [tipo, id, router])

  // ... resto del codice invariato ...
} 