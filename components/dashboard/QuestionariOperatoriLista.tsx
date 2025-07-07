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
          .from('operatori')
          .select('*')
          .neq('stato', 'cancellato')
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
      console.log('🔄 Tentativo di eliminazione del questionario:', id)
      
      const { error } = await supabase
        .from('operatori')
        .delete()
        .eq('id', id)

      console.log('📡 Risposta Supabase - error:', error)

      if (error) {
        console.error('❌ Errore Supabase:', error)
        throw error
      }
      
      console.log('✅ Questionario eliminato con successo')
      setQuestionari(prev => prev.filter(q => q.id !== id))
      toast.success('Questionario eliminato con successo')
    } catch (error) {
      console.error('💥 Errore durante l\'eliminazione:', error)
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

        // Controlli di sicurezza per i campi undefined
        const professione = q.professione || { tipo: 'Altro', altro_specificare: '' };
        const persone_seguite = q.persone_seguite || { uomini: 0, donne: 0, totale: 0 };
        const persone_maggiorenni = q.persone_maggiorenni || { uomini: 0, donne: 0, totale: 0 };
        const caratteristiche_persone = q.caratteristiche_persone || {
          stranieri_migranti: false,
          vittime_tratta: false,
          vittime_violenza: false,
          allontanati_famiglia: false,
          detenuti: false,
          ex_detenuti: false,
          misure_alternative: false,
          indigenti_senzatetto: false,
          rom_sinti: false,
          disabilita_fisica: false,
          disabilita_cognitiva: false,
          disturbi_psichiatrici: false,
          dipendenze: false,
          genitori_precoci: false,
          problemi_orientamento: false,
          altro: false,
          altro_specificare: ''
        };
        const tipo_intervento = q.tipo_intervento || {
          sostegno_formazione: false,
          sostegno_lavoro: false,
          sostegno_abitativo: false,
          sostegno_famiglia: false,
          sostegno_coetanei: false,
          sostegno_competenze: false,
          sostegno_legale: false,
          sostegno_sociosanitario: false,
          mediazione_interculturale: false,
          altro: false,
          altro_specificare: ''
        };
        const difficolta_uscita = q.difficolta_uscita || {
          problemi_economici: 0,
          trovare_lavoro: 0,
          lavori_qualita: 0,
          trovare_casa: 0,
          discriminazioni: 0,
          salute_fisica: 0,
          problemi_psicologici: 0,
          difficolta_linguistiche: 0,
          altro: 0,
          altro_specificare: ''
        };

        return {
          COD_OPE: q.creato_da || 'FORNITO DA INAPP',
          ID_QUEST: q.id || 'FORNITO DAL SISTEMA',
          TIPO_STRUTTURA: q.tipo_struttura || '',
          PROF: professioneMap[professione.tipo] || 13,
          PROF_SPEC: professione.tipo === 'Altro' ? professione.altro_specificare : '',
          B1U: persone_seguite.uomini || 0,
          B1D: persone_seguite.donne || 0,
          B1T: persone_seguite.totale || 0,
          B2U: persone_maggiorenni.uomini || 0,
          B2D: persone_maggiorenni.donne || 0,
          B2T: persone_maggiorenni.totale || 0,
          B3_1: caratteristiche_persone.stranieri_migranti ? 1 : 0,
          B3_2: caratteristiche_persone.vittime_tratta ? 1 : 0,
          B3_3: caratteristiche_persone.vittime_violenza ? 1 : 0,
          B3_4: caratteristiche_persone.allontanati_famiglia ? 1 : 0,
          B3_5: caratteristiche_persone.detenuti ? 1 : 0,
          B3_6: caratteristiche_persone.ex_detenuti ? 1 : 0,
          B3_7: caratteristiche_persone.misure_alternative ? 1 : 0,
          B3_8: caratteristiche_persone.indigenti_senzatetto ? 1 : 0,
          B3_9: caratteristiche_persone.rom_sinti ? 1 : 0,
          B3_10: caratteristiche_persone.disabilita_fisica ? 1 : 0,
          B3_11: caratteristiche_persone.disabilita_cognitiva ? 1 : 0,
          B3_12: caratteristiche_persone.disturbi_psichiatrici ? 1 : 0,
          B3_13: caratteristiche_persone.dipendenze ? 1 : 0,
          B3_14: caratteristiche_persone.genitori_precoci ? 1 : 0,
          B3_15: caratteristiche_persone.problemi_orientamento ? 1 : 0,
          B3_16: caratteristiche_persone.altro ? 1 : 0,
          B3_16SPEC: caratteristiche_persone.altro_specificare || '',
          B4_1: tipo_intervento.sostegno_formazione ? 1 : 0,
          B4_2: tipo_intervento.sostegno_lavoro ? 1 : 0,
          B4_3: tipo_intervento.sostegno_abitativo ? 1 : 0,
          B4_4: tipo_intervento.sostegno_famiglia ? 1 : 0,
          B4_5: tipo_intervento.sostegno_coetanei ? 1 : 0,
          B4_6: tipo_intervento.sostegno_competenze ? 1 : 0,
          B4_7: tipo_intervento.sostegno_legale ? 1 : 0,
          B4_8: tipo_intervento.sostegno_sociosanitario ? 1 : 0,
          B4_9: tipo_intervento.mediazione_interculturale ? 1 : 0,
          B4_10: tipo_intervento.altro ? 1 : 0,
          B4_10SPEC: tipo_intervento.altro_specificare || '',
          C1: difficolta_uscita.problemi_economici || 0,
          C2: difficolta_uscita.trovare_lavoro || 0,
          C3: difficolta_uscita.lavori_qualita || 0,
          C4: difficolta_uscita.trovare_casa || 0,
          C5: difficolta_uscita.discriminazioni || 0,
          C6: difficolta_uscita.salute_fisica || 0,
          C7: difficolta_uscita.problemi_psicologici || 0,
          C8: difficolta_uscita.difficolta_linguistiche || 0,
          C9: difficolta_uscita.altro || 0,
          C9SPEC: difficolta_uscita.altro_specificare || ''
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
                      onClick={() => {
                        console.log('🎯 Click sul cestino rilevato per ID:', questionario.id)
                        handleDelete(questionario.id)
                      }}
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