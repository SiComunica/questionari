import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

// Definizione del tipo per il questionario
interface QuestionarioGiovani {
  id: string;
  percorso_autonomia: boolean;
  percorso_autonomia_spec: string;
  vive_in_struttura: boolean;
  collocazione_attuale: number;
  collocazione_attuale_spec: string;
  fattori_vulnerabilita?: {
    stranieri?: boolean;
    vittime_tratta?: boolean;
    vittime_violenza?: boolean;
    allontanati_famiglia?: boolean;
    detenuti?: boolean;
    ex_detenuti?: boolean;
    misura_alternativa?: boolean;
    senza_dimora?: boolean;
    rom_sinti?: boolean;
    disabilita_fisica?: boolean;
    disabilita_cognitiva?: boolean;
    disturbi_psichiatrici?: boolean;
    dipendenze?: boolean;
    genitori_precoci?: boolean;
    orientamento_sessuale?: boolean;
    altro?: boolean;
    altro_spec?: string;
  };
  sesso: number;
  classe_eta: number;
  luogo_nascita: number;
  luogo_nascita_spec?: string;
  cittadinanza: number;
  permesso_soggiorno: number;
  tempo_in_struttura: number;
  ospite_precedente: number;
  familiari?: {
    padre?: boolean;
    madre?: boolean;
    fratelli?: boolean;
    nonni?: boolean;
    altri_parenti?: boolean;
    non_parenti?: boolean;
  };
  titolo_studio_madre: number;
  situazione_lavorativa_madre: number;
  titolo_studio_padre: number;
  situazione_lavorativa_padre: number;
  titolo_studio: number;
  prima_entrata?: {
    studiavo?: boolean;
    lavoravo_stabile?: boolean;
    lavoravo_saltuario?: boolean;
    corso_formazione?: boolean;
    altro?: boolean;
    nessuna?: boolean;
    altro_spec?: string;
  };
  orientamento_lavoro: boolean;
  dove_orientamento?: {
    scuola?: boolean;
    enti_formazione?: boolean;
    servizi_impiego?: boolean;
    struttura?: boolean;
    altro?: boolean;
    altro_spec?: string;
  };
  utilita_servizio: number;
  attualmente?: {
    studio?: boolean;
    formazione?: boolean;
    lavoro?: boolean;
    ricerca_lavoro?: boolean;
    nessuna?: boolean;
  };
  motivo_non_studio: number;
  corso_frequentato?: string;
  lavoro_attuale?: string;
  utilita?: {
    studiare: number;
    formazione: number;
    lavorare: number;
    cercare_lavoro: number;
  };
  ricerca_lavoro?: {
    centro_impiego?: boolean;
    sportelli?: boolean;
    inps?: boolean;
    servizi_sociali?: boolean;
    agenzie?: boolean;
    cooperative?: boolean;
    struttura?: boolean;
    conoscenti?: boolean;
    portali?: boolean;
    social?: boolean;
    altro?: boolean;
    altro_spec?: string;
  };
  curriculum: boolean;
  centro_impiego: boolean;
  lavoro_autonomo: boolean;
  importanza?: {
    stabilita: number;
    flessibilita: number;
    valorizzazione: number;
    retribuzione: number;
    fatica: number;
    sicurezza: number;
    utilita_sociale: number;
    vicinanza: number;
  };
  abitazione_precedente?: {
    solo?: boolean;
    struttura?: boolean;
    madre?: boolean;
    padre?: boolean;
    partner?: boolean;
    figli?: boolean;
    fratelli?: boolean;
    nonni?: boolean;
    altri_parenti?: boolean;
    amici?: boolean;
  };
  supporto?: {
    padre?: boolean;
    madre?: boolean;
    fratelli?: boolean;
    altri_parenti?: boolean;
    amici?: boolean;
    tutore?: boolean;
    insegnanti?: boolean;
    figure_sostegno?: boolean;
    volontari?: boolean;
    altre_persone?: boolean;
    altre_persone_spec?: string;
  };
  preoccupazioni?: {
    pregiudizi: number;
    mancanza_lavoro: number;
    mancanza_aiuto: number;
    mancanza_casa: number;
    solitudine: number;
    salute: number;
    perdita_persone: number;
    altro: number;
    altro_spec?: string;
  };
  realizzabile?: {
    lavoro_piacevole: number;
    autonomia: number;
    famiglia: number;
    trovare_lavoro: number;
    salute: number;
    casa: number;
  };
  aiuto_futuro?: string;
  pronto: boolean;
  non_pronto_perche?: string;
  pronto_perche?: string;
  emozioni?: {
    felicita?: boolean;
    tristezza?: boolean;
    curiosita?: boolean;
    preoccupazione?: boolean;
    paura?: boolean;
    liberazione?: boolean;
    solitudine?: boolean;
    rabbia?: boolean;
    speranza?: boolean;
    determinazione?: boolean;
  };
  desiderio?: string;
  aggiungere?: string;
  creato_da?: string;
  creato_a?: string;
  fonte: string;
  percorso_tipo: string;
  percorso_fase: string;
  collocazione: string;
  permesso: string;
  tempo_in_precedenza: string;
  famiglia_madre: string;
  padre: string;
  attivita_precedente: string;
  orientamento: string;
  ricerca_lavoro_attiva: boolean;
  condizioni: string;
  livelli: string;
  abbandono: string;
  figura_supporto: string;
  precedente: string;
  remoto: string;
  profilo: string;
  stato: string;
  fase: string;
  note: string;
}

const handleExportXLSX = async (questionari: QuestionarioGiovani[]) => {
  try {
    if (!questionari || questionari.length === 0) {
      toast.error("Nessun dato disponibile per l'esportazione");
      return;
    }

    const data = questionari.map(q => ({
      'id': q.id || '',
      'creato_a': q.creato_a ? format(new Date(q.creato_a), 'yyyy-MM-dd') : '',
      'fonte': q.fonte || '',
      'percorso_tipo': q.percorso_tipo || '',
      'percorso_fase': q.percorso_fase || '',
      'collocazione': q.collocazione || '',
      'permesso': q.permesso || '',
      'tempo_in_precedenza': q.tempo_in_precedenza || '',
      'famiglia_madre': q.famiglia_madre || '',
      'padre': q.padre || '',
      'titolo_studio': q.titolo_studio || 0,
      'attivita_precedente': q.attivita_precedente || '',
      'orientamento': q.orientamento || '',
      'ricerca_lavoro_attiva': q.ricerca_lavoro_attiva ? 1 : 0,
      'condizioni': q.condizioni || '',
      'livelli': q.livelli || '',
      'abbandono': q.abbandono || '',
      'figura_supporto': q.figura_supporto || '',
      'precedente': q.precedente || '',
      'remoto': q.remoto || '',
      'profilo': q.profilo || '',
      'stato': q.stato || '',
      'fase': q.fase || '',
      'note': q.note || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questionari");

    const fileName = `questionari_giovani_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast.success("File Excel esportato con successo");
  } catch (error) {
    console.error("Errore durante l'esportazione:", error);
    toast.error("Errore durante l'esportazione del file Excel");
  }
} 