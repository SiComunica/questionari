export type Sesso = "1" | "2" | "3"
export type ClasseEta = "1" | "2" | "3" | "4"
export type Cittadinanza = "1" | "2" | "3"
export type PermessoSoggiorno = "1" | "2" | "3"
export type TempoStruttura = "1" | "2" | "3" | "4"
export type TitoloStudio = "1" | "2" | "3" | "4" | "5" | "6"
export type ValutazioneUtilita = "0" | "1" | "2" | "3"
export type ValutazionePreoccupazione = "0" | "1" | "2" | "3"
export type ValutazioneObiettivo = "0" | "1" | "2" | "3" | "9"
export type CollocazioneAttuale = "1" | "2" | "3" | "4" | "5"
export type PrecedentiStrutture = "1" | "2" | "3"
export type TitoloStudioGenitori = "1" | "2" | "3" | "4" | "5" | "9"
export type LavoroGenitori = "1" | "2" | "3" | "4" | "9"
export type MotivoNonStudio = "1" | "2" | "3" | "4"

interface LuogoNascita {
  italia: boolean;
  altro_paese?: string;
}

interface AttivitaPrecedenti {
  [key: string]: boolean | string | undefined;
  altro?: boolean;
  altro_specificare?: string;
}

interface RicercaLavoro {
  [key: string]: boolean | string | undefined;
  altro?: boolean;
  altro_specificare?: string;
}

interface OrientamentoLavoro {
  usufruito: boolean;
  utilita: string;
  dove: {
    [key: string]: boolean;
  };
}

export interface QuestionarioGiovani {
  // Metadati
  id?: string
  creato_a?: string
  creato_da?: string

  // Sezione A
  percorso_autonomia: boolean
  tipo_percorso: string
  vivere_in_struttura: boolean
  collocazione_attuale: string
  fattori_vulnerabilità: string[]

  // Sezione B
  sesso: string
  classe_eta: string
  luogo_nascita: LuogoNascita
  cittadinanza: string
  permesso_soggiorno: string
  tempo_in_struttura: string
  precedenti_strutture: string
  famiglia_origine: {
    padre: boolean
    madre: boolean
    fratelli_sorelle: boolean
    nonni: boolean
    altri_parenti: boolean
    altri_conviventi: boolean
  }
  madre: {
    titolo_studio: string
    lavoro: string
  }
  padre: {
    titolo_studio: string
    lavoro: string
  }

  // Sezione C
  titolo_studio: string
  attività_precedenti: AttivitaPrecedenti
  attività_attuali: string[]
  motivi_non_studio: string[]
  corso_formazione: {
    presente: boolean
    descrizione?: string
  }
  orientamento_lavoro: OrientamentoLavoro
  orientamento_luoghi: string[]
  ricerca_lavoro: RicercaLavoro
  lavoro_attuale: {
    presente: boolean
    descrizione?: string
  }
  curriculum_vitae: string
  centro_impiego: string
  lavoro_autonomo: string
  aspetti_lavoro: {
    stabilita: string
    flessibilita: string
    valorizzazione: string
    retribuzione: string
    fatica: string
    sicurezza: string
    utilita_sociale: string
    vicinanza_casa: string
  }
  condizioni_lavoro: string[]
  livelli_utilità: string[]
  livelli_obiettivi: string[]

  // Sezione D
  abitazione_precedente: {
    solo: boolean
    struttura: boolean
    madre: boolean
    padre: boolean
    partner: boolean
    figli: boolean
    fratelli: boolean
    nonni: boolean
    altri_parenti: boolean
    amici: boolean
  }
  figura_aiuto: {
    padre: boolean
    madre: boolean
    fratelli: boolean
    altri_parenti: boolean
    amici: boolean
    tutore: boolean
    insegnanti: boolean
    figure_sostegno: boolean
    volontari: boolean
    altri: boolean
    altri_specificare?: string
  }

  // Sezione E
  preoccupazioni_futuro: {
    pregiudizi: string
    mancanza_lavoro: string
    mancanza_aiuto: string
    mancanza_casa: string
    solitudine: string
    salute: string
    perdita_persone: string
    altro: string
    altro_specificare?: string
  }
  obiettivi_realizzabili: {
    lavoro_piacevole: string
    autonomia: string
    famiglia: string
    trovare_lavoro: string
    salute: string
    casa: string
  }
  emozioni_uscita: {
    felicita: boolean
    tristezza: boolean
    curiosita: boolean
    preoccupazione: boolean
    paura: boolean
    liberazione: boolean
    solitudine: boolean
    rabbia: boolean
    speranza: boolean
    determinazione: boolean
  }
  pronto_uscita: {
    pronto: boolean
    motivazione: string
  }
  aiuto_futuro: string
  desiderio: string
  nota_aggiuntiva: string
}