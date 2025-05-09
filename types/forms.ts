export type QuestionarioStrutture = {
  id_struttura: string
  forma_giuridica: string
  tipo_struttura: string
  anno_inizio: number
  mission: string
  personale_retribuito_uomini: number
  personale_retribuito_donne: number
  personale_volontario_uomini: number
  personale_volontario_donne: number
  figure_professionali: string[]
}

export type QuestionarioOperatori = {
  id_struttura: string
  tipo_struttura: string
  professione: string
  persone_seguite_uomini: number
  persone_seguite_donne: number
  persone_seguite_maggiorenni_uomini: number
  persone_seguite_maggiorenni_donne: number
  caratteristiche_persone_seguite: string[]
  tipo_interventi: string[]
}

export type QuestionarioGiovani = {
  percorso_autonomia: boolean
  tipo_percorso: string | null
  vive_in_struttura: boolean
  collocazione_attuale: string | null
  fattori_vulnerabilita: string[]
  sesso: string
  classe_eta: string
  luogo_nascita: string
  cittadinanza: string
  permesso_soggiorno: string | null
  tempo_in_struttura: string
  precedenti_strutture: string
  famiglia_origine: string[]
  titolo_studio: string
  attivita_precedenti: string[]
  attivita_attuali: string[]
} 