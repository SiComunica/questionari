'use client'

import { useState } from 'react'
import type { QuestionarioGiovani } from '@/types/forms'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import type { Database } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type LuogoNascita = {
  italia: boolean
  altro_paese?: string
}

// Definiamo prima i tipi per la famiglia di origine
type FamigliaOrigine = {
  padre: boolean
  madre: boolean
  fratelli: boolean
  nonni: boolean
  altri_parenti: boolean
  altri_conviventi: boolean
}

// Aggiorniamo il tipo Giovane per includere il tipo corretto di famiglia_origine
type Giovane = Omit<Database['public']['Tables']['giovani']['Row'], 'famiglia_origine'> & {
  famiglia_origine: FamigliaOrigine
}

// Aggiungiamo il tipo per i valori dei checkbox
type CheckboxValue = {
  value: boolean
  checked: boolean
}

const TIPI_PERCORSO = [
  'Formazione professionale',
  'Scuola superiore',
  'Università',
  'Tirocinio',
  'Lavoro',
  'Altro'
]

const COLLOCAZIONI = [
  { value: '1', label: 'Ospite di centri antiviolenza' },
  { value: '2', label: 'Ospite di strutture per stranieri' },
  { value: '3', label: 'Ospite di strutture sanitarie' },
  { value: '4', label: 'Ospite di altro tipo di struttura' },
  { value: '5', label: 'Ospite di comunità' }
]

const CLASSI_ETA = [
  { value: '1', label: '18-21 anni' },
  { value: '2', label: '22-24 anni' },
  { value: '3', label: '25-27 anni' },
  { value: '4', label: '28-34 anni' }
]

const TITOLI_STUDIO = [
  { value: '1', label: 'Nessun titolo' },
  { value: '2', label: 'Licenza elementare' },
  { value: '3', label: 'Licenza media' },
  { value: '4', label: 'Qualifica professionale' },
  { value: '5', label: 'Diploma di scuola superiore' },
  { value: '6', label: 'Laurea' },
  { value: '9', label: 'Non so' }
]

const CONDIZIONI_LAVORO = [
  { value: '1', label: 'Ha un lavoro stabile' },
  { value: '2', label: 'Ha un lavoro saltuario' },
  { value: '3', label: 'Non lavora' },
  { value: '4', label: 'Pensionato/a' },
  { value: '9', label: 'Non so' }
]

const MOTIVI_NON_STUDIO = [
  { value: '1', label: 'Ho completato gli studi' },
  { value: '2', label: 'Non mi piace studiare' },
  { value: '3', label: 'Non ho la possibilità di studiare' },
  { value: '4', label: 'Ho necessità di lavorare' }
]

const LIVELLI_UTILITA = [
  { value: '0', label: 'Per niente' },
  { value: '1', label: 'Poco' },
  { value: '2', label: 'Abbastanza' },
  { value: '3', label: 'Molto' }
]

const LIVELLI_OBIETTIVI = [
  { value: '0', label: 'Per niente' },
  { value: '1', label: 'Poco' },
  { value: '2', label: 'Abbastanza' },
  { value: '3', label: 'Molto' },
  { value: '9', label: 'Non è mio obiettivo' }
]

const SESSO = [
  { value: '1', label: 'Maschio' },
  { value: '2', label: 'Femmina' },
  { value: '3', label: 'Altro / Preferisco non rispondere' }
]

const CITTADINANZA = [
  { value: '1', label: 'Italiana' },
  { value: '2', label: 'Di altro Paese U.E.' },
  { value: '3', label: 'Di paese extraU.E.' }
]

const PERMESSO_SOGGIORNO = [
  { value: '1', label: 'Con permesso di soggiorno' },
  { value: '2', label: 'In attesa di permesso di soggiorno' },
  { value: '3', label: 'Senza permesso di soggiorno' }
]

const TEMPO_STRUTTURA = [
  { value: '1', label: 'Da meno di 6 mesi' },
  { value: '2', label: 'Da 6 mesi a 1 anno' },
  { value: '3', label: 'Da 1 a 3 anni' },
  { value: '4', label: 'Più di 3 anni' }
]

const STRUTTURE_PRECEDENTI = [
  { value: '1', label: 'No, mai' },
  { value: '2', label: 'Sì, una volta' },
  { value: '3', label: 'Sì, più di una volta' }
]

// Aggiungiamo il tipo per l'orientamento al lavoro
type OrientamentoLavoro = {
  usufruito: boolean
  luoghi: string[]
  utilita: string
}

// Aggiorniamo il tipo ArrayFields per includere orientamento_luoghi
type ArrayFields = {
  fattori_vulnerabilita: string[]
  attivita_precedenti: string[]
  attivita_attuali: string[]
  condizioni_lavoro: string[]
  motivi_non_studio: string[]
  livelli_utilita: string[]
  livelli_obiettivi: string[]
  ricerca_lavoro: string[]
  orientamento_luoghi: string[]
}

// Aggiorniamo il tipo BooleanFields per includere famiglia_origine
type BooleanFields = {
  abitazione_precedente: Record<string, boolean>
  figure_aiuto: Record<string, boolean>
  emozioni_uscita: Record<string, boolean>
  famiglia_origine: FamigliaOrigine
}

// Aggiorniamo il tipo FormData
type FormData = Omit<Giovane, 'id' | 'created_at' | 'created_by' | 'precedenti_strutture'> & {
  condizioni_lavoro: string[]
  motivi_non_studio: string[]
  livelli_utilita: string[]
  livelli_obiettivi: string[]
  famiglia_origine: Record<string, boolean>
  madre: {
    titolo_studio: string
    condizione_lavoro: string
  }
  padre: {
    titolo_studio: string
    condizione_lavoro: string
  }
  ricerca_lavoro: string[]
  aspetti_lavoro: Record<string, string>
  curriculum_vitae: string
  centro_impiego: string
  lavoro_autonomo: string
  corso_formazione: {
    frequenta: boolean
    descrizione: string
  }
  lavoro_attuale: {
    occupato: boolean
    descrizione: string
  }
  precedenti_strutture: number
  orientamento_lavoro: OrientamentoLavoro
  orientamento_luoghi: string[]
}

// Aggiungiamo le costanti per i nuovi campi
const FAMIGLIA_ORIGINE = [
  { id: 'padre', label: 'Padre' },
  { id: 'madre', label: 'Madre' },
  { id: 'fratelli', label: 'Fratelli/Sorelle' },
  { id: 'nonni', label: 'Nonni/Nonne' },
  { id: 'altri_parenti', label: 'Altri parenti' },
  { id: 'altri_conviventi', label: 'Altri conviventi non parenti' }
]

const CONDIZIONE_LAVORO = [
  { value: '1', label: 'Ha un lavoro stabile' },
  { value: '2', label: 'Ha un lavoro saltuario' },
  { value: '3', label: 'Non lavora' },
  { value: '4', label: 'Pensionato/a' },
  { value: '9', label: 'Non so' }
]

// Manteniamo solo la versione con id e label
const FATTORI_VULNERABILITA = [
  { id: 'disagio_economico', label: 'Disagio economico' },
  { id: 'disagio_familiare', label: 'Disagio familiare' },
  { id: 'disagio_psicologico', label: 'Disagio psicologico' },
  { id: 'dipendenze', label: 'Dipendenze' },
  { id: 'problemi_legali', label: 'Problemi legali' },
  { id: 'problemi_salute', label: 'Problemi di salute' },
  { id: 'stranieri', label: 'Stranieri con problemi legati alla condizione migratoria' },
  { id: 'tratta', label: 'Vittime di tratta' },
  { id: 'violenza', label: 'Vittime di violenza domestica' },
  { id: 'allontanati', label: 'Persone allontanate dalla famiglia' },
  { id: 'detenuti', label: 'Detenuti' },
  { id: 'ex_detenuti', label: 'Ex detenuti' },
  { id: 'penale_esterna', label: 'Persone in esecuzione penale esterna' },
  { id: 'indigenti', label: 'Indigenti e/o senza dimora' },
  { id: 'rom', label: 'Rom e Sinti' },
  { id: 'disabilita_fisica', label: 'Persone con disabilità fisica' },
  { id: 'disabilita_cognitiva', label: 'Persone con disabilità cognitiva' },
  { id: 'disturbi_psichiatrici', label: 'Persone con disturbi psichiatrici' },
  { id: 'genitori_precoci', label: 'Genitori precoci' },
  { id: 'orientamento', label: 'Persone con problemi legati all\'orientamento sessuale' },
  { id: 'altro', label: 'Altro' }
]

// Aggiorniamo il tipo per i fattori di vulnerabilità
type FattoreVulnerabilita = {
  id: string
  label: string
}

const RICERCA_LAVORO = [
  { id: 'centro_impiego', label: 'Centro per l\'impiego (ex collocamento)' },
  { id: 'sportelli', label: 'Sportelli di orientamento al lavoro' },
  { id: 'inps', label: 'INPS e patronati' },
  { id: 'servizi_sociali', label: 'Servizi sociali' },
  { id: 'agenzie', label: 'Agenzie interinali' },
  { id: 'cooperative', label: 'Cooperative sociali' },
  { id: 'struttura', label: 'Struttura ospitante' },
  { id: 'conoscenti', label: 'Amici, parenti, conoscenti' },
  { id: 'portali', label: 'Portali online per la ricerca del lavoro' },
  { id: 'social', label: 'Social network' },
  { id: 'altro', label: 'Altro' }
]

const ASPETTI_LAVORO = [
  { id: 'stabilita', label: 'Stabilità del posto di lavoro' },
  { id: 'flessibilita', label: 'Flessibilità dell\'orario di lavoro' },
  { id: 'valorizzazione', label: 'Valorizzazione delle mie capacità' },
  { id: 'retribuzione', label: 'Lavoro ben pagato' },
  { id: 'fatica', label: 'Lavoro poco faticoso' },
  { id: 'sicurezza', label: 'Sicurezza sul lavoro' },
  { id: 'utilita', label: 'Utilità del lavoro per la società' },
  { id: 'vicinanza', label: 'Vicinanza alla propria casa' }
]

// Aggiungiamo costanti per le nuove domande
const CURRICULUM = [
  { value: '0', label: 'No' },
  { value: '1', label: 'Sì' }
]

const CENTRO_IMPIEGO = [
  { value: '0', label: 'No' },
  { value: '1', label: 'Sì' }
]

const LAVORO_AUTONOMO = [
  { value: '0', label: 'No' },
  { value: '1', label: 'Sì' }
]

// Aggiungiamo la costante per le attività attuali
const ATTIVITA_ATTUALI = [
  { id: 'studio', label: 'Studio' },
  { id: 'formazione', label: 'Formazione' },
  { id: 'lavoro', label: 'Lavoro' },
  { id: 'ricerca_lavoro', label: 'Ricerca attiva di un lavoro' },
  { id: 'nessuna', label: 'Nessuna attività' }
]

export default function QuestionarioGiovani() {
  const router = useRouter()
  const { userType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Aggiorniamo lo stato iniziale
  const [formData, setFormData] = useState<FormData>({
    percorso_autonomia: {
      presente: false,
      tipo: ''
    },
    tipo_percorso: null,
    vive_in_struttura: false,
    collocazione_attuale: {
      tipo: '',
      comunita_specificare: ''
    },
    fattori_vulnerabilita: [],
    sesso: '',
    classe_eta: '',
    luogo_nascita: {
      italia: true,
      altro_paese: ''
    },
    cittadinanza: '',
    permesso_soggiorno: false,
    tempo_in_struttura: '',
    precedenti_strutture: 1,
    famiglia_origine: {
      padre: false,
      madre: false,
      fratelli: false,
      nonni: false,
      altri_parenti: false,
      altri_conviventi: false
    },
    titolo_studio: '',
    attivita_precedenti: [],
    attivita_attuali: [],
    condizioni_lavoro: [],
    motivi_non_studio: [],
    livelli_utilita: [],
    livelli_obiettivi: [],
    orientamento_lavoro: {
      usufruito: false,
      luoghi: [],
      utilita: '0'
    },
    orientamento_luoghi: [],
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
    figure_aiuto: {
      padre: false,
      madre: false,
      fratelli: false,
      parenti: false,
      amici: false,
      tutore: false,
      insegnanti: false,
      figure_sostegno: false,
      volontari: false,
      altri: false,
      altri_specificare: ''
    },
    preoccupazioni_futuro: {
      pregiudizi: '0',
      mancanza_lavoro: '0',
      mancanza_aiuto: '0',
      mancanza_casa: '0',
      solitudine: '0',
      salute: '0',
      perdita_persone: '0',
      altro: '0',
      altro_specificare: ''
    },
    obiettivi_realizzabili: {
      lavoro_piacevole: '0',
      autonomia: '0',
      famiglia: '0',
      trovare_lavoro: '0',
      salute: '0',
      casa: '0'
    },
    aiuto_futuro: '',
    pronto_uscita: {
      risposta: false,
      motivazione: ''
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
    desiderio: '',
    note_aggiuntive: '',
    madre: {
      titolo_studio: '',
      condizione_lavoro: ''
    },
    padre: {
      titolo_studio: '',
      condizione_lavoro: ''
    },
    ricerca_lavoro: [],
    aspetti_lavoro: {
      stabilita: '0',
      flessibilita: '0',
      valorizzazione: '0',
      retribuzione: '0',
      fatica: '0',
      sicurezza: '0',
      utilita: '0',
      vicinanza: '0'
    },
    curriculum_vitae: '0',
    centro_impiego: '0',
    lavoro_autonomo: '0',
    corso_formazione: {
      frequenta: false,
      descrizione: ''
    },
    lavoro_attuale: {
      occupato: false,
      descrizione: ''
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Generiamo un ID univoco usando timestamp + random string
      const id = `G${Date.now()}${Math.random().toString(36).substr(2, 5)}`

      const { error } = await supabase
        .from('giovani')
        .insert({
          ...formData,
          id,
          created_at: new Date().toISOString(),
          created_by: 'anonimo 9999'
        })

      if (error) throw error

      // Redirect alla pagina di successo o dashboard
      router.push('/dashboard/anonimo?success=true')
    } catch (err) {
      console.error('Errore durante il salvataggio:', err)
      setError('Errore durante il salvataggio del questionario. Riprova più tardi.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleArrayCheckboxChange = (array: keyof ArrayFields, value: string) => {
    setFormData(prev => ({
      ...prev,
      [array]: prev[array].includes(value)
        ? prev[array].filter(item => item !== value)
        : [...prev[array], value]
    }))
  }

  const handleBooleanCheckboxChange = (
    object: keyof BooleanFields,
    key: string,
    checked: boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [object]: {
        ...prev[object],
        [key]: checked
      }
    }))
  }

  // Mostra eventuali errori
  if (error) {
    return (
      <div className="p-4 text-red-600 text-center">
        {error}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Questionario Giovani
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Compila tutti i campi richiesti
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Percorso di autonomia */}
          <div className="sm:col-span-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="percorso_autonomia"
                name="percorso_autonomia"
                checked={formData.percorso_autonomia.presente}
                onChange={handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="percorso_autonomia" className="ml-2 block text-sm text-gray-900">
                In percorso di autonomia
              </label>
            </div>
          </div>

          {formData.percorso_autonomia.presente && (
            <div className="sm:col-span-3">
              <label htmlFor="tipo_percorso" className="block text-sm font-medium text-gray-700">
                Tipo di Percorso
              </label>
              <select
                id="tipo_percorso"
                name="tipo_percorso"
                required
                value={formData.tipo_percorso || ''}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Seleziona...</option>
                {TIPI_PERCORSO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          )}

          {/* Vive in struttura e collocazione */}
          <div className="sm:col-span-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="vive_in_struttura"
                name="vive_in_struttura"
                checked={formData.vive_in_struttura}
                onChange={handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="vive_in_struttura" className="ml-2 block text-sm text-gray-900">
                Vive in struttura
              </label>
            </div>
          </div>

          {!formData.vive_in_struttura && (
            <div className="sm:col-span-3">
              <label htmlFor="collocazione_attuale" className="block text-sm font-medium text-gray-700">
                Collocazione Attuale
              </label>
              <select
                id="collocazione_attuale"
                name="collocazione_attuale"
                required
                value={formData.collocazione_attuale.tipo}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Seleziona...</option>
                {COLLOCAZIONI.map(collocazione => (
                  <option key={collocazione.value} value={collocazione.value}>{collocazione.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Dati personali */}
          <div className="sm:col-span-3">
            <label htmlFor="sesso" className="block text-sm font-medium text-gray-700">
              Sesso
            </label>
            <select
              id="sesso"
              name="sesso"
              required
              value={formData.sesso}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {SESSO.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="classe_eta" className="block text-sm font-medium text-gray-700">
              Classe di Età
            </label>
            <select
              id="classe_eta"
              name="classe_eta"
              required
              value={formData.classe_eta}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {CLASSI_ETA.map(classe => (
                <option key={classe.value} value={classe.value}>{classe.label}</option>
              ))}
            </select>
          </div>

          {/* B3-B4: Luogo nascita e cittadinanza */}
          <div className="space-y-4">
            <Label>B3. Luogo di nascita</Label>
            <RadioGroup
              value={formData.luogo_nascita.italia ? "1" : "2"}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                luogo_nascita: {
                  ...prev.luogo_nascita,
                  italia: value === "1"
                }
              }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="nascita_italia" />
                <Label htmlFor="nascita_italia">Italia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="nascita_estero" />
                <Label htmlFor="nascita_estero">Altro Paese</Label>
              </div>
            </RadioGroup>

            {!formData.luogo_nascita.italia && (
              <div className="space-y-2">
                <Label htmlFor="altro_paese">Specificare il Paese</Label>
                <Input
                  id="altro_paese"
                  value={formData.luogo_nascita.altro_paese || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    luogo_nascita: {
                      ...prev.luogo_nascita,
                      altro_paese: e.target.value
                    }
                  }))}
                />
              </div>
            )}

            <Label>B4. Cittadinanza</Label>
            <RadioGroup
              value={formData.cittadinanza}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                cittadinanza: value
              }))}
            >
              {CITTADINANZA.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`cittadinanza_${option.value}`} />
                  <Label htmlFor={`cittadinanza_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* B6-B7: Tempo in struttura */}
          <div className="space-y-4">
            <Label>B6. Da quanto tempo sei in questa struttura/progetto (attuale ingresso)?</Label>
            <RadioGroup
              value={formData.tempo_in_struttura}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                tempo_in_struttura: value
              }))}
            >
              {TEMPO_STRUTTURA.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`tempo_${option.value}`} />
                  <Label htmlFor={`tempo_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>

            <Label>B7. In precedenza, sei stato ospite di altre strutture o preso in carico da altro progetto?</Label>
            <RadioGroup
              value={formData.precedenti_strutture.toString()}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                precedenti_strutture: parseInt(value, 10)
              }))}
            >
              {STRUTTURE_PRECEDENTI.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`precedenti_${option.value}`} />
                  <Label htmlFor={`precedenti_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Sezione B: Domande socio-anagrafiche */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE B: Domande socio-anagrafiche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sesso */}
          <div className="space-y-4">
            <Label>B1. Sesso</Label>
            <RadioGroup
              value={formData.sesso}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                sesso: value
              }))}
            >
              {SESSO.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`sesso_${option.value}`} />
                  <Label htmlFor={`sesso_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Classe di età */}
          <div className="space-y-4">
            <Label>B2. Classe di età</Label>
            <RadioGroup
              value={formData.classe_eta}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                classe_eta: value
              }))}
            >
              {CLASSI_ETA.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`eta_${option.value}`} />
                  <Label htmlFor={`eta_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Luogo di nascita */}
          <div className="space-y-4">
            <Label>B3. Luogo di nascita</Label>
            <RadioGroup
              value={formData.luogo_nascita.italia ? "1" : "2"}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                luogo_nascita: {
                  ...prev.luogo_nascita,
                  italia: value === "1"
                }
              }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="nascita_italia" />
                <Label htmlFor="nascita_italia">Italia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="nascita_estero" />
                <Label htmlFor="nascita_estero">Altro Paese</Label>
              </div>
            </RadioGroup>

            {!formData.luogo_nascita.italia && (
              <div className="space-y-2">
                <Label htmlFor="altro_paese">Specificare il Paese</Label>
                <Input
                  id="altro_paese"
                  value={formData.luogo_nascita.altro_paese || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    luogo_nascita: {
                      ...prev.luogo_nascita,
                      altro_paese: e.target.value
                    }
                  }))}
                />
              </div>
            )}
          </div>

          {/* ... continua con gli altri campi della sezione B ... */}
        </CardContent>
      </Card>

      {/* Sezione C: Formazione e lavoro */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE C: Formazione e lavoro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* C1: Titolo di studio */}
          <div className="space-y-4">
            <Label>C1. Quale titolo di studio possiedi?</Label>
            <RadioGroup
              value={formData.titolo_studio}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                titolo_studio: value
              }))}
            >
              {TITOLI_STUDIO.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`titolo_${option.value}`} />
                  <Label htmlFor={`titolo_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* C2: Attività precedenti */}
          <div className="space-y-4">
            <Label>C2. Prima di essere inserito nella struttura/progetto quali attività svolgevi?</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="att_prec_studio"
                  checked={formData.attivita_precedenti.includes('studiavo')}
                  onChange={() => handleArrayCheckboxChange('attivita_precedenti', 'studiavo')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="att_prec_studio">Studiavo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="att_prec_lavoro_stabile"
                  checked={formData.attivita_precedenti.includes('lavoravo_stabilmente')}
                  onChange={() => handleArrayCheckboxChange('attivita_precedenti', 'lavoravo_stabilmente')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="att_prec_lavoro_stabile">Lavoravo stabilmente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="att_prec_lavoro_saltuario"
                  checked={formData.attivita_precedenti.includes('lavoravo_saltuariamente')}
                  onChange={() => handleArrayCheckboxChange('attivita_precedenti', 'lavoravo_saltuariamente')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="att_prec_lavoro_saltuario">Lavoravo saltuariamente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="att_prec_formazione"
                  checked={formData.attivita_precedenti.includes('corso_formazione')}
                  onChange={() => handleArrayCheckboxChange('attivita_precedenti', 'corso_formazione')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="att_prec_formazione">Frequentavo un corso di formazione</Label>
              </div>
            </div>
          </div>

          {/* C3-C4: Orientamento al lavoro */}
          <div className="space-y-4">
            <Label>C3. Hai mai usufruito di servizi di orientamento al lavoro?</Label>
            <RadioGroup
              value={formData.orientamento_lavoro.usufruito ? "1" : "0"}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                orientamento_lavoro: {
                  ...prev.orientamento_lavoro,
                  usufruito: value === "1"
                }
              }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="orientamento_si" />
                <Label htmlFor="orientamento_si">Sì</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="orientamento_no" />
                <Label htmlFor="orientamento_no">No</Label>
              </div>
            </RadioGroup>

            {formData.orientamento_lavoro.usufruito && (
              <>
                <Label>C4. Se sì, dove?</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="orientamento_scuola"
                      checked={formData.orientamento_lavoro.luoghi.includes('scuola')}
                      onChange={() => handleArrayCheckboxChange('orientamento_luoghi', 'scuola')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="orientamento_scuola">A scuola/università</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="orientamento_formazione"
                      checked={formData.orientamento_lavoro.luoghi.includes('formazione')}
                      onChange={() => handleArrayCheckboxChange('orientamento_luoghi', 'formazione')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="orientamento_formazione">Presso enti di formazione professionale</Label>
                  </div>
                  {/* ... altri luoghi ... */}
                </div>
                
                <Label>C4_BIS. Quanto lo ritieni utile?</Label>
                  <RadioGroup
                  value={formData.orientamento_lavoro.utilita}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      orientamento_lavoro: {
                        ...prev.orientamento_lavoro,
                        utilita: value
                      }
                    }))}
                  >
                    {LIVELLI_UTILITA.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`utilita_${option.value}`} />
                        <Label htmlFor={`utilita_${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
              </>
            )}
          </div>

          {/* C5: Attività attuali */}
          <div className="space-y-4">
            <Label>C5. Attualmente in quale attività sei impegnato/a?</Label>
            <div className="grid grid-cols-2 gap-4">
              {ATTIVITA_ATTUALI.map(attivita => (
                <div key={attivita.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`attivita_${attivita.id}`}
                    checked={formData.attivita_attuali.includes(attivita.id)}
                    onChange={() => handleArrayCheckboxChange('attivita_attuali', attivita.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`attivita_${attivita.id}`}>{attivita.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* C9: Ricerca lavoro */}
          <div className="space-y-4">
            <Label>C9. A chi ti rivolgeresti per cercare un lavoro? (Massimo tre scelte)</Label>
            <div className="grid grid-cols-2 gap-4">
              {RICERCA_LAVORO.map(opzione => (
                <div key={opzione.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`ricerca_${opzione.id}`}
                    checked={formData.ricerca_lavoro.includes(opzione.id)}
                    onChange={() => handleArrayCheckboxChange('ricerca_lavoro', opzione.id)}
                    disabled={formData.ricerca_lavoro.length >= 3 && !formData.ricerca_lavoro.includes(opzione.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`ricerca_${opzione.id}`}>{opzione.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* C13: Aspetti del lavoro */}
          <div className="space-y-4">
            <Label>C13. Pensando al tuo futuro lavorativo, quanta importanza attribuisci ai seguenti aspetti?</Label>
            <div className="space-y-6">
              {ASPETTI_LAVORO.map(aspetto => (
                <div key={aspetto.id} className="space-y-2">
                  <Label>{aspetto.label}</Label>
                  <RadioGroup
                    value={formData.aspetti_lavoro[aspetto.id]}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      aspetti_lavoro: {
                        ...prev.aspetti_lavoro,
                        [aspetto.id]: value
                      }
                    }))}
                  >
                    {LIVELLI_UTILITA.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`aspetto_${aspetto.id}_${option.value}`} />
                        <Label htmlFor={`aspetto_${aspetto.id}_${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>

          {/* C10: Curriculum vitae */}
          <div className="space-y-4">
            <Label>C10. Hai mai compilato un curriculum vitae?</Label>
            <RadioGroup
              value={formData.curriculum_vitae}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                curriculum_vitae: value
              }))}
            >
              {CURRICULUM.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`cv_${option.value}`} />
                  <Label htmlFor={`cv_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* C11: Centro per l'impiego */}
          <div className="space-y-4">
            <Label>C11. Ti sei mai rivolto al Centro per l'impiego (ex collocamento)?</Label>
            <RadioGroup
              value={formData.centro_impiego}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                centro_impiego: value
              }))}
            >
              {CENTRO_IMPIEGO.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`cpi_${option.value}`} />
                  <Label htmlFor={`cpi_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* C12: Lavoro autonomo */}
          <div className="space-y-4">
            <Label>C12. Hai mai pensato di avviare un'attività di lavoro autonomo?</Label>
            <RadioGroup
              value={formData.lavoro_autonomo}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                lavoro_autonomo: value
              }))}
            >
              {LAVORO_AUTONOMO.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`autonomo_${option.value}`} />
                  <Label htmlFor={`autonomo_${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* C7: Corso di formazione */}
          <div className="space-y-4">
            <Label>C7. Se sei impegnato in attività formativa, quale corso frequenti?</Label>
            <Textarea
              id="corso_formazione"
              value={formData.corso_formazione.descrizione || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                corso_formazione: {
                  ...prev.corso_formazione,
                  descrizione: e.target.value
                }
              }))}
              className="min-h-[100px]"
            />
          </div>

          {/* C8: Lavoro attuale */}
          <div className="space-y-4">
            <Label>C8. Se sei impegnato in attività lavorative, qual è il tuo lavoro?</Label>
            <Textarea
              id="lavoro_attuale"
              placeholder="Indicare professione, tipo di posto di lavoro e tipo di contratto"
              value={formData.lavoro_attuale.descrizione || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                lavoro_attuale: {
                  ...prev.lavoro_attuale,
                  descrizione: e.target.value
                }
              }))}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sezione D: Area relazionale */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE D: Area relazionale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* D1: Abitazione precedente */}
          <div className="space-y-4">
            <Label>D1. Con chi abitavi prima di entrare in questa struttura?</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.abitazione_precedente).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`abitazione_${key}`}
                    checked={value}
                    onChange={(e) => handleBooleanCheckboxChange('abitazione_precedente', key, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`abitazione_${key}`}>
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* D2: Figure di aiuto */}
          <div className="space-y-4">
            <Label>D2. A chi puoi rivolgerti per un aiuto?</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.figure_aiuto).map(([key, value]) => {
                if (key === 'altri_specificare') return null;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`aiuto_${key}`}
                      checked={Boolean(value)}
                      onChange={(e) => handleBooleanCheckboxChange('figure_aiuto', key, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`aiuto_${key}`}>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                );
              })}
            </div>

            {formData.figure_aiuto.altri && (
              <div className="space-y-2">
                <Label htmlFor="aiuto_altri_spec">Specificare altre persone</Label>
                <Input
                  id="aiuto_altri_spec"
                  value={formData.figure_aiuto.altri_specificare || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    figure_aiuto: {
                      ...prev.figure_aiuto,
                      altri_specificare: e.target.value
                    }
                  }))}
                />
              </div>
            )}
          </div>

          {/* ... altri campi della sezione D ... */}
        </CardContent>
      </Card>

      {/* Sezione E: Aspettative e preoccupazioni per il futuro */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE E: Aspettative e preoccupazioni per il futuro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* E1: Preoccupazioni */}
          <div className="space-y-4">
            <Label>E1. Quanto ti preoccupano i seguenti aspetti per il tuo futuro?</Label>
            <div className="space-y-6">
              {Object.entries(formData.preoccupazioni_futuro).map(([key, value]) => {
                if (key === 'altro_specificare') return null;
                return (
                  <div key={key} className="space-y-2">
                    <Label>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                    <RadioGroup
                      value={value}
                      onValueChange={(newValue) => setFormData(prev => ({
                        ...prev,
                        preoccupazioni_futuro: {
                          ...prev.preoccupazioni_futuro,
                          [key]: newValue
                        }
                      }))}
                    >
                      {LIVELLI_UTILITA.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`preoc_${key}_${option.value}`} />
                          <Label htmlFor={`preoc_${key}_${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                );
              })}
            </div>
          </div>

          {/* E2: Obiettivi realizzabili */}
          <div className="space-y-4">
            <Label>E2. Quanto ritieni realizzabili i seguenti obiettivi?</Label>
            <div className="space-y-6">
              {Object.entries(formData.obiettivi_realizzabili).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label>
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Label>
                  <RadioGroup
                    value={value}
                    onValueChange={(newValue) => setFormData(prev => ({
                      ...prev,
                      obiettivi_realizzabili: {
                        ...prev.obiettivi_realizzabili,
                        [key]: newValue
                      }
                    }))}
                  >
                    {LIVELLI_OBIETTIVI.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`obj_${key}_${option.value}`} />
                        <Label htmlFor={`obj_${key}_${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>

          {/* E3: Aiuto futuro */}
          <div className="space-y-4">
            <Label htmlFor="aiuto_futuro">
              E3. Quando uscirai dalla struttura/progetto, a chi pensi di poterti rivolgere in caso di bisogno?
            </Label>
            <Textarea
              id="aiuto_futuro"
              value={formData.aiuto_futuro || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                aiuto_futuro: e.target.value
              }))}
              className="min-h-[100px]"
            />
          </div>

          {/* E4: Pronto per l'uscita */}
          <div className="space-y-4">
            <Label>E4. Ti senti pronto/a per l'uscita dalla struttura/progetto?</Label>
            <RadioGroup
              value={formData.pronto_uscita.risposta ? "1" : "0"}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                pronto_uscita: {
                  ...prev.pronto_uscita,
                  risposta: value === "1"
                }
              }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="pronto_si" />
                <Label htmlFor="pronto_si">Sì</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="pronto_no" />
                <Label htmlFor="pronto_no">No</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="pronto_motivazione">Perché?</Label>
              <Textarea
                id="pronto_motivazione"
                value={formData.pronto_uscita.motivazione || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pronto_uscita: {
                    ...prev.pronto_uscita,
                    motivazione: e.target.value
                  }
                }))}
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* E5: Emozioni */}
          <div className="space-y-4">
            <Label>E5. Quali emozioni provi pensando all'uscita dalla struttura/progetto?</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.emozioni_uscita).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`emozione_${key}`}
                    checked={Boolean(value)}
                    onChange={(e) => handleBooleanCheckboxChange('emozioni_uscita', key, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`emozione_${key}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* E6: Desiderio */}
          <div className="space-y-4">
            <Label htmlFor="desiderio">
              E6. Se potessi esprimere un desiderio per il tuo futuro, quale sarebbe?
            </Label>
            <Textarea
              id="desiderio"
              value={formData.desiderio || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                desiderio: e.target.value
              }))}
              className="min-h-[100px]"
            />
          </div>

          {/* Note aggiuntive */}
          <div className="space-y-4">
            <Label htmlFor="note">Note aggiuntive</Label>
            <Textarea
              id="note"
              value={formData.note_aggiuntive || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                note_aggiuntive: e.target.value
              }))}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pulsante di submit */}
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Invio in corso...' : 'Invia Questionario'}
          </button>
        </div>
      </div>
    </form>
  )
}