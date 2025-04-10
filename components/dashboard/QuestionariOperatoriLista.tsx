'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileSpreadsheet, FileText, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

type QuestionarioOperatori = {
  id: string;
  creato_a: string;
  creato_da: string;
  stato: string;
  id_struttura: string;
  tipo_struttura: string;
  professione: {
    tipo: string;
    altro_specificare: string;
  };
  persone_seguite: {
    uomini: number;
    donne: number;
    totale: number;
  };
  persone_maggiorenni: {
    uomini: number;
    donne: number;
    totale: number;
  };
  caratteristiche_persone: {
    stranieri_migranti: boolean;
    vittime_tratta: boolean;
    vittime_violenza: boolean;
    allontanati_famiglia: boolean;
    detenuti: boolean;
    ex_detenuti: boolean;
    misure_alternative: boolean;
    indigenti_senzatetto: boolean;
    rom_sinti: boolean;
    disabilita_fisica: boolean;
    disabilita_cognitiva: boolean;
    disturbi_psichiatrici: boolean;
    dipendenze: boolean;
    genitori_precoci: boolean;
    problemi_orientamento: boolean;
    altro: boolean;
    altro_specificare: string;
  };
  tipo_intervento: {
    sostegno_formazione: boolean;
    sostegno_lavoro: boolean;
    sostegno_abitativo: boolean;
    sostegno_famiglia: boolean;
    sostegno_coetanei: boolean;
    sostegno_competenze: boolean;
    sostegno_legale: boolean;
    sostegno_sociosanitario: boolean;
    mediazione_interculturale: boolean;
    altro: boolean;
    altro_specificare: string;
  };
  difficolta_uscita: {
    problemi_economici: number;
    trovare_lavoro: number;
    lavori_qualita: number;
    trovare_casa: number;
    discriminazioni: number;
    salute_fisica: number;
    problemi_psicologici: number;
    difficolta_linguistiche: number;
    altro: number;
    altro_specificare: string;
  };
  fonte: string;
}

export default function QuestionariOperatoriLista() {
  const [questionari, setQuestionari] = useState<QuestionarioOperatori[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestionario, setSelectedQuestionario] = useState<QuestionarioOperatori | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        const { data, error } = await supabase
          .from('operatori')
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

  const handleExportExcel = async (questionario?: QuestionarioOperatori) => {
    try {
      const data = questionario ? [questionario] : questionari;
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `questionari_operatori_${new Date().toISOString()}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Export completato');
    } catch (error) {
      console.error('Errore durante l\'export:', error);
      toast.error('Errore durante l\'export');
    }
  };

  const handleExportPDF = async (questionario?: QuestionarioOperatori) => {
    try {
      const doc = new jsPDF()
      const dataToExport = questionario ? [questionario] : questionari
      
      doc.text("Questionari Operatori", 14, 15)
      
      const headers = ['Campo', 'Valore']
      const data = Object.entries(dataToExport[0]).map(([key, value]) => {
        let displayValue = value
        if (typeof value === 'object' && value !== null) {
          displayValue = JSON.stringify(value, null, 2)
        }
        return [key, String(displayValue)]
      })

      doc.autoTable({
        head: [headers],
        body: data,
        startY: 25,
        styles: {
          fontSize: 10,
          cellPadding: 5,
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 10, right: 10 },
        theme: 'grid'
      })
      
      doc.save(`questionari_operatori_${new Date().toISOString()}.pdf`)
      toast.success('Export PDF completato')
    } catch (error) {
      console.error('Errore export PDF:', error)
      toast.error('Errore durante l\'export PDF')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('operatori')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setQuestionari(prev => prev.filter(q => q.id !== id))
      toast.success('Questionario eliminato con successo')
    } catch (error) {
      toast.error('Errore durante l\'eliminazione')
    }
  }

  const handleExportXLSX = () => {
    if (questionari.length === 0) {
      toast.error('Nessun dato da esportare');
      return;
    }

    // Prepariamo i dati per l'export
    const dataToExport = questionari.map(q => ({
      ID: q.id,
      'Data Creazione': new Date(q.creato_a).toLocaleDateString('it-IT'),
      'Codice Operatore': q.creato_da,
      'ID Struttura': q.id_struttura,
      'Tipo Struttura': q.tipo_struttura,
      'Professione': q.professione.tipo,
      'Professione Altro': q.professione.altro_specificare,
      'Persone Seguite Uomini': q.persone_seguite.uomini,
      'Persone Seguite Donne': q.persone_seguite.donne,
      'Persone Seguite Totale': q.persone_seguite.totale,
      'Persone Maggiorenni Uomini': q.persone_maggiorenni.uomini,
      'Persone Maggiorenni Donne': q.persone_maggiorenni.donne,
      'Persone Maggiorenni Totale': q.persone_maggiorenni.totale,
      'Caratteristiche Persone': Object.entries(q.caratteristiche_persone)
        .filter(([key, value]) => typeof value === 'boolean' && value === true && !key.includes('spec'))
        .map(([key]) => key)
        .join(', '),
      'Caratteristiche Altro': q.caratteristiche_persone.altro_specificare,
      'Tipo Intervento': Object.entries(q.tipo_intervento)
        .filter(([key, value]) => typeof value === 'boolean' && value === true && !key.includes('spec'))
        .map(([key]) => key)
        .join(', '),
      'Tipo Intervento Altro': q.tipo_intervento.altro_specificare,
      'Difficoltà Uscita': Object.entries(q.difficolta_uscita)
        .filter(([key, value]) => typeof value === 'boolean' && value === true && !key.includes('spec'))
        .map(([key]) => key)
        .join(', '),
      'Difficoltà Altro': q.difficolta_uscita.altro_specificare,
      'Stato': q.stato
    }));

    // Creiamo il workbook
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questionari Operatori');

    // Scarichiamo il file
    XLSX.writeFile(wb, 'questionari_operatori.xlsx');
    toast.success('Export completato con successo');
  };

  const renderQuestionarioDettaglio = (questionario: QuestionarioOperatori) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold">Dati Generali</h3>
            <p>Data invio: {new Date(questionario.creato_a).toLocaleDateString()}</p>
            <p>Operatore: {questionario.creato_da}</p>
            <p>Stato: {questionario.stato}</p>
          </div>
          <div>
            <h3 className="font-bold">Dettagli Operatore</h3>
            {/* Aggiungi qui i campi specifici degli operatori */}
          </div>
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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Questionari Operatori</CardTitle>
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
          <Button onClick={handleExportXLSX} className="flex gap-2">
            <FileSpreadsheet size={20} />
            Esporta tutti in XLSX
          </Button>
        </div>

        {questionari.length === 0 ? (
          <p>Nessun questionario operatori ricevuto</p>
        ) : (
          <div className="space-y-4">
            {questionari.map((questionario) => (
              <Card key={questionario.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Operatore: {questionario.creato_da}</p>
                    <p className="text-sm text-gray-600">
                      Inviato il {new Date(questionario.creato_a).toLocaleDateString()}
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
            <DialogTitle>Dettaglio Questionario Operatore</DialogTitle>
          </DialogHeader>
          {selectedQuestionario && renderQuestionarioDettaglio(selectedQuestionario)}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 