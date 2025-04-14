import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface QuestionarioOperatori {
  id: string;
  id_struttura: string;
  tipo_struttura: string;
  professione: number;
  professione_spec?: string;
  persone_seguite: {
    uomini: number;
    donne: number;
    maggiorenni_uomini: number;
    maggiorenni_donne: number;
  };
  tipologie_persone?: {
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
  interventi?: {
    formazione?: boolean;
    ricerca_lavoro?: boolean;
    autonomia_abitativa?: boolean;
    rapporto_famiglia?: boolean;
    relazioni_coetanei?: boolean;
    valorizzazione_competenze?: boolean;
    sostegno_legale?: boolean;
    sostegno_sociosanitario?: boolean;
    mediazione_interculturale?: boolean;
    altro?: boolean;
    altro_spec?: string;
  };
  potenziamento?: {
    formazione?: boolean;
    ricerca_lavoro?: boolean;
    autonomia_abitativa?: boolean;
    rapporto_famiglia?: boolean;
    relazioni_coetanei?: boolean;
    valorizzazione_competenze?: boolean;
    sostegno_legale?: boolean;
    sostegno_sociosanitario?: boolean;
    mediazione_interculturale?: boolean;
    altro?: boolean;
    altro_spec?: string;
  };
  difficolta?: {
    problemi_economici: number;
    trovare_lavoro: number;
    lavori_qualita: number;
    trovare_casa: number;
    discriminazioni: number;
    salute_fisica: number;
    problemi_psicologici: number;
    difficolta_linguistiche: number;
    altro: number;
    altro_spec?: string;
  };
}

const handleExportXLSX = async (questionari: QuestionarioOperatori[]) => {
  try {
    if (!questionari || questionari.length === 0) {
      toast.error("Nessun dato disponibile per l'esportazione");
      return;
    }

    const dataToExport = questionari.map((q: QuestionarioOperatori) => ({
      'ID_STRUTTURA': q.id_struttura || '',
      'TIPO_STRUTTURA': q.tipo_struttura || '',
      'PROF': q.professione || 0,
      'PROF_SPEC': q.professione_spec || '',
      'B1U': q.persone_seguite?.uomini || 0,
      'B1D': q.persone_seguite?.donne || 0,
      'B1T': (q.persone_seguite?.uomini || 0) + (q.persone_seguite?.donne || 0),
      'B2U': q.persone_seguite?.maggiorenni_uomini || 0,
      'B2D': q.persone_seguite?.maggiorenni_donne || 0,
      'B2T': (q.persone_seguite?.maggiorenni_uomini || 0) + (q.persone_seguite?.maggiorenni_donne || 0),
      'B3.1': q.tipologie_persone?.stranieri ? 1 : 0,
      'B3.2': q.tipologie_persone?.vittime_tratta ? 1 : 0,
      'B3.3': q.tipologie_persone?.vittime_violenza ? 1 : 0,
      'B3.4': q.tipologie_persone?.allontanati_famiglia ? 1 : 0,
      'B3.5': q.tipologie_persone?.detenuti ? 1 : 0,
      'B3.6': q.tipologie_persone?.ex_detenuti ? 1 : 0,
      'B3.7': q.tipologie_persone?.misura_alternativa ? 1 : 0,
      'B3.8': q.tipologie_persone?.senza_dimora ? 1 : 0,
      'B3.9': q.tipologie_persone?.rom_sinti ? 1 : 0,
      'B3.10': q.tipologie_persone?.disabilita_fisica ? 1 : 0,
      'B3.11': q.tipologie_persone?.disabilita_cognitiva ? 1 : 0,
      'B3.12': q.tipologie_persone?.disturbi_psichiatrici ? 1 : 0,
      'B3.13': q.tipologie_persone?.dipendenze ? 1 : 0,
      'B3.14': q.tipologie_persone?.genitori_precoci ? 1 : 0,
      'B3.15': q.tipologie_persone?.orientamento_sessuale ? 1 : 0,
      'B3.16': q.tipologie_persone?.altro ? 1 : 0,
      'B3.16SPEC': q.tipologie_persone?.altro_spec || '',
      'B4.1': q.interventi?.formazione ? 1 : 0,
      'B4.2': q.interventi?.ricerca_lavoro ? 1 : 0,
      'B4.3': q.interventi?.autonomia_abitativa ? 1 : 0,
      'B4.4': q.interventi?.rapporto_famiglia ? 1 : 0,
      'B4.5': q.interventi?.relazioni_coetanei ? 1 : 0,
      'B4.6': q.interventi?.valorizzazione_competenze ? 1 : 0,
      'B4.7': q.interventi?.sostegno_legale ? 1 : 0,
      'B4.8': q.interventi?.sostegno_sociosanitario ? 1 : 0,
      'B4.9': q.interventi?.mediazione_interculturale ? 1 : 0,
      'B4.10': q.interventi?.altro ? 1 : 0,
      'B4.10SPEC': q.interventi?.altro_spec || '',
      'B5.1': q.potenziamento?.formazione ? 1 : 0,
      'B5.2': q.potenziamento?.ricerca_lavoro ? 1 : 0,
      'B5.3': q.potenziamento?.autonomia_abitativa ? 1 : 0,
      'B5.4': q.potenziamento?.rapporto_famiglia ? 1 : 0,
      'B5.5': q.potenziamento?.relazioni_coetanei ? 1 : 0,
      'B5.6': q.potenziamento?.valorizzazione_competenze ? 1 : 0,
      'B5.7': q.potenziamento?.sostegno_legale ? 1 : 0,
      'B5.8': q.potenziamento?.sostegno_sociosanitario ? 1 : 0,
      'B5.9': q.potenziamento?.mediazione_interculturale ? 1 : 0,
      'B5.10': q.potenziamento?.altro ? 1 : 0,
      'B5.10SPEC': q.potenziamento?.altro_spec || '',
      'C1.1': q.difficolta?.problemi_economici || 0,
      'C1.2': q.difficolta?.trovare_lavoro || 0,
      'C1.3': q.difficolta?.lavori_qualita || 0,
      'C1.4': q.difficolta?.trovare_casa || 0,
      'C1.5': q.difficolta?.discriminazioni || 0,
      'C1.6': q.difficolta?.salute_fisica || 0,
      'C1.7': q.difficolta?.problemi_psicologici || 0,
      'C1.8': q.difficolta?.difficolta_linguistiche || 0,
      'C1.9': q.difficolta?.altro || 0,
      'C1.9SPEC': q.difficolta?.altro_spec || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questionari");

    const fileName = `questionari_operatori_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast.success("File Excel esportato con successo");
  } catch (error) {
    console.error("Errore durante l'esportazione:", error);
    toast.error("Errore durante l'esportazione del file Excel");
  }
}; 