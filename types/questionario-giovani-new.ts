export type Sesso = "1" | "2" | "3"
export type ClasseEta = "1" | "2" | "3" | "4"
export type Cittadinanza = "1" | "2" | "3"
export type PermessoSoggiorno = "1" | "2" | "3" | undefined
export type TempoStruttura = "1" | "2" | "3" | "4"
export type LivelloIstruzione = "1" | "2" | "3" | "4" | "5" | "6"
export type ValutazioneUtilita = "0" | "1" | "2" | "3"
export type ValutazionePreoccupazione = "0" | "1" | "2" | "3"
export type ValutazioneObiettivo = "0" | "1" | "2" | "3" | "9"
export type CollocazioneAttuale = "1" | "2" | "3" | "4" | "5"
export type PrecedentiStrutture = "1" | "2" | "3"

export interface QuestionarioData {
  percorso_autonomia: {
    presente: boolean
    tipo: string
  }
  vive_struttura: boolean
  collocazione_attuale: {
    tipo: CollocazioneAttuale
    comunita_specificare?: string
  }
  fattori_vulnerabilita: {
    stranieri: boolean
    vittime_tratta: boolean
    vittime_violenza: boolean
    allontanati_famiglia: boolean
    detenuti: boolean
    ex_detenuti: boolean
    esecuzione_penale: boolean
    indigenti: boolean
    rom_sinti: boolean
    disabilita_fisica: boolean
    disabilita_cognitiva: boolean
    disturbi_psichiatrici: boolean
    dipendenze: boolean
    genitori_precoci: boolean
    orientamento_sessuale: boolean
    altro: boolean
    altro_specificare?: string
  }
  sesso: Sesso
  classe_eta: ClasseEta
  luogo_nascita: {
    italia: boolean
    altro_paese: string
  }
  cittadinanza: Cittadinanza
  permesso_soggiorno: PermessoSoggiorno
  tempo_struttura: TempoStruttura
  precedenti_strutture: PrecedentiStrutture
  livello_istruzione: LivelloIstruzione
  attivita_precedenti: {
    studiavo: boolean
    lavoravo_stabilmente: boolean
    lavoravo_saltuariamente: boolean
    corso_formazione: boolean
    altro: boolean
    nessuna: boolean
    altro_specificare?: string
  }
  attivita_attuali: {
    studio: boolean
    formazione: boolean
    lavoro: boolean
    ricerca_lavoro: boolean
    nessuna: boolean
  }
  orientamento_lavoro: {
    usufruito: boolean
    dove: {
      scuola_universita: boolean
      enti_formazione: boolean
      servizi_impiego: boolean
      struttura: boolean
      altro: boolean
      altro_specificare?: string
    }
    utilita: ValutazioneUtilita
  }
  lavoro: {
    presente: boolean
    tipo_contratto?: string
    settore?: string
  }
  aspetti_lavoro: {
    stabilita: ValutazionePreoccupazione
    flessibilita: ValutazionePreoccupazione
    valorizzazione: ValutazionePreoccupazione
    retribuzione: ValutazionePreoccupazione
    fatica: ValutazionePreoccupazione
    sicurezza: ValutazionePreoccupazione
    utilita_sociale: ValutazionePreoccupazione
    vicinanza_casa: ValutazionePreoccupazione
  }
  ricerca_lavoro: {
    centro_impiego: boolean
    sportelli: boolean
    inps_patronati: boolean
    servizi_sociali: boolean
    agenzie_interinali: boolean
    cooperative: boolean
    struttura: boolean
    conoscenti: boolean
    portali_online: boolean
    social: boolean
    altro: boolean
    altro_specificare?: string
  }
} 