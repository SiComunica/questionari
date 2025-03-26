'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function QuestionariStruttureNew() {
  const [questionari, setQuestionari] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        const { data, error } = await supabase
          .from('strutture')
          .select('*')
          .order('creato_a', { ascending: false })

        if (error) throw error
        setQuestionari(data || [])
      } catch (err) {
        console.error('Errore:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionari()
  }, [])

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionari Strutture</CardTitle>
      </CardHeader>
      <CardContent>
        {questionari.length === 0 ? (
          <p>Nessun questionario strutture ricevuto</p>
        ) : (
          <div className="space-y-4">
            {questionari.map((questionario) => (
              <Card key={questionario.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Struttura: {questionario.nome_struttura}</p>
                    <p className="text-sm text-gray-600">
                      Inviato il {new Date(questionario.creato_a).toLocaleDateString()}
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
  )
} 