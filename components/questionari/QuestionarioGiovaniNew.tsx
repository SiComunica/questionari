'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-hot-toast"
import { 
  QuestionarioGiovani,
  Sesso, 
  ClasseEta, 
  Cittadinanza, 
  PermessoSoggiorno, 
  TempoStruttura, 
  TitoloStudio,
  ValutazioneUtilita,
  ValutazionePreoccupazione,
  CollocazioneAttuale,
  TitoloStudioGenitori,
  LavoroGenitori
} from '@/types/questionario-giovani'

// Costanti per le opzioni
const TIPI_PERCORSO = [
  'Formazione professionale',
  'Scuola superiore',
  'Università',
  'Tirocinio',
  'Lavoro',
  'Altro'
]

const SESSO_OPTIONS = [
  { value: "1", label: "Maschio" },
  { value: "2", label: "Femmina" },
  { value: "3", label: "Altro" }
]

const CLASSE_ETA_OPTIONS = [
  { value: "1", label: "18-21" },
  { value: "2", label: "22-24" },
  { value: "3", label: "25-28" },
  { value: "4", label: "Oltre 28" }
]

const CITTADINANZA_OPTIONS = [
  { value: "1", label: "Italiana" },
  { value: "2", label: "Comunitaria" },
  { value: "3", label: "Extracomunitaria" }
]

const TITOLO_STUDIO_OPTIONS = [
  { value: "1", label: "Nessun titolo" },
  { value: "2", label: "Licenza elementare" },
  { value: "3", label: "Licenza media" },
  { value: "4", label: "Qualifica professionale" },
  { value: "5", label: "Diploma superiore" },
  { value: "6", label: "Laurea" }
]

const VALUTAZIONE_OPTIONS = [
  { value: "0", label: "Per niente" },
  { value: "1", label: "Poco" },
  { value: "2", label: "Abbastanza" },
  { value: "3", label: "Molto" }
]

const ATTIVITA_PRECEDENTI = [
  { id: 'studiavo', label: 'Studiavo' },
  { id: 'lavoravo_stabilmente', label: 'Lavoravo stabilmente' },
  { id: 'lavoravo_saltuariamente', label: 'Lavoravo saltuariamente' },
  { id: 'corso_formazione', label: 'Frequentavo un corso di formazione' },
  { id: 'altro', label: 'Altro' },
  { id: 'nessuna', label: 'Nessuna' }
]

const ATTIVITA_ATTUALI = [
  { id: 'studio', label: 'Studio' },
  { id: 'formazione', label: 'Formazione professionale' },
  { id: 'lavoro', label: 'Lavoro' },
  { id: 'ricerca_lavoro', label: 'Ricerca lavoro' },
  { id: 'nessuna', label: 'Nessuna' }
]

const LUOGHI_ORIENTAMENTO = [
  { id: 'scuola_universita', label: 'Scuola/Università' },
  { id: 'enti_formazione', label: 'Enti di formazione' },
  { id: 'servizi_impiego', label: 'Servizi per l\'impiego' },
  { id: 'struttura', label: 'Struttura/progetto di accoglienza' },
  { id: 'altro', label: 'Altro' }
]

const CANALI_RICERCA = [
  { id: 'centro_impiego', label: 'Centro per l\'impiego' },
  { id: 'sportelli', label: 'Sportelli lavoro' },
  { id: 'inps_patronati', label: 'INPS/Patronati' },
  { id: 'servizi_sociali', label: 'Servizi sociali' },
  { id: 'agenzie_interinali', label: 'Agenzie interinali' },
  { id: 'cooperative', label: 'Cooperative' },
  { id: 'struttura', label: 'Struttura/progetto di accoglienza' },
  { id: 'conoscenti', label: 'Conoscenti' },
  { id: 'portali_online', label: 'Portali online' },
  { id: 'social', label: 'Social network' },
  { id: 'altro', label: 'Altro' }
]

const ASPETTI_LAVORO = [
  { id: 'stabilita', label: 'Stabilità del posto di lavoro' },
  { id: 'flessibilita', label: 'Flessibilità oraria' },
  { id: 'valorizzazione', label: 'Valorizzazione competenze' },
  { id: 'retribuzione', label: 'Retribuzione' },
  { id: 'fatica', label: 'Fatica fisica' },
  { id: 'sicurezza', label: 'Sicurezza sul lavoro' },
  { id: 'utilita_sociale', label: 'Utilità sociale' },
  { id: 'vicinanza_casa', label: 'Vicinanza a casa' }
]

const initialData: QuestionarioGiovani = {
  // Metadati
  id: undefined,
  creato_a: undefined,
  creato_da: undefined,

  // Sezione A
  percorso_autonomia: false,
  tipo_percorso: '',
  vivere_in_struttura: false,
  collocazione_attuale: "1",
  fattori_vulnerabilita: {
    fv1_stranieri: false,
    fv2_vittime_tratta: false,
    fv3_vittime_violenza: false,
    fv4_allontanati_famiglia: false,
    fv5_detenuti: false,
    fv6_ex_detenuti: false,
    fv7_esecuzione_penale: false,
    fv8_indigenti: false,
    fv9_rom_sinti: false,
    fv10_disabilita_fisica: false,
    fv11_disabilita_cognitiva: false,
    fv12_disturbi_psichiatrici: false,
    fv13_dipendenze: false,
    fv14_genitori_precoci: false,
    fv15_orientamento_sessuale: false,
    fv16_altro: false,
    fv16_spec: ''
  },

  // Sezione B
  sesso: "1",
  classe_eta: "1",
  luogo_nascita: {
    italia: false,
    altro_paese: ''
  },
  cittadinanza: "1",
  permesso_soggiorno: "1",
  tempo_in_struttura: "1",
  precedenti_strutture: "1",
  
  famiglia_origine: {
    padre: false,
    madre: false,
    fratelli_sorelle: false,
    nonni: false,
    altri_parenti: false,
    altri_conviventi: false
  },
  
  madre: {
    titolo_studio: "1",
    lavoro: "1"
  },
  
  padre: {
    titolo_studio: "1",
    lavoro: "1"
  },

  // Sezione C
  titolo_studio: "1",
  attivita_precedenti: {
    studiavo: false,
    lavoravo_stabilmente: false,
    lavoravo_saltuariamente: false,
    corso_formazione: false,
    altro: false,
    altro_specificare: ''
  },
  attivita_attuali: {
    studio: false,
    lavoro: false,
    tirocinio: false,
    nessuna: false
  },
  motivi_non_studio: [],
  corso_formazione: {
    presente: false,
    descrizione: ''
  },
  orientamento_lavoro: {
    usufruito: false,
    utilita: "0",
    dove: {
      scuola_universita: false,
      enti_formazione: false,
      servizi_impiego: false,
      struttura: false,
      altro: false
    }
  },
  orientamento_luoghi: [],
  ricerca_lavoro: {
    centro_impiego: false,
    sportelli: false,
    inps_patronati: false,
    servizi_sociali: false,
    agenzie_interinali: false,
    cooperative: false,
    struttura: false,
    conoscenti: false,
    portali_online: false,
    social: false,
    altro: false,
    altro_specificare: ''
  },
  lavoro_attuale: {
    presente: false,
    descrizione: ''
  },
  curriculum_vitae: '',
  centro_impiego: '',
  lavoro_autonomo: '',
  aspetti_lavoro: {
    stabilita: "0",
    flessibilita: "0",
    valorizzazione: "0",
    retribuzione: "0",
    fatica: "0",
    sicurezza: "0",
    utilita_sociale: "0",
    vicinanza_casa: "0"
  },
  condizioni_lavoro: [],
  livelli_utilità: [],
  livelli_obiettivi: [],

  // Sezione D
  abitazione_precedente: {
    solo: false,
    struttura: false,
    madre: false,
    padre: false,
    partner: false,
    figli: false,
    fratelli: false,
    nonni: false,
    altri_parenti: false,
    amici: false
  },
  figura_aiuto: {
    padre: false,
    madre: false,
    fratelli: false,
    altri_parenti: false,
    amici: false,
    tutore: false,
    insegnanti: false,
    figure_sostegno: false,
    volontari: false,
    altri: false,
    altri_specificare: ''
  },

  // Sezione E
  preoccupazioni_futuro: {
    pregiudizi: "0",
    mancanza_lavoro: "0",
    mancanza_aiuto: "0",
    mancanza_casa: "0",
    solitudine: "0",
    salute: "0",
    perdita_persone: "0",
    altro: "0",
    altro_specificare: ''
  },
  obiettivi_realizzabili: {
    lavoro_piacevole: "0",
    autonomia: "0",
    famiglia: "0",
    trovare_lavoro: "0",
    salute: "0",
    casa: "0"
  },
  emozioni_uscita: {
    felicita: false,
    tristezza: false,
    curiosita: false,
    preoccupazione: false,
    paura: false,
    liberazione: false,
    solitudine: false,
    rabbia: false,
    speranza: false,
    determinazione: false
  },
  pronto_uscita: {
    pronto: false,
    motivazione: ''
  },
  aiuto_futuro: '',
  desiderio: '',
  nota_aggiuntiva: ''
}

// Modifica la funzione checkboxToArray per gestire i tipi specifici
const checkboxToArray = (obj: Record<string, any> | string[]): string[] => {
  if (Array.isArray(obj)) {
    return obj
  }
  return Object.entries(obj)
    .filter(([key, value]) => value === true && key !== 'altro' && key !== 'altro_specificare')
    .map(([key]) => key)
}

export default function QuestionarioGiovaniNew() {
  const router = useRouter()
  const { session } = useAuth()
  const [formData, setFormData] = useState<QuestionarioGiovani>(initialData)
  const [loading, setLoading] = useState(false)

  // Aggiorna l'handler per radio button
  const handleRadioChange = (
    field: keyof QuestionarioGiovani,
    value: QuestionarioGiovani[keyof QuestionarioGiovani]
  ) => {
    setFormData((prev: QuestionarioGiovani) => ({
      ...prev,
      [field]: value
    }))
  }

  // Aggiorna l'handler per campi booleani nidificati
  const handleNestedBooleanChange = (
    section: keyof QuestionarioGiovani,
    field: string,
    checked: boolean
  ) => {
    setFormData((prev: QuestionarioGiovani) => {
      const currentSection = prev[section] as Record<string, boolean>
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: checked
        }
      }
    })
  }

  // Aggiorna l'handler per campi nidificati
  const handleNestedChange = <
    T extends keyof QuestionarioGiovani,
    K extends keyof QuestionarioGiovani[T]
  >(
    section: T,
    field: K,
    value: QuestionarioGiovani[T][K]
  ) => {
    setFormData((prev: QuestionarioGiovani) => {
      const currentSection = prev[section] as Record<string, any>
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      }
    })
  }

  // Aggiorna l'handler per campi di testo
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: QuestionarioGiovani) => ({
      ...prev,
      [name]: value
    }))
  }

  // Correggi il riferimento a lavoro -> lavoro_attuale
  const handleLavoroChange = (presente: boolean) => {
    setFormData(prev => ({
      ...prev,
      lavoro_attuale: {
        ...prev.lavoro_attuale,
        presente
      }
    }))
  }

  // Aggiungiamo un handler specifico per orientamento_lavoro.dove
  const handleOrientamentoChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      orientamento_lavoro: {
        ...prev.orientamento_lavoro,
        dove: {
          ...prev.orientamento_lavoro.dove,
          [id]: checked
        }
      }
    }))
  }

  // Aggiungiamo un handler specifico per aspetti_lavoro
  const handleAspettiLavoroChange = (
    aspetto: keyof QuestionarioGiovani['aspetti_lavoro'], 
    value: ValutazionePreoccupazione
  ) => {
    setFormData(prev => ({
      ...prev,
      aspetti_lavoro: {
        ...prev.aspetti_lavoro,
        [aspetto]: value
      }
    }))
  }

  // Aggiungi questo nuovo handler per i campi stringa diretti
  const handleStringChange = (field: keyof QuestionarioGiovani, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Modifica handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabaseData = {
        ...formData,
        // Converti i campi in array usando unknown come tipo intermedio
        fattori_vulnerabilita: checkboxToArray(formData.fattori_vulnerabilita as unknown as Record<string, boolean>),
        attivita_precedenti: checkboxToArray(formData.attivita_precedenti as unknown as Record<string, boolean>),
        attivita_attuali: checkboxToArray(formData.attivita_attuali as unknown as Record<string, boolean>),
        ricerca_lavoro: checkboxToArray(formData.ricerca_lavoro as unknown as Record<string, boolean>),
        orientamento_luoghi: checkboxToArray(formData.orientamento_luoghi as unknown as Record<string, boolean>),
        
        // Aggiungi i metadati
        creato_a: new Date().toISOString(),
        creato_da: session?.user.id || 'anonymous',
        
        // Converti i livelli in array se necessario
        livelli_utilità: Object.values(formData.livelli_utilità),
        livelli_obiettivi: Object.values(formData.livelli_obiettivi),
        
        // Assicurati che i campi jsonb siano oggetti validi
        famiglia_origine: JSON.stringify(formData.famiglia_origine),
        madre: JSON.stringify(formData.madre),
        padre: JSON.stringify(formData.padre),
        abitazione_precedente: JSON.stringify(formData.abitazione_precedente),
        figura_aiuto: JSON.stringify(formData.figura_aiuto),
        emozioni_uscita: JSON.stringify(formData.emozioni_uscita),
        preoccupazioni_futuro: JSON.stringify(formData.preoccupazioni_futuro),
        obiettivi_realizzabili: JSON.stringify(formData.obiettivi_realizzabili),
        pronto_uscita: JSON.stringify(formData.pronto_uscita),
        orientamento_lavoro: JSON.stringify(formData.orientamento_lavoro),
        aspetti_lavoro: JSON.stringify(formData.aspetti_lavoro),
        corso_formazione: JSON.stringify(formData.corso_formazione.presente ? { id: formData.corso_formazione.descrizione } : null),
        lavoro_attuale: JSON.stringify(formData.lavoro_attuale)
      }

      const { error } = await supabase
        .from('giovani')
        .insert(supabaseData)

      if (error) throw error
      
      // Mostra messaggio di successo
      toast.success('Questionario inviato con successo')
      
      router.push('/success')
    } catch (error) {
      console.error(error)
      toast.error('Errore durante l\'invio del questionario')
    } finally {
      setLoading(false)
    }
  }

  // Modifica la gestione delle attività attuali
  const handleAttivitaAttualiChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      attivita_attuali: {
        ...prev.attivita_attuali,
        [id]: checked
      }
    }))
  }

  // Aggiungi questa funzione handleChange insieme agli altri handler
  const handleChange = (field: keyof QuestionarioGiovani, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent>
          {/* Sezione A */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">SEZIONE A: Descrizione del giovane</h2>
            {/* ... contenuto sezione A ... */}
          </div>

          {/* Sezione B */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">B. Dati personali</h3>
            {/* ... contenuto sezione B ... */}
          </div>

          {/* Sezione C */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">C. Formazione e lavoro</h3>
            {/* ... contenuto sezione C ... */}
          </div>

          {/* Sezione D */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">D. Area relazionale</h3>
            {/* ... contenuto sezione D ... */}
          </div>

          {/* Sezione E */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">E. Area personale</h3>
            {/* ... contenuto sezione E ... */}
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Invio in corso...' : 'Invia questionario'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}