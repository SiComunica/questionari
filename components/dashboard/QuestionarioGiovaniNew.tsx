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

    // Definiamo il tracciato record completo
    const tracciatoRecord = [
      ['VARIABILE', 'FORMATO', 'ETICHETTA', 'VALORI', 'ETICHETTE DEI VALORI'],
      ['PERCAUT', 'LOGIC', 'Percorso di autonomia', '0/1', 'NO/SI'],
      ['PERCAUT_SPEC', 'STRING', 'Specificare il tipo di percorso o di presa in carico', '', ''],
      ['VIVE', 'LOGIC', 'vive in struttura', '0/1', 'NO/SI'],
      ['CONDATT', 'NUMERIC', 'collocazione attuale del giovane', '1,2,3,4,5', 'Ospite di centri antiviolenza,Ospite di strutture per stranieri,Ospite di strutture sanitarie,Ospite di altro tipo di struttura,Ospite di comunità'],
      ['CONDATT_SPEC', 'STRING', 'specificare il tipo di comunità', '', ''],
      ['FV.1', 'LOGIC', 'fattori di vulnerabilità: Stranieri con problemi legati alla condizione migratoria', '0/1', 'NO/SI'],
      ['FV.2', 'LOGIC', 'fattori di vulnerabilità: Vittime di tratta', '0/1', 'NO/SI'],
      ['FV.3', 'LOGIC', 'fattori di vulnerabilità: Vittime di violenza domestica', '0/1', 'NO/SI'],
      ['FV.4', 'LOGIC', 'fattori di vulnerabilità: Persone allontanate dalla famiglia', '0/1', 'NO/SI'],
      ['FV.5', 'LOGIC', 'fattori di vulnerabilità: Detenuti', '0/1', 'NO/SI'],
      ['FV.6', 'LOGIC', 'fattori di vulnerabilità: Ex detenuti', '0/1', 'NO/SI'],
      ['FV.7', 'LOGIC', 'fattori di vulnerabilità: Persone in esecuzione penale esterna /misura alternativa alla detenzione', '0/1', 'NO/SI'],
      ['FV.8', 'LOGIC', 'fattori di vulnerabilità: Indigenti e/o senza dimora', '0/1', 'NO/SI'],
      ['FV.9', 'LOGIC', 'fattori di vulnerabilità: Rom e Sinti', '0/1', 'NO/SI'],
      ['FV.10', 'LOGIC', 'fattori di vulnerabilità: Persone con disabilità fisica', '0/1', 'NO/SI'],
      ['FV.11', 'LOGIC', 'fattori di vulnerabilità: Persone con disabilità cognitiva', '0/1', 'NO/SI'],
      ['FV.12', 'LOGIC', 'fattori di vulnerabilità: Persone con disturbi psichiatrici', '0/1', 'NO/SI'],
      ['FV.13', 'LOGIC', 'fattori di vulnerabilità: Persone con dipendenze', '0/1', 'NO/SI'],
      ['FV.14', 'LOGIC', 'fattori di vulnerabilità: Genitori precoci', '0/1', 'NO/SI'],
      ['FV.15', 'LOGIC', 'fattori di vulnerabilità: Persone con problemi legati all\'orientamento sessuale', '0/1', 'NO/SI'],
      ['FV.16', 'LOGIC', 'fattori di vulnerabilità: Altro', '0/1', 'NO/SI'],
      ['FV.16_SPEC', 'STRING', 'Specificare la voce "altro"', '', ''],
      ['B1', 'NUMERIC', 'Sesso', '1,2,3', 'maschio,femmina,altro / preferisco non rispondere'],
      ['B2', 'NUMERIC', 'Classe di età', '1,2,3,4', '18-21 anni,22-24 anni,25-27 anni,28-34 anni'],
      ['B3', 'NUMERIC', 'Luogo di nascita', '1,2', 'Italia,Altro Paese'],
      ['B3SPEC', 'STRING', 'Specificare il Paese', '', ''],
      ['B4', 'NUMERIC', 'Cittadinanza', '1,2,3', 'italiana,di altro Paese UE,di Paese extra-UE'],
      ['B5', 'NUMERIC', 'Se cittadino UE', '1,2,3', 'con permesso di soggiorno,in attesa di permesso di soggiorno,senza permesso di soggiorno'],
      ['B6', 'NUMERIC', 'Da quanto tempo in struttura', '1,2,3,4', 'Da meno di 6 mesi,da 6 mesi a 1 anno,da 1 a 3 anni,più di 3 anni'],
      ['B7', 'NUMERIC', 'Ospite di strutture in precedenza', '0,1,2', 'no mai,sì una volta,sì più di una volta'],
      ['B8.1', 'LOGIC', 'familiari: padre', '0/1', 'NO/SI'],
      ['B8.2', 'LOGIC', 'familiari: madre', '0/1', 'NO/SI'],
      ['B8.3', 'LOGIC', 'familiari: fratelli/sorelle', '0/1', 'NO/SI'],
      ['B8.4', 'LOGIC', 'familiari: nonni/nonne', '0/1', 'NO/SI'],
      ['B8.5', 'LOGIC', 'familiari: altri parenti', '0/1', 'NO/SI'],
      ['B8.6', 'LOGIC', 'familiari: altri conviventi non parenti', '0/1', 'NO/SI'],
      ['B9', 'NUMERIC', 'Titolo di studio della madre', '1,2,3,4,5,9', 'Nessun titolo di studio,Licenza elementare,Licenza media,Diploma di scuola superiore,Laurea,Non so'],
      ['B10', 'NUMERIC', 'Situazione lavorativa madre', '1,2,3,4,9', 'Ha un lavoro stabile,Ha un lavoro saltuario,Non lavora,Pensionata,Non so'],
      ['B11', 'NUMERIC', 'Titolo di studio del padre', '1,2,3,4,5,9', 'Nessun titolo di studio,Licenza elementare,Licenza media,Diploma di scuola superiore,Laurea,Non so'],
      ['B12', 'NUMERIC', 'Situazione lavorativa padre', '1,2,3,4,9', 'Ha un lavoro stabile,Ha un lavoro saltuario,Non lavora,Pensionato,Non so'],
      ['C1', 'NUMERIC', 'Titolo di studio', '1,2,3,4,5,6', 'Nessun titolo di studio,Licenza elementare,Licenza media,Qualifica professionale,Diploma di scuola superiore,Laurea'],
      ['C2.1', 'LOGIC', 'Prima di entrare: studiavo', '0/1', 'NO/SI'],
      ['C2.2', 'LOGIC', 'Prima di entrare: lavoravo stabilmente', '0/1', 'NO/SI'],
      ['C2.3', 'LOGIC', 'Prima di entrare: lavoravo saltuariamente', '0/1', 'NO/SI'],
      ['C2.4', 'LOGIC', 'Prima di entrare: frequentavo un corso di formazione', '0/1', 'NO/SI'],
      ['C2.5', 'LOGIC', 'Prima di entrare: altro', '0/1', 'NO/SI'],
      ['C2.6', 'LOGIC', 'Prima di entrare: Nessuna delle precedenti', '0/1', 'NO/SI'],
      ['C2.5SPEC', 'STRING', 'Specificare la voce "altro"', '', ''],
      ['C3', 'LOGIC', 'usufruito di servizi di orientamento al lavoro', '0/1', 'NO/SI'],
      ['C4.1', 'LOGIC', 'a scuola/università', '0/1', 'NO/SI'],
      ['C4.2', 'LOGIC', 'presso enti di formazione professionale', '0/1', 'NO/SI'],
      ['C4.3', 'LOGIC', 'presso servizi per l\'impiego (pubblici e/o privati)', '0/1', 'NO/SI'],
      ['C4.4', 'LOGIC', 'nella struttura dove mi trovo', '0/1', 'NO/SI'],
      ['C4.5', 'LOGIC', 'in altro luogo', '0/1', 'NO/SI'],
      ['C4.5SPEC', 'STRING', 'Specificare in quale altro luogo', '', ''],
      ['C4_BIS', 'NUMERIC', 'Utilità del servizio', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C5.1', 'LOGIC', 'Attualmente studio', '0/1', 'NO/SI'],
      ['C5.2', 'LOGIC', 'Attualmente in formazione', '0/1', 'NO/SI'],
      ['C5.3', 'LOGIC', 'Attualmente lavoro', '0/1', 'NO/SI'],
      ['C5.4', 'LOGIC', 'Attualmente ricerco lavoro', '0/1', 'NO/SI'],
      ['C5.5', 'LOGIC', 'Attualmente nessuna attività', '0/1', 'NO/SI'],
      ['C6', 'NUMERIC', 'Motivo di non studio', '1,2,3,4', 'Ho completato gli studi,Non mi piace studiare,Non ho la possibilità di studiare,Ho necessità di lavorare'],
      ['C7', 'STRING', 'Se sei impegnato in attività formativa, quale corso frequenti?', '', ''],
      ['C8', 'STRING', 'Se sei impegnato in attività lavorative, qual è il tuo lavoro?', '', ''],
      ['C8.1', 'NUMERIC', 'utilità: studiare', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C8.2', 'NUMERIC', 'utilità: frequentare un corso di formazione', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C8.3', 'NUMERIC', 'utilità: lavorare', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C8.4', 'NUMERIC', 'utilità: cercare lavoro', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C9.1', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Centro per l\'impiego (ex collocamento)', '0/1', 'NO/SI'],
      ['C9.2', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Sportelli di orientamento al lavoro', '0/1', 'NO/SI'],
      ['C9.3', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: INPS e patronati', '0/1', 'NO/SI'],
      ['C9.4', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Servizi sociali', '0/1', 'NO/SI'],
      ['C9.5', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Agenzie interinali', '0/1', 'NO/SI'],
      ['C9.6', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Cooperative sociali', '0/1', 'NO/SI'],
      ['C9.7', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: struttura ospitante', '0/1', 'NO/SI'],
      ['C9.8', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Amici, parenti, conoscenti', '0/1', 'NO/SI'],
      ['C9.9', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Portali on line per la ricerca del lavoro', '0/1', 'NO/SI'],
      ['C9.10', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Social network', '0/1', 'NO/SI'],
      ['C9.11', 'LOGIC', 'A chi si rivolgerebbe per trovare lavoro: Altro', '0/1', 'NO/SI'],
      ['C9.11SPEC', 'STRING', 'Specificare la voce "altro"', '', ''],
      ['C10', 'LOGIC', 'Hai mai compilato un curriculum vitae?', '0/1', 'NO/SI'],
      ['C11', 'LOGIC', 'Ti sei mai rivolto al Centro per l\'impiego (ex collocamento)?', '0/1', 'NO/SI'],
      ['C12', 'LOGIC', 'Hai mai pensato di avviare un\'attività di lavoro autonomo?', '0/1', 'NO/SI'],
      ['C13.1', 'NUMERIC', 'importanza: Stabilità del posto di lavoro', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C13.2', 'NUMERIC', 'importanza: Flessibilità dell\'orario di lavoro', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C13.3', 'NUMERIC', 'importanza: Valorizzazione delle mie capacità', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C13.4', 'NUMERIC', 'importanza: Lavoro ben pagato', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C13.5', 'NUMERIC', 'importanza: Lavoro poco faticoso', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C13.6', 'NUMERIC', 'importanza: Sicurezza sul lavoro', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C13.7', 'NUMERIC', 'importanza: Utilità del lavoro per la società', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['C13.8', 'NUMERIC', 'importanza: Vicinanza alla propria casa', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['D1.1', 'LOGIC', 'Condizione abitativa precedente: nessuno, vivevo da solo', '0/1', 'NO/SI'],
      ['D1.2', 'LOGIC', 'Condizione abitativa precedente: vivevo in una struttura (comunità, casa-famiglia, etc.)', '0/1', 'NO/SI'],
      ['D1.3', 'LOGIC', 'Condizione abitativa precedente: con mia madre', '0/1', 'NO/SI'],
      ['D1.4', 'LOGIC', 'Condizione abitativa precedente: con mio padre', '0/1', 'NO/SI'],
      ['D1.5', 'LOGIC', 'Condizione abitativa precedente: con il mio compagna/o, moglie/marito', '0/1', 'NO/SI'],
      ['D1.6', 'LOGIC', 'Condizione abitativa precedente: con i miei figli', '0/1', 'NO/SI'],
      ['D1.7', 'LOGIC', 'Condizione abitativa precedente: con i miei fratelli/sorelle', '0/1', 'NO/SI'],
      ['D1.8', 'LOGIC', 'Condizione abitativa precedente: con i miei nonni/nonne', '0/1', 'NO/SI'],
      ['D1.9', 'LOGIC', 'Condizione abitativa precedente: con altri parenti/conviventi', '0/1', 'NO/SI'],
      ['D1.10', 'LOGIC', 'Condizione abitativa precedente: con amici', '0/1', 'NO/SI'],
      ['D2.1', 'LOGIC', 'a chi può rivolgersi Padre', '0/1', 'NO/SI'],
      ['D2.2', 'LOGIC', 'a chi può rivolgersi Madre', '0/1', 'NO/SI'],
      ['D2.3', 'LOGIC', 'a chi può rivolgersi Fratelli/Sorelle', '0/1', 'NO/SI'],
      ['D2.4', 'LOGIC', 'a chi può rivolgersi Altri parenti', '0/1', 'NO/SI'],
      ['D2.5', 'LOGIC', 'a chi può rivolgersi Amici', '0/1', 'NO/SI'],
      ['D2.6', 'LOGIC', 'a chi può rivolgersi Tutore', '0/1', 'NO/SI'],
      ['D2.7', 'LOGIC', 'a chi può rivolgersi Insegnanti', '0/1', 'NO/SI'],
      ['D2.8', 'LOGIC', 'a chi può rivolgersi Altre figure di sostegno', '0/1', 'NO/SI'],
      ['D2.9', 'LOGIC', 'a chi può rivolgersi volontari', '0/1', 'NO/SI'],
      ['D2.10', 'LOGIC', 'a chi può rivolgersi Altre persone', '0/1', 'NO/SI'],
      ['D2.10SPEC', 'STRING', 'Specificare la voce "altre persone"', '', ''],
      ['E1.1', 'NUMERIC', 'preoccupazione: Pregiudizi nei miei confronti', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['E1.2', 'NUMERIC', 'preoccupazione: Mancanza di offerte di lavoro', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['E1.3', 'NUMERIC', 'preoccupazione: Non saprei a chi rivolgermi per un aiuto', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['E1.4', 'NUMERIC', 'preoccupazione: Non avere una casa', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['E1.5', 'NUMERIC', 'preoccupazione: La solitudine', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['E1.6', 'NUMERIC', 'preoccupazione: La salute', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['E1.7', 'NUMERIC', 'preoccupazione: Perdere le persone care', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['E1.8', 'NUMERIC', 'preoccupazione: Altro', '0,1,2,3', 'Per niente,Poco,Abbastanza,Molto'],
      ['E1.8SPEC', 'STRING', 'Specificare la voce "altro"', '', ''],
      ['E2.1', 'NUMERIC', 'realizzabile: Fare un lavoro che mi piace', '0,1,2,3,9', 'Per niente,Poco,Abbastanza,Molto,Non è mio obiettivo'],
      ['E2.2', 'NUMERIC', 'realizzabile: Essere autonomo/a', '0,1,2,3,9', 'Per niente,Poco,Abbastanza,Molto,Non è mio obiettivo'],
      ['E2.3', 'NUMERIC', 'realizzabile: Costruire una famiglia', '0,1,2,3,9', 'Per niente,Poco,Abbastanza,Molto,Non è mio obiettivo'],
      ['E2.4', 'NUMERIC', 'realizzabile: Trovare un lavoro', '0,1,2,3,9', 'Per niente,Poco,Abbastanza,Molto,Non è mio obiettivo'],
      ['E2.5', 'NUMERIC', 'realizzabile: Stare in buona salute', '0,1,2,3,9', 'Per niente,Poco,Abbastanza,Molto,Non è mio obiettivo'],
      ['E2.6', 'NUMERIC', 'realizzabile: Avere una casa', '0,1,2,3,9', 'Per niente,Poco,Abbastanza,Molto,Non è mio obiettivo'],
      ['E3', 'STRING', 'Cosa aiuterebbe per affrontare futuro', '', ''],
      ['E4', 'LOGIC', 'Pensando al momento in cui uscirai da questa struttura, ti senti pronto ad affrontare la tua vita', '0/1', 'NO/SI'],
      ['E4.1', 'STRING', 'No, perché', '', ''],
      ['E4.2', 'STRING', 'Sì, perché', '', ''],
      ['E5.1', 'LOGIC', 'Felicità', '0/1', 'NO/SI'],
      ['E5.2', 'LOGIC', 'Tristezza', '0/1', 'NO/SI'],
      ['E5.3', 'LOGIC', 'Curiosità', '0/1', 'NO/SI'],
      ['E5.4', 'LOGIC', 'Preoccupazione', '0/1', 'NO/SI'],
      ['E5.5', 'LOGIC', 'Paura', '0/1', 'NO/SI'],
      ['E5.6', 'LOGIC', 'Liberazione', '0/1', 'NO/SI'],
      ['E5.7', 'LOGIC', 'Solitudine', '0/1', 'NO/SI'],
      ['E5.8', 'LOGIC', 'Rabbia', '0/1', 'NO/SI'],
      ['E5.9', 'LOGIC', 'Speranza', '0/1', 'NO/SI'],
      ['E5.10', 'LOGIC', 'Determinazione', '0/1', 'NO/SI'],
      ['E6', 'STRING', 'desiderio', '', ''],
      ['E7', 'STRING', 'vorrei aggiungere', '', '']
    ];

    // Creiamo il foglio con il tracciato record
    const worksheet = XLSX.utils.aoa_to_sheet(tracciatoRecord);

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tracciato Record");

    const fileName = `tracciato_record_questionari_giovani_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast.success("File Excel esportato con successo");
  } catch (error) {
    console.error("Errore durante l'esportazione:", error);
    toast.error("Errore durante l'esportazione del file Excel");
  }
} 