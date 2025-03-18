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
  LavoroGenitori,
  RicercaLavoro,
  AttivitaAttuali,
  LivelliUtilita,
  AspettiLavoro
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
  { id: 'tirocinio', label: 'Tirocinio' },
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

const ABITAZIONE_PRECEDENTE = [
  { id: 'solo', label: 'Nessuno, vivevo da solo' },
  { id: 'struttura', label: 'Vivevo in una struttura (comunità, casa-famiglia, etc.)' },
  { id: 'madre', label: 'Con mia madre' },
  { id: 'padre', label: 'Con mio padre' },
  { id: 'partner', label: 'Con il mio compagna/o, moglie/marito' },
  { id: 'figli', label: 'Con i miei figli' },
  { id: 'fratelli', label: 'Con i miei fratelli/sorelle' },
  { id: 'nonni', label: 'Con i miei nonni/nonne' },
  { id: 'altri_parenti', label: 'Con altri parenti/conviventi' },
  { id: 'amici', label: 'Con amici' }
]

const FIGURE_AIUTO = [
  { id: 'padre', label: 'Padre' },
  { id: 'madre', label: 'Madre' },
  { id: 'fratelli', label: 'Fratelli/Sorelle' },
  { id: 'altri_parenti', label: 'Altri parenti' },
  { id: 'amici', label: 'Amici' },
  { id: 'tutore', label: 'Tutore' },
  { id: 'insegnanti', label: 'Insegnanti' },
  { id: 'figure_sostegno', label: 'Altre figure di sostegno (psicologo, educatore, assistente sociale, medico...)' },
  { id: 'volontari', label: 'Volontari (figure religiose, etc.)' },
  { id: 'altri', label: 'Altre persone' }
]

const EMOZIONI_USCITA = [
  { id: 'felicita', label: 'Felicità' },
  { id: 'tristezza', label: 'Tristezza' },
  { id: 'curiosita', label: 'Curiosità' },
  { id: 'preoccupazione', label: 'Preoccupazione' },
  { id: 'paura', label: 'Paura' },
  { id: 'liberazione', label: 'Liberazione' },
  { id: 'solitudine', label: 'Solitudine' },
  { id: 'rabbia', label: 'Rabbia' },
  { id: 'speranza', label: 'Speranza' },
  { id: 'determinazione', label: 'Determinazione' }
]

const initialFormData: QuestionarioGiovani = {
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
    formazione: false,
    lavoro: false,
    ricerca_lavoro: false,
    tirocinio: false,
    nessuna: false
  },
  motivi_non_studio: [], // Mantieni come array
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
  livelli_utilità: {
    studio: "0",
    formazione: "0",
    lavoro: "0",
    ricerca_lavoro: "0"
  } as LivelliUtilita,
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

const SectionA = ({ formData, setFormData }: { 
  formData: QuestionarioGiovani, 
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioGiovani>> 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SEZIONE A: Descrizione del giovane</h2>
      <p className="text-sm italic mb-6">
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
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              collocazione_attuale: value as CollocazioneAttuale
            }))
          }
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
        <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(formData.fattori_vulnerabilita)
            .filter(([key]) => !key.includes('spec'))
            .map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox 
                  id={key}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      fattori_vulnerabilita: {
                        ...prev.fattori_vulnerabilita,
                        [key]: checked === true
                      }
                    }))
                  }
                />
                <Label htmlFor={key}>
                  {key === 'fv1_stranieri' && 'Stranieri con problemi legati alla condizione migratoria'}
                  {key === 'fv2_vittime_tratta' && 'Vittime di tratta'}
                  {key === 'fv3_vittime_violenza' && 'Vittime di violenza domestica'}
                  {key === 'fv4_allontanati_famiglia' && 'Persone allontanate dalla famiglia'}
                  {key === 'fv5_detenuti' && 'Detenuti'}
                  {key === 'fv6_ex_detenuti' && 'Ex detenuti'}
                  {key === 'fv7_esecuzione_penale' && 'Persone in esecuzione penale esterna/misura alternativa alla detenzione'}
                  {key === 'fv8_indigenti' && 'Indigenti e/o senza dimora'}
                  {key === 'fv9_rom_sinti' && 'Rom e Sinti'}
                  {key === 'fv10_disabilita_fisica' && 'Persone con disabilità fisica'}
                  {key === 'fv11_disabilita_cognitiva' && 'Persone con disabilità cognitiva'}
                  {key === 'fv12_disturbi_psichiatrici' && 'Persone con disturbi psichiatrici'}
                  {key === 'fv13_dipendenze' && 'Persone con dipendenze'}
                  {key === 'fv14_genitori_precoci' && 'Genitori precoci'}
                  {key === 'fv15_orientamento_sessuale' && 'Persone con problemi legati all\'orientamento sessuale'}
                  {key === 'fv16_altro' && 'Altro'}
                </Label>
              </div>
            ))}
        </div>
        
        {formData.fattori_vulnerabilita.fv16_altro && (
          <div className="mt-2">
            <Label htmlFor="fv16-spec">Specificare la voce "Altro"</Label>
            <Input
              id="fv16-spec"
              value={formData.fattori_vulnerabilita.fv16_spec}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  fattori_vulnerabilita: {
                    ...prev.fattori_vulnerabilita,
                    fv16_spec: e.target.value
                  }
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

const SectionB = ({ formData, setFormData }: { 
  formData: QuestionarioGiovani, 
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioGiovani>> 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SEZIONE B: Domande socio-anagrafiche</h2>

      {/* B1. Sesso */}
      <div className="space-y-4">
        <Label>B1. Sesso</Label>
        <RadioGroup
          value={formData.sesso}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              sesso: value as Sesso
            }))
          }
        >
          {SESSO_OPTIONS.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`sesso-${option.value}`} />
              <Label htmlFor={`sesso-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* B2. Classe di età */}
      <div className="space-y-4">
        <Label>B2. Classe di età</Label>
        <RadioGroup
          value={formData.classe_eta}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              classe_eta: value as ClasseEta
            }))
          }
        >
          {CLASSE_ETA_OPTIONS.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`eta-${option.value}`} />
              <Label htmlFor={`eta-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* B3. Luogo di nascita */}
      <div className="space-y-4">
        <Label>B3. Luogo di nascita</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="luogo_nascita_italia"
              checked={formData.luogo_nascita.italia}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  luogo_nascita: {
                    ...prev.luogo_nascita,
                    italia: checked === true
                  }
                }))
              }
            />
            <Label htmlFor="luogo_nascita_italia">Italia</Label>
          </div>
          {!formData.luogo_nascita.italia && (
            <div className="ml-6">
              <Label htmlFor="altro_paese">Specificare il Paese</Label>
              <Input
                id="altro_paese"
                value={formData.luogo_nascita.altro_paese}
                onChange={(e) => 
                  setFormData(prev => ({
                    ...prev,
                    luogo_nascita: {
                      ...prev.luogo_nascita,
                      altro_paese: e.target.value
                    }
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* B4. Cittadinanza */}
      <div className="space-y-4">
        <Label>B4. Cittadinanza</Label>
        <RadioGroup
          value={formData.cittadinanza}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              cittadinanza: value as Cittadinanza
            }))
          }
        >
          {CITTADINANZA_OPTIONS.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`cittadinanza-${option.value}`} />
              <Label htmlFor={`cittadinanza-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* B5. Permesso di soggiorno (solo se extracomunitario) */}
      {formData.cittadinanza === "3" && (
        <div className="space-y-4">
          <Label>B5. Se cittadino extra U.E.</Label>
          <RadioGroup
            value={formData.permesso_soggiorno}
            onValueChange={(value) => 
              setFormData(prev => ({
                ...prev,
                permesso_soggiorno: value as PermessoSoggiorno
              }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="permesso-1" />
              <Label htmlFor="permesso-1">Con permesso di soggiorno</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="permesso-2" />
              <Label htmlFor="permesso-2">In attesa di permesso di soggiorno</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="permesso-3" />
              <Label htmlFor="permesso-3">Senza permesso di soggiorno</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* B6. Tempo in struttura */}
      <div className="space-y-4">
        <Label>B6. Da quanto tempo sei in questa struttura/progetto (attuale ingresso)?</Label>
        <RadioGroup
          value={formData.tempo_in_struttura}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              tempo_in_struttura: value as TempoStruttura
            }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="tempo-1" />
            <Label htmlFor="tempo-1">Da meno di 6 mesi</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="tempo-2" />
            <Label htmlFor="tempo-2">Da 6 mesi a 1 anno</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="tempo-3" />
            <Label htmlFor="tempo-3">Da 1 a 3 anni</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id="tempo-4" />
            <Label htmlFor="tempo-4">Più di 3 anni</Label>
          </div>
        </RadioGroup>
      </div>

      {/* B7. Strutture precedenti */}
      <div className="space-y-4">
        <Label>B7. In precedenza, sei stato ospite di altre strutture o preso in carico da altro progetto?</Label>
        <RadioGroup
          value={formData.precedenti_strutture}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              precedenti_strutture: value
            }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="prec-1" />
            <Label htmlFor="prec-1">No, mai</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="prec-2" />
            <Label htmlFor="prec-2">Sì, una volta</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="prec-3" />
            <Label htmlFor="prec-3">Sì, più di una volta</Label>
          </div>
        </RadioGroup>
      </div>

      {/* B8. Famiglia di origine */}
      <div className="space-y-4">
        <Label>B8. Da chi è composta la tua famiglia di origine?</Label>
        <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="famiglia-padre"
              checked={formData.famiglia_origine.padre}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  famiglia_origine: {
                    ...prev.famiglia_origine,
                    padre: checked === true
                  }
                }))
              }
            />
            <Label htmlFor="famiglia-padre">Padre</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="famiglia-madre"
              checked={formData.famiglia_origine.madre}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  famiglia_origine: {
                    ...prev.famiglia_origine,
                    madre: checked === true
                  }
                }))
              }
            />
            <Label htmlFor="famiglia-madre">Madre</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="famiglia-fratelli"
              checked={formData.famiglia_origine.fratelli_sorelle}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  famiglia_origine: {
                    ...prev.famiglia_origine,
                    fratelli_sorelle: checked === true
                  }
                }))
              }
            />
            <Label htmlFor="famiglia-fratelli">Fratelli/sorelle</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="famiglia-nonni"
              checked={formData.famiglia_origine.nonni}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  famiglia_origine: {
                    ...prev.famiglia_origine,
                    nonni: checked === true
                  }
                }))
              }
            />
            <Label htmlFor="famiglia-nonni">Nonni/nonne</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="famiglia-altri-parenti"
              checked={formData.famiglia_origine.altri_parenti}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  famiglia_origine: {
                    ...prev.famiglia_origine,
                    altri_parenti: checked === true
                  }
                }))
              }
            />
            <Label htmlFor="famiglia-altri-parenti">Altri parenti</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="famiglia-altri-conviventi"
              checked={formData.famiglia_origine.altri_conviventi}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  famiglia_origine: {
                    ...prev.famiglia_origine,
                    altri_conviventi: checked === true
                  }
                }))
              }
            />
            <Label htmlFor="famiglia-altri-conviventi">Altri conviventi non parenti</Label>
          </div>
        </div>
      </div>

      {/* B9-B10. Madre */}
      <div className="space-y-4">
        <Label>B9. Titolo di studio della madre</Label>
        <RadioGroup
          value={formData.madre.titolo_studio}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              madre: {
                ...prev.madre,
                titolo_studio: value as TitoloStudioGenitori
              }
            }))
          }
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
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              madre: {
                ...prev.madre,
                lavoro: value as LavoroGenitori
              }
            }))
          }
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
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              padre: {
                ...prev.padre,
                titolo_studio: value as TitoloStudioGenitori
              }
            }))
          }
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
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              padre: {
                ...prev.padre,
                lavoro: value as LavoroGenitori
              }
            }))
          }
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
  )
}

const SectionC = ({ formData, setFormData }: { 
  formData: QuestionarioGiovani, 
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioGiovani>> 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SEZIONE C: Formazione e lavoro</h2>

      {/* C1. Titolo di studio */}
      <div className="space-y-4">
        <Label>C1. Quale titolo di studio possiedi? (indicare il più elevato)</Label>
        <RadioGroup
          value={formData.titolo_studio}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              titolo_studio: value as TitoloStudio
            }))
          }
        >
          {TITOLO_STUDIO_OPTIONS.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`titolo-${option.value}`} />
              <Label htmlFor={`titolo-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* C2. Attività precedenti */}
      <div className="space-y-4">
        <Label>C2. Prima di essere inserito nella struttura/progetto quali attività svolgevi?</Label>
        <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
        <div className="space-y-2">
          {ATTIVITA_PRECEDENTI.map(attivita => (
            <div key={attivita.id} className="flex items-center space-x-2">
              <Checkbox
                id={`attivita-${attivita.id}`}
                checked={Boolean(formData.attivita_precedenti[attivita.id])}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    attivita_precedenti: {
                      ...prev.attivita_precedenti,
                      [attivita.id]: checked === true
                    }
                  }))
                }
              />
              <Label htmlFor={`attivita-${attivita.id}`}>{attivita.label}</Label>
            </div>
          ))}
        </div>

        {formData.attivita_precedenti.altro && (
          <div className="mt-2">
            <Label htmlFor="attivita-altro-spec">Specificare altro</Label>
            <Input
              id="attivita-altro-spec"
              value={formData.attivita_precedenti.altro_specificare}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  attivita_precedenti: {
                    ...prev.attivita_precedenti,
                    altro_specificare: e.target.value
                  }
                }))
              }
            />
          </div>
        )}
      </div>

      {/* C3-C4. Orientamento al lavoro */}
      <div className="space-y-4">
        <Label>C3. Hai mai usufruito di servizi di orientamento al lavoro?</Label>
        <RadioGroup
          value={formData.orientamento_lavoro.usufruito ? "1" : "0"}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              orientamento_lavoro: {
                ...prev.orientamento_lavoro,
                usufruito: value === "1"
              }
            }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="orient-no" />
            <Label htmlFor="orient-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="orient-si" />
            <Label htmlFor="orient-si">Sì</Label>
          </div>
        </RadioGroup>

        {formData.orientamento_lavoro.usufruito && (
          <>
            <Label>C4. Se sì, dove?</Label>
            <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
            <div className="space-y-2">
              {LUOGHI_ORIENTAMENTO.map(luogo => (
                <div key={luogo.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`luogo-${luogo.id}`}
                    checked={formData.orientamento_lavoro.dove[luogo.id]}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        orientamento_lavoro: {
                          ...prev.orientamento_lavoro,
                          dove: {
                            ...prev.orientamento_lavoro.dove,
                            [luogo.id]: checked === true
                          }
                        }
                      }))
                    }
                  />
                  <Label htmlFor={`luogo-${luogo.id}`}>{luogo.label}</Label>
                </div>
              ))}
            </div>

            <Label>C4_BIS. Quanto lo ritieni utile?</Label>
            <RadioGroup
              value={formData.orientamento_lavoro.utilita}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  orientamento_lavoro: {
                    ...prev.orientamento_lavoro,
                    utilita: value as ValutazioneUtilita
                  }
                }))
              }
            >
              {VALUTAZIONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`utilita-${option.value}`} />
                  <Label htmlFor={`utilita-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </>
        )}
      </div>

      {/* C5. Attività attuali */}
      <div className="space-y-4">
        <Label>C5. Attualmente in quali attività sei impegnato/a?</Label>
        <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
        <div className="space-y-2">
          {ATTIVITA_ATTUALI.map(attivita => (
            <div key={attivita.id} className="flex items-center space-x-2">
              <Checkbox
                id={`attuale-${attivita.id}`}
                checked={Boolean(formData.attivita_attuali[attivita.id as keyof AttivitaAttuali])}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    attivita_attuali: {
                      ...prev.attivita_attuali,
                      [attivita.id]: checked === true
                    } as AttivitaAttuali
                  }))
                }
              />
              <Label htmlFor={`attuale-${attivita.id}`}>{attivita.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* C6. Motivo non studio */}
      {!formData.attivita_attuali.studio && (
        <div className="space-y-4">
          <Label>C6. Se attualmente non studi, qual è il motivo principale?</Label>
          <RadioGroup
            value={formData.motivi_non_studio[0] || ""}
            onValueChange={(value) => 
              setFormData(prev => ({
                ...prev,
                motivi_non_studio: [value]
              }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="motivo-1" />
              <Label htmlFor="motivo-1">Ho completato gli studi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="motivo-2" />
              <Label htmlFor="motivo-2">Non mi piace studiare</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="motivo-3" />
              <Label htmlFor="motivo-3">Non ho la possibilità di studiare</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="motivo-4" />
              <Label htmlFor="motivo-4">Ho necessità di lavorare</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* C7. Corso frequentato */}
      {formData.attivita_attuali.formazione && (
        <div className="space-y-4">
          <Label>C7. Se sei impegnato in attività formativa, quale corso frequenti?</Label>
          <Textarea
            value={formData.corso_formazione.descrizione}
            onChange={(e) => 
              setFormData(prev => ({
                ...prev,
                corso_formazione: {
                  presente: true,
                  descrizione: e.target.value
                }
              }))
            }
          />
        </div>
      )}

      {/* C8. Lavoro attuale */}
      {formData.attivita_attuali.lavoro && (
        <div className="space-y-4">
          <Label>C8. Se sei impegnato in attività lavorative, qual è il tuo lavoro?</Label>
          <p className="text-sm text-gray-500">
            Indicare in sintesi professione o mestiere, tipo di posto di lavoro, tipo di contratto
          </p>
          <Textarea
            value={formData.lavoro_attuale.descrizione}
            onChange={(e) => 
              setFormData(prev => ({
                ...prev,
                lavoro_attuale: {
                  presente: true,
                  descrizione: e.target.value
                }
              }))
            }
          />
        </div>
      )}

      {/* C8.1-C8.4 Utilità attività */}
      <div className="space-y-4">
        <Label>C8. Quanto ritieni utili le attività che stai svolgendo per il tuo futuro?</Label>
        
        {formData.attivita_attuali.studio && (
          <div className="space-y-2">
            <Label>C8.1 Studiare</Label>
            <RadioGroup
              value={formData.livelli_utilità.studio}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  livelli_utilità: {
                    ...prev.livelli_utilità,
                    studio: value as ValutazioneUtilita
                  }
                }))
              }
            >
              {VALUTAZIONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`util-studio-${option.value}`} />
                  <Label htmlFor={`util-studio-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {formData.attivita_attuali.formazione && (
          <div className="space-y-2">
            <Label>C8.2 Frequentare un corso di formazione</Label>
            <RadioGroup
              value={formData.livelli_utilità.formazione}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  livelli_utilità: {
                    ...prev.livelli_utilità,
                    formazione: value as ValutazioneUtilita
                  }
                }))
              }
            >
              {VALUTAZIONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`util-form-${option.value}`} />
                  <Label htmlFor={`util-form-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {formData.attivita_attuali.lavoro && (
          <div className="space-y-2">
            <Label>C8.3 Lavorare</Label>
            <RadioGroup
              value={formData.livelli_utilità.lavoro}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  livelli_utilità: {
                    ...prev.livelli_utilità,
                    lavoro: value as ValutazioneUtilita
                  }
                }))
              }
            >
              {VALUTAZIONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`util-lav-${option.value}`} />
                  <Label htmlFor={`util-lav-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {formData.attivita_attuali.ricerca_lavoro && (
          <div className="space-y-2">
            <Label>C8.4 Ricerca attiva del lavoro</Label>
            <RadioGroup
              value={formData.livelli_utilità.ricerca_lavoro}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  livelli_utilità: {
                    ...prev.livelli_utilità,
                    ricerca_lavoro: value as ValutazioneUtilita
                  }
                }))
              }
            >
              {VALUTAZIONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`util-ric-${option.value}`} />
                  <Label htmlFor={`util-ric-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      {/* C9. Canali ricerca lavoro */}
      <div className="space-y-4">
        <Label>C9. A chi ti rivolgeresti per cercare un lavoro?</Label>
        <p className="text-sm text-gray-500">[Indicare massimo tre scelte]</p>
        <div className="space-y-2">
          {CANALI_RICERCA.map(canale => (
            <div key={canale.id} className="flex items-center space-x-2">
              <Checkbox
                id={`canale-${canale.id}`}
                checked={Boolean(formData.ricerca_lavoro[canale.id as string])}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    ricerca_lavoro: {
                      ...prev.ricerca_lavoro,
                      [canale.id]: checked === true
                    } as RicercaLavoro
                  }))
                }
              />
              <Label htmlFor={`canale-${canale.id}`}>{canale.label}</Label>
            </div>
          ))}
        </div>

        {formData.ricerca_lavoro.altro && (
          <div className="mt-2">
            <Label htmlFor="canale-altro-spec">Specificare altro</Label>
            <Input
              id="canale-altro-spec"
              value={formData.ricerca_lavoro.altro_specificare}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  ricerca_lavoro: {
                    ...prev.ricerca_lavoro,
                    altro_specificare: e.target.value
                  }
                }))
              }
            />
          </div>
        )}
      </div>

      {/* C10-C12. Domande sì/no */}
      <div className="space-y-4">
        <Label>C10. Hai mai compilato un curriculum vitae?</Label>
        <RadioGroup
          value={formData.curriculum_vitae}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              curriculum_vitae: value
            }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="cv-no" />
            <Label htmlFor="cv-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="cv-si" />
            <Label htmlFor="cv-si">Sì</Label>
          </div>
        </RadioGroup>

        <Label>C11. Ti sei mai rivolto al Centro per l'impiego (ex collocamento)?</Label>
        <RadioGroup
          value={formData.centro_impiego}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              centro_impiego: value
            }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="centro-no" />
            <Label htmlFor="centro-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="centro-si" />
            <Label htmlFor="centro-si">Sì</Label>
          </div>
        </RadioGroup>

        <Label>C12. Hai mai pensato di avviare un'attività di lavoro autonomo?</Label>
        <RadioGroup
          value={formData.lavoro_autonomo}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              lavoro_autonomo: value
            }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="autonomo-no" />
            <Label htmlFor="autonomo-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="autonomo-si" />
            <Label htmlFor="autonomo-si">Sì</Label>
          </div>
        </RadioGroup>
      </div>

      {/* C13. Aspetti lavoro */}
      <div className="space-y-4">
        <Label>C13. Pensando al tuo futuro lavorativo, quanta importanza attribuisci ai seguenti aspetti?</Label>
        
        {ASPETTI_LAVORO.map(aspetto => (
          <div key={aspetto.id} className="space-y-2">
            <Label>{aspetto.label}</Label>
            <RadioGroup
              value={formData.aspetti_lavoro[aspetto.id as keyof AspettiLavoro]}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  aspetti_lavoro: {
                    ...prev.aspetti_lavoro,
                    [aspetto.id]: value as ValutazioneUtilita
                  }
                }))
              }
            >
              {VALUTAZIONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${aspetto.id}-${option.value}`} />
                  <Label htmlFor={`${aspetto.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  )
}

const SectionD = ({ formData, setFormData }: { 
  formData: QuestionarioGiovani, 
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioGiovani>> 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SEZIONE D: Area relazionale</h2>

      {/* D1. Abitazione precedente */}
      <div className="space-y-4">
        <Label>D1. Con chi abitavi prima di entrare in questa struttura/fossi inserito in un progetto di presa in carico?</Label>
        <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ABITAZIONE_PRECEDENTE.map(opzione => (
            <div key={opzione.id} className="flex items-center space-x-2">
              <Checkbox
                id={`abitazione-${opzione.id}`}
                checked={Boolean(formData.abitazione_precedente[opzione.id as keyof typeof formData.abitazione_precedente])}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    abitazione_precedente: {
                      ...prev.abitazione_precedente,
                      [opzione.id]: checked === true
                    }
                  }))
                }
              />
              <Label htmlFor={`abitazione-${opzione.id}`}>{opzione.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* D2. Figure di aiuto */}
      <div className="space-y-4">
        <Label>D2. A chi puoi rivolgerti per un aiuto?</Label>
        <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {FIGURE_AIUTO.map(figura => (
            <div key={figura.id} className="flex items-center space-x-2">
              <Checkbox
                id={`aiuto-${figura.id}`}
                checked={Boolean(formData.figura_aiuto[figura.id as keyof typeof formData.figura_aiuto])}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    figura_aiuto: {
                      ...prev.figura_aiuto,
                      [figura.id]: checked === true
                    }
                  }))
                }
              />
              <Label htmlFor={`aiuto-${figura.id}`}>{figura.label}</Label>
            </div>
          ))}
        </div>

        {formData.figura_aiuto.altri && (
          <div className="mt-2">
            <Label htmlFor="aiuto-altri-spec">Specificare altre persone</Label>
            <Input
              id="aiuto-altri-spec"
              value={formData.figura_aiuto.altri_specificare}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  figura_aiuto: {
                    ...prev.figura_aiuto,
                    altri_specificare: e.target.value
                  }
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

const SectionE = ({ formData, setFormData }: { 
  formData: QuestionarioGiovani, 
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioGiovani>> 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SEZIONE E: Area personale: capacità di immaginare il proprio futuro</h2>

      {/* E1. Preoccupazioni futuro */}
      <div className="space-y-4">
        <Label>E1. Quanto sei preoccupato dei seguenti aspetti per il tuo futuro?</Label>
        
        <div className="space-y-4">
          {/* E1.1 Pregiudizi */}
          <div className="space-y-2">
            <Label>E1.1 Pregiudizi nei miei confronti</Label>
            <RadioGroup
              value={formData.preoccupazioni_futuro.pregiudizi}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  preoccupazioni_futuro: {
                    ...prev.preoccupazioni_futuro,
                    pregiudizi: value as ValutazionePreoccupazione
                  }
                }))
              }
            >
              {VALUTAZIONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`pregiudizi-${option.value}`} />
                  <Label htmlFor={`pregiudizi-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* E1.2-E1.7 Altri aspetti */}
          {[
            { id: 'mancanza_lavoro', label: 'Mancanza di offerte di lavoro' },
            { id: 'mancanza_aiuto', label: 'Non saprei a chi rivolgermi per un aiuto' },
            { id: 'mancanza_casa', label: 'Non avere una casa' },
            { id: 'solitudine', label: 'La solitudine' },
            { id: 'salute', label: 'La salute' },
            { id: 'perdita_persone', label: 'Perdere le persone care' }
          ].map(aspetto => (
            <div key={aspetto.id} className="space-y-2">
              <Label>{aspetto.label}</Label>
              <RadioGroup
                value={formData.preoccupazioni_futuro[aspetto.id as keyof typeof formData.preoccupazioni_futuro]}
                onValueChange={(value) => 
                  setFormData(prev => ({
                    ...prev,
                    preoccupazioni_futuro: {
                      ...prev.preoccupazioni_futuro,
                      [aspetto.id]: value as ValutazionePreoccupazione
                    }
                  }))
                }
              >
                {VALUTAZIONE_OPTIONS.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${aspetto.id}-${option.value}`} />
                    <Label htmlFor={`${aspetto.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* E1.8 Altro */}
          <div className="space-y-2">
            <Label>E1.8 Altro</Label>
            <RadioGroup
              value={formData.preoccupazioni_futuro.altro}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  preoccupazioni_futuro: {
                    ...prev.preoccupazioni_futuro,
                    altro: value as ValutazionePreoccupazione
                  }
                }))
              }
            >
              {VALUTAZIONE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`altro-preoc-${option.value}`} />
                  <Label htmlFor={`altro-preoc-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>

            {formData.preoccupazioni_futuro.altro !== "0" && (
              <div className="mt-2">
                <Label htmlFor="altro-preoc-spec">Specificare altro</Label>
                <Input
                  id="altro-preoc-spec"
                  value={formData.preoccupazioni_futuro.altro_specificare}
                  onChange={(e) => 
                    setFormData(prev => ({
                      ...prev,
                      preoccupazioni_futuro: {
                        ...prev.preoccupazioni_futuro,
                        altro_specificare: e.target.value
                      }
                    }))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* E2. Obiettivi realizzabili */}
      <div className="space-y-4">
        <Label>E2. Pensando al tuo futuro, quanto ritieni realizzabili i seguenti obiettivi?</Label>
        
        {[
          { id: 'lavoro_piacevole', label: 'Fare un lavoro che mi piace' },
          { id: 'autonomia', label: 'Essere autonomo/a' },
          { id: 'famiglia', label: 'Costruire una famiglia' },
          { id: 'trovare_lavoro', label: 'Trovare un lavoro' },
          { id: 'salute', label: 'Stare in buona salute' },
          { id: 'casa', label: 'Avere una casa' }
        ].map(obiettivo => (
          <div key={obiettivo.id} className="space-y-2">
            <Label>{obiettivo.label}</Label>
            <RadioGroup
              value={formData.obiettivi_realizzabili[obiettivo.id as keyof typeof formData.obiettivi_realizzabili]}
              onValueChange={(value) => 
                setFormData(prev => ({
                  ...prev,
                  obiettivi_realizzabili: {
                    ...prev.obiettivi_realizzabili,
                    [obiettivo.id]: value
                  }
                }))
              }
            >
              {[...VALUTAZIONE_OPTIONS, { value: "9", label: "Non è mio obiettivo" }].map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${obiettivo.id}-${option.value}`} />
                  <Label htmlFor={`${obiettivo.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      {/* E3. Aiuto per il futuro */}
      <div className="space-y-4">
        <Label>E3. Cosa ti aiuterebbe ad affrontare il futuro?</Label>
        <Textarea
          value={formData.aiuto_futuro}
          onChange={(e) => 
            setFormData(prev => ({
              ...prev,
              aiuto_futuro: e.target.value
            }))
          }
          className="min-h-[100px]"
        />
      </div>

      {/* E4. Prontezza uscita */}
      <div className="space-y-4">
        <Label>E4. Pensando al momento in cui uscirai da questa struttura, ti senti pronto ad affrontare la tua vita?</Label>
        <RadioGroup
          value={formData.pronto_uscita.pronto ? "1" : "0"}
          onValueChange={(value) => 
            setFormData(prev => ({
              ...prev,
              pronto_uscita: {
                ...prev.pronto_uscita,
                pronto: value === "1"
              }
            }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="pronto-no" />
            <Label htmlFor="pronto-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="pronto-si" />
            <Label htmlFor="pronto-si">Sì</Label>
          </div>
        </RadioGroup>

        <div className="mt-2">
          <Label>Motivazione:</Label>
          <Textarea
            value={formData.pronto_uscita.motivazione}
            onChange={(e) => 
              setFormData(prev => ({
                ...prev,
                pronto_uscita: {
                  ...prev.pronto_uscita,
                  motivazione: e.target.value
                }
              }))
            }
            placeholder={formData.pronto_uscita.pronto ? "Sì, perché..." : "No, perché..."}
          />
        </div>
      </div>

      {/* E5. Emozioni uscita */}
      <div className="space-y-4">
        <Label>E5. Pensando all'uscita dalla struttura/dal progetto di presa in carico quali emozioni provi?</Label>
        <p className="text-sm text-gray-500">[barrare tutte le caselle pertinenti]</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {EMOZIONI_USCITA.map(emozione => (
            <div key={emozione.id} className="flex items-center space-x-2">
              <Checkbox
                id={`emozione-${emozione.id}`}
                checked={Boolean(formData.emozioni_uscita[emozione.id as keyof typeof formData.emozioni_uscita])}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    emozioni_uscita: {
                      ...prev.emozioni_uscita,
                      [emozione.id]: checked === true
                    }
                  }))
                }
              />
              <Label htmlFor={`emozione-${emozione.id}`}>{emozione.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* E6. Desiderio */}
      <div className="space-y-4">
        <Label>E6. Qual è il tuo più grande desiderio?</Label>
        <Textarea
          value={formData.desiderio}
          onChange={(e) => 
            setFormData(prev => ({
              ...prev,
              desiderio: e.target.value
            }))
          }
          className="min-h-[100px]"
        />
      </div>

      {/* E7. Nota aggiuntiva */}
      <div className="space-y-4">
        <Label>E7. C'è qualche cosa di importante che non ti abbiamo chiesto ma che vorresti aggiungere?</Label>
        <Textarea
          value={formData.nota_aggiuntiva}
          onChange={(e) => 
            setFormData(prev => ({
              ...prev,
              nota_aggiuntiva: e.target.value
            }))
          }
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}

export default function QuestionarioGiovaniNew() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5 // A, B, C, D, E
  const progress = (currentStep / totalSteps) * 100
  
  const [formData, setFormData] = useState<QuestionarioGiovani>(initialFormData)
  const [loading, setLoading] = useState(false)
  
  const { session } = useAuth()
  const router = useRouter()

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await supabase.auth.getSession();
      const isOperatore = session?.data?.session?.user?.user_metadata?.role === 'operatore';
      
      const { data, error } = await supabase
        .from('giovani')
        .insert({
          ...formData,
          fonte: isOperatore ? 'operatore' : 'anonimo',
          created_by: session?.data?.session?.user?.id || null,
          stato: 'nuovo'
        })
        .select()
        .single();

      if (error) throw error;

      // Redirect o mostra messaggio di successo
      router.push('/success');
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      setError('Errore durante il salvataggio del questionario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center mt-2">Step {currentStep} di {totalSteps}</p>
          </div>

          {/* Contenuto dinamico in base allo step */}
          <div className="mb-6">
            {currentStep === 1 && (
              <SectionA formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 2 && (
              <SectionB formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 3 && (
              <SectionC formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 4 && (
              <SectionD formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 5 && (
              <SectionE formData={formData} setFormData={setFormData} />
            )}
          </div>

          {/* Pulsanti navigazione */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button onClick={prevStep} variant="outline">
                Indietro
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="ml-auto">
                Avanti
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto">
                Invia Questionario
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}