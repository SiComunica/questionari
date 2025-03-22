'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import QuestionarioView from '@/components/questionari/QuestionarioView'
import { formatQuestionarioData, QuestionarioData } from '@/utils/questionarioMappings'
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

      // Sezione A
      doc.setFontSize(14)
      doc.text("SEZIONE A: Descrizione del giovane", 14, 70)
      doc.setFontSize(12)
      doc.text(`Percorso autonomia: ${q.percorso_autonomia ? 'Sì' : 'No'}`, 14, 80)
      if (q.percorso_autonomia) {
        doc.text(`Tipo percorso: ${q.tipo_percorso}`, 14, 90)
      }
      doc.text(`Vive in struttura: ${q.vive_in_struttura ? 'Sì' : 'No'}`, 14, 100)
      doc.text(`Collocazione attuale: ${q.collocazione_attuale}`, 14, 110)

      // Sezione B
      doc.setFontSize(14)
      doc.text("SEZIONE B: Domande socio-anagrafiche", 14, 130)
      doc.setFontSize(12)
      doc.text(`Sesso: ${q.sesso}`, 14, 140)
      doc.text(`Classe età: ${q.classe_eta}`, 14, 150)
      doc.text(`Cittadinanza: ${q.cittadinanza}`, 14, 160)
      doc.text(`Titolo di studio: ${q.titolo_studio}`, 14, 170)

      // Sezione C
      doc.addPage()
      doc.setFontSize(14)
      doc.text("SEZIONE C: Formazione e lavoro", 14, 20)
      doc.setFontSize(12)
      doc.text("Attività precedenti:", 14, 30)
      q.attivita_precedenti.forEach((att, i) => {
        doc.text(`- ${att}`, 20, 40 + (i * 10))
      })

      doc.text("Attività attuali:", 14, 90)
      q.attivita_attuali.forEach((att, i) => {
        doc.text(`- ${att}`, 20, 100 + (i * 10))
      })

      // Sezione D
      doc.addPage()
      doc.setFontSize(14)
      doc.text("SEZIONE D: Area relazionale", 14, 20)
      // ... aggiungi tutti i dati della sezione D

      // Sezione E
      doc.addPage()
      doc.setFontSize(14)
      doc.text("SEZIONE E: Area personale", 14, 20)
      // ... aggiungi tutti i dati della sezione E
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