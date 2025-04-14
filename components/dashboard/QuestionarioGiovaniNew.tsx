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
  // ... resto dell'interfaccia con tutti i campi necessari
}

const handleExportXLSX = async (questionari: QuestionarioGiovani[]) => {
  try {
    if (!questionari || questionari.length === 0) {
      toast.error("Nessun dato disponibile per l'esportazione");
      return;
    }

    const dataToExport = questionari.map((q) => ({
      'PERCAUT': q.percorso_autonomia ? 1 : 0,
      'PERCAUT_SPEC': q.percorso_autonomia_spec || '',
      'VIVE': q.vive_in_struttura ? 1 : 0,
      'CONDATT': q.collocazione_attuale,
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
      'B1': q.sesso,
      'B2': q.classe_eta,
      'B3': q.luogo_nascita,
      'B3SPEC': q.luogo_nascita_spec || '',
      'B4': q.cittadinanza,
      'B5': q.permesso_soggiorno,
      'B6': q.tempo_in_struttura,
      'B7': q.ospite_precedente,
      'B8.1': q.familiari?.padre ? 1 : 0,
      'B8.2': q.familiari?.madre ? 1 : 0,
      'B8.3': q.familiari?.fratelli ? 1 : 0,
      'B8.4': q.familiari?.nonni ? 1 : 0,
      'B8.5': q.familiari?.altri_parenti ? 1 : 0,
      'B8.6': q.familiari?.non_parenti ? 1 : 0,
      'B9': q.titolo_studio_madre,
      'B10': q.situazione_lavorativa_madre,
      'B11': q.titolo_studio_padre,
      'B12': q.situazione_lavorativa_padre,
      'C1': q.titolo_studio,
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
      'C4_BIS': q.utilita_servizio,
      'C5.1': q.attualmente?.studio ? 1 : 0,
      'C5.2': q.attualmente?.formazione ? 1 : 0,
      'C5.3': q.attualmente?.lavoro ? 1 : 0,
      'C5.4': q.attualmente?.ricerca_lavoro ? 1 : 0,
      'C5.5': q.attualmente?.nessuna ? 1 : 0,
      'C6': q.motivo_non_studio,
      'C7': q.corso_frequentato || '',
      'C8': q.lavoro_attuale || '',
      'C8.1': q.utilita?.studiare,
      'C8.2': q.utilita?.formazione,
      'C8.3': q.utilita?.lavorare,
      'C8.4': q.utilita?.cercare_lavoro,
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
      'C13.1': q.importanza?.stabilita,
      'C13.2': q.importanza?.flessibilita,
      'C13.3': q.importanza?.valorizzazione,
      'C13.4': q.importanza?.retribuzione,
      'C13.5': q.importanza?.fatica,
      'C13.6': q.importanza?.sicurezza,
      'C13.7': q.importanza?.utilita_sociale,
      'C13.8': q.importanza?.vicinanza,
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
      'E1.1': q.preoccupazioni?.pregiudizi,
      'E1.2': q.preoccupazioni?.mancanza_lavoro,
      'E1.3': q.preoccupazioni?.mancanza_aiuto,
      'E1.4': q.preoccupazioni?.mancanza_casa,
      'E1.5': q.preoccupazioni?.solitudine,
      'E1.6': q.preoccupazioni?.salute,
      'E1.7': q.preoccupazioni?.perdita_persone,
      'E1.8': q.preoccupazioni?.altro,
      'E1.8SPEC': q.preoccupazioni?.altro_spec || '',
      'E2.1': q.realizzabile?.lavoro_piacevole,
      'E2.2': q.realizzabile?.autonomia,
      'E2.3': q.realizzabile?.famiglia,
      'E2.4': q.realizzabile?.trovare_lavoro,
      'E2.5': q.realizzabile?.salute,
      'E2.6': q.realizzabile?.casa,
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

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questionari");

    const fileName = `questionari_giovani_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast.success("File Excel esportato con successo");
  } catch (error) {
    console.error("Errore durante l'esportazione:", error);
    toast.error("Errore durante l'esportazione del file Excel");
  }
}; 