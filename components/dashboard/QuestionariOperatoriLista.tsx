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
import { format } from 'date-fns'

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
        .from('operatorinew')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setQuestionari(prev => prev.filter(q => q.id !== id))
      toast.success('Questionario eliminato con successo')
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error)
      toast.error('Errore durante l\'eliminazione')
    }
  }

  const handleExportXLSX = () => {
    if (questionari.length === 0) {
      toast.error('Nessun dato da esportare');
      return;
    }

    try {
      const dataToExport = questionari.map(q => {
        // Mappiamo la professione secondo i codici del tracciato record
        const professioneMap: { [key: string]: number } = {
          'Psicologo': 1,
          'Assistente sociale': 2,
          'Educatore': 3,
          'Mediatore': 4,
          'Medico': 5,
          'Personale infermieristico/operatore sanitario': 6,
          'Insegnante/formatore': 7,
          'Cappellano/operatore religioso e spirituale': 8,
          'Tutor': 9,
          'Operatore legale': 10,
          'Operatore multifunzionale': 11,
          'Amministrativo': 12,
          'Altro': 13
        };

        return {
          COD_OPE: q.creato_da || 'FORNITO DA INAPP',
          ID_QUEST: q.id || 'FORNITO DAL SISTEMA',
          TIPO_STRUTTURA: q.tipo_struttura || '',
          PROF: professioneMap[q.professione.tipo] || 13,
          PROF_SPEC: q.professione.tipo === 'Altro' ? q.professione.altro_specificare : '',
          B1U: q.persone_seguite.uomini || 0,
          B1D: q.persone_seguite.donne || 0,
          B1T: q.persone_seguite.totale || 0,
          B2U: q.persone_maggiorenni.uomini || 0,
          B2D: q.persone_maggiorenni.donne || 0,
          B2T: q.persone_maggiorenni.totale || 0,
          B3_1: q.caratteristiche_persone.stranieri_migranti ? 1 : 0,
          B3_2: q.caratteristiche_persone.vittime_tratta ? 1 : 0,
          B3_3: q.caratteristiche_persone.vittime_violenza ? 1 : 0,
          B3_4: q.caratteristiche_persone.allontanati_famiglia ? 1 : 0,
          B3_5: q.caratteristiche_persone.detenuti ? 1 : 0,
          B3_6: q.caratteristiche_persone.ex_detenuti ? 1 : 0,
          B3_7: q.caratteristiche_persone.misure_alternative ? 1 : 0,
          B3_8: q.caratteristiche_persone.indigenti_senzatetto ? 1 : 0,
          B3_9: q.caratteristiche_persone.rom_sinti ? 1 : 0,
          B3_10: q.caratteristiche_persone.disabilita_fisica ? 1 : 0,
          B3_11: q.caratteristiche_persone.disabilita_cognitiva ? 1 : 0,
          B3_12: q.caratteristiche_persone.disturbi_psichiatrici ? 1 : 0,
          B3_13: q.caratteristiche_persone.dipendenze ? 1 : 0,
          B3_14: q.caratteristiche_persone.genitori_precoci ? 1 : 0,
          B3_15: q.caratteristiche_persone.problemi_orientamento ? 1 : 0,
          B3_16: q.caratteristiche_persone.altro ? 1 : 0,
          B3_16SPEC: q.caratteristiche_persone.altro_specificare || '',
          B4_1: q.tipo_intervento.sostegno_formazione ? 1 : 0,
          B4_2: q.tipo_intervento.sostegno_lavoro ? 1 : 0,
          B4_3: q.tipo_intervento.sostegno_abitativo ? 1 : 0,
          B4_4: q.tipo_intervento.sostegno_famiglia ? 1 : 0,
          B4_5: q.tipo_intervento.sostegno_coetanei ? 1 : 0,
          B4_6: q.tipo_intervento.sostegno_competenze ? 1 : 0,
          B4_7: q.tipo_intervento.sostegno_legale ? 1 : 0,
          B4_8: q.tipo_intervento.sostegno_sociosanitario ? 1 : 0,
          B4_9: q.tipo_intervento.mediazione_interculturale ? 1 : 0,
          B4_10: q.tipo_intervento.altro ? 1 : 0,
          B4_10SPEC: q.tipo_intervento.altro_specificare || '',
          C1: q.difficolta_uscita.problemi_economici || 0,
          C2: q.difficolta_uscita.trovare_lavoro || 0,
          C3: q.difficolta_uscita.lavori_qualita || 0,
          C4: q.difficolta_uscita.trovare_casa || 0,
          C5: q.difficolta_uscita.discriminazioni || 0,
          C6: q.difficolta_uscita.salute_fisica || 0,
          C7: q.difficolta_uscita.problemi_psicologici || 0,
          C8: q.difficolta_uscita.difficolta_linguistiche || 0,
          C9: q.difficolta_uscita.altro || 0,
          C9SPEC: q.difficolta_uscita.altro_specificare || ''
        };
      });

      // Creiamo il workbook
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Questionari Operatori');

      // Scarichiamo il file
      const fileName = `questionari_operatori_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success('Export completato con successo');
    } catch (error) {
      console.error('Errore durante l\'export:', error);
      toast.error('Errore durante l\'export');
    }
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
          <Button onClick={handleExportXLSX} className="flex gap-2">
            <FileSpreadsheet size={20} />
            Esporta XLSX
          </Button>
          <Button onClick={() => handleExportPDF()} className="flex gap-2">
            <FileText size={20} />
            Esporta PDF
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