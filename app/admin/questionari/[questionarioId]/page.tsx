'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"

interface PageProps {
  params: {
    questionarioId: string;
  }
}

export default function DettaglioQuestionario({ params }: PageProps) {
  const router = useRouter()
  const [questionario, setQuestionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Estraiamo tipo e id dal questionarioId (formato: "tipo-id")
  const [tipo, id] = params.questionarioId.split('-')

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
  }, [tipo, id])

  // ... resto del codice invariato ...
} 