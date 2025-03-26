'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileSpreadsheet, FileText, Trash2, LogOut } from 'lucide-react'
import { toast } from 'react-hot-toast'
import QuestionariStruttureNew from '@/components/dashboard/QuestionariStruttureNew'
import { exportToExcel, exportToPDF } from '@/utils/export'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import QuestionariOperatoriLista from '@/components/dashboard/QuestionariOperatoriLista'

// Tipo corretto per i questionari giovani
type QuestionarioGiovani = {
  id: string;
  created_at: string;
  stato: string;
  // Aggiungiamo tutti i campi necessari per il dettaglio
  eta: number;
  genere: string;
  titolo_studio: string;
  occupazione: string;
  // ... altri campi del questionario
}

export default function AmministratoriDashboard() {
  const [questionari, setQuestionari] = useState<QuestionarioGiovani[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestionario, setSelectedQuestionario] = useState<QuestionarioGiovani | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

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
        toast.error('Errore nel caricamento dei questionari')
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      
      if (userType === 'admin' && codice === 'admin2025') {
        fetchQuestionari()
      } else {
        router.push('/login')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('codice')
    router.push('/login')
  }

  const handleExportExcel = async (questionario?: QuestionarioGiovani) => {
    try {
      const dataToExport = questionario ? [questionario] : questionari
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Questionari")
      XLSX.writeFile(workbook, `questionari_${new Date().toISOString()}.xlsx`)
      toast.success('Export Excel completato')
    } catch (error) {
      console.error('Errore export Excel:', error)
      toast.error('Errore durante l\'export Excel')
    }
  }

  const handleExportPDF = async (questionario?: QuestionarioGiovani) => {
    try {
      const doc = new jsPDF()
      const dataToExport = questionario ? [questionario] : questionari
      
      doc.text("Questionari", 14, 15)
      doc.autoTable({
        head: [Object.keys(dataToExport[0])],
        body: dataToExport.map(Object.values),
        startY: 25,
      })
      
      doc.save(`questionari_${new Date().toISOString()}.pdf`)
      toast.success('Export PDF completato')
    } catch (error) {
      console.error('Errore export PDF:', error)
      toast.error('Errore durante l\'export PDF')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('giovani')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setQuestionari(prev => prev.filter(q => q.id !== id))
      toast.success('Questionario eliminato con successo')
    } catch (error) {
      console.error('Errore eliminazione:', error)
      toast.error('Errore durante l\'eliminazione')
    }
  }

  const renderQuestionarioDettaglio = (questionario: QuestionarioGiovani) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold">Dati Generali</h3>
            <p>Data invio: {new Date(questionario.created_at).toLocaleDateString()}</p>
            <p>Stato: {questionario.stato}</p>
            <p>Età: {questionario.eta}</p>
            <p>Genere: {questionario.genere}</p>
          </div>
          <div>
            <h3 className="font-bold">Formazione e Lavoro</h3>
            <p>Titolo di studio: {questionario.titolo_studio}</p>
            <p>Occupazione: {questionario.occupazione}</p>
          </div>
          {/* Aggiungi altre sezioni del questionario */}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => handleExportExcel(questionario)} className="flex gap-2">
            <FileSpreadsheet size={20} />
            Excel
          </Button>
          <Button onClick={() => handleExportPDF(questionario)} className="flex gap-2">
            <FileText size={20} />
            PDF
          </Button>
        </div>
      </div>
    )
  }

  if (loading) return <div>Caricamento...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Amministratori</h1>
        <Button onClick={handleLogout} variant="destructive" className="flex gap-2">
          <LogOut size={20} />
          Logout
        </Button>
      </div>

      <div className="mb-6 flex gap-4">
        <Button onClick={() => handleExportExcel()} className="flex gap-2">
          <FileSpreadsheet size={20} />
          Esporta tutti in Excel
        </Button>
        <Button onClick={() => handleExportPDF()} className="flex gap-2">
          <FileText size={20} />
          Esporta tutti in PDF
        </Button>
      </div>

      <Card>
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
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedQuestionario(questionario)
                          setIsDialogOpen(true)
                        }}
                      >
                        Visualizza dettagli
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleExportExcel(questionario)}
                      >
                        <FileSpreadsheet size={20} />
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleExportPDF(questionario)}
                      >
                        <FileText size={20} />
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDelete(questionario.id)}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dettaglio Questionario</DialogTitle>
          </DialogHeader>
          {selectedQuestionario && (
            <div className="space-y-4">
              {renderQuestionarioDettaglio(selectedQuestionario)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Nuovo componente per questionari strutture */}
      <QuestionariStruttureNew />

      {/* Nuova Sezione Questionari Operatori */}
      <QuestionariOperatoriLista />
    </div>
  )
} 