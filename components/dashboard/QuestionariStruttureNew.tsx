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
  collaborazioni: Array<{
    soggetto: string;
    tipo: string;
    oggetto: string;
  }>;
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
  caratteristiche_ospiti_adolescenti?: string[];
  caratteristiche_ospiti_giovani?: string[];
  caratteristiche_ospiti_altro?: string;
  caratteristiche_non_ospiti_adolescenti?: string[];
  caratteristiche_non_ospiti_giovani?: string[];
  caratteristiche_non_ospiti_altro?: string;
  attivita_servizi: {
    alloggio?: { attivo: boolean; descrizione?: string };
    vitto?: { attivo: boolean; descrizione?: string };
    servizi_bassa_soglia?: { attivo: boolean; descrizione?: string };
    ospitalita_diurna?: { attivo: boolean; descrizione?: string };
    supporto_psicologico?: { attivo: boolean; descrizione?: string };
    sostegno_autonomia?: { attivo: boolean; descrizione?: string };
    orientamento_lavoro?: { attivo: boolean; descrizione?: string };
    orientamento_formazione?: { attivo: boolean; descrizione?: string };
    istruzione?: { attivo: boolean; descrizione?: string };
    formazione_professionale?: { attivo: boolean; descrizione?: string };
    attivita_socializzazione?: { attivo: boolean; descrizione?: string };
    altro?: { attivo: boolean; descrizione?: string };
  };
  attivita_inserimento?: Array<{
    nome: string;
    periodo: string;
    contenuto: string;
    destinatari: string;
    attori: string;
    punti_forza: string;
    criticita: string;
  }>;
  esperienze_inserimento_lavorativo?: boolean;
  punti_forza_network?: string;
  critica_network?: string;
  finanziamenti?: {
    fondi_pubblici?: number;
    fondi_privati?: number;
    fondi_pubblici_specifica?: string;
    fondi_privati_specifica?: string;
    fornitori?: { nome: string; tipo_sostegno: string }[];
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
      console.log('Tentativo di eliminazione del questionario:', id)
      
      // Usiamo una query SQL diretta
      const { data: deleteData, error: deleteError } = await supabase
        .rpc('delete_struttura', { struttura_id: id })

      if (deleteError) {
        console.error('Errore durante l\'eliminazione:', deleteError)
        throw deleteError
      }

      console.log('Risultato eliminazione:', deleteData)

      // Verifichiamo se il record è stato effettivamente eliminato
      const { data: verifyData, error: verifyError } = await supabase
        .from('strutture')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (verifyError) {
        console.error('Errore durante la verifica:', verifyError)
        throw verifyError
      }
      
      if (!verifyData) {
        console.log('Record eliminato con successo')
      setQuestionari(prev => prev.filter(q => q.id !== id))
      toast.success('Questionario eliminato con successo')
      } else {
        console.error('Il record esiste ancora dopo l\'eliminazione:', verifyData)
        toast.error('Errore: il record non è stato eliminato')
      }
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

    // Debug: controlliamo la struttura dei dati
    console.log('Dati strutture per export:', questionari[0]);
    console.log('Struttura figure_professionali:', questionari[0]?.figure_professionali);
    console.log('Struttura persone_ospitate:', questionari[0]?.persone_ospitate);
    console.log('Tutti i campi disponibili:', Object.keys(questionari[0] || {}));
    console.log('Campi che contengono figure:', Object.keys(questionari[0] || {}).filter(k => k.includes('figure')));

    // Funzione helper per verificare se un array contiene un valore standard O un valore form che mappa a quel valore
    const hasCaratteristica = (arr: string[] | undefined, valoreStandard: string, valoriForm: string[]) => {
      if (!arr || !Array.isArray(arr)) return false;
      // Verifica se contiene il valore standard
      if (arr.includes(valoreStandard)) return true;
      // Verifica se contiene uno dei valori form che mappano a quel valore standard
      return valoriForm.some(val => arr.includes(val));
    };

    // Mapping valori form -> valori standard per caratteristiche adolescenti
    const mappingAdolescenti: Record<string, string[]> = {
      'Stranieri con problemi legati alla condizione migratoria': ['MSNA', 'Minori stranieri accompagnati'],
      'Vittime di tratta': ['Minori vittime di tratta'],
      'Detenuti': ['Minori con problemi di giustizia']
    };

    // Mapping valori form -> valori standard per caratteristiche giovani
    const mappingGiovani: Record<string, string[]> = {
      'Stranieri con problemi legati alla condizione migratoria': ['Giovani stranieri'],
      'Vittime di tratta': ['Giovani vittime di tratta'],
      'Detenuti': ['Giovani con problemi di giustizia']
    };

    // Helper per servizi: gestisce booleani, oggetti {attivo, descrizione}, stringhe e alias
    const isServizioAttivo = (q: any, ...keys: string[]) => {
      for (const k of keys) {
        const v = q?.attivita_servizi?.[k]
        if (typeof v === 'boolean' && v) return true
        if (typeof v === 'object' && v && v.attivo === true) return true
        if (typeof v === 'string' && v.trim() !== '') return true
      }
      return false
    }
    const getServizioDesc = (q: any, ...keys: string[]) => {
      for (const k of keys) {
        const v = q?.attivita_servizi?.[k]
        if (typeof v === 'object' && v) {
          if (typeof v.descrizione === 'string' && v.descrizione.trim() !== '') return v.descrizione
          if (typeof (v as any).desc === 'string' && (v as any).desc.trim() !== '') return (v as any).desc
          if (typeof (v as any).note === 'string' && (v as any).note.trim() !== '') return (v as any).note
        }
        if (typeof v === 'string' && v.trim() !== '') return v
      }
      return ''
    }

    const dataToExport = questionari.map(q => {
      // Calcoliamo i totali per le persone non ospitate
      const c3tu = (q.persone_non_ospitate?.fino_16?.uomini || 0) + 
                   (q.persone_non_ospitate?.da_16_a_18?.uomini || 0) + 
                   (q.persone_non_ospitate?.maggiorenni?.uomini || 0);
      
      const c3td = (q.persone_non_ospitate?.fino_16?.donne || 0) + 
                   (q.persone_non_ospitate?.da_16_a_18?.donne || 0) + 
                   (q.persone_non_ospitate?.maggiorenni?.donne || 0);

      return {
        COD_OPE: q.creato_da || 'FORNITO DA INAPP',
        ID_QUEST: q.id || 'FORNITO DAL SISTEMA',
        TIPO_STRUTTURA: q.tipo_struttura || '',
        'FORMAGIU': Number(q.forma_giuridica) || 0,
        'FORMAGIU_SPEC': q.forma_giuridica_altro || '',
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

        // Persone ospitate e totali
        'C1A.U': q.persone_ospitate?.fino_16?.uomini || 0,
        'C1B.U': q.persone_ospitate?.da_16_a_18?.uomini || 0,
        'C1C.U': q.persone_ospitate?.maggiorenni?.uomini || 0,
        'C1.T.U': (q.persone_ospitate?.fino_16?.uomini || 0) + 
                  (q.persone_ospitate?.da_16_a_18?.uomini || 0) + 
                  (q.persone_ospitate?.maggiorenni?.uomini || 0),
        'C1A.D': q.persone_ospitate?.fino_16?.donne || 0,
        'C1B.D': q.persone_ospitate?.da_16_a_18?.donne || 0,
        'C1C.D': q.persone_ospitate?.maggiorenni?.donne || 0,
        'C1T.D': (q.persone_ospitate?.fino_16?.donne || 0) + 
                 (q.persone_ospitate?.da_16_a_18?.donne || 0) + 
                 (q.persone_ospitate?.maggiorenni?.donne || 0),
        'C1A.T': (q.persone_ospitate?.fino_16?.uomini || 0) + (q.persone_ospitate?.fino_16?.donne || 0),
        'C1B.T': (q.persone_ospitate?.da_16_a_18?.uomini || 0) + (q.persone_ospitate?.da_16_a_18?.donne || 0),
        'C1C.T': (q.persone_ospitate?.maggiorenni?.uomini || 0) + (q.persone_ospitate?.maggiorenni?.donne || 0),
        'C1T.T': (q.persone_ospitate?.fino_16?.uomini || 0) + 
                 (q.persone_ospitate?.da_16_a_18?.uomini || 0) + 
                 (q.persone_ospitate?.maggiorenni?.uomini || 0) +
                 (q.persone_ospitate?.fino_16?.donne || 0) + 
                 (q.persone_ospitate?.da_16_a_18?.donne || 0) + 
                 (q.persone_ospitate?.maggiorenni?.donne || 0),

        // C2.1A-C2.16A - Caratteristiche persone trattate adolescenti
        'C2.1A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Stranieri con problemi legati alla condizione migratoria', mappingAdolescenti['Stranieri con problemi legati alla condizione migratoria'] || []) ? 1 : 0,
        'C2.2A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Vittime di tratta', mappingAdolescenti['Vittime di tratta'] || []) ? 1 : 0,
        'C2.3A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Vittime di violenza domestica', []) ? 1 : 0,
        'C2.4A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Persone allontanate dalla famiglia', []) ? 1 : 0,
        'C2.5A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Detenuti', mappingAdolescenti['Detenuti'] || []) ? 1 : 0,
        'C2.6A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Ex detenuti', []) ? 1 : 0,
        'C2.7A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Persone in esecuzione penale esterna', []) ? 1 : 0,
        'C2.8A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Indigenti e/o senza dimora', []) ? 1 : 0,
        'C2.9A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Rom e Sinti', []) ? 1 : 0,
        'C2.10A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Persone con disabilità fisica', []) ? 1 : 0,
        'C2.11A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Persone con disabilità cognitiva', []) ? 1 : 0,
        'C2.12A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Persone con disturbi psichiatrici', []) ? 1 : 0,
        'C2.13A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Persone con dipendenze', []) ? 1 : 0,
        'C2.14A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Genitori precoci', []) ? 1 : 0,
        'C2.15A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Persone con problemi legati all\'orientamento sessuale', []) ? 1 : 0,
        'C2.16A': hasCaratteristica(q.caratteristiche_ospiti_adolescenti, 'Altro', []) ? 1 : 0,
        'C2.16A_SPEC': q.caratteristiche_ospiti_altro || '',

        // C2.1B-C2.16B - Caratteristiche persone trattate giovani adulti
        'C2.1B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Stranieri con problemi legati alla condizione migratoria', mappingGiovani['Stranieri con problemi legati alla condizione migratoria'] || []) ? 1 : 0,
        'C2.2B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Vittime di tratta', mappingGiovani['Vittime di tratta'] || []) ? 1 : 0,
        'C2.3B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Vittime di violenza domestica', []) ? 1 : 0,
        'C2.4B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Persone allontanate dalla famiglia', []) ? 1 : 0,
        'C2.5B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Detenuti', mappingGiovani['Detenuti'] || []) ? 1 : 0,
        'C2.6B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Ex detenuti', []) ? 1 : 0,
        'C2.7B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Persone in esecuzione penale esterna', []) ? 1 : 0,
        'C2.8B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Indigenti e/o senza dimora', []) ? 1 : 0,
        'C2.9B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Rom e Sinti', []) ? 1 : 0,
        'C2.10B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Persone con disabilità fisica', []) ? 1 : 0,
        'C2.11B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Persone con disabilità cognitiva', []) ? 1 : 0,
        'C2.12B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Persone con disturbi psichiatrici', []) ? 1 : 0,
        'C2.13B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Persone con dipendenze', []) ? 1 : 0,
        'C2.14B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Genitori precoci', []) ? 1 : 0,
        'C2.15B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Persone con problemi legati all\'orientamento sessuale', []) ? 1 : 0,
        'C2.16B': hasCaratteristica(q.caratteristiche_ospiti_giovani, 'Altro', []) ? 1 : 0,
        'C2.16B_SPEC': q.caratteristiche_ospiti_altro || '',

        // Persone non ospitate e totali
        'C3A.U': q.persone_non_ospitate?.fino_16?.uomini || 0,
        'C3B.U': q.persone_non_ospitate?.da_16_a_18?.uomini || 0,
        'C3C.U': q.persone_non_ospitate?.maggiorenni?.uomini || 0,
        'C3.T.U': c3tu,
        'C3A.D': q.persone_non_ospitate?.fino_16?.donne || 0,
        'C3B.D': q.persone_non_ospitate?.da_16_a_18?.donne || 0,
        'C3C.D': q.persone_non_ospitate?.maggiorenni?.donne || 0,
        'C3T.D': c3td,
        'C3A.T': (q.persone_non_ospitate?.fino_16?.uomini || 0) + (q.persone_non_ospitate?.fino_16?.donne || 0),
        'C3B.T': (q.persone_non_ospitate?.da_16_a_18?.uomini || 0) + (q.persone_non_ospitate?.da_16_a_18?.donne || 0),
        'C3C.T': (q.persone_non_ospitate?.maggiorenni?.uomini || 0) + (q.persone_non_ospitate?.maggiorenni?.donne || 0),
        'C3T.T': c3tu + c3td,

        // Caratteristiche persone non ospitate - adolescenti
        'C4.1A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Stranieri con problemi legati alla condizione migratoria', mappingAdolescenti['Stranieri con problemi legati alla condizione migratoria'] || []) ? 1 : 0,
        'C4.2A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Vittime di tratta', mappingAdolescenti['Vittime di tratta'] || []) ? 1 : 0,
        'C4.3A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Vittime di violenza domestica', []) ? 1 : 0,
        'C4.4A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Persone allontanate dalla famiglia', []) ? 1 : 0,
        'C4.5A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Detenuti', mappingAdolescenti['Detenuti'] || []) ? 1 : 0,
        'C4.6A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Ex detenuti', []) ? 1 : 0,
        'C4.7A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Persone in esecuzione penale esterna', []) ? 1 : 0,
        'C4.8A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Indigenti e/o senza dimora', []) ? 1 : 0,
        'C4.9A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Rom e Sinti', []) ? 1 : 0,
        'C4.10A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Persone con disabilità fisica', []) ? 1 : 0,
        'C4.11A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Persone con disabilità cognitiva', []) ? 1 : 0,
        'C4.12A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Persone con disturbi psichiatrici', []) ? 1 : 0,
        'C4.13A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Persone con dipendenze', []) ? 1 : 0,
        'C4.14A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Genitori precoci', []) ? 1 : 0,
        'C4.15A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Persone con problemi legati all\'orientamento sessuale', []) ? 1 : 0,
        'C4.16A': hasCaratteristica(q.caratteristiche_non_ospiti_adolescenti, 'Altro', []) ? 1 : 0,

        // Caratteristiche persone non ospitate - giovani adulti
        'C4.1B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Stranieri con problemi legati alla condizione migratoria', mappingGiovani['Stranieri con problemi legati alla condizione migratoria'] || []) ? 1 : 0,
        'C4.2B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Vittime di tratta', mappingGiovani['Vittime di tratta'] || []) ? 1 : 0,
        'C4.3B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Vittime di violenza domestica', []) ? 1 : 0,
        'C4.4B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Persone allontanate dalla famiglia', []) ? 1 : 0,
        'C4.5B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Detenuti', mappingGiovani['Detenuti'] || []) ? 1 : 0,
        'C4.6B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Ex detenuti', []) ? 1 : 0,
        'C4.7B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Persone in esecuzione penale esterna', []) ? 1 : 0,
        'C4.8B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Indigenti e/o senza dimora', []) ? 1 : 0,
        'C4.9B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Rom e Sinti', []) ? 1 : 0,
        'C4.10B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Persone con disabilità fisica', []) ? 1 : 0,
        'C4.11B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Persone con disabilità cognitiva', []) ? 1 : 0,
        'C4.12B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Persone con disturbi psichiatrici', []) ? 1 : 0,
        'C4.13B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Persone con dipendenze', []) ? 1 : 0,
        'C4.14B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Genitori precoci', []) ? 1 : 0,
        'C4.15B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Persone con problemi legati all\'orientamento sessuale', []) ? 1 : 0,
        'C4.16B': hasCaratteristica(q.caratteristiche_non_ospiti_giovani, 'Altro', []) ? 1 : 0,
        'C4.16ALTRO': q.caratteristiche_non_ospiti_altro || '',

        // Attività e servizi
        'D1.1': isServizioAttivo(q, 'alloggio') ? 1 : 0,
        'D1.2': isServizioAttivo(q, 'vitto') ? 1 : 0,
        'D1.3': isServizioAttivo(q, 'servizi_bassa_soglia') ? 1 : 0,
        'D1.3DESC': getServizioDesc(q, 'servizi_bassa_soglia'),
        'D1.4': isServizioAttivo(q, 'ospitalita_diurna') ? 1 : 0,
        'D1.4DESC': getServizioDesc(q, 'ospitalita_diurna'),
        'D1.5': isServizioAttivo(q, 'supporto_psicologico') ? 1 : 0,
        'D1.5DESC': getServizioDesc(q, 'supporto_psicologico'),
        'D1.6': isServizioAttivo(q, 'sostegno_autonomia', 'sostegno_abitativo') ? 1 : 0,
        'D1.6DESC': getServizioDesc(q, 'sostegno_autonomia', 'sostegno_abitativo'),
        'D1.7': isServizioAttivo(q, 'orientamento_lavoro', 'inserimento_lavorativo') ? 1 : 0,
        'D1.7DESC': getServizioDesc(q, 'orientamento_lavoro', 'inserimento_lavorativo'),
        'D1.8': isServizioAttivo(q, 'orientamento_formazione', 'orientamento_scolastico') ? 1 : 0,
        'D1.8DESC': getServizioDesc(q, 'orientamento_formazione', 'orientamento_scolastico'),
        'D1.9': isServizioAttivo(q, 'istruzione', 'istruzione_scolastica') ? 1 : 0,
        'D1.9DESC': getServizioDesc(q, 'istruzione', 'istruzione_scolastica'),
        'D1.10': isServizioAttivo(q, 'formazione_professionale') ? 1 : 0,
        'D1.10DESC': getServizioDesc(q, 'formazione_professionale'),
        'D1.11': isServizioAttivo(q, 'attivita_socializzazione', 'attivita_ricreative') ? 1 : 0,
        'D1.11DESC': getServizioDesc(q, 'attivita_socializzazione', 'attivita_ricreative'),
        'D1.12': isServizioAttivo(q, 'altro') ? 1 : 0,
        'D1.12DESC': getServizioDesc(q, 'altro'),

        // Attività di inserimento
        'D2': q.esperienze_inserimento_lavorativo ? 1 : 0,

        // Progetti (fino a 3)
        'D3.1NOM': q.attivita_inserimento?.[0]?.nome || '',
        'D3.1PER': q.attivita_inserimento?.[0]?.periodo || '',
        'D3.1CONT': q.attivita_inserimento?.[0]?.contenuto || '',
        'D3.1DEST': q.attivita_inserimento?.[0]?.destinatari || '',
        'D3.1ATT': q.attivita_inserimento?.[0]?.attori || '',
        'D3.1PFOR': q.attivita_inserimento?.[0]?.punti_forza || '',
        'D3.1CRIT': q.attivita_inserimento?.[0]?.criticita || '',

        'D3.2NOM': q.attivita_inserimento?.[1]?.nome || '',
        'D3.2PER': q.attivita_inserimento?.[1]?.periodo || '',
        'D3.2CONT': q.attivita_inserimento?.[1]?.contenuto || '',
        'D3.2DEST': q.attivita_inserimento?.[1]?.destinatari || '',
        'D3.2ATT': q.attivita_inserimento?.[1]?.attori || '',
        'D3.2PFOR': q.attivita_inserimento?.[1]?.punti_forza || '',
        'D3.2CRIT': q.attivita_inserimento?.[1]?.criticita || '',

        'D3.3NOM': q.attivita_inserimento?.[2]?.nome || '',
        'D3.3PER': q.attivita_inserimento?.[2]?.periodo || '',
        'D3.3CONT': q.attivita_inserimento?.[2]?.contenuto || '',
        'D3.3DEST': q.attivita_inserimento?.[2]?.destinatari || '',
        'D3.3ATT': q.attivita_inserimento?.[2]?.attori || '',
        'D3.3PFOR': q.attivita_inserimento?.[2]?.punti_forza || '',
        'D3.3CRIT': q.attivita_inserimento?.[2]?.criticita || '',

        // D4 - Prevedete di realizzare nei prossimi due anni esperienze significative? (0=No, 1=Sì)
        // Gestisce sia boolean che array nuove_attivita (se array non vuoto = 1)
        'D4': (q as any).nuove_esperienze_previste !== undefined 
          ? ((q as any).nuove_esperienze_previste ? 1 : 0)
          : (q as any).nuove_attivita && Array.isArray((q as any).nuove_attivita) && (q as any).nuove_attivita.some((a: string) => a && a.trim() !== '')
            ? 1 
            : 0,

        // Collaborazioni
        'E1.1SOGG': q.collaborazioni?.[0]?.soggetto || '',
        'E1.1TIPO': Number(q.collaborazioni?.[0]?.tipo) || 0,
        'E1.1OGGETTO': q.collaborazioni?.[0]?.oggetto || '',
        'E1.2SOGG': q.collaborazioni?.[1]?.soggetto || '',
        'E1.2TIPO': Number(q.collaborazioni?.[1]?.tipo) || 0,
        'E1.2OGGETTO': q.collaborazioni?.[1]?.oggetto || '',
        'E1.3SOGG': q.collaborazioni?.[2]?.soggetto || '',
        'E1.3TIPO': Number(q.collaborazioni?.[2]?.tipo) || 0,
        'E1.3OGGETTO': q.collaborazioni?.[2]?.oggetto || '',

        // Network
        'E2': q.punti_forza_network || '',
        'E3': q.critica_network || '',

        // Finanziamenti
        'F1.1': q.finanziamenti?.fondi_pubblici || 0,
        'F1.2': q.finanziamenti?.fondi_privati || 0,
        'F1.1SPEC': q.finanziamenti?.fondi_pubblici_specifica || '',
        'F1.2SPEC': q.finanziamenti?.fondi_privati_specifica || '',
        'F2.1forn': q.finanziamenti?.fornitori?.[0]?.nome || '',
        'F2.1sost': q.finanziamenti?.fornitori?.[0]?.tipo_sostegno || '',
        'F2.2forn': q.finanziamenti?.fornitori?.[1]?.nome || '',
        'F2.2sost': q.finanziamenti?.fornitori?.[1]?.tipo_sostegno || ''
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questionari Strutture');

    XLSX.writeFile(wb, `questionari_strutture_${new Date().toISOString()}.xlsx`);
    toast.success('Export completato con successo');
  };

    return (
      <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Questionari Strutture</h1>
      
      {loading ? (
        <div>Caricamento...</div>
      ) : (
        <>
          <div className="flex justify-end space-x-2 mb-4">
            <Button onClick={() => handleExportXLSX()}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            Esporta XLSX
          </Button>
            <Button onClick={() => handleExportPDF()}>
              <FileText className="mr-2 h-4 w-4" />
              Esporta PDF
          </Button>
        </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {questionari.map((questionario) => (
              <Card key={questionario.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Questionario {questionario.id_struttura}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleExportPDF(questionario)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    <Button 
                      variant="outline"
                        size="icon"
                      onClick={() => {
                        setSelectedQuestionario(questionario)
                        setIsDialogOpen(true)
                      }}
                    >
                        <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                        size="icon"
                      onClick={() => handleDelete(questionario.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Data: {new Date(questionario.creato_a).toLocaleDateString()}</p>
                  <p>Operatore: {questionario.creato_da}</p>
                </CardContent>
              </Card>
            ))}
          </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
                <DialogTitle>Dettagli Questionario</DialogTitle>
          </DialogHeader>
              {selectedQuestionario && (
                <div className="space-y-4">
                  <pre>{JSON.stringify(selectedQuestionario, null, 2)}</pre>
                </div>
              )}
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  );
} 