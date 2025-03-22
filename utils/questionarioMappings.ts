export const MAPPINGS = {
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
    "0": "Per niente",
    "1": "Poco",
    "2": "Abbastanza",
    "3": "Molto"
  }
}

export const formatQuestionarioData = (questionario: any) => {
  return {
    ...questionario,
    sesso: MAPPINGS.sesso[questionario.sesso] || questionario.sesso,
    classe_eta: MAPPINGS.classe_eta[questionario.classe_eta] || questionario.classe_eta,
    cittadinanza: MAPPINGS.cittadinanza[questionario.cittadinanza] || questionario.cittadinanza,
    titolo_studio: MAPPINGS.titolo_studio[questionario.titolo_studio] || questionario.titolo_studio,
    // ... altri mapping simili
  }
} 