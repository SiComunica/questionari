'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type QuestionarioWithType } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminListaPage() {
  const { userType } = useAuth()
  const router = useRouter()
  const [questionari, setQuestionari] = useState<QuestionarioWithType[]>([])

  useEffect(() => {
    if (!userType || userType !== 'admin') {
      window.location.href = '/'
    }
  }, [userType])

  useEffect(() => {
    const fetchQuestionari = async () => {
      const { data: giovani } = await supabase.from('giovani').select('*').order('created_at', { ascending: false })
      const { data: operatori } = await supabase.from('operatori').select('*').order('created_at', { ascending: false })
      const { data: strutture } = await supabase.from('strutture').select('*').order('created_at', { ascending: false })
      
      setQuestionari([
        ...(giovani || []).map(q => ({...q, tipo: 'giovani' as const})),
        ...(operatori || []).map(q => ({...q, tipo: 'operatori' as const})),
        ...(strutture || []).map(q => ({...q, tipo: 'strutture' as const}))
      ])
    }

    fetchQuestionari()
  }, [])

  if (!userType || userType !== 'admin') {
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Questionari Compilati</h1>
        <div className="grid gap-4">
          {questionari.map((q) => (
            <Card key={`${q.tipo}-${q.id}`} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">Questionario {q.tipo}</h3>
                  <p>Compilato il: {new Date(q.created_at).toLocaleDateString()}</p>
                </div>
                <Button 
                  onClick={() => router.push(`/admin/questionari/dettaglio?tipo=${q.tipo}&id=${q.id}`)}
                >
                  Visualizza
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 