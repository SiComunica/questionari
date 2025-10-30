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
    fv1_stranieri: boolean;
    fv2_vittime_tratta: boolean;
    fv3_vittime_violenza: boolean;
    fv4_allontanati_famiglia: boolean;
    fv5_detenuti: boolean;
    fv6_ex_detenuti: boolean;
    fv7_esecuzione_penale: boolean;
    fv8_indigenti: boolean;
    fv9_rom_sinti: boolean;
    fv10_disabilita_fisica: boolean;
    fv11_disabilita_cognitiva: boolean;
    fv12_disturbi_psichiatrici: boolean;
    fv13_dipendenze: boolean;
    fv14_genitori_precoci: boolean;
    fv15_orientamento_sessuale: boolean;
    fv16_altro: boolean;
    fv16_spec: string;
  };
  sesso: number;
  classe_eta: number;
  luogo_nascita: number;
  luogo_nascita_spec: string;
  cittadinanza: number;
  permesso_soggiorno: number;
  tempo_in_struttura: number;
  precedenti_strutture: number;
  madre: {
    titolo_studio: number;
    situazione: number;
  };
  padre: {
    titolo_studio: number;
    situazione: number;
  };
  famiglia_origine: {
    fratelli: boolean;
    nonni: boolean;
    altri_parenti: boolean;
    non_parenti: boolean;
  };
  titolo_studio: number;
  attivita_precedenti: {
    studiavo: boolean;
    lavoravo_stabile: boolean;
    lavoravo_saltuario: boolean;
    corso_formazione: boolean;
    altro: boolean;
    nessuna: boolean;
    altro_spec: string;
  };
  orientamento_lavoro: boolean;
  orientamento_luoghi: {
    scuola: boolean;
    enti_formazione: boolean;
    servizi_impiego: boolean;
    struttura: boolean;
    altro: boolean;
    altro_spec: string;
  };
  utilita_servizio: number;
  attivita_attuali: {
    studio: boolean;
    formazione: boolean;
    lavoro: boolean;
    ricerca_lavoro: boolean;
    nessuna: boolean;
  };
  motivi_non_studio: number;
  corso_formazione: string;
  lavoro_attuale: string;
  livelli_utilita: number[];
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
  curriculum_vitae: boolean;
  centro_impiego: boolean;
  lavoro_autonomo: boolean;
  condizioni_lavoro: {
    stabilita: number;
    flessibilita: number;
    valorizzazione: number;
    retribuzione: number;
    fatica: number;
    sicurezza: number;
    utilita_sociale: number;
    vicinanza_casa: number;
  };
  aspetti_lavoro: {
    stabilita: number;
    flessibilita: number;
    valorizzazione: number;
    retribuzione: number;
    fatica: number;
    sicurezza: number;
    utilita_sociale: number;
    vicinanza_casa: number;
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
  figura_aiuto: {
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
  preoccupazioni_futuro: {
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
  obiettivi_realizzabili: {
    lavoro_piacevole: number;
    autonomia: number;
    famiglia: number;
    trovare_lavoro: number;
    salute: number;
    casa: number;
  };
  aiuto_futuro: string;
  pronto_uscita: boolean;
  pronto_uscita_perche_no: string;
  pronto_uscita_perche_si: string;
  emozioni_uscita: {
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
  nota_aggiuntiva: string;
  id_struttura: string;
  tipo_struttura: string;
  operatori: string;
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
      
      // Debug: controlliamo la struttura dei dati
      console.log('Dati giovani per export:', dataToExport[0]);
      console.log('Struttura fattori_vulnerabilita:', dataToExport[0]?.fattori_vulnerabilita);
      console.log('Struttura livelli_utilita:', dataToExport[0]?.livelli_utilita);
      console.log('Tutti i campi disponibili:', Object.keys(dataToExport[0] || {}));
      console.log('Campi che iniziano con utilita:', Object.keys(dataToExport[0] || {}).filter(k => k.includes('utilita')));
      
      const mappedData = dataToExport.map(q => ({
        'ID_QUEST': q.id || 'FORNITO DAL SISTEMA',
        'FONTE': q.creato_da || '',
        'PERCAUT': q.percorso_autonomia ? 1 : 0,
        'PERCAUT_SPEC': (((q as any).tipo_percorso) || (q as any).percorso_autonomia_spec || ''),
        'VIVE': q.vive_in_struttura ? 1 : 0,
        'CONDATT': q.collocazione_attuale || 0,
        'CONDATT_SPEC': (q as any).collocazione_attuale_spec || '',
        'FV.1': q.fattori_vulnerabilita?.fv1_stranieri ? 1 : 0,
        'FV.2': q.fattori_vulnerabilita?.fv2_vittime_tratta ? 1 : 0,
        'FV.3': q.fattori_vulnerabilita?.fv3_vittime_violenza ? 1 : 0,
        'FV.4': q.fattori_vulnerabilita?.fv4_allontanati_famiglia ? 1 : 0,
        'FV.5': q.fattori_vulnerabilita?.fv5_detenuti ? 1 : 0,
        'FV.6': q.fattori_vulnerabilita?.fv6_ex_detenuti ? 1 : 0,
        'FV.7': q.fattori_vulnerabilita?.fv7_esecuzione_penale ? 1 : 0,
        'FV.8': q.fattori_vulnerabilita?.fv8_indigenti ? 1 : 0,
        'FV.9': q.fattori_vulnerabilita?.fv9_rom_sinti ? 1 : 0,
        'FV.10': q.fattori_vulnerabilita?.fv10_disabilita_fisica ? 1 : 0,
        'FV.11': q.fattori_vulnerabilita?.fv11_disabilita_cognitiva ? 1 : 0,
        'FV.12': q.fattori_vulnerabilita?.fv12_disturbi_psichiatrici ? 1 : 0,
        'FV.13': q.fattori_vulnerabilita?.fv13_dipendenze ? 1 : 0,
        'FV.14': q.fattori_vulnerabilita?.fv14_genitori_precoci ? 1 : 0,
        'FV.15': q.fattori_vulnerabilita?.fv15_orientamento_sessuale ? 1 : 0,
        'FV.16': q.fattori_vulnerabilita?.fv16_altro ? 1 : 0,
        'FV.16_SPEC': q.fattori_vulnerabilita?.fv16_spec || '',
        'B1': q.sesso || 0,
        'B2': q.classe_eta || 0,
        'B3': (typeof (q as any).luogo_nascita === 'number' ? (q as any).luogo_nascita : (((q as any).luogo_nascita?.italia === true) ? 1 : ((q as any).luogo_nascita ? 2 : 0))) || 0,
        'B3SPEC': (q as any).luogo_nascita_spec || (q as any).luogo_nascita?.altro_paese || '',
        'B4': (q as any).cittadinanza || 0,
        'B5': (q as any).permesso_soggiorno || 0,
        'B6': (q as any).tempo_in_struttura || 0,
        'B7': (q as any).precedenti_strutture || 0,
        'B8.1': q.padre ? 1 : 0,
        'B8.2': q.madre ? 1 : 0,
        'B8.3': ((q.famiglia_origine?.fratelli === true) || (q as any)?.famiglia_origine?.fratelli_sorelle === true) ? 1 : 0,
        'B8.4': q.famiglia_origine?.nonni ? 1 : 0,
        'B8.5': q.famiglia_origine?.altri_parenti ? 1 : 0,
        'B8.6': ((q.famiglia_origine?.non_parenti === true) || (q as any)?.famiglia_origine?.altri_conviventi === true) ? 1 : 0,
        'B9': ((q as any).titolo_studio_madre || (q as any).madre?.titolo_studio || (q as any).madre?.studio || 0),
        'B10': ((q as any).situazione_lavorativa_madre || (q as any).madre?.situazione || (q as any).madre?.lavoro || 0),
        'B11': ((q as any).titolo_studio_padre || (q as any).padre?.titolo_studio || (q as any).padre?.studio || 0),
        'B12': ((q as any).situazione_lavorativa_padre || (q as any).padre?.situazione || (q as any).padre?.lavoro || 0),
        'C1': q.titolo_studio || 0,
        'C2.1': q.attivita_precedenti?.studiavo ? 1 : 0,
        'C2.2': q.attivita_precedenti?.lavoravo_stabile ? 1 : 0,
        'C2.3': q.attivita_precedenti?.lavoravo_saltuario ? 1 : 0,
        'C2.4': q.attivita_precedenti?.corso_formazione ? 1 : 0,
        'C2.5': q.attivita_precedenti?.altro ? 1 : 0,
        'C2.6': q.attivita_precedenti?.nessuna ? 1 : 0,
        'C2.5SPEC': q.attivita_precedenti?.altro_spec || '',
        'C3': q.orientamento_lavoro ? 1 : 0,
        'C4.1': q.orientamento_luoghi?.scuola ? 1 : 0,
        'C4.2': q.orientamento_luoghi?.enti_formazione ? 1 : 0,
        'C4.3': q.orientamento_luoghi?.servizi_impiego ? 1 : 0,
        'C4.4': q.orientamento_luoghi?.struttura ? 1 : 0,
        'C4.5': q.orientamento_luoghi?.altro ? 1 : 0,
        'C4.5SPEC': q.orientamento_luoghi?.altro_spec || '',
        'C4_BIS': q.utilita_servizio || 0,
        'C5.1': q.attivita_attuali?.studio ? 1 : 0,
        'C5.2': q.attivita_attuali?.formazione ? 1 : 0,
        'C5.3': q.attivita_attuali?.lavoro ? 1 : 0,
        'C5.4': q.attivita_attuali?.ricerca_lavoro ? 1 : 0,
        'C5.5': q.attivita_attuali?.nessuna ? 1 : 0,
        'C6': q.motivi_non_studio || 0,
        'C7': q.corso_formazione || '',
        'C8': q.lavoro_attuale || '',
        'C8.1': q.livelli_utilita?.[0] || 0,
        'C8.2': q.livelli_utilita?.[1] || 0,
        'C8.3': q.livelli_utilita?.[2] || 0,
        'C8.4': q.livelli_utilita?.[3] || 0,
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
        'C10': q.curriculum_vitae ? 1 : 0,
        'C11': q.centro_impiego ? 1 : 0,
        'C12': q.lavoro_autonomo ? 1 : 0,
        'C13.1': q.condizioni_lavoro?.stabilita || 0,
        'C13.2': q.condizioni_lavoro?.flessibilita || 0,
        'C13.3': q.condizioni_lavoro?.valorizzazione || 0,
        'C13.4': q.condizioni_lavoro?.retribuzione || 0,
        'C13.5': q.condizioni_lavoro?.fatica || 0,
        'C13.6': q.condizioni_lavoro?.sicurezza || 0,
        'C13.7': q.condizioni_lavoro?.utilita_sociale || 0,
        'C13.8': q.condizioni_lavoro?.vicinanza_casa || 0,
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
        'D2.1': q.figura_aiuto?.padre ? 1 : 0,
        'D2.2': q.figura_aiuto?.madre ? 1 : 0,
        'D2.3': q.figura_aiuto?.fratelli ? 1 : 0,
        'D2.4': q.figura_aiuto?.altri_parenti ? 1 : 0,
        'D2.5': q.figura_aiuto?.amici ? 1 : 0,
        'D2.6': q.figura_aiuto?.tutore ? 1 : 0,
        'D2.7': q.figura_aiuto?.insegnanti ? 1 : 0,
        'D2.8': q.figura_aiuto?.figure_sostegno ? 1 : 0,
        'D2.9': q.figura_aiuto?.volontari ? 1 : 0,
        'D2.10': q.figura_aiuto?.altre_persone ? 1 : 0,
        'D2.10SPEC': q.figura_aiuto?.altre_persone_spec || '',
        'E1.1': q.preoccupazioni_futuro?.pregiudizi || 0,
        'E1.2': q.preoccupazioni_futuro?.mancanza_lavoro || 0,
        'E1.3': q.preoccupazioni_futuro?.mancanza_aiuto || 0,
        'E1.4': q.preoccupazioni_futuro?.mancanza_casa || 0,
        'E1.5': q.preoccupazioni_futuro?.solitudine || 0,
        'E1.6': q.preoccupazioni_futuro?.salute || 0,
        'E1.7': q.preoccupazioni_futuro?.perdita_persone || 0,
        'E1.8': q.preoccupazioni_futuro?.altro || 0,
        'E1.8SPEC': q.preoccupazioni_futuro?.altro_spec || '',
        'E2.1': q.obiettivi_realizzabili?.lavoro_piacevole || 0,
        'E2.2': q.obiettivi_realizzabili?.autonomia || 0,
        'E2.3': q.obiettivi_realizzabili?.famiglia || 0,
        'E2.4': q.obiettivi_realizzabili?.trovare_lavoro || 0,
        'E2.5': q.obiettivi_realizzabili?.salute || 0,
        'E2.6': q.obiettivi_realizzabili?.casa || 0,
        'E3': q.aiuto_futuro || '',
        'E4': q.pronto_uscita ? 1 : 0,
        'E4.1': q.pronto_uscita_perche_no || '',
        'E4.2': q.pronto_uscita_perche_si || '',
        'E5.1': q.emozioni_uscita?.felicita ? 1 : 0,
        'E5.2': q.emozioni_uscita?.tristezza ? 1 : 0,
        'E5.3': q.emozioni_uscita?.curiosita ? 1 : 0,
        'E5.4': q.emozioni_uscita?.preoccupazione ? 1 : 0,
        'E5.5': q.emozioni_uscita?.paura ? 1 : 0,
        'E5.6': q.emozioni_uscita?.liberazione ? 1 : 0,
        'E5.7': q.emozioni_uscita?.solitudine ? 1 : 0,
        'E5.8': q.emozioni_uscita?.rabbia ? 1 : 0,
        'E5.9': q.emozioni_uscita?.speranza ? 1 : 0,
        'E5.10': q.emozioni_uscita?.determinazione ? 1 : 0,
        'E6': q.desiderio || '',
        'E7': q.nota_aggiuntiva || '',
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