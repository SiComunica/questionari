'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import QuestionarioView from '@/components/questionari/QuestionarioView'
import { 
  formatQuestionarioData, 
  QuestionarioGiovani,
  QuestionarioOperatori,
  QuestionarioStrutture
} from '@/utils/questionarioMappings'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuestionarioStruttureNew } from '@/types/questionari'

// Definiamo un tipo base per i campi comuni
interface BaseQuestionario {
  id: string
  created_at: string
  fonte: string
  stato: string
  tipo: 'giovani' | 'operatori' | 'strutture'
}

// Uniamo i tipi specifici con il tipo base
type Questionario = (QuestionarioGiovani | QuestionarioOperatori | QuestionarioStrutture) & BaseQuestionario

export default function AmministratoriDashboard() {
  const [questionariVecchi, setQuestionariVecchi] = useState<Questionario[]>([])
  const [questionariStrutture, setQuestionariStrutture] = useState<QuestionarioStruttureNew[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAllQuestionari = async () => {
      try {
        // Fetch vecchi questionari
        const [giovani, operatori, strutture] = await Promise.all([
          supabase.from('giovani').select('*'),
          supabase.from('operatori').select('*'),
          supabase.from('struttura').select('*')
        ])

        const vecchiQuestionari = [
          ...(giovani.data || []).map(q => ({ ...q, tipo: 'giovani' as const })),
          ...(operatori.data || []).map(q => ({ ...q, tipo: 'operatori' as const })),
          ...(strutture.data || []).map(q => ({ ...q, tipo: 'strutture' as const }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setQuestionariVecchi(vecchiQuestionari)

        // Fetch nuovi questionari strutture
        const { data: nuoveStrutture, error } = await supabase
          .from('strutture')
          .select('*')
          .order('creato_a', { ascending: false });

        if (error) throw error;
        
        console.log('Nuovi questionari strutture:', nuoveStrutture);
        setQuestionariStrutture(nuoveStrutture || []);

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
        fetchAllQuestionari()
      }
    }
  }, [])

  // Controllo autenticazione
  if (typeof window !== 'undefined') {
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')

    if (userType !== 'admin' || codice !== 'admin2025') {
      window.location.replace('/')
      return null
    }
  }

  const exportToExcel = () => {
    const formattedData = questionariVecchi.map(q => {
      const formatted = formatQuestionarioData(q)
      return {
        ...formatted,
        tipo: q.tipo
      }
    })
    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Questionari")
    XLSX.writeFile(wb, "questionari.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    questionariVecchi.forEach((q, index) => {
      if (index > 0) doc.addPage()
      
      // Intestazione
      doc.setFontSize(16)
      doc.text(`Questionario ${q.tipo.charAt(0).toUpperCase() + q.tipo.slice(1)}`, 14, 20)
      
      doc.setFontSize(12)
      doc.text(`ID: ${q.id}`, 14, 30)
      doc.text(`Data: ${new Date(q.created_at).toLocaleString('it-IT')}`, 14, 40)
      doc.text(`Fonte: ${q.fonte}`, 14, 50)

      // Contenuto specifico per tipo
      switch (q.tipo) {
        case 'giovani':
          renderQuestionarioGiovaniPDF(doc, q as QuestionarioGiovani & BaseQuestionario)
          break
        case 'operatori':
          renderQuestionarioOperatoriPDF(doc, q as QuestionarioOperatori & BaseQuestionario)
          break
        case 'strutture':
          renderQuestionarioStrutturePDF(doc, q as QuestionarioStrutture & BaseQuestionario)
          break
      }
    })
    
    doc.save("questionari_completi.pdf")
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Amministratori</h1>
        
        <div className="space-x-4">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Esporta Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Esporta PDF
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Caricamento questionari...</p>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Questionari Ricevuti ({questionariVecchi.length})
          </h2>
          
          {questionariVecchi.length === 0 ? (
            <p className="text-gray-500">Nessun questionario ricevuto</p>
          ) : (
            <div className="grid gap-4">
              {questionariVecchi.map((q) => (
                <div 
                  key={q.id} 
                  className="border p-4 rounded-lg bg-white shadow cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedQuestionario(q)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">ID: {q.id}</p>
                      <p className="text-sm text-gray-500">
                        Data: {new Date(q.created_at).toLocaleString('it-IT')}
                      </p>
                      <p className="text-sm">Fonte: {q.fonte}</p>
                      <p className="text-sm text-blue-600">
                        Tipo: {q.tipo.charAt(0).toUpperCase() + q.tipo.slice(1)}
                      </p>
                    </div>
                    <div className="text-sm">
                      Stato: <span className="font-medium">{q.stato}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedQuestionario && (
            <QuestionarioView 
              questionario={selectedQuestionario}
              onClose={() => setSelectedQuestionario(null)}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Nuovi Questionari Strutture</CardTitle>
            </CardHeader>
            <CardContent>
              {questionariStrutture.length === 0 ? (
                <p>Nessun nuovo questionario strutture ricevuto</p>
              ) : (
                <div className="space-y-4">
                  {questionariStrutture.map((questionario) => (
                    <Card key={questionario.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">Struttura: {questionario.id_struttura}</p>
                          <p className="text-sm text-gray-600">
                            Inviato da: {questionario.creato_da} il{' '}
                            {new Date(questionario.creato_a || '').toLocaleDateString()}
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
        </div>
      )}
    </div>
  )
}

// Funzioni helper per il rendering PDF
function renderQuestionarioGiovaniPDF(doc: jsPDF, q: QuestionarioGiovani & BaseQuestionario) {
  // Implementazione del rendering per questionario giovani
}

function renderQuestionarioOperatoriPDF(doc: jsPDF, q: QuestionarioOperatori & BaseQuestionario) {
  // Implementazione del rendering per questionario operatori
}

function renderQuestionarioStrutturePDF(doc: jsPDF, q: QuestionarioStrutture & BaseQuestionario) {
  // Implementazione del rendering per questionario strutture
} 