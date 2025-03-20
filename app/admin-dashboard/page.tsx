'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AdminDashboard() {
  const { userType } = useAuth()
  const [questionari, setQuestionari] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userType !== 'admin') return

    const fetchQuestionari = async () => {
      try {
        const { data: questionariGiovani } = await supabase
          .from('giovani')
          .select('*')
          .eq('stato', 'inviato')
          .order('created_at', { ascending: false })

        const { data: questionariOperatori } = await supabase
          .from('operatori')
          .select('*')
          .eq('stato', 'inviato')
          .order('created_at', { ascending: false })

        const { data: questionariStrutture } = await supabase
          .from('strutture')
          .select('*')
          .eq('stato', 'inviato')
          .order('created_at', { ascending: false })

        setQuestionari([
          ...(questionariGiovani || []).map(q => ({ ...q, tipo: 'giovani' })),
          ...(questionariOperatori || []).map(q => ({ ...q, tipo: 'operatori' })),
          ...(questionariStrutture || []).map(q => ({ ...q, tipo: 'strutture' }))
        ])
      } catch (error) {
        console.error('Errore:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionari()
  }, [userType])

  if (userType !== 'admin') return null
  if (loading) return <div>Caricamento...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid gap-6">
        {questionari.map((q) => (
          <Card key={`${q.tipo}-${q.id}`}>
            <CardHeader>
              <CardTitle>Questionario {q.tipo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p>Fonte: {q.fonte}</p>
                  <p>Data: {new Date(q.created_at).toLocaleDateString()}</p>
                </div>
                <Link 
                  href={`/visualizza-questionario?tipo=${q.tipo}&id=${q.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
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