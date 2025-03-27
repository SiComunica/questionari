'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileSpreadsheet, FileText, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

type QuestionarioGiovani = {
  id: string;
  creato_a: string;
  creato_da: string;
  stato: string;
  fonte: string;
  // ... altri campi del questionario
}

export default function QuestionariGiovaniOperatori() {
  const [questionari, setQuestionari] = useState<QuestionarioGiovani[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestionario, setSelectedQuestionario] = useState<QuestionarioGiovani | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        const { data, error } = await supabase
          .from('operatorinew')
          .select('*')
          .order('creato_a', { ascending: false })

        if (error) throw error
        setQuestionari(data || [])
      } catch (err) {
        console.error('Errore:', err)
        toast.error('Errore nel caricamento dei questionari')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionari()
  }, [])

  const handleExportExcel = async (questionario?: QuestionarioGiovani) => {
    try {
      const dataToExport = questionario ? [questionario] : questionari
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Questionari")
      XLSX.writeFile(workbook, `questionari_giovani_${new Date().toISOString()}.xlsx`)
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
      
      doc.text("Questionari Giovani", 14, 15)
      
      // @ts-ignore - ignoriamo l'errore di TypeScript per autoTable
      doc.autoTable({
        head: [Object.keys(dataToExport[0])],
        body: dataToExport.map(Object.values),
        startY: 25,
      })
      
      doc.save(`questionari_giovani_${new Date().toISOString()}.pdf`)
      toast.success('Export PDF completato')
    } catch (error) {
      console.error('Errore export PDF:', error)
      toast.error('Errore durante l\'export PDF')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('operatorinew')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setQuestionari(prev => prev.filter(q => q.id !== id))
      toast.success('Questionario eliminato con successo')
    } catch (error) {
      toast.error('Errore durante l\'eliminazione')
    }
  }

  if (loading) return <div>Caricamento...</div>

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Questionari Giovani</CardTitle>
      </CardHeader>
      <CardContent>
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

        {questionari.length === 0 ? (
          <p>Nessun questionario giovani ricevuto</p>
        ) : (
          <div className="space-y-4">
            {questionari.map((questionario) => (
              <Card key={questionario.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Inviato il {new Date(questionario.creato_a).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Operatore: {questionario.creato_da}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dettaglio Questionario Giovani</DialogTitle>
          </DialogHeader>
          {selectedQuestionario && (
            <div className="space-y-4">
              {Object.entries(selectedQuestionario).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">{key}:</span>
                  <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => handleExportExcel(selectedQuestionario)} className="flex gap-2">
                  <FileSpreadsheet size={20} />
                  Excel
                </Button>
                <Button onClick={() => handleExportPDF(selectedQuestionario)} className="flex gap-2">
                  <FileText size={20} />
                  PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 