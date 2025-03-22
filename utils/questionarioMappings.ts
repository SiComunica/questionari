export interface QuestionarioGiovani {
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
}

export interface QuestionarioOperatori {
  id: string
  created_at: string
  fonte: string
  stato: string
  id_struttura: string
  tipo_struttura: string
  professione: string
  professione_altro: string
  persone_seguite: {
    uomini: number
    donne: number
    totale: number
  }
  persone_maggiorenni: {
    uomini: number
    donne: number
    totale: number
  }
  caratteristiche_persone: string[]
  caratteristiche_altro: string
  tipo_intervento: string[]
  intervento_altro: string
  difficolta_uscita: {
    [key: string]: number
  }
  difficolta_altro_spec: string
}

export interface QuestionarioStrutture {
  id: string
  created_at: string
  fonte: string
  stato: string
  id_struttura: string
  forma_giuridica: string
  forma_giuridica_altro: string
  tipo_struttura: string
  anno_inizio: string
  missione: string
  personale_retribuito: {
    uomini: number
    donne: number
    totale: number
  }
  personale_volontario: {
    uomini: number
    donne: number
    totale: number
  }
  figure_professionali: string[]
  figure_professionali_altro: string
}

export type QuestionarioData = QuestionarioGiovani | QuestionarioOperatori | QuestionarioStrutture

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
    'M': 'Maschio',
    'F': 'Femmina',
    'A': 'Altro'
  },
  classe_eta: {
    '1': '18-24',
    '2': '25-29',
    '3': '30-34'
  },
  cittadinanza: {
    '1': 'Italiana',
    '2': 'UE',
    '3': 'Extra UE'
  },
  titolo_studio: {
    '1': 'Nessuno',
    '2': 'Licenza elementare',
    '3': 'Licenza media',
    '4': 'Diploma',
    '5': 'Laurea'
  },
  valutazione: {
    '1': 'Per niente',
    '2': 'Poco',
    '3': 'Abbastanza',
    '4': 'Molto'
  }
}

export const formatQuestionarioData = (questionario: any) => {
  switch (questionario.tipo) {
    case 'giovani':
      return {
        ...questionario,
        sesso: MAPPINGS.sesso[questionario.sesso] || questionario.sesso,
        classe_eta: MAPPINGS.classe_eta[questionario.classe_eta] || questionario.classe_eta,
        cittadinanza: MAPPINGS.cittadinanza[questionario.cittadinanza] || questionario.cittadinanza,
        titolo_studio: MAPPINGS.titolo_studio[questionario.titolo_studio] || questionario.titolo_studio
      };
    case 'operatori':
      return questionario;
    case 'strutture':
      return questionario;
    default:
      return questionario;
  }
}; 