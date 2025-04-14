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
}

const handleExportXLSX = async (questionari: QuestionarioGiovani[]) => {
  try {
    if (!questionari || questionari.length === 0) {
      toast.error("Nessun dato disponibile per l'esportazione");
      return;
    }

    // Definiamo prima l'header con le colonne nel giusto ordine
    const headers = [
      ['VARIABILE', 'FORMATO', 'ETICHETTA', 'VALORI', 'ETICHETTE DEI VALORI'],
      ['PERCAUT', 'LOGIC', 'Percorso di autonomia', '0/1', 'NO/SI'],
      ['PERCAUT_SPEC', 'STRING', 'Specificare il tipo di percorso o di presa in carico', '', ''],
      ['VIVE', 'LOGIC', 'vive in struttura', '0/1', 'NO/SI'],
      ['CONDATT', 'NUMERIC', 'collocazione attuale del giovane', '1,2,3,4,5', 'Ospite di centri antiviolenza,Ospite di strutture per stranieri,Ospite di strutture sanitarie,Ospite di altro tipo di struttura,Ospite di comunità'],
      ['CONDATT_SPEC', 'STRING', 'specificare il tipo di comunità', '', ''],
      ['FV.1', 'LOGIC', 'fattori di vulnerabilità: Stranieri con problemi legati alla condizione migratoria', '0/1', 'NO/SI'],
      ['FV.2', 'LOGIC', 'fattori di vulnerabilità: Vittime di trattamento', '0/1', 'NO/SI'],
      ['FV.3', 'LOGIC', 'fattori di vulnerabilità: Vittime di violenza', '0/1', 'NO/SI'],
      ['FV.4', 'LOGIC', 'fattori di vulnerabilità: Allontanati dalla famiglia', '0/1', 'NO/SI'],
      ['FV.5', 'LOGIC', 'fattori di vulnerabilità: Detenuti', '0/1', 'NO/SI'],
      ['FV.6', 'LOGIC', 'fattori di vulnerabilità: Ex detenuti', '0/1', 'NO/SI'],
      ['FV.7', 'LOGIC', 'fattori di vulnerabilità: Misura alternativa', '0/1', 'NO/SI'],
      ['FV.8', 'LOGIC', 'fattori di vulnerabilità: Senza dimora', '0/1', 'NO/SI'],
      ['FV.9', 'LOGIC', 'fattori di vulnerabilità: Rom Sinti', '0/1', 'NO/SI'],
      ['FV.10', 'LOGIC', 'fattori di vulnerabilità: Disabilita fisica', '0/1', 'NO/SI'],
      ['FV.11', 'LOGIC', 'fattori di vulnerabilità: Disabilita cognitiva', '0/1', 'NO/SI'],
      ['FV.12', 'LOGIC', 'fattori di vulnerabilità: Disturbi psichiatrici', '0/1', 'NO/SI'],
      ['FV.13', 'LOGIC', 'fattori di vulnerabilità: Dipendenze', '0/1', 'NO/SI'],
      ['FV.14', 'LOGIC', 'fattori di vulnerabilità: Genitori precoci', '0/1', 'NO/SI'],
      ['FV.15', 'LOGIC', 'fattori di vulnerabilità: Orientamento sessuale', '0/1', 'NO/SI'],
      ['FV.16', 'LOGIC', 'fattori di vulnerabilità: Altro', '0/1', 'NO/SI'],
      ['FV.16_SPEC', 'STRING', 'Specificare il tipo di altro', '', ''],
      ['B1', 'NUMERIC', 'Sesso', '1,2', 'Maschio/Femmina'],
      ['B2', 'NUMERIC', 'Classe di età', '1,2,3,4,5', 'Primaria,Secondaria,Terzaria,Quarta,Quinta'],
      ['B3', 'NUMERIC', 'Luogo di nascita', '1,2,3,4,5', 'Italia,Stranieri,Altro'],
      ['B3SPEC', 'STRING', 'Specificare il luogo di nascita', '', ''],
      ['B4', 'NUMERIC', 'Cittadinanza', '1,2', 'Italiana/Straniera'],
      ['B5', 'NUMERIC', 'Permesso di soggiorno', '1,2,3', 'Permesso di soggiorno,Permesso di lavoro,Altro'],
      ['B6', 'NUMERIC', 'Tempo in struttura', '1,2,3,4,5', '1-5 anni,5-10 anni,10-15 anni,15-20 anni,20 anni o più'],
      ['B7', 'NUMERIC', 'Ospite precedente', '1,2,3,4,5', 'Ospite di centri antiviolenza,Ospite di strutture per stranieri,Ospite di strutture sanitarie,Ospite di altro tipo di struttura,Ospite di comunità'],
      ['B8.1', 'LOGIC', 'Familiari: Padre', '0/1', 'NO/SI'],
      ['B8.2', 'LOGIC', 'Familiari: Madre', '0/1', 'NO/SI'],
      ['B8.3', 'LOGIC', 'Familiari: Fratelli', '0/1', 'NO/SI'],
      ['B8.4', 'LOGIC', 'Familiari: Nonni', '0/1', 'NO/SI'],
      ['B8.5', 'LOGIC', 'Familiari: Altri parenti', '0/1', 'NO/SI'],
      ['B8.6', 'LOGIC', 'Familiari: Non parenti', '0/1', 'NO/SI'],
      ['B9', 'NUMERIC', 'Titolo di studio della madre', '1,2,3,4,5', 'Primario,Secondario,Terziario,Quartario,Quinto'],
      ['B10', 'NUMERIC', 'Situazione lavorativa della madre', '1,2,3,4,5', 'Occupata,Inoccupata,Disoccupata,Inattiva,Inattiva'],
      ['B11', 'NUMERIC', 'Titolo di studio del padre', '1,2,3,4,5', 'Primario,Secondario,Terziario,Quartario,Quinto'],
      ['B12', 'NUMERIC', 'Situazione lavorativa del padre', '1,2,3,4,5', 'Occupato,Inoccupato,Disoccupato,Inattivo,Inattivo'],
      ['C1', 'NUMERIC', 'Titolo di studio', '1,2,3,4,5', 'Primario,Secondario,Terziario,Quartario,Quinto'],
      ['C2.1', 'LOGIC', 'Prima entrata: Studiavo', '0/1', 'NO/SI'],
      ['C2.2', 'LOGIC', 'Prima entrata: Lavoravo stabile', '0/1', 'NO/SI'],
      ['C2.3', 'LOGIC', 'Prima entrata: Lavoravo saltuario', '0/1', 'NO/SI'],
      ['C2.4', 'LOGIC', 'Prima entrata: Corso di formazione', '0/1', 'NO/SI'],
      ['C2.5', 'LOGIC', 'Prima entrata: Altro', '0/1', 'NO/SI'],
      ['C2.6', 'LOGIC', 'Prima entrata: Nessuna', '0/1', 'NO/SI'],
      ['C2.5SPEC', 'STRING', 'Specificare il tipo di altro', '', ''],
      ['C3', 'LOGIC', 'Orientamento lavoro', '0/1', 'NO/SI'],
      ['C4.1', 'LOGIC', 'Dove orientamento: Scuola', '0/1', 'NO/SI'],
      ['C4.2', 'LOGIC', 'Dove orientamento: Enti di formazione', '0/1', 'NO/SI'],
      ['C4.3', 'LOGIC', 'Dove orientamento: Servizi di impiego', '0/1', 'NO/SI'],
      ['C4.4', 'LOGIC', 'Dove orientamento: Struttura', '0/1', 'NO/SI'],
      ['C4.5', 'LOGIC', 'Dove orientamento: Altro', '0/1', 'NO/SI'],
      ['C4.5SPEC', 'STRING', 'Specificare il tipo di altro', '', ''],
      ['C4_BIS', 'NUMERIC', 'Utilita servizio', '1,2,3,4,5', 'Ospite di centri antiviolenza,Ospite di strutture per stranieri,Ospite di strutture sanitarie,Ospite di altro tipo di struttura,Ospite di comunità'],
      ['C5.1', 'LOGIC', 'Attualmente: Studio', '0/1', 'NO/SI'],
      ['C5.2', 'LOGIC', 'Attualmente: Formazione', '0/1', 'NO/SI'],
      ['C5.3', 'LOGIC', 'Attualmente: Lavoro', '0/1', 'NO/SI'],
      ['C5.4', 'LOGIC', 'Attualmente: Ricerca lavoro', '0/1', 'NO/SI'],
      ['C5.5', 'LOGIC', 'Attualmente: Nessuna', '0/1', 'NO/SI'],
      ['C6', 'NUMERIC', 'Motivo non studio', '1,2,3,4,5', 'Scuola,Formazione,Lavoro,Ricerca lavoro,Altro'],
      ['C7', 'STRING', 'Corso frequentato', '', ''],
      ['C8', 'STRING', 'Lavoro attuale', '', ''],
      ['C8.1', 'NUMERIC', 'Utilita: Studiare', '1,2,3,4,5', 'Primario,Secondario,Terziario,Quartario,Quinto'],
      ['C8.2', 'NUMERIC', 'Utilita: Formazione', '1,2,3,4,5', 'Primario,Secondario,Terziario,Quartario,Quinto'],
      ['C8.3', 'NUMERIC', 'Utilita: Lavorare', '1,2,3,4,5', 'Primario,Secondario,Terziario,Quartario,Quinto'],
      ['C8.4', 'NUMERIC', 'Utilita: Cercare lavoro', '1,2,3,4,5', 'Primario,Secondario,Terziario,Quartario,Quinto'],
      ['C9.1', 'LOGIC', 'Ricerca lavoro: Centro impiego', '0/1', 'NO/SI'],
      ['C9.2', 'LOGIC', 'Ricerca lavoro: Sportelli', '0/1', 'NO/SI'],
      ['C9.3', 'LOGIC', 'Ricerca lavoro: Inps', '0/1', 'NO/SI'],
      ['C9.4', 'LOGIC', 'Ricerca lavoro: Servizi sociali', '0/1', 'NO/SI'],
      ['C9.5', 'LOGIC', 'Ricerca lavoro: Agenzie', '0/1', 'NO/SI'],
      ['C9.6', 'LOGIC', 'Ricerca lavoro: Cooperative', '0/1', 'NO/SI'],
      ['C9.7', 'LOGIC', 'Ricerca lavoro: Struttura', '0/1', 'NO/SI'],
      ['C9.8', 'LOGIC', 'Ricerca lavoro: Conoscenti', '0/1', 'NO/SI'],
      ['C9.9', 'LOGIC', 'Ricerca lavoro: Portali', '0/1', 'NO/SI'],
      ['C9.10', 'LOGIC', 'Ricerca lavoro: Social', '0/1', 'NO/SI'],
      ['C9.11', 'LOGIC', 'Ricerca lavoro: Altro', '0/1', 'NO/SI'],
      ['C9.11SPEC', 'STRING', 'Specificare il tipo di altro', '', ''],
      ['C10', 'LOGIC', 'Curriculum', '0/1', 'NO/SI'],
      ['C11', 'LOGIC', 'Centro impiego', '0/1', 'NO/SI'],
      ['C12', 'LOGIC', 'Lavoro autonomo', '0/1', 'NO/SI'],
      ['C13.1', 'NUMERIC', 'Importanza: Stabilita', '1,2,3,4,5', 'Molto importante,Importante,Moderato,Poco importante,Non importante'],
      ['C13.2', 'NUMERIC', 'Importanza: Flessibilita', '1,2,3,4,5', 'Molto flessibile,Flessibile,Moderato,Poco flessibile,Non flessibile'],
      ['C13.3', 'NUMERIC', 'Importanza: Valorizzazione', '1,2,3,4,5', 'Molto valorizzante,Valorizzante,Moderato,Poco valorizzante,Non valorizzante'],
      ['C13.4', 'NUMERIC', 'Importanza: Retribuzione', '1,2,3,4,5', 'Molto retribuito,Retribuito,Moderato,Poco retribuito,Non retribuito'],
      ['C13.5', 'NUMERIC', 'Importanza: Fatica', '1,2,3,4,5', 'Molto faticoso,Faticoso,Moderato,Poco faticoso,Non faticoso'],
      ['C13.6', 'NUMERIC', 'Importanza: Sicurezza', '1,2,3,4,5', 'Molto sicuro,Sicuro,Moderato,Poco sicuro,Non sicuro'],
      ['C13.7', 'NUMERIC', 'Importanza: Utilita sociale', '1,2,3,4,5', 'Molto utile socialmente,Utile socialmente,Moderato,Poco utile socialmente,Non utile socialmente'],
      ['C13.8', 'NUMERIC', 'Importanza: Vicinanza', '1,2,3,4,5', 'Molto vicino,Vicino,Moderato,Poco vicino,Non vicino'],
      ['D1.1', 'LOGIC', 'Abitazione precedente: Solo', '0/1', 'NO/SI'],
      ['D1.2', 'LOGIC', 'Abitazione precedente: Struttura', '0/1', 'NO/SI'],
      ['D1.3', 'LOGIC', 'Abitazione precedente: Madre', '0/1', 'NO/SI'],
      ['D1.4', 'LOGIC', 'Abitazione precedente: Padre', '0/1', 'NO/SI'],
      ['D1.5', 'LOGIC', 'Abitazione precedente: Partner', '0/1', 'NO/SI'],
      ['D1.6', 'LOGIC', 'Abitazione precedente: Figli', '0/1', 'NO/SI'],
      ['D1.7', 'LOGIC', 'Abitazione precedente: Fratelli', '0/1', 'NO/SI'],
      ['D1.8', 'LOGIC', 'Abitazione precedente: Nonni', '0/1', 'NO/SI'],
      ['D1.9', 'LOGIC', 'Abitazione precedente: Altri parenti', '0/1', 'NO/SI'],
      ['D1.10', 'LOGIC', 'Abitazione precedente: Amici', '0/1', 'NO/SI'],
      ['D2.1', 'LOGIC', 'Supporto: Padre', '0/1', 'NO/SI'],
      ['D2.2', 'LOGIC', 'Supporto: Madre', '0/1', 'NO/SI'],
      ['D2.3', 'LOGIC', 'Supporto: Fratelli', '0/1', 'NO/SI'],
      ['D2.4', 'LOGIC', 'Supporto: Altri parenti', '0/1', 'NO/SI'],
      ['D2.5', 'LOGIC', 'Supporto: Amici', '0/1', 'NO/SI'],
      ['D2.6', 'LOGIC', 'Supporto: Tutore', '0/1', 'NO/SI'],
      ['D2.7', 'LOGIC', 'Supporto: Insegnanti', '0/1', 'NO/SI'],
      ['D2.8', 'LOGIC', 'Supporto: Figure sostegno', '0/1', 'NO/SI'],
      ['D2.9', 'LOGIC', 'Supporto: Volontari', '0/1', 'NO/SI'],
      ['D2.10', 'LOGIC', 'Supporto: Altri', '0/1', 'NO/SI'],
      ['D2.10SPEC', 'STRING', 'Specificare il tipo di altro', '', ''],
      ['E1.1', 'NUMERIC', 'Preoccupazioni: Pregiudizi', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E1.2', 'NUMERIC', 'Preoccupazioni: Mancanza lavoro', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E1.3', 'NUMERIC', 'Preoccupazioni: Mancanza aiuto', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E1.4', 'NUMERIC', 'Preoccupazioni: Mancanza casa', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E1.5', 'NUMERIC', 'Preoccupazioni: Solitudine', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E1.6', 'NUMERIC', 'Preoccupazioni: Salute', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E1.7', 'NUMERIC', 'Preoccupazioni: Perdita persone', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E1.8', 'NUMERIC', 'Preoccupazioni: Altro', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E1.8SPEC', 'STRING', 'Specificare il tipo di altro', '', ''],
      ['E2.1', 'NUMERIC', 'Realizzabile: Lavoro piacevole', '1,2,3,4,5', 'Molto piacevole,Piacevole,Moderato,Poco piacevole,Non piacevole'],
      ['E2.2', 'NUMERIC', 'Realizzabile: Autonomia', '1,2,3,4,5', 'Molto autonoma,Autonoma,Moderata,Poco autonoma,Non autonoma'],
      ['E2.3', 'NUMERIC', 'Realizzabile: Famiglia', '1,2,3,4,5', 'Molto importante,Importante,Moderato,Poco importante,Non importante'],
      ['E2.4', 'NUMERIC', 'Realizzabile: Trovare lavoro', '1,2,3,4,5', 'Molto difficile,Difficile,Moderato,Poco difficile,Facile'],
      ['E2.5', 'NUMERIC', 'Realizzabile: Salute', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E2.6', 'NUMERIC', 'Realizzabile: Casa', '1,2,3,4,5', 'Molto preoccupante,Preoccupante,Moderato,Poco preoccupante,Non preoccupante'],
      ['E3', 'STRING', 'Aiuto futuro', '', ''],
      ['E4', 'LOGIC', 'Pronto', '0/1', 'NO/SI'],
      ['E4.1', 'STRING', 'Non pronto perche', '', ''],
      ['E4.2', 'STRING', 'Pronto perche', '', ''],
      ['E5.1', 'LOGIC', 'Emozioni: Felicita', '0/1', 'NO/SI'],
      ['E5.2', 'LOGIC', 'Emozioni: Tristezza', '0/1', 'NO/SI'],
      ['E5.3', 'LOGIC', 'Emozioni: Curiosita', '0/1', 'NO/SI'],
      ['E5.4', 'LOGIC', 'Emozioni: Preoccupazione', '0/1', 'NO/SI'],
      ['E5.5', 'LOGIC', 'Emozioni: Paura', '0/1', 'NO/SI'],
      ['E5.6', 'LOGIC', 'Emozioni: Liberazione', '0/1', 'NO/SI'],
      ['E5.7', 'LOGIC', 'Emozioni: Solitudine', '0/1', 'NO/SI'],
      ['E5.8', 'LOGIC', 'Emozioni: Rabbia', '0/1', 'NO/SI'],
      ['E5.9', 'LOGIC', 'Emozioni: Speranza', '0/1', 'NO/SI'],
      ['E5.10', 'LOGIC', 'Emozioni: Determinazione', '0/1', 'NO/SI'],
      ['E6', 'STRING', 'Desiderio', '', ''],
      ['E7', 'STRING', 'Aggiungere', '', '']
    ];

    // Creiamo il foglio con l'header
    const worksheet = XLSX.utils.aoa_to_sheet(headers);

    // Prepariamo i dati
    const data = questionari.map((q: QuestionarioGiovani) => ({
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
      'B10': q.situazione_lavorativa_madre || 0,
      'B11': q.titolo_studio_padre || 0,
      'B12': q.situazione_lavorativa_padre || 0,
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

    // Aggiungiamo i dati sotto l'header
    XLSX.utils.sheet_add_json(worksheet, data, { 
      origin: 'A' + (headers.length + 1),
      skipHeader: true 
    });

    // Impostiamo la larghezza delle colonne
    const wscols = [
      {wch: 15}, // VARIABILE
      {wch: 10}, // FORMATO
      {wch: 50}, // ETICHETTA
      {wch: 15}, // VALORI
      {wch: 50}  // ETICHETTE DEI VALORI
    ];
    worksheet['!cols'] = wscols;

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