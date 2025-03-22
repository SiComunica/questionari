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
      
      doc.setFontSize(16)
      doc.text("Questionario", 14, 20)
      
      doc.setFontSize(12)
      doc.text(`ID: ${q.id}`, 14, 30)
      doc.text(`Data: ${new Date(q.created_at).toLocaleString('it-IT')}`, 14, 40)
      doc.text(`Fonte: ${q.fonte}`, 14, 50)
      doc.text(`Stato: ${q.stato}`, 14, 60)
    })
    
    doc.save("questionari.pdf")
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