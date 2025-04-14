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

// Definiamo il tipo base che corrisponde alla struttura del database
type QuestionarioStrutture = {
  id: string;
  creato_a: string;
  creato_da: string;
  stato: string;
  nome_struttura: string;
  id_struttura: string;
  forma_giuridica: string;
  forma_giuridica_altro: string;
  tipo_struttura: string;
  tipo_struttura_altro: string;
  anno_inizio: number;
  missione: string;
  personale_retribuito_uomini: number;
  personale_retribuito_donne: number;
  personale_volontario_uomini: number;
  personale_volontario_donne: number;
  figure_professionali: string[];
  figure_professionali_altro: string;
  servizi_offerti: string[];
  tipologia_utenti: string[];
  modalita_accesso: string;
  durata_media_accoglienza: number;
  numero_posti: number;
  costi_mensili: number;
  fonti_finanziamento: string[];
  collaborazioni: string[];
  note: string;
  persone_ospitate?: {
    fino_16?: { uomini: number; donne: number; totale: number };
    da_16_a_18?: { uomini: number; donne: number; totale: number };
    maggiorenni?: { uomini: number; donne: number; totale: number };
  };
  persone_non_ospitate?: {
    fino_16?: { uomini: number; donne: number; totale: number };
    da_16_a_18?: { uomini: number; donne: number; totale: number };
    maggiorenni?: { uomini: number; donne: number; totale: number };
  };
}

export default function QuestionariStruttureNew() {
  const [questionari, setQuestionari] = useState<QuestionarioStrutture[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestionario, setSelectedQuestionario] = useState<QuestionarioStrutture | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        const { data, error } = await supabase
          .from('strutture')
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

  const handleExportPDF = async (questionario?: QuestionarioStrutture) => {
    try {
      const doc = new jsPDF()
      const dataToExport = questionario ? [questionario] : questionari
      
      doc.text("Questionari Strutture", 14, 15)
      
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
      
      doc.save(`questionari_strutture_${new Date().toISOString()}.pdf`)
      toast.success('Export PDF completato')
    } catch (error) {
      console.error('Errore export PDF:', error)
      toast.error('Errore durante l\'export PDF')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('strutture')
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

    const dataToExport = questionari.map(q => ({
      'ID_STRUTTURA': q.id_struttura || '',
      'FORMAGIU': q.forma_giuridica || '',
      'FORMAGIU_SPEC': q.forma_giuridica_altro || '',
      'TIPO_STRUTTURA': q.tipo_struttura || '',
      'ANNO_INIZIO': q.anno_inizio || '',
      'MISSION': q.missione || '',
      'B1U': q.personale_retribuito_uomini || 0,
      'B1D': q.personale_retribuito_donne || 0,
      'B1T': (q.personale_retribuito_uomini || 0) + (q.personale_retribuito_donne || 0),
      'B2U': q.personale_volontario_uomini || 0,
      'B2D': q.personale_volontario_donne || 0,
      'B2T': (q.personale_volontario_uomini || 0) + (q.personale_volontario_donne || 0),
      'B3.1': q.figure_professionali?.includes('Psicologi') ? 1 : 0,
      'B3.2': q.figure_professionali?.includes('Assistenti sociali') ? 1 : 0,
      'B3.3': q.figure_professionali?.includes('Educatori') ? 1 : 0,
      'B3.4': q.figure_professionali?.includes('Mediatori') ? 1 : 0,
      'B3.5': q.figure_professionali?.includes('Medici') ? 1 : 0,
      'B3.6': q.figure_professionali?.includes('Personale infermieristico/operatori sanitari') ? 1 : 0,
      'B3.7': q.figure_professionali?.includes('Insegnanti/formatori') ? 1 : 0,
      'B3.8': q.figure_professionali?.includes('Cappellano/operatori religiosi e spirituali') ? 1 : 0,
      'B3.9': q.figure_professionali?.includes('Tutor') ? 1 : 0,
      'B3.10': q.figure_professionali?.includes('Operatore legale') ? 1 : 0,
      'B3.11': q.figure_professionali?.includes('Operatore multifunzionale') ? 1 : 0,
      'B3.12': q.figure_professionali?.includes('Amministrativo') ? 1 : 0,
      'B3.13': q.figure_professionali?.includes('Altro') ? 1 : 0,
      'B3.13_SPEC': q.figure_professionali_altro || '',
      // Persone ospitate
      'C1A.U': q.persone_ospitate?.fino_16?.uomini || 0,
      'C1B.U': q.persone_ospitate?.da_16_a_18?.uomini || 0,
      'C1C.U': q.persone_ospitate?.maggiorenni?.uomini || 0,
      'C1A.D': q.persone_ospitate?.fino_16?.donne || 0,
      'C1B.D': q.persone_ospitate?.da_16_a_18?.donne || 0,
      'C1C.D': q.persone_ospitate?.maggiorenni?.donne || 0,
      // Persone non ospitate
      'C3A.U': q.persone_non_ospitate?.fino_16?.uomini || 0,
      'C3B.U': q.persone_non_ospitate?.da_16_a_18?.uomini || 0,
      'C3C.U': q.persone_non_ospitate?.maggiorenni?.uomini || 0,
      'C3A.D': q.persone_non_ospitate?.fino_16?.donne || 0,
      'C3B.D': q.persone_non_ospitate?.da_16_a_18?.donne || 0,
      'C3C.D': q.persone_non_ospitate?.maggiorenni?.donne || 0,
    }));

    // Creiamo il workbook
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questionari Strutture');

    // Scarichiamo il file
    XLSX.writeFile(wb, `questionari_strutture_${new Date().toISOString()}.xlsx`);
    toast.success('Export completato con successo');
  };

  const renderQuestionarioDettaglio = (questionario: QuestionarioStrutture) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold">Dati Struttura</h3>
            <p>Nome: {questionario.nome_struttura}</p>
            <p>ID Struttura: {questionario.id_struttura}</p>
            <p>Forma Giuridica: {questionario.forma_giuridica}</p>
            <p>Tipo: {questionario.tipo_struttura}</p>
            <p>Anno Inizio: {questionario.anno_inizio}</p>
          </div>
          <div>
            <h3 className="font-bold">Personale</h3>
            <p>Retribuiti Uomini: {questionario.personale_retribuito_uomini}</p>
            <p>Retribuiti Donne: {questionario.personale_retribuito_donne}</p>
            <p>Volontari Uomini: {questionario.personale_volontario_uomini}</p>
            <p>Volontari Donne: {questionario.personale_volontario_donne}</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Missione</h3>
          <p>{questionario.missione}</p>
        </div>
        <div>
          <h3 className="font-bold">Figure Professionali</h3>
          <ul className="list-disc pl-4">
            {questionario.figure_professionali.map((figura, index) => (
              <li key={index}>{figura}</li>
            ))}
          </ul>
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
        <CardTitle>Questionari Strutture</CardTitle>
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
          <p>Nessun questionario strutture ricevuto</p>
        ) : (
          <div className="space-y-4">
            {questionari.map((questionario) => (
              <Card key={questionario.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Struttura: {questionario.nome_struttura}</p>
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
            <DialogTitle>Dettaglio Questionario Struttura</DialogTitle>
          </DialogHeader>
          {selectedQuestionario && renderQuestionarioDettaglio(selectedQuestionario)}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 