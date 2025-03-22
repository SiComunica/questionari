export interface QuestionarioData {
  id: string
  created_at: string
  fonte: string
  stato: string
  sesso: string
  classe_eta: string
  cittadinanza: string
  titolo_studio: string
  percorso_autonomia: boolean
  tipo_percorso: string
  vive_in_struttura: boolean
  collocazione_attuale: string
  fattori_vulnerabilita: string[]
  attivita_precedenti: string[]
  attivita_attuali: string[]
  [key: string]: any
}

type MappingValue = {
  [key: string]: string
}

type Mappings = {
  sesso: MappingValue
  classe_eta: MappingValue
  cittadinanza: MappingValue
  titolo_studio: MappingValue
  valutazione: MappingValue
}

export const MAPPINGS: Mappings = {
  sesso: {
    "1": "Maschio",
    "2": "Femmina",
    "3": "Altro"
  },
  classe_eta: {
    "1": "18-21",
    "2": "22-24",
    "3": "25-28",
    "4": "Oltre 28"
  },
  cittadinanza: {
    "1": "Italiana",
    "2": "Comunitaria",
    "3": "Extracomunitaria"
  },
  titolo_studio: {
    "1": "Nessun titolo",
    "2": "Licenza elementare",
    "3": "Licenza media",
    "4": "Qualifica professionale",
    "5": "Diploma superiore",
    "6": "Laurea"
  },
  valutazione: {
    1: "Per niente",
    2: "Poco",
    3: "Abbastanza",
    4: "Molto"
  }
}

export const formatQuestionarioData = (questionario: QuestionarioData): QuestionarioData => {
  return {
    ...questionario,
    sesso: MAPPINGS.sesso[questionario.sesso] || questionario.sesso,
    classe_eta: MAPPINGS.classe_eta[questionario.classe_eta] || questionario.classe_eta,
    cittadinanza: MAPPINGS.cittadinanza[questionario.cittadinanza] || questionario.cittadinanza,
    titolo_studio: MAPPINGS.titolo_studio[questionario.titolo_studio] || questionario.titolo_studio,
  }
} 