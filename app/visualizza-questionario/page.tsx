'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'

// Creiamo un componente client separato per la logica
function QuestionarioViewer() {
  const { userType, codiceAccesso } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [questionario, setQuestionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const tipo = searchParams?.get('tipo')
  const id = searchParams?.get('id')

  useEffect(() => {
    if (!userType || !codiceAccesso) {
      router.push('/')
      return
    }

    if (!tipo || !id) {
      router.push('/admin/questionari/lista')
      return
    }

    const fetchQuestionario = async () => {
      try {
        const { data, error } = await supabase
          .from(tipo)
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setQuestionario(data)
      } catch (error) {
        console.error('Errore nel caricamento del questionario:', error)
        router.push('/admin/questionari/lista')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionario()
  }, [userType, codiceAccesso, tipo, id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Caricamento...</p>
      </div>
    )
  }

  if (!questionario || !tipo) {
    return null
  }

  const tipoCapitalized = tipo.charAt(0).toUpperCase() + tipo.slice(1)

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Visualizza Questionario {tipoCapitalized}
        </h1>
        
        {tipo === 'giovani' && (
          <QuestionarioGiovaniNew 
            readOnly={true} 
            initialData={questionario} 
          />
        )}
      </Card>
    </div>
  )
}

// Componente principale che fa da wrapper
export default function VisualizzaQuestionarioPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <QuestionarioViewer />
} 