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
import type { Database } from '@/types/database'
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
            <p className="text-sm italic">
              [preliminare all'intervista. Da compilare sulla base di informazioni fornite dagli operatori]
            </p>

            {/* Percorso Autonomia */}
            <div className="space-y-4">
              <Label>Il/la giovane è in un percorso per l'autonomia?</Label>
              <RadioGroup
                value={formData.percorso_autonomia ? "1" : "0"}
                onValueChange={(value) => 
                  setFormData(prev => ({
                    ...prev,
                    percorso_autonomia: value === "1"
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="percaut-no" />
                  <Label htmlFor="percaut-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="percaut-si" />
                  <Label htmlFor="percaut-si">Sì</Label>
                </div>
              </RadioGroup>

              {formData.percorso_autonomia && (
                <div className="space-y-2">
                  <Label htmlFor="percaut-spec">
                    Specificare il tipo di percorso o di presa in carico
                  </Label>
                  <Input
                    id="percaut-spec"
                    value={formData.tipo_percorso}
                    onChange={(e) => 
                      setFormData(prev => ({
                        ...prev,
                        tipo_percorso: e.target.value
                      }))
                    }
                  />
                </div>
              )}
            </div>

            {/* Vive in struttura */}
            <div className="space-y-4">
              <Label>La persona vive stabilmente presso la struttura?</Label>
              <RadioGroup
                value={formData.vivere_in_struttura ? "1" : "0"}
                onValueChange={(value) => 
                  setFormData(prev => ({
                    ...prev,
                    vivere_in_struttura: value === "1"
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="vive-no" />
                  <Label htmlFor="vive-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="vive-si" />
                  <Label htmlFor="vive-si">Sì</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Collocazione attuale */}
            <div className="space-y-4">
              <Label>Collocazione attuale del/della giovane</Label>
              <RadioGroup
                value={formData.collocazione_attuale}
                onValueChange={(value) => handleRadioChange('collocazione_attuale', value as CollocazioneAttuale)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="coll-1" />
                  <Label htmlFor="coll-1">Ospite di centri antiviolenza</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="coll-2" />
                  <Label htmlFor="coll-2">Ospite di strutture per stranieri</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="coll-3" />
                  <Label htmlFor="coll-3">Ospite di strutture sanitarie</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="coll-4" />
                  <Label htmlFor="coll-4">Ospite di altro tipo di struttura</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="coll-5" />
                  <Label htmlFor="coll-5">Ospite di comunità</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Fattori di vulnerabilità */}
            <div className="space-y-4">
              <Label>Fattori di vulnerabilità del giovane</Label>
              <div className="space-y-2">
                <p className="font-medium">[barrare tutte le caselle pertinenti]</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv1"
                      checked={formData.fattori_vulnerabilita.fv1_stranieri}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv1_stranieri', checked === true)}
                    />
                    <Label htmlFor="fv1">FV.1 Stranieri con problemi legati alla condizione migratoria</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv2"
                      checked={formData.fattori_vulnerabilita.fv2_vittime_tratta}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv2_vittime_tratta', checked === true)}
                    />
                    <Label htmlFor="fv2">FV.2 Vittime di tratta</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv3"
                      checked={formData.fattori_vulnerabilita.fv3_vittime_violenza}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv3_vittime_violenza', checked === true)}
                    />
                    <Label htmlFor="fv3">FV.3 Vittime di violenza domestica</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv4"
                      checked={formData.fattori_vulnerabilita.fv4_allontanati_famiglia}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv4_allontanati_famiglia', checked === true)}
                    />
                    <Label htmlFor="fv4">FV.4 Persone allontanate dalla famiglia</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv5"
                      checked={formData.fattori_vulnerabilita.fv5_detenuti}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv5_detenuti', checked === true)}
                    />
                    <Label htmlFor="fv5">FV.5 Detenuti</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv6"
                      checked={formData.fattori_vulnerabilita.fv6_ex_detenuti}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv6_ex_detenuti', checked === true)}
                    />
                    <Label htmlFor="fv6">FV.6 Ex detenuti</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv7"
                      checked={formData.fattori_vulnerabilita.fv7_esecuzione_penale}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv7_esecuzione_penale', checked === true)}
                    />
                    <Label htmlFor="fv7">FV.7 Persone in esecuzione penale esterna/misura alternativa alla detenzione</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv8"
                      checked={formData.fattori_vulnerabilita.fv8_indigenti}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv8_indigenti', checked === true)}
                    />
                    <Label htmlFor="fv8">FV.8 Indigenti e/o senza dimora</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv9"
                      checked={formData.fattori_vulnerabilita.fv9_rom_sinti}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv9_rom_sinti', checked === true)}
                    />
                    <Label htmlFor="fv9">FV.9 Rom e Sinti</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv10"
                      checked={formData.fattori_vulnerabilita.fv10_disabilita_fisica}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv10_disabilita_fisica', checked === true)}
                    />
                    <Label htmlFor="fv10">FV.10 Persone con disabilità fisica</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv11"
                      checked={formData.fattori_vulnerabilita.fv11_disabilita_cognitiva}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv11_disabilita_cognitiva', checked === true)}
                    />
                    <Label htmlFor="fv11">FV.11 Persone con disabilità cognitiva</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv12"
                      checked={formData.fattori_vulnerabilita.fv12_disturbi_psichiatrici}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv12_disturbi_psichiatrici', checked === true)}
                    />
                    <Label htmlFor="fv12">FV.12 Persone con disturbi psichiatrici</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv13"
                      checked={formData.fattori_vulnerabilita.fv13_dipendenze}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv13_dipendenze', checked === true)}
                    />
                    <Label htmlFor="fv13">FV.13 Persone con dipendenze</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv14"
                      checked={formData.fattori_vulnerabilita.fv14_genitori_precoci}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv14_genitori_precoci', checked === true)}
                    />
                    <Label htmlFor="fv14">FV.14 Genitori precoci</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv15"
                      checked={formData.fattori_vulnerabilita.fv15_orientamento_sessuale}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv15_orientamento_sessuale', checked === true)}
                    />
                    <Label htmlFor="fv15">FV.15 Persone con problemi legati all'orientamento sessuale</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fv16"
                      checked={formData.fattori_vulnerabilita.fv16_altro}
                      onCheckedChange={(checked) => 
                        handleNestedBooleanChange('fattori_vulnerabilita', 'fv16_altro', checked === true)}
                    />
                    <Label htmlFor="fv16">FV.16 Altro</Label>
                  </div>
                </div>
                
                {formData.fattori_vulnerabilita.fv16_altro && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      placeholder="Specificare la voce 'Altro'"
                      value={formData.fattori_vulnerabilita.fv16_spec}
                      onChange={(e) => 
                        handleNestedChange('fattori_vulnerabilita', 'fv16_spec', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sezione B */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">B. Dati personali</h3>
            
            {/* B1. Sesso */}
            <div className="space-y-4">
              <Label>B1. Sesso</Label>
              <RadioGroup
                value={formData.sesso}
                onValueChange={(value) => handleRadioChange('sesso', value as Sesso)}
              >
                <div className="space-y-2">
                  {SESSO_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`sesso-${option.value}`} />
                      <Label htmlFor={`sesso-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* B2. Classe di età */}
            <div className="space-y-4">
              <Label>B2. Classe di età</Label>
              <RadioGroup
                value={formData.classe_eta}
                onValueChange={(value) => handleRadioChange('classe_eta', value as ClasseEta)}
              >
                <div className="space-y-2">
                  {CLASSE_ETA_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`eta-${option.value}`} />
                      <Label htmlFor={`eta-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* B3. Luogo di nascita */}
            <div className="space-y-4">
              <Label>B3. Luogo di nascita</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="luogo_nascita_italia"
                    checked={formData.luogo_nascita.italia}
                    onChange={(e) => handleNestedBooleanChange('luogo_nascita', 'italia', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="luogo_nascita_italia">Italia</Label>
                </div>
                {!formData.luogo_nascita.italia && (
                  <Input
                    type="text"
                    placeholder="Specificare il paese"
                    value={formData.luogo_nascita.altro_paese}
                    onChange={(e) => handleNestedChange('luogo_nascita', 'altro_paese', e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {/* B4. Cittadinanza */}
            <div className="space-y-4">
              <Label>B4. Cittadinanza</Label>
              <RadioGroup
                value={formData.cittadinanza}
                onValueChange={(value) => handleRadioChange('cittadinanza', value as Cittadinanza)}
              >
                <div className="space-y-2">
                  {CITTADINANZA_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`cittadinanza-${option.value}`} />
                      <Label htmlFor={`cittadinanza-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* B5. Permesso di soggiorno (solo se cittadinanza extra UE) */}
            {formData.cittadinanza === "3" && (
              <div className="space-y-4">
                <Label>B5. Hai il permesso di soggiorno?</Label>
                <RadioGroup
                  value={formData.permesso_soggiorno}
                  onValueChange={(value) => handleRadioChange('permesso_soggiorno', value as PermessoSoggiorno)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="permesso-1" />
                      <Label htmlFor="permesso-1">Sì</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="permesso-2" />
                      <Label htmlFor="permesso-2">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="permesso-3" />
                      <Label htmlFor="permesso-3">In fase di rinnovo</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* B6. Tempo in struttura */}
            <div className="space-y-4">
              <Label>B6. Da quanto tempo sei nella struttura/progetto attuale?</Label>
              <RadioGroup
                value={formData.tempo_in_struttura}
                onValueChange={(value) => handleRadioChange('tempo_in_struttura', value as TempoStruttura)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="tempo-1" />
                    <Label htmlFor="tempo-1">Meno di 6 mesi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="tempo-2" />
                    <Label htmlFor="tempo-2">Da 6 mesi a 1 anno</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="tempo-3" />
                    <Label htmlFor="tempo-3">Da 1 a 2 anni</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="tempo-4" />
                    <Label htmlFor="tempo-4">Più di 2 anni</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* B7. Strutture precedenti */}
            <div className="space-y-4">
              <Label>B7. In precedenza, sei stato ospite di altre strutture o preso in carico da altro progetto?</Label>
              <Textarea
                value={formData.precedenti_strutture}
                onChange={(e) => handleTextAreaChange(e)}
                name="precedenti_strutture"
                placeholder="Specifica quali strutture o progetti..."
                className="mt-2"
              />
            </div>

            {/* B8. Famiglia di origine */}
            <div className="space-y-4">
              <Label>B8. Da chi è composta la tua famiglia di origine?</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.famiglia_origine).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`famiglia-${key}`}
                      checked={Boolean(value)}
                      onChange={(e) => handleNestedBooleanChange('famiglia_origine', key, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`famiglia-${key}`}>
                      {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* B9-B10. Madre */}
            <div className="space-y-4">
              <Label>B9. Titolo di studio della madre</Label>
              <RadioGroup
                value={formData.madre.titolo_studio}
                onValueChange={(value) => handleNestedChange('madre', 'titolo_studio', value as TitoloStudioGenitori)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="madre-titolo-1" />
                    <Label htmlFor="madre-titolo-1">Nessun titolo di studio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="madre-titolo-2" />
                    <Label htmlFor="madre-titolo-2">Licenza elementare</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="madre-titolo-3" />
                    <Label htmlFor="madre-titolo-3">Licenza media</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="madre-titolo-4" />
                    <Label htmlFor="madre-titolo-4">Diploma di scuola superiore</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="madre-titolo-5" />
                    <Label htmlFor="madre-titolo-5">Laurea</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="9" id="madre-titolo-9" />
                    <Label htmlFor="madre-titolo-9">Non so</Label>
                  </div>
                </div>
              </RadioGroup>

              <Label>B10. Tua madre attualmente:</Label>
              <RadioGroup
                value={formData.madre.lavoro}
                onValueChange={(value) => handleNestedChange('madre', 'lavoro', value as LavoroGenitori)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="madre-lavoro-1" />
                    <Label htmlFor="madre-lavoro-1">Ha un lavoro stabile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="madre-lavoro-2" />
                    <Label htmlFor="madre-lavoro-2">Ha un lavoro saltuario</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="madre-lavoro-3" />
                    <Label htmlFor="madre-lavoro-3">Non lavora</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="madre-lavoro-4" />
                    <Label htmlFor="madre-lavoro-4">Pensionata</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="9" id="madre-lavoro-9" />
                    <Label htmlFor="madre-lavoro-9">Non so</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* B11-B12. Padre */}
            <div className="space-y-4">
              <Label>B11. Titolo di studio del padre</Label>
              <RadioGroup
                value={formData.padre.titolo_studio}
                onValueChange={(value) => handleNestedChange('padre', 'titolo_studio', value as TitoloStudioGenitori)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="padre-titolo-1" />
                    <Label htmlFor="padre-titolo-1">Nessun titolo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="padre-titolo-2" />
                    <Label htmlFor="padre-titolo-2">Licenza elementare</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="padre-titolo-3" />
                    <Label htmlFor="padre-titolo-3">Licenza media</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="padre-titolo-4" />
                    <Label htmlFor="padre-titolo-4">Diploma di scuola superiore</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="padre-titolo-5" />
                    <Label htmlFor="padre-titolo-5">Laurea</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="9" id="padre-titolo-9" />
                    <Label htmlFor="padre-titolo-9">Non so</Label>
                  </div>
                </div>
              </RadioGroup>

              <Label>B12. Tuo padre attualmente:</Label>
              <RadioGroup
                value={formData.padre.lavoro}
                onValueChange={(value) => handleNestedChange('padre', 'lavoro', value as LavoroGenitori)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="padre-lavoro-1" />
                    <Label htmlFor="padre-lavoro-1">Ha un lavoro stabile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="padre-lavoro-2" />
                    <Label htmlFor="padre-lavoro-2">Ha un lavoro saltuario</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="padre-lavoro-3" />
                    <Label htmlFor="padre-lavoro-3">Non lavora</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="padre-lavoro-4" />
                    <Label htmlFor="padre-lavoro-4">Pensionato</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="9" id="padre-lavoro-9" />
                    <Label htmlFor="padre-lavoro-9">Non so</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Sezione C */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">C. Formazione e lavoro</h3>

            {/* C1. Titolo di studio */}
            <div className="space-y-4">
              <Label>C1. Qual è il tuo titolo di studio?</Label>
              <RadioGroup
                value={formData.titolo_studio}
                onValueChange={(value) => handleRadioChange('titolo_studio', value as TitoloStudio)}
              >
                <div className="space-y-2">
                  {TITOLO_STUDIO_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`titolo-${option.value}`} />
                      <Label htmlFor={`titolo-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* C2. Attività precedenti */}
            <div className="space-y-4">
              <Label>C2. Prima di entrare nella struttura/progetto, che attività svolgevi?</Label>
              <div className="space-y-2">
                {ATTIVITA_PRECEDENTI.map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`att_prec_${id}`}
                      checked={Boolean(formData.attivita_precedenti[id as keyof typeof formData.attivita_precedenti])}
                      onChange={() => handleNestedBooleanChange('attivita_precedenti', id, !formData.attivita_precedenti[id as keyof typeof formData.attivita_precedenti])}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`att_prec_${id}`}>{label}</Label>
                  </div>
                ))}
                {formData.attivita_precedenti.altro && (
                  <Input
                    type="text"
                    placeholder="Specificare altro..."
                    value={formData.attivita_precedenti.altro_specificare || ''}
                    onChange={(e) => handleNestedChange('attivita_precedenti', 'altro_specificare', e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {/* C3. Attività attuali */}
            <div className="space-y-4">
              <Label>C3. Attualmente che attività svolgi?</Label>
              <div className="space-y-2">
                {ATTIVITA_ATTUALI.map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`att_att_${id}`}
                      checked={Boolean(formData.attivita_attuali[id as keyof typeof formData.attivita_attuali])}
                      onChange={(e) => handleAttivitaAttualiChange(id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`att_att_${id}`}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* C4. Orientamento al lavoro */}
            <div className="space-y-4">
              <Label>C4. Hai usufruito di servizi di orientamento al lavoro?</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="orientamento_usufruito"
                    checked={formData.orientamento_lavoro.usufruito}
                    onChange={(e) => handleNestedBooleanChange('orientamento_lavoro', 'usufruito', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="orientamento_usufruito">Sì</Label>
                </div>

                {formData.orientamento_lavoro.usufruito && (
                  <>
                    <div className="ml-6 space-y-4">
                      <Label>Dove?</Label>
                      <div className="space-y-2">
                        {LUOGHI_ORIENTAMENTO.map(({ id, label }) => (
                          <div key={id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`orientamento_${id}`}
                              checked={Boolean(formData.orientamento_lavoro.dove[id as keyof typeof formData.orientamento_lavoro.dove])}
                              onChange={(e) => handleOrientamentoChange(id, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor={`orientamento_${id}`}>{label}</Label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label>Quanto è stato utile?</Label>
                        <RadioGroup
                          value={formData.orientamento_lavoro.utilita}
                          onValueChange={(value) => handleNestedChange('orientamento_lavoro', 'utilita', value as ValutazioneUtilita)}
                        >
                          <div className="space-y-2">
                            {VALUTAZIONE_OPTIONS.map(option => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`utilita-${option.value}`} />
                                <Label htmlFor={`utilita-${option.value}`}>{option.label}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* C5. Ricerca lavoro */}
            <div className="space-y-4">
              <Label>C5. Quali canali utilizzi/hai utilizzato per cercare lavoro?</Label>
              <div className="space-y-2">
                {CANALI_RICERCA.map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <input
                    type="checkbox"
                    id={`ricerca_${id}`}
                    checked={Boolean(formData.ricerca_lavoro[id as keyof typeof formData.ricerca_lavoro])}
                    onChange={(e) => handleNestedBooleanChange('ricerca_lavoro', id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`ricerca_${id}`}>{label}</Label>
                </div>
              ))}
              {formData.ricerca_lavoro.altro && (
                <Input
                  type="text"
                  placeholder="Specificare altro..."
                  value={formData.ricerca_lavoro.altro_specificare || ''}
                  onChange={(e) => handleNestedChange('ricerca_lavoro', 'altro_specificare', e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* C6. Aspetti importanti del lavoro */}
            <div className="space-y-4">
              <Label>C6. Quanto sono importanti per te i seguenti aspetti del lavoro?</Label>
              <div className="space-y-4">
                {ASPETTI_LAVORO.map(({ id, label }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={`aspetto_${id}`}>{label}</Label>
                    <RadioGroup
                      value={String(formData.aspetti_lavoro[id as keyof typeof formData.aspetti_lavoro])}
                      onValueChange={(value) => handleAspettiLavoroChange(
                        id as keyof QuestionarioGiovani['aspetti_lavoro'], 
                        value as ValutazionePreoccupazione
                      )}
                    >
                      <div className="flex space-x-4">
                        {VALUTAZIONE_OPTIONS.map(option => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`aspetto_${id}_${option.value}`} />
                            <Label htmlFor={`aspetto_${id}_${option.value}`}>{option.label}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>

            {/* C7. Lavoro attuale */}
            <div className="space-y-4">
              <Label>C7. Attualmente lavori?</Label>
              <div className="space-y-4">
                <RadioGroup
                  value={formData.lavoro_attuale.presente ? "1" : "0"}
                  onValueChange={(value) => handleLavoroChange(value === "1")}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="lavoro-si" />
                      <Label htmlFor="lavoro-si">Sì</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="lavoro-no" />
                      <Label htmlFor="lavoro-no">No</Label>
                    </div>
                  </div>
                </RadioGroup>

                {formData.lavoro_attuale.presente && (
                  <div className="ml-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Che tipo di contratto hai?</Label>
                      <Input
                        type="text"
                        value={formData.lavoro_attuale.descrizione || ''}
                        onChange={(e) => 
                          setFormData(prev => ({
                            ...prev,
                            lavoro_attuale: {
                              ...prev.lavoro_attuale,
                              descrizione: e.target.value
                            }
                          }))
                        }
                        placeholder="Es: Tempo determinato, indeterminato, etc."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div> {/* Fine Sezione C */}

          {/* Sezione D */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">D. Area relazionale</h3>

            {/* D1. Abitazione precedente */}
            <div className="space-y-4">
              <Label>D1. Con chi abitavi prima di entrare in questa struttura?</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.abitazione_precedente).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`abit-${key}`}
                      checked={Boolean(value)}
                      onChange={(e) => handleNestedBooleanChange('abitazione_precedente', key, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`abit-${key}`}>
                      {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* D2. Figure di aiuto */}
            <div className="space-y-4">
              <Label>D2. A chi puoi rivolgerti per un aiuto?</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.figura_aiuto)
                  .filter(([key]) => key !== 'altri_specificare')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`aiuto-${key}`}
                        checked={Boolean(value)}
                        onChange={(e) => handleNestedBooleanChange('figura_aiuto', key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`aiuto-${key}`}>
                        {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                    </div>
                  ))}
              </div>
              {formData.figura_aiuto.altri && (
                <div className="space-y-2">
                  <Label htmlFor="aiuto-altri-spec">Specificare altre persone</Label>
                  <Input
                    id="aiuto-altri-spec"
                    value={formData.figura_aiuto.altri_specificare}
                    onChange={(e) => handleNestedChange('figura_aiuto', 'altri_specificare', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sezione E */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">E. Area personale: capacità di immaginare il proprio futuro</h3>
            
            {/* E1. Preoccupazioni */}
            <div className="space-y-4">
              <Label>E1. Quanto sei preoccupato dei seguenti aspetti per il tuo futuro?</Label>
              <div className="space-y-4">
                {Object.entries(formData.preoccupazioni_futuro)
                  .filter(([key]) => key !== 'altro_specificare')
                  .map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1)}</Label>
                      <RadioGroup
                        value={String(value)}
                        onValueChange={(val) => 
                          handleNestedChange('preoccupazioni_futuro', key as keyof typeof formData.preoccupazioni_futuro, val as ValutazionePreoccupazione)
                        }
                      >
                        <div className="flex space-x-4">
                          {VALUTAZIONE_OPTIONS.map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value} id={`preoc-${key}-${option.value}`} />
                              <Label htmlFor={`preoc-${key}-${option.value}`}>{option.label}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
              </div>
            </div>

            {/* E2 */}
            <div className="space-y-4">
              <h4 className="font-medium">E2. Pensando al tuo futuro, quanto ritieni realizzabili i seguenti obiettivi?</h4>
              
              <div className="space-y-6">
                {/* E2.1 */}
                <div>
                  <p className="mb-2">E2.1 Fare un lavoro che mi piace</p>
                  <RadioGroup 
                    value={formData.obiettivi_realizzabili.lavoro_piacevole}
                    onValueChange={(value) => 
                      handleNestedChange('obiettivi_realizzabili', 'lavoro_piacevole', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="e21-0" />
                      <Label htmlFor="e21-0">Per niente (0)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="e21-1" />
                      <Label htmlFor="e21-1">Poco (1)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="e21-2" />
                      <Label htmlFor="e21-2">Abbastanza (2)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="e21-3" />
                      <Label htmlFor="e21-3">Molto (3)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="9" id="e21-9" />
                      <Label htmlFor="e21-9">Non è mio obiettivo (9)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* E2.2 */}
                <div>
                  <p className="mb-2">E2.2 Essere autonomo/a</p>
                  <RadioGroup 
                    value={formData.obiettivi_realizzabili.autonomia}
                    onValueChange={(value) => 
                      handleNestedChange('obiettivi_realizzabili', 'autonomia', value)}
                    className="flex flex-wrap gap-4"
                  >
                    {/* Stessa struttura dei radio button come sopra */}
                  </RadioGroup>
                </div>

                {/* E2.3 */}
                <div>
                  <p className="mb-2">E2.3 Costruire una famiglia</p>
                  <RadioGroup 
                    value={formData.obiettivi_realizzabili.famiglia}
                    onValueChange={(value) => 
                      handleNestedChange('obiettivi_realizzabili', 'famiglia', value)}
                    className="flex flex-wrap gap-4"
                  >
                    {/* Stessa struttura dei radio button come sopra */}
                  </RadioGroup>
                </div>

                {/* E2.4 */}
                <div>
                  <p className="mb-2">E2.4 Trovare un lavoro</p>
                  <RadioGroup 
                    value={formData.obiettivi_realizzabili.trovare_lavoro}
                    onValueChange={(value) => 
                      handleNestedChange('obiettivi_realizzabili', 'trovare_lavoro', value)}
                    className="flex flex-wrap gap-4"
                  >
                    {/* Stessa struttura dei radio button come sopra */}
                  </RadioGroup>
                </div>

                {/* E2.5 */}
                <div>
                  <p className="mb-2">E2.5 Stare in buona salute</p>
                  <RadioGroup 
                    value={formData.obiettivi_realizzabili.salute}
                    onValueChange={(value) => 
                      handleNestedChange('obiettivi_realizzabili', 'salute', value)}
                    className="flex flex-wrap gap-4"
                  >
                    {/* Stessa struttura dei radio button come sopra */}
                  </RadioGroup>
                </div>

                {/* E2.6 */}
                <div>
                  <p className="mb-2">E2.6 Avere una casa</p>
                  <RadioGroup 
                    value={formData.obiettivi_realizzabili.casa}
                    onValueChange={(value) => 
                      handleNestedChange('obiettivi_realizzabili', 'casa', value)}
                    className="flex flex-wrap gap-4"
                  >
                    {/* Stessa struttura dei radio button come sopra */}
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* E3 */}
            <div className="space-y-4">
              <h4 className="font-medium">E3. Cosa ti aiuterebbe ad affrontare il futuro?</h4>
              <Textarea
                value={formData.aiuto_futuro}
                onChange={(e) => handleChange('aiuto_futuro', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* E4 */}
            <div className="space-y-4">
              <h4 className="font-medium">E4. Pensando al momento in cui uscirai da questa struttura, ti senti pronto ad affrontare la tua vita?</h4>
              <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
              
              <RadioGroup 
                value={formData.pronto_uscita.pronto ? "1" : "0"}
                onValueChange={(value) => {
                  handleNestedChange('pronto_uscita', 'pronto', value === "1")
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="e4-no" />
                  <Label htmlFor="e4-no">0. No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="e4-si" />
                  <Label htmlFor="e4-si">1. Sì</Label>
                </div>
              </RadioGroup>

              <Textarea
                placeholder={formData.pronto_uscita.pronto ? "Sì, perché..." : "No, perché..."}
                value={formData.pronto_uscita.motivazione}
                onChange={(e) => handleNestedChange('pronto_uscita', 'motivazione', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* E5 */}
            <div className="space-y-4">
              <h4 className="font-medium">E5. Pensando all'uscita dalla struttura/dal progetto di presa in carico quali emozioni provi?</h4>
              <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-1"
                    checked={formData.emozioni_uscita.felicita}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'felicita', checked === true)}
                  />
                  <Label htmlFor="e5-1">E5.1 Felicità</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-2"
                    checked={formData.emozioni_uscita.tristezza}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'tristezza', checked === true)}
                  />
                  <Label htmlFor="e5-2">E5.2 Tristezza</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-3"
                    checked={formData.emozioni_uscita.curiosita}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'curiosita', checked === true)}
                  />
                  <Label htmlFor="e5-3">E5.3 Curiosità</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-4"
                    checked={formData.emozioni_uscita.preoccupazione}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'preoccupazione', checked === true)}
                  />
                  <Label htmlFor="e5-4">E5.4 Preoccupazione</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-5"
                    checked={formData.emozioni_uscita.paura}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'paura', checked === true)}
                  />
                  <Label htmlFor="e5-5">E5.5 Paura</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-6"
                    checked={formData.emozioni_uscita.liberazione}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'liberazione', checked === true)}
                  />
                  <Label htmlFor="e5-6">E5.6 Liberazione</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-7"
                    checked={formData.emozioni_uscita.solitudine}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'solitudine', checked === true)}
                  />
                  <Label htmlFor="e5-7">E5.7 Solitudine</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-8"
                    checked={formData.emozioni_uscita.rabbia}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'rabbia', checked === true)}
                  />
                  <Label htmlFor="e5-8">E5.8 Rabbia</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-9"
                    checked={formData.emozioni_uscita.speranza}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'speranza', checked === true)}
                  />
                  <Label htmlFor="e5-9">E5.9 Speranza</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="e5-10"
                    checked={formData.emozioni_uscita.determinazione}
                    onCheckedChange={(checked) => 
                      handleNestedBooleanChange('emozioni_uscita', 'determinazione', checked === true)}
                  />
                  <Label htmlFor="e5-10">E5.10 Determinazione</Label>
                </div>
              </div>
            </div>

            {/* E6 */}
            <div className="space-y-4">
              <h4 className="font-medium">E6. Qual è il tuo più grande desiderio?</h4>
              <Textarea
                value={formData.desiderio}
                onChange={(e) => handleChange('desiderio', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* E7 */}
            <div className="space-y-4">
              <h4 className="font-medium">E7. C'è qualche cosa di importante che non ti abbiamo chiesto ma che vorresti aggiungere?</h4>
              <Textarea
                value={formData.nota_aggiuntiva}
                onChange={(e) => handleChange('nota_aggiuntiva', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Pulsante Submit */}
          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? 'Invio in corso...' : 'Invia questionario'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}