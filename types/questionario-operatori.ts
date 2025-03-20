export interface FormData {
  // Metadati
  created_at?: string;
  created_by?: string;
  stato?: string;
  fonte?: string;

  // SezioneA - Dati anagrafici
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  eta: string;
  genere: string;
  titolo_studio: string;
  anni_esperienza: string;
  tipo_contratto: string;
  ruolo_attuale: string;

  // SezioneB - Struttura e ruolo
  id_struttura: string;
  tipo_struttura: string;
  professione: string;
  professione_altro?: string;
  mansioni_principali: string[];
  competenze_specifiche: string[];
  formazione_specialistica?: string;
  certificazioni: string[];
  lingue_conosciute: string[];

  // SezioneC - Esperienza con giovani
  ruolo: string;
  esperienza_giovani: string;
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
  caratteristiche_persone: string[];
  caratteristiche_altro?: string;

  // SezioneD - Approccio e metodologia
  approccio_educativo: string;
  metodologie_utilizzate: string[];
  strumenti_lavoro: string[];
  modalita_coinvolgimento: string;
  sfide_principali: string[];
  strategie_motivazionali: string;
  gestione_conflitti: string;
  valutazione_impatto: string;
  tipo_intervento: string[];
  intervento_altro?: string;
  strategie_supporto: string[];
  strategie_altro?: string;
  metodi_valutazione: string[];
  metodi_altro?: string;
  risorse_utilizzate: string[];
  risorse_altro?: string;
  frequenza_incontri: string;
  durata_media_incontri: string;
  setting_lavoro: string[];
  setting_altro?: string;
  casi_successo: string;
  lezioni_apprese: string;
  buone_pratiche: string[];
  feedback_giovani: string;

  // SezioneE - Difficoltà riscontrate
  difficolta_incontrate: string[];
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
  };
  difficolta_altro_spec: string;
  barriere_comunicazione: string[];
  barriere_altro?: string;
  supporto_necessario: string[];
  supporto_altro?: string;
  ostacoli_principali: string[];
  ostacoli_altro?: string;
  risorse_mancanti: string[];
  risorse_mancanti_altro?: string;

  // SezioneF - Sviluppo professionale
  punti_forza: string[];
  aree_miglioramento: string[];
  obiettivi_professionali: string;
  formazione_desiderata: string[];
  suggerimenti?: string;
  competenze_da_sviluppare: string[];
  competenze_altro?: string;
  bisogni_formativi: string[];
  bisogni_altro?: string;
  feedback_ricevuti: string;
  impatto_percepito: string;

  // SezioneD - campi aggiuntivi
  risultati_ottenuti: string;
  indicatori_successo: string[];
  collaborazioni_attive: string[];
  reti_territoriali: string[];
  progetti_futuri: string;
  innovazioni_introdotte: string[];
  
  // SezioneE - campi aggiuntivi
  criticita_sistema: string[];
  proposte_miglioramento: string[];
  bisogni_territorio: string[];
  
  // SezioneF - campi aggiuntivi
  sviluppi_carriera: string;
  aspettative_professionali: string;
  disponibilita_formazione: boolean;
  aree_interesse: string[];
  mentoring_desiderato: boolean;
  networking_interesse: string[];
} 