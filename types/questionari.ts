export interface QuestionarioStrutture {
  // Sezione A: Descrizione della struttura
  id_struttura: string;
  forma_giuridica: {
    tipo: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
    altro_specificare?: string;
  };
  tipo_struttura: string;
  anno_inizio: number;
  mission: string;

  // Sezione B: Informazioni sul personale
  personale_retribuito: {
    uomini: number;
    donne: number;
    totale: number; // Calcolato automaticamente
  };
  personale_volontario: {
    uomini: number;
    donne: number;
    totale: number; // Calcolato automaticamente
  };
  figure_professionali: {
    psicologi: boolean;
    assistenti_sociali: boolean;
    educatori: boolean;
    mediatori: boolean;
    medici: boolean;
    personale_infermieristico: boolean;
    insegnanti: boolean;
    operatori_religiosi: boolean;
    tutor: boolean;
    operatori_legali: boolean;
    operatori_multifunzionali: boolean;
    amministrativi: boolean;
    altro: boolean;
    altro_specificare?: string;
  };

  // Sezione C: Persone assistite
  persone_ospitate: {
    fino_16_anni: {
      uomini: number;
      donne: number;
      totale: number; // Calcolato
    };
    da_16_a_18: {
      uomini: number;
      donne: number;
      totale: number; // Calcolato
    };
    maggiorenni: {
      uomini: number;
      donne: number;
      totale: number; // Calcolato
    };
    totali: {
      uomini: number; // Calcolato
      donne: number; // Calcolato
      totale: number; // Calcolato
    };
  };

  // Caratteristiche persone ospitate (C2)
  caratteristiche_ospiti: {
    adolescenti: { // 16-18 anni
      stranieri_migranti: boolean;
      vittime_tratta: boolean;
      vittime_violenza: boolean;
      allontanati_famiglia: boolean;
      detenuti: boolean;
      ex_detenuti: boolean;
      misure_alternative: boolean;
      indigenti_senzatetto: boolean;
      rom_sinti: boolean;
      disabilita_fisica: boolean;
      disabilita_cognitiva: boolean;
      disturbi_psichiatrici: boolean;
      dipendenze: boolean;
      genitori_precoci: boolean;
      problemi_orientamento: boolean;
      altro: boolean;
      altro_specificare?: string;
    };
    giovani_adulti: { // 18-25 anni
      // stessi campi di adolescenti
      stranieri_migranti: boolean;
      vittime_tratta: boolean;
      vittime_violenza: boolean;
      allontanati_famiglia: boolean;
      detenuti: boolean;
      ex_detenuti: boolean;
      misure_alternative: boolean;
      indigenti_senzatetto: boolean;
      rom_sinti: boolean;
      disabilita_fisica: boolean;
      disabilita_cognitiva: boolean;
      disturbi_psichiatrici: boolean;
      dipendenze: boolean;
      genitori_precoci: boolean;
      problemi_orientamento: boolean;
      altro: boolean;
      altro_specificare?: string;
    };
  };

  // Persone non ospitate (C3)
  persone_non_ospitate: {
    fino_16_anni: {
      uomini: number;
      donne: number;
      totale: number; // Calcolato
    };
    da_16_a_18: {
      uomini: number;
      donne: number;
      totale: number; // Calcolato
    };
    maggiorenni: {
      uomini: number;
      donne: number;
      totale: number; // Calcolato
    };
    totali: {
      uomini: number; // Calcolato
      donne: number; // Calcolato
      totale: number; // Calcolato
    };
  };

  // Caratteristiche persone non ospitate (C4)
  caratteristiche_non_ospiti: {
    adolescenti: {
      // stessi campi di caratteristiche_ospiti.adolescenti
      stranieri_migranti: boolean;
      vittime_tratta: boolean;
      vittime_violenza: boolean;
      allontanati_famiglia: boolean;
      detenuti: boolean;
      ex_detenuti: boolean;
      misure_alternative: boolean;
      indigenti_senzatetto: boolean;
      rom_sinti: boolean;
      disabilita_fisica: boolean;
      disabilita_cognitiva: boolean;
      disturbi_psichiatrici: boolean;
      dipendenze: boolean;
      genitori_precoci: boolean;
      problemi_orientamento: boolean;
      altro: boolean;
      altro_specificare?: string;
    };
    giovani_adulti: {
      // stessi campi di caratteristiche_ospiti.giovani_adulti
      stranieri_migranti: boolean;
      vittime_tratta: boolean;
      vittime_violenza: boolean;
      allontanati_famiglia: boolean;
      detenuti: boolean;
      ex_detenuti: boolean;
      misure_alternative: boolean;
      indigenti_senzatetto: boolean;
      rom_sinti: boolean;
      disabilita_fisica: boolean;
      disabilita_cognitiva: boolean;
      disturbi_psichiatrici: boolean;
      dipendenze: boolean;
      genitori_precoci: boolean;
      problemi_orientamento: boolean;
      altro: boolean;
      altro_specificare?: string;
    };
  };

  // Sezione D: Attività
  attivita_servizi: {
    alloggio: boolean;
    vitto: boolean;
    servizi_bassa_soglia: {
      attivo: boolean;
      descrizione?: string;
    };
    ospitalita_diurna: {
      attivo: boolean;
      descrizione?: string;
    };
    supporto_psicologico: {
      attivo: boolean;
      descrizione?: string;
    };
    sostegno_autonomia: {
      attivo: boolean;
      descrizione?: string;
    };
    orientamento_lavoro: {
      attivo: boolean;
      descrizione?: string;
    };
    orientamento_formazione: {
      attivo: boolean;
      descrizione?: string;
    };
    istruzione: {
      attivo: boolean;
      descrizione?: string;
    };
    formazione_professionale: {
      attivo: boolean;
      descrizione?: string;
    };
    attivita_socializzazione: {
      attivo: boolean;
      descrizione?: string;
    };
    altro: {
      attivo: boolean;
      descrizione?: string;
    };
  };

  // Esperienze significative ultimi 3 anni
  esperienze_inserimento: {
    presenti: boolean;
    attivita?: Array<{
      nome: string;
      periodo: string;
      contenuto: string;
      destinatari: string;
      attori: string;
      punti_forza: string;
      criticita: string;
    }>;
  };

  // Attività future
  attivita_future: {
    previste: boolean;
    attivita?: Array<{
      descrizione: string;
    }>;
  };

  // Sezione E: Reti/collaborazioni
  collaborazioni: Array<{
    denominazione: string;
    tipo: 'ricorrente' | 'occasionale';
    oggetto: string;
  }>;

  network: {
    punti_forza: string;
    criticita: string;
  };
}

export type QuestionarioOperatori = {
  // Sezione A
  id_struttura: string
  tipo_struttura: string
  professione: {
    tipo: string
    altro_specificare?: string
  }

  // Sezione B
  persone_seguite: {
    totali: {
      uomini: number
      donne: number
      totale: number
    }
    maggiorenni: {
      uomini: number
      donne: number
      totale: number
    }
  }
  caratteristiche_persone: {
    stranieri_migranti: boolean
    vittime_tratta: boolean
    vittime_violenza: boolean
    allontanati_famiglia: boolean
    detenuti: boolean
    ex_detenuti: boolean
    misure_alternative: boolean
    indigenti_senzatetto: boolean
    rom_sinti: boolean
    disabilita_fisica: boolean
    disabilita_cognitiva: boolean
    disturbi_psichiatrici: boolean
    dipendenze: boolean
    genitori_precoci: boolean
    problemi_orientamento: boolean
    altro: boolean
    altro_specificare?: string
  }
  tipo_intervento: {
    formazione_istruzione: boolean
    ricerca_lavoro: boolean
    autonomia_abitativa: boolean
    rapporto_famiglia: boolean
    relazioni_coetanei: boolean
    valorizzazione_competenze: boolean
    sostegno_legale: boolean
    sostegno_sociosanitario: boolean
    mediazione_interculturale: boolean
    altro: boolean
    altro_specificare?: string
  }
  interventi_potenziare: {
    formazione_istruzione: boolean
    ricerca_lavoro: boolean
    autonomia_abitativa: boolean
    rapporto_famiglia: boolean
    relazioni_coetanei: boolean
    valorizzazione_competenze: boolean
    sostegno_legale: boolean
    sostegno_sociosanitario: boolean
    mediazione_interculturale: boolean
    nessuno: boolean
    altro: boolean
    altro_specificare?: string
  }

  // Sezione C
  difficolta_uscita: {
    problemi_economici: number
    trovare_lavoro: number
    lavori_qualita: number
    trovare_casa: number
    discriminazioni: number
    salute_fisica: number
    problemi_psicologici: number
    difficolta_linguistiche: number
    altro: number
    altro_specificare?: string
  }
}

export type QuestionarioGiovani = {
  // Sezione A: Descrizione del giovane
  percorso_autonomia: {
    presente: boolean
    tipo?: string
  }
  vive_in_struttura: boolean
  collocazione_attuale: {
    tipo: '1' | '2' | '3' | '4' | '5'  // 1-5 come da elenco
    comunita_specificare?: string
  }
  fattori_vulnerabilita: {
    stranieri_migranti: boolean
    vittime_tratta: boolean
    vittime_violenza: boolean
    allontanati_famiglia: boolean
    detenuti: boolean
    ex_detenuti: boolean
    misure_alternative: boolean
    indigenti_senzatetto: boolean
    rom_sinti: boolean
    disabilita_fisica: boolean
    disabilita_cognitiva: boolean
    disturbi_psichiatrici: boolean
    dipendenze: boolean
    genitori_precoci: boolean
    problemi_orientamento: boolean
    altro: boolean
    altro_specificare?: string
  }

  // Sezione B: Domande socio-anagrafiche
  sesso: '1' | '2' | '3'  // 1=maschio, 2=femmina, 3=altro
  classe_eta: '1' | '2' | '3' | '4'  // 1=18-21, 2=22-24, 3=25-27, 4=28-34
  luogo_nascita: {
    italia: boolean
    altro_paese?: string
  }
  cittadinanza: {
    tipo: '1' | '2' | '3'  // 1=italiana, 2=UE, 3=extraUE
    permesso_soggiorno?: '1' | '2' | '3'  // 1=con permesso, 2=in attesa, 3=senza
  }
  tempo_in_struttura: '1' | '2' | '3' | '4'  // 1=<6mesi, 2=6m-1a, 3=1-3a, 4=>3a
  strutture_precedenti: '1' | '2' | '3'  // 1=mai, 2=una volta, 3=più volte
  famiglia_origine: {
    padre: boolean
    madre: boolean
    fratelli_sorelle: boolean
    nonni: boolean
    altri_parenti: boolean
    altri_conviventi: boolean
  }
  madre: {
    titolo_studio: '1' | '2' | '3' | '4' | '5' | '9'  // 1-5 come da elenco, 9=non so
    condizione: '1' | '2' | '3' | '4' | '9'  // 1=lavoro stabile, 2=saltuario, 3=non lavora, 4=pensionata, 9=non so
  }
  padre: {
    titolo_studio: '1' | '2' | '3' | '4' | '5' | '9'
    condizione: '1' | '2' | '3' | '4' | '9'
  }

  // Sezione C: Formazione e lavoro
  titolo_studio: '1' | '2' | '3' | '4' | '5' | '6'  // 1-6 come da elenco
  attivita_precedenti: {
    studio: boolean
    lavoro_stabile: boolean
    lavoro_saltuario: boolean
    formazione: boolean
    altro: boolean
    nessuna: boolean
    altro_specificare?: string
  }
  orientamento_lavoro: {
    usufruito: boolean
    dove?: {
      scuola_universita: boolean
      enti_formazione: boolean
      servizi_impiego: boolean
      struttura_attuale: boolean
      altro: boolean
      altro_specificare?: string
    }
    utilita?: '1' | '2' | '3' | '4'  // 1=per niente, 2=poco, 3=abbastanza, 4=molto
  }
  attivita_attuali: {
    studio: boolean
    formazione: boolean
    lavoro: boolean
    ricerca_lavoro: boolean
    nessuna: boolean
  }
  motivo_non_studio?: '1' | '2' | '3' | '4'  // 1-4 come da elenco
  corso_attuale?: string
  lavoro_attuale?: string
  utilita_attivita: {
    studio?: '0' | '1' | '2' | '3'  // 0=per niente, 1=poco, 2=abbastanza, 3=molto
    formazione?: '0' | '1' | '2' | '3'
    lavoro?: '0' | '1' | '2' | '3'
    ricerca_lavoro?: '0' | '1' | '2' | '3'
  }
  ricerca_lavoro: {
    centro_impiego: boolean
    sportelli_orientamento: boolean
    inps_patronati: boolean
    servizi_sociali: boolean
    agenzie_interinali: boolean
    cooperative_sociali: boolean
    struttura_ospitante: boolean
    amici_parenti: boolean
    portali_online: boolean
    social_network: boolean
    altro: boolean
    altro_specificare?: string
  }
  curriculum_vitae: boolean
  centro_impiego: boolean
  lavoro_autonomo: boolean
  importanza_lavoro: {
    stabilita: '0' | '1' | '2' | '3'
    flessibilita: '0' | '1' | '2' | '3'
    valorizzazione: '0' | '1' | '2' | '3'
    retribuzione: '0' | '1' | '2' | '3'
    fatica: '0' | '1' | '2' | '3'
    sicurezza: '0' | '1' | '2' | '3'
    utilita_sociale: '0' | '1' | '2' | '3'
    vicinanza: '0' | '1' | '2' | '3'
  }

  // Sezione D: Area relazionale
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
  figure_aiuto: {
    padre: boolean
    madre: boolean
    fratelli: boolean
    parenti: boolean
    amici: boolean
    tutore: boolean
    insegnanti: boolean
    figure_sostegno: boolean
    volontari: boolean
    altri: boolean
    altri_specificare?: string
  }

  // Sezione E: Area personale
  preoccupazioni_futuro: {
    pregiudizi: '0' | '1' | '2' | '3'
    mancanza_lavoro: '0' | '1' | '2' | '3'
    mancanza_aiuto: '0' | '1' | '2' | '3'
    mancanza_casa: '0' | '1' | '2' | '3'
    solitudine: '0' | '1' | '2' | '3'
    salute: '0' | '1' | '2' | '3'
    perdita_persone: '0' | '1' | '2' | '3'
    altro: '0' | '1' | '2' | '3'
    altro_specificare?: string
  }
  obiettivi_realizzabili: {
    lavoro_piacevole: '0' | '1' | '2' | '3' | '9'
    autonomia: '0' | '1' | '2' | '3' | '9'
    famiglia: '0' | '1' | '2' | '3' | '9'
    trovare_lavoro: '0' | '1' | '2' | '3' | '9'
    salute: '0' | '1' | '2' | '3' | '9'
    casa: '0' | '1' | '2' | '3' | '9'
  }
  aiuto_futuro?: string
  pronto_uscita: {
    risposta: boolean
    motivazione?: string
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
  desiderio?: string
  note_aggiuntive?: string
} 