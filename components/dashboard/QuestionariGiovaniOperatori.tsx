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
import { format } from 'date-fns'

type QuestionarioGiovani = {
  id: string;
  creato_a: string;
  creato_da: string;
  stato: string;
  fonte: string;
  percorso_autonomia: boolean;
  percorso_autonomia_spec: string;
  vive_in_struttura: boolean;
  collocazione_attuale: number;
  collocazione_attuale_spec: string;
  fattori_vulnerabilita: {
    stranieri: boolean;
    vittime_tratta: boolean;
    vittime_violenza: boolean;
    allontanati_famiglia: boolean;
    detenuti: boolean;
    ex_detenuti: boolean;
    misura_alternativa: boolean;
    senza_dimora: boolean;
    rom_sinti: boolean;
    disabilita_fisica: boolean;
    disabilita_cognitiva: boolean;
    disturbi_psichiatrici: boolean;
    dipendenze: boolean;
    genitori_precoci: boolean;
    orientamento_sessuale: boolean;
    altro: boolean;
    altro_spec: string;
  };
  sesso: number;
  classe_eta: number;
  luogo_nascita: number;
  luogo_nascita_spec: string;
  cittadinanza: number;
  permesso_soggiorno: number;
  tempo_in_struttura: number;
  ospite_precedente: number;
  familiari: {
    padre: boolean;
    madre: boolean;
    fratelli: boolean;
    nonni: boolean;
    altri_parenti: boolean;
    non_parenti: boolean;
  };
  titolo_studio_madre: number;
  situazione_madre: number;
  titolo_studio_padre: number;
  situazione_padre: number;
  titolo_studio: number;
  prima_entrata: {
    studiavo: boolean;
    lavoravo_stabile: boolean;
    lavoravo_saltuario: boolean;
    corso_formazione: boolean;
    altro: boolean;
    nessuna: boolean;
    altro_spec: string;
  };
  orientamento_lavoro: boolean;
  dove_orientamento: {
    scuola: boolean;
    enti_formazione: boolean;
    servizi_impiego: boolean;
    struttura: boolean;
    altro: boolean;
    altro_spec: string;
  };
  utilita_servizio: number;
  attualmente: {
    studio: boolean;
    formazione: boolean;
    lavoro: boolean;
    ricerca_lavoro: boolean;
    nessuna: boolean;
  };
  motivo_non_studio: number;
  corso_frequentato: string;
  lavoro_attuale: string;
  utilita: {
    studiare: number;
    formazione: number;
    lavorare: number;
    cercare_lavoro: number;
  };
  ricerca_lavoro: {
    centro_impiego: boolean;
    sportelli: boolean;
    inps: boolean;
    servizi_sociali: boolean;
    agenzie: boolean;
    cooperative: boolean;
    struttura: boolean;
    conoscenti: boolean;
    portali: boolean;
    social: boolean;
    altro: boolean;
    altro_spec: string;
  };
  curriculum: boolean;
  centro_impiego: boolean;
  lavoro_autonomo: boolean;
  importanza: {
    stabilita: number;
    flessibilita: number;
    valorizzazione: number;
    retribuzione: number;
    fatica: number;
    sicurezza: number;
    utilita_sociale: number;
    vicinanza: number;
  };
  abitazione_precedente: {
    solo: boolean;
    struttura: boolean;
    madre: boolean;
    padre: boolean;
    partner: boolean;
    figli: boolean;
    fratelli: boolean;
    nonni: boolean;
    altri_parenti: boolean;
    amici: boolean;
  };
  supporto: {
    padre: boolean;
    madre: boolean;
    fratelli: boolean;
    altri_parenti: boolean;
    amici: boolean;
    tutore: boolean;
    insegnanti: boolean;
    figure_sostegno: boolean;
    volontari: boolean;
    altre_persone: boolean;
    altre_persone_spec: string;
  };
  preoccupazioni: {
    pregiudizi: number;
    mancanza_lavoro: number;
    mancanza_aiuto: number;
    mancanza_casa: number;
    solitudine: number;
    salute: number;
    perdita_persone: number;
    altro: number;
    altro_spec: string;
  };
  realizzabile: {
    lavoro_piacevole: number;
    autonomia: number;
    famiglia: number;
    trovare_lavoro: number;
    salute: number;
    casa: number;
  };
  aiuto_futuro: string;
  pronto: boolean;
  non_pronto_perche: string;
  pronto_perche: string;
  emozioni: {
    felicita: boolean;
    tristezza: boolean;
    curiosita: boolean;
    preoccupazione: boolean;
    paura: boolean;
    liberazione: boolean;
    solitudine: boolean;
    rabbia: boolean;
    speranza: boolean;
    determinazione: boolean;
  };
  desiderio: string;
  aggiungere: string;
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
      const dataToExport = questionario ? [questionario] : questionari;
      
      const mappedData = dataToExport.map(q => ({
        'PERCAUT': q.percorso_autonomia ? 1 : 0,
        'PERCAUT_SPEC': q.percorso_autonomia_spec || '',
        'VIVE': q.vive_in_struttura ? 1 : 0,
        'CONDATT': q.collocazione_attuale || 0,
        'CONDATT_SPEC': q.collocazione_attuale_spec || '',
        'FV.1': q.fattori_vulnerabilita?.stranieri ? 1 : 0,
        'FV.2': q.fattori_vulnerabilita?.vittime_tratta ? 1 : 0,
        'FV.3': q.fattori_vulnerabilita?.vittime_violenza ? 1 : 0,
        'FV.4': q.fattori_vulnerabilita?.allontanati_famiglia ? 1 : 0,
        'FV.5': q.fattori_vulnerabilita?.detenuti ? 1 : 0,
        'FV.6': q.fattori_vulnerabilita?.ex_detenuti ? 1 : 0,
        'FV.7': q.fattori_vulnerabilita?.misura_alternativa ? 1 : 0,
        'FV.8': q.fattori_vulnerabilita?.senza_dimora ? 1 : 0,
        'FV.9': q.fattori_vulnerabilita?.rom_sinti ? 1 : 0,
        'FV.10': q.fattori_vulnerabilita?.disabilita_fisica ? 1 : 0,
        'FV.11': q.fattori_vulnerabilita?.disabilita_cognitiva ? 1 : 0,
        'FV.12': q.fattori_vulnerabilita?.disturbi_psichiatrici ? 1 : 0,
        'FV.13': q.fattori_vulnerabilita?.dipendenze ? 1 : 0,
        'FV.14': q.fattori_vulnerabilita?.genitori_precoci ? 1 : 0,
        'FV.15': q.fattori_vulnerabilita?.orientamento_sessuale ? 1 : 0,
        'FV.16': q.fattori_vulnerabilita?.altro ? 1 : 0,
        'FV.16_SPEC': q.fattori_vulnerabilita?.altro_spec || '',
        'B1': q.sesso || 0,
        'B2': q.classe_eta || 0,
        'B3': q.luogo_nascita || 0,
        'B3SPEC': q.luogo_nascita_spec || '',
        'B4': q.cittadinanza || 0,
        'B5': q.permesso_soggiorno || 0,
        'B6': q.tempo_in_struttura || 0,
        'B7': q.ospite_precedente || 0,
        'B8.1': q.familiari?.padre ? 1 : 0,
        'B8.2': q.familiari?.madre ? 1 : 0,
        'B8.3': q.familiari?.fratelli ? 1 : 0,
        'B8.4': q.familiari?.nonni ? 1 : 0,
        'B8.5': q.familiari?.altri_parenti ? 1 : 0,
        'B8.6': q.familiari?.non_parenti ? 1 : 0,
        'B9': q.titolo_studio_madre || 0,
        'B10': q.situazione_madre || 0,
        'B11': q.titolo_studio_padre || 0,
        'B12': q.situazione_padre || 0,
        'C1': q.titolo_studio || 0,
        'C2.1': q.prima_entrata?.studiavo ? 1 : 0,
        'C2.2': q.prima_entrata?.lavoravo_stabile ? 1 : 0,
        'C2.3': q.prima_entrata?.lavoravo_saltuario ? 1 : 0,
        'C2.4': q.prima_entrata?.corso_formazione ? 1 : 0,
        'C2.5': q.prima_entrata?.altro ? 1 : 0,
        'C2.6': q.prima_entrata?.nessuna ? 1 : 0,
        'C2.5SPEC': q.prima_entrata?.altro_spec || '',
        'C3': q.orientamento_lavoro ? 1 : 0,
        'C4.1': q.dove_orientamento?.scuola ? 1 : 0,
        'C4.2': q.dove_orientamento?.enti_formazione ? 1 : 0,
        'C4.3': q.dove_orientamento?.servizi_impiego ? 1 : 0,
        'C4.4': q.dove_orientamento?.struttura ? 1 : 0,
        'C4.5': q.dove_orientamento?.altro ? 1 : 0,
        'C4.5SPEC': q.dove_orientamento?.altro_spec || '',
        'C4_BIS': q.utilita_servizio || 0,
        'C5.1': q.attualmente?.studio ? 1 : 0,
        'C5.2': q.attualmente?.formazione ? 1 : 0,
        'C5.3': q.attualmente?.lavoro ? 1 : 0,
        'C5.4': q.attualmente?.ricerca_lavoro ? 1 : 0,
        'C5.5': q.attualmente?.nessuna ? 1 : 0,
        'C6': q.motivo_non_studio || 0,
        'C7': q.corso_frequentato || '',
        'C8': q.lavoro_attuale || '',
        'C8.1': q.utilita?.studiare || 0,
        'C8.2': q.utilita?.formazione || 0,
        'C8.3': q.utilita?.lavorare || 0,
        'C8.4': q.utilita?.cercare_lavoro || 0,
        'C9.1': q.ricerca_lavoro?.centro_impiego ? 1 : 0,
        'C9.2': q.ricerca_lavoro?.sportelli ? 1 : 0,
        'C9.3': q.ricerca_lavoro?.inps ? 1 : 0,
        'C9.4': q.ricerca_lavoro?.servizi_sociali ? 1 : 0,
        'C9.5': q.ricerca_lavoro?.agenzie ? 1 : 0,
        'C9.6': q.ricerca_lavoro?.cooperative ? 1 : 0,
        'C9.7': q.ricerca_lavoro?.struttura ? 1 : 0,
        'C9.8': q.ricerca_lavoro?.conoscenti ? 1 : 0,
        'C9.9': q.ricerca_lavoro?.portali ? 1 : 0,
        'C9.10': q.ricerca_lavoro?.social ? 1 : 0,
        'C9.11': q.ricerca_lavoro?.altro ? 1 : 0,
        'C9.11SPEC': q.ricerca_lavoro?.altro_spec || '',
        'C10': q.curriculum ? 1 : 0,
        'C11': q.centro_impiego ? 1 : 0,
        'C12': q.lavoro_autonomo ? 1 : 0,
        'C13.1': q.importanza?.stabilita || 0,
        'C13.2': q.importanza?.flessibilita || 0,
        'C13.3': q.importanza?.valorizzazione || 0,
        'C13.4': q.importanza?.retribuzione || 0,
        'C13.5': q.importanza?.fatica || 0,
        'C13.6': q.importanza?.sicurezza || 0,
        'C13.7': q.importanza?.utilita_sociale || 0,
        'C13.8': q.importanza?.vicinanza || 0,
        'D1.1': q.abitazione_precedente?.solo ? 1 : 0,
        'D1.2': q.abitazione_precedente?.struttura ? 1 : 0,
        'D1.3': q.abitazione_precedente?.madre ? 1 : 0,
        'D1.4': q.abitazione_precedente?.padre ? 1 : 0,
        'D1.5': q.abitazione_precedente?.partner ? 1 : 0,
        'D1.6': q.abitazione_precedente?.figli ? 1 : 0,
        'D1.7': q.abitazione_precedente?.fratelli ? 1 : 0,
        'D1.8': q.abitazione_precedente?.nonni ? 1 : 0,
        'D1.9': q.abitazione_precedente?.altri_parenti ? 1 : 0,
        'D1.10': q.abitazione_precedente?.amici ? 1 : 0,
        'D2.1': q.supporto?.padre ? 1 : 0,
        'D2.2': q.supporto?.madre ? 1 : 0,
        'D2.3': q.supporto?.fratelli ? 1 : 0,
        'D2.4': q.supporto?.altri_parenti ? 1 : 0,
        'D2.5': q.supporto?.amici ? 1 : 0,
        'D2.6': q.supporto?.tutore ? 1 : 0,
        'D2.7': q.supporto?.insegnanti ? 1 : 0,
        'D2.8': q.supporto?.figure_sostegno ? 1 : 0,
        'D2.9': q.supporto?.volontari ? 1 : 0,
        'D2.10': q.supporto?.altre_persone ? 1 : 0,
        'D2.10SPEC': q.supporto?.altre_persone_spec || '',
        'E1.1': q.preoccupazioni?.pregiudizi || 0,
        'E1.2': q.preoccupazioni?.mancanza_lavoro || 0,
        'E1.3': q.preoccupazioni?.mancanza_aiuto || 0,
        'E1.4': q.preoccupazioni?.mancanza_casa || 0,
        'E1.5': q.preoccupazioni?.solitudine || 0,
        'E1.6': q.preoccupazioni?.salute || 0,
        'E1.7': q.preoccupazioni?.perdita_persone || 0,
        'E1.8': q.preoccupazioni?.altro || 0,
        'E1.8SPEC': q.preoccupazioni?.altro_spec || '',
        'E2.1': q.realizzabile?.lavoro_piacevole || 0,
        'E2.2': q.realizzabile?.autonomia || 0,
        'E2.3': q.realizzabile?.famiglia || 0,
        'E2.4': q.realizzabile?.trovare_lavoro || 0,
        'E2.5': q.realizzabile?.salute || 0,
        'E2.6': q.realizzabile?.casa || 0,
        'E3': q.aiuto_futuro || '',
        'E4': q.pronto ? 1 : 0,
        'E4.1': q.non_pronto_perche || '',
        'E4.2': q.pronto_perche || '',
        'E5.1': q.emozioni?.felicita ? 1 : 0,
        'E5.2': q.emozioni?.tristezza ? 1 : 0,
        'E5.3': q.emozioni?.curiosita ? 1 : 0,
        'E5.4': q.emozioni?.preoccupazione ? 1 : 0,
        'E5.5': q.emozioni?.paura ? 1 : 0,
        'E5.6': q.emozioni?.liberazione ? 1 : 0,
        'E5.7': q.emozioni?.solitudine ? 1 : 0,
        'E5.8': q.emozioni?.rabbia ? 1 : 0,
        'E5.9': q.emozioni?.speranza ? 1 : 0,
        'E5.10': q.emozioni?.determinazione ? 1 : 0,
        'E6': q.desiderio || '',
        'E7': q.aggiungere || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      const workbook = XLSX.utils.book_new();
      
      const wscols = Array(Object.keys(mappedData[0]).length).fill({ wch: 15 });
      worksheet['!cols'] = wscols;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Questionari");

      const fileName = `questionari_giovani_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success('Export Excel completato');
    } catch (error) {
      console.error('Errore export Excel:', error);
      toast.error('Errore durante l\'export Excel');
    }
  }

  const handleExportPDF = async (questionario?: QuestionarioGiovani) => {
    try {
      const doc = new jsPDF()
      const dataToExport = questionario ? [questionario] : questionari
      
      doc.text("Questionari Giovani Operatori", 14, 15)
      
      doc.autoTable({
        head: [['Campo', 'Valore']],
        body: Object.entries(dataToExport[0]).map(([key, value]) => [
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value)
        ]),
        startY: 25,
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { cellWidth: 'auto' }
        }
      })
      
      doc.save(`questionari_giovani_operatori_${new Date().toISOString()}.pdf`)
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

  const renderQuestionarioDettaglio = (questionario: QuestionarioGiovani) => {
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
            <h3 className="font-bold">Dettagli Giovane</h3>
            {/* Aggiungi qui i campi specifici dei giovani */}
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
          {selectedQuestionario && renderQuestionarioDettaglio(selectedQuestionario)}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 