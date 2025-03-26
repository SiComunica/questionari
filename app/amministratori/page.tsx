'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuestionariStruttureNew from '@/components/dashboard/QuestionariStruttureNew'

export default function AmministratoriDashboard() {
  const [questionari, setQuestionari] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        const { data, error } = await supabase
          .from('giovani')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setQuestionari(data || [])
      } catch (err) {
        console.error('Errore:', err)
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      
      if (userType === 'admin' && codice === 'admin2025') {
        fetchQuestionari()
      }
    }
  }, [])

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Amministratori</h1>

      {/* Sezione questionari giovani (originale) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Questionari Giovani</CardTitle>
        </CardHeader>
        <CardContent>
          {questionari.length === 0 ? (
            <p>Nessun questionario ricevuto</p>
          ) : (
            <div className="space-y-4">
              {questionari.map((questionario) => (
                <Card key={questionario.created_at} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Inviato il {new Date(questionario.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stato: {questionario.stato}
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => {/* TODO: implementare visualizzazione dettagli */}}
                    >
                      Visualizza dettagli
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nuovo componente per questionari strutture */}
      <QuestionariStruttureNew />
    </div>
  )
} 