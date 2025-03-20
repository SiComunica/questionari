'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "../../../../components/ui/select"

interface PageProps {
  params: {
    id: string;
  };
}

export default async function QuestionarioPage({ params }: PageProps) {
  if (!params?.id) {
    return <div>ID questionario non valido</div>;
  }

  const router = useRouter()
  const [questionario, setQuestionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestionario()
  }, [params.id])

  const fetchQuestionario = async () => {
    try {
      const { data, error } = await supabase
        .from('giovani')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setQuestionario(data)
    } catch (error) {
      console.error('Errore nel caricamento del questionario:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStato = async (nuovo_stato: string) => {
    try {
      const { error } = await supabase
        .from('giovani')
        .update({ 
          stato: nuovo_stato,
          ultima_modifica: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error
      setQuestionario({...questionario, stato: nuovo_stato})
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato:', error)
    }
  }

  if (loading) return <div>Caricamento...</div>
  if (!questionario) return <div>Questionario non trovato</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dettaglio Questionario</h1>
        <div className="flex gap-4">
          <Select
            value={questionario.stato}
            onValueChange={updateStato}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleziona stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nuovo">Nuovo</SelectItem>
              <SelectItem value="in_revisione">In Revisione</SelectItem>
              <SelectItem value="completato">Completato</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => router.back()}>
            Torna alla lista
          </Button>
        </div>
      </div>

      {/* Sezione A */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sezione A: Descrizione del giovane</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Percorso di autonomia</h3>
              <p>{questionario.percorso_autonomia ? 'Sì' : 'No'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Tipo percorso</h3>
              <p>{questionario.tipo_percorso}</p>
            </div>
            <div>
              <h3 className="font-semibold">Vive in struttura</h3>
              <p>{questionario.vive_in_struttura ? 'Sì' : 'No'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Collocazione attuale</h3>
              <p>{questionario.collocazione_attuale}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Fattori di vulnerabilità</h3>
            <ul className="list-disc list-inside">
              {questionario.fattori_vulnerabilita?.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Sezione B */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sezione B: Domande socio-anagrafiche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Sesso</h3>
              <p>{questionario.sesso === "1" ? "Maschio" : 
                  questionario.sesso === "2" ? "Femmina" : "Altro"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Classe di età</h3>
              <p>{questionario.classe_eta === "1" ? "18-21" : 
                  questionario.classe_eta === "2" ? "22-24" : 
                  questionario.classe_eta === "3" ? "25-27" : "28-34"}</p>
            </div>
            {/* Altri campi della sezione B */}
          </div>
        </CardContent>
      </Card>

      {/* Sezione C */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sezione C: Formazione e lavoro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Titolo di studio</h3>
              <p>{questionario.titolo_studio}</p>
            </div>
            <div>
              <h3 className="font-semibold">Attività attuali</h3>
              <ul className="list-disc list-inside">
                {(questionario.attivita_attuali || []).map((attivita: string, index: number) => (
                  <li key={index}>{attivita}</li>
                ))}
              </ul>
            </div>
            {/* Altri campi della sezione C */}
          </div>
        </CardContent>
      </Card>

      {/* Sezione D */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sezione D: Area relazionale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Abitazione precedente</h3>
              <ul className="list-disc list-inside">
                {questionario.abitazione_precedente && 
                  Object.entries(questionario.abitazione_precedente).map(([key, value]: [string, any]) => (
                    value && <li key={key}>{key}</li>
                  ))
                }
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Figure di aiuto</h3>
              <ul className="list-disc list-inside">
                {questionario.figure_aiuto && 
                  Object.entries(questionario.figure_aiuto).map(([key, value]: [string, any]) => (
                    value && <li key={key}>{key}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sezione E */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sezione E: Area personale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Preoccupazioni per il futuro</h3>
              {questionario.preoccupazioni_futuro && 
                Object.entries(questionario.preoccupazioni_futuro).map(([key, value]: [string, any]) => (
                  <div key={key} className="ml-4">
                    <span className="font-medium">{key}: </span>
                    <span>{String(value)}</span>
                  </div>
                ))
              }
            </div>
            <div>
              <h3 className="font-semibold">Pronto per l'uscita</h3>
              <p>{questionario.pronto_uscita?.pronto ? 'Sì' : 'No'}</p>
              {questionario.pronto_uscita?.motivazione && (
                <p className="mt-2"><strong>Motivazione:</strong> {questionario.pronto_uscita.motivazione}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Desiderio</h3>
              <p>{questionario.desiderio || ''}</p>
            </div>
            <div>
              <h3 className="font-semibold">Note aggiuntive</h3>
              <p>{questionario.nota_aggiuntiva || ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 