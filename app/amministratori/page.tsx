'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import QuestionarioView from '@/components/questionari/QuestionarioView'
import { formatQuestionarioData, QuestionarioData, MAPPINGS } from '@/utils/questionarioMappings'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default function AmministratoriDashboard() {
  const [questionari, setQuestionari] = useState<QuestionarioData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestionario, setSelectedQuestionario] = useState<QuestionarioData | null>(null)
  
  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        console.log('Fetching questionari...')
        
        const { data, error } = await supabase
          .from('giovani')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Errore nel caricamento questionari:', error)
          throw error
        }

        console.log('Questionari ricevuti:', data)
        setQuestionari(data || [])
      } catch (err) {
        console.error('Errore:', err)
        setQuestionari([])
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
    const formattedData = questionari.map(formatQuestionarioData)
    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Questionari")
    XLSX.writeFile(wb, "questionari.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const formattedData = questionari.map(formatQuestionarioData)
    
    formattedData.forEach((q, index) => {
      if (index > 0) doc.addPage()
      
      // Intestazione
      doc.setFontSize(16)
      doc.text("Questionario Giovani", 14, 20)
      
      doc.setFontSize(12)
      doc.text(`ID: ${q.id}`, 14, 30)
      doc.text(`Data: ${new Date(q.created_at).toLocaleString('it-IT')}`, 14, 40)
      doc.text(`Fonte: ${q.fonte}`, 14, 50)

      // Sezione A - Descrizione del giovane
      doc.setFontSize(14)
      doc.text("SEZIONE A: Descrizione del giovane", 14, 70)
      doc.setFontSize(12)
      doc.text(`Percorso autonomia: ${q.percorso_autonomia ? 'Sì' : 'No'}`, 14, 80)
      if (q.percorso_autonomia) {
        doc.text(`Tipo percorso: ${q.tipo_percorso}`, 14, 90)
      }
      doc.text(`Vive in struttura: ${q.vive_in_struttura ? 'Sì' : 'No'}`, 14, 100)
      doc.text(`Collocazione attuale: ${q.collocazione_attuale}`, 14, 110)
      
      doc.text("Fattori di vulnerabilità:", 14, 120)
      q.fattori_vulnerabilita?.forEach((fattore, i) => {
        doc.text(`- ${fattore}`, 20, 130 + (i * 10))
      })

      // Sezione B - Dati socio-anagrafici
      doc.addPage()
      doc.setFontSize(14)
      doc.text("SEZIONE B: Dati socio-anagrafici", 14, 20)
      doc.setFontSize(12)
      doc.text(`Sesso: ${q.sesso}`, 14, 30)
      doc.text(`Classe età: ${q.classe_eta}`, 14, 40)
      doc.text(`Cittadinanza: ${q.cittadinanza}`, 14, 50)
      doc.text(`Titolo di studio: ${q.titolo_studio}`, 14, 60)

      // Sezione C - Formazione e lavoro
      doc.addPage()
      doc.setFontSize(14)
      doc.text("SEZIONE C: Formazione e lavoro", 14, 20)
      doc.setFontSize(12)
      
      doc.text("Attività precedenti:", 14, 30)
      q.attivita_precedenti?.forEach((att, i) => {
        doc.text(`- ${att}`, 20, 40 + (i * 10))
      })

      doc.text("Attività attuali:", 14, 90)
      q.attivita_attuali?.forEach((att, i) => {
        doc.text(`- ${att}`, 20, 100 + (i * 10))
      })

      // Sezione D - Area relazionale
      doc.addPage()
      doc.setFontSize(14)
      doc.text("SEZIONE D: Area relazionale", 14, 20)
      doc.setFontSize(12)
      doc.text(`Relazioni familiari: ${MAPPINGS.valutazione[q.relazioni_familiari]}`, 14, 30)
      doc.text(`Relazioni amicali: ${MAPPINGS.valutazione[q.relazioni_amicali]}`, 14, 40)
      doc.text(`Relazioni sentimentali: ${MAPPINGS.valutazione[q.relazioni_sentimentali]}`, 14, 50)
      doc.text(`Relazioni con operatori: ${MAPPINGS.valutazione[q.relazioni_operatori]}`, 14, 60)
      doc.text(`Capacità di chiedere aiuto: ${MAPPINGS.valutazione[q.capacita_aiuto]}`, 14, 70)
      doc.text(`Capacità di mantenere impegni: ${MAPPINGS.valutazione[q.capacita_impegni]}`, 14, 80)

      // Sezione E - Area personale
      doc.addPage()
      doc.setFontSize(14)
      doc.text("SEZIONE E: Area personale", 14, 20)
      doc.setFontSize(12)
      doc.text(`Cura di sé: ${MAPPINGS.valutazione[q.cura_se]}`, 14, 30)
      doc.text(`Cura degli spazi: ${MAPPINGS.valutazione[q.cura_spazi]}`, 14, 40)
      doc.text(`Gestione emotiva: ${MAPPINGS.valutazione[q.gestione_emotiva]}`, 14, 50)
      doc.text(`Consapevolezza risorse: ${MAPPINGS.valutazione[q.consapevolezza_risorse]}`, 14, 60)
      doc.text(`Capacità progettuale: ${MAPPINGS.valutazione[q.capacita_progettuale]}`, 14, 70)

      // Sezione F - Area delle autonomie
      doc.addPage()
      doc.setFontSize(14)
      doc.text("SEZIONE F: Area delle autonomie", 14, 20)
      doc.setFontSize(12)
      doc.text(`Gestione denaro: ${MAPPINGS.valutazione[q.gestione_denaro]}`, 14, 30)
      doc.text(`Ricerca lavoro: ${MAPPINGS.valutazione[q.ricerca_lavoro]}`, 14, 40)
      doc.text(`Ricerca casa: ${MAPPINGS.valutazione[q.ricerca_casa]}`, 14, 50)
      doc.text(`Mobilità territorio: ${MAPPINGS.valutazione[q.mobilita_territorio]}`, 14, 60)
      doc.text(`Rispetto regole: ${MAPPINGS.valutazione[q.rispetto_regole]}`, 14, 70)

      // Note e osservazioni
      if (q.note_osservazioni) {
        doc.addPage()
        doc.setFontSize(14)
        doc.text("Note e osservazioni", 14, 20)
        doc.setFontSize(12)
        
        // Dividiamo il testo in righe per evitare che esca dalla pagina
        const noteLines = doc.splitTextToSize(q.note_osservazioni, 180)
        doc.text(noteLines, 14, 30)
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
          <h2 className="text-xl font-semibold">Questionari Ricevuti ({questionari.length})</h2>
          
          {questionari.length === 0 ? (
            <p className="text-gray-500">Nessun questionario ricevuto</p>
          ) : (
            <div className="grid gap-4">
              {questionari.map((q) => (
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
        </div>
      )}
    </div>
  )
} 