'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuestionarioGiovani } from '@/types/questionari'
import QuestionariStruttureNew from '@/components/dashboard/QuestionariStruttureNew'

export default function AmministratoriDashboard() {
  const [questionariGiovani, setQuestionariGiovani] = useState<QuestionarioGiovani[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuestionariGiovani = async () => {
      try {
        // Fetch solo questionari giovani
        const { data: giovani, error } = await supabase
          .from('giovani')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log('Questionari giovani:', giovani);
        setQuestionariGiovani(giovani || []);

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
        fetchQuestionariGiovani()
      }
    }
  }, [])

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Amministratori</h1>

      {/* Sezione questionari giovani */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Questionari Giovani</CardTitle>
        </CardHeader>
        <CardContent>
          {questionariGiovani.length === 0 ? (
            <p>Nessun questionario giovani ricevuto</p>
          ) : (
            <div className="space-y-4">
              {questionariGiovani.map((questionario) => (
                <Card key={questionario.id} className="p-4">
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

      {/* Sezione questionari strutture */}
      <QuestionariStruttureNew />
    </div>
  )
} 