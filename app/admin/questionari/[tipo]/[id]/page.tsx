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
} from "@/components/ui/select"

interface PageProps {
  params: {
    tipo: string;
    id: string;
  }
}

export default function DettaglioQuestionario({ params }: PageProps) {
  const router = useRouter()
  const [questionario, setQuestionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestionario = async () => {
      try {
        const { data, error } = await supabase
          .from(params.tipo)
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setQuestionario(data)
      } catch (error) {
        console.error('Errore nel caricamento del questionario:', error)
        router.push('/dashboard/admin')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionario()
  }, [params.tipo, params.id])

  const updateStato = async (nuovo_stato: string) => {
    try {
      const { error } = await supabase
        .from(params.tipo)
        .update({ stato: nuovo_stato })
        .eq('id', params.id)

      if (error) throw error
      setQuestionario({ ...questionario, stato: nuovo_stato })
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato:', error)
    }
  }

  if (loading) return <div>Caricamento...</div>
  if (!questionario) return <div>Questionario non trovato</div>

  const renderGiovaniContent = () => (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dati Personali</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Età</p>
              <p>{questionario.classe_eta}</p>
            </div>
            <div>
              <p className="font-semibold">Genere</p>
              <p>{questionario.sesso}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Percorso e Vulnerabilità</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Fattori di vulnerabilità</p>
              <ul className="list-disc list-inside">
                {questionario.fattori_vulnerabilita?.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Attività attuali</p>
              <ul className="list-disc list-inside">
                {questionario.attivita_attuali?.map((a: string, i: number) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderOperatoriContent = () => (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informazioni Professionali</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Ruolo</p>
              <p>{questionario.ruolo}</p>
            </div>
            <div>
              <p className="font-semibold">Struttura</p>
              <p>{questionario.id_struttura}</p>
            </div>
            <div>
              <p className="font-semibold">Esperienza</p>
              <p>{questionario.anni_esperienza}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Competenze e Formazione</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Competenze specifiche</p>
              <ul className="list-disc list-inside">
                {questionario.competenze_specifiche?.map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Formazione desiderata</p>
              <ul className="list-disc list-inside">
                {questionario.formazione_desiderata?.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderStruttureContent = () => (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informazioni Struttura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nome Struttura</p>
              <p>{questionario.id_struttura}</p>
            </div>
            <div>
              <p className="font-semibold">Tipo</p>
              <p>{questionario.tipo_struttura}</p>
            </div>
            <div>
              <p className="font-semibold">Anno inizio attività</p>
              <p>{questionario.anno_inizio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Servizi e Attività</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Attività e servizi</p>
              <ul className="list-disc list-inside">
                {Object.entries(questionario.attivita_servizi || {}).map(([key, value]: [string, any]) => (
                  value && <li key={key}>{key.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Dettaglio Questionario {params.tipo.charAt(0).toUpperCase() + params.tipo.slice(1)}
        </h1>
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
            Torna indietro
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informazioni Generali</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Data compilazione</p>
              <p>{new Date(questionario.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Fonte</p>
              <p>{questionario.fonte}</p>
            </div>
            <div>
              <p className="font-semibold">Stato</p>
              <p>{questionario.stato}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {params.tipo === 'giovani' && renderGiovaniContent()}
      {params.tipo === 'operatori' && renderOperatoriContent()}
      {params.tipo === 'strutture' && renderStruttureContent()}
    </div>
  )
} 