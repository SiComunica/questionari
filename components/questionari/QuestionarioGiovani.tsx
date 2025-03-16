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

type Giovane = Database['public']['Tables']['giovani']['Row']

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

const FATTORI_VULNERABILITA = [
  'Disagio economico',
  'Disagio familiare',
  'Disagio psicologico',
  'Dipendenze',
  'Problemi legali',
  'Problemi di salute',
  'Altro'
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

// Aggiorniamo i tipi per i campi array e booleani
type ArrayFields = {
  fattori_vulnerabilita: string[]
  attivita_precedenti: string[]
  attivita_attuali: string[]
  condizioni_lavoro: string[]
  motivi_non_studio: string[]
  livelli_utilita: string[]
  livelli_obiettivi: string[]
}

type BooleanFields = {
  abitazione_precedente: Record<string, boolean>
  figure_aiuto: Record<string, boolean>
  emozioni_uscita: Record<string, boolean>
}

// Aggiorniamo i tipi per includere tutti i campi necessari
type FormData = Omit<Giovane, 'id' | 'created_at' | 'created_by'> & {
  condizioni_lavoro: string[]
  motivi_non_studio: string[]
  livelli_utilita: string[]
  livelli_obiettivi: string[]
}

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
    precedenti_strutture: 0,
    famiglia_origine: '',
    titolo_studio: '',
    attivita_precedenti: [],
    attivita_attuali: [],
    condizioni_lavoro: [],
    motivi_non_studio: [],
    livelli_utilita: [],
    livelli_obiettivi: [],
    orientamento_lavoro: {
      usufruito: false,
      utilita: '',
      luoghi: []
    },
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
    note_aggiuntive: ''
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
        [key]: checked as boolean
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

          {/* Luogo di nascita */}
          <div className="space-y-4">
            <Label>B3. Luogo di nascita</Label>
            <RadioGroup
              value={formData.luogo_nascita.italia ? '1' : '2'}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                luogo_nascita: {
                  italia: value === '1',
                  altro_paese: value === '2' ? prev.luogo_nascita.altro_paese : undefined
                } as LuogoNascita
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
                    } as LuogoNascita
                  }))}
                />
              </div>
            )}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="cittadinanza" className="block text-sm font-medium text-gray-700">
              Cittadinanza
            </label>
            <select
              id="cittadinanza"
              name="cittadinanza"
              required
              value={formData.cittadinanza}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {CITTADINANZA.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {formData.cittadinanza !== 'Italiana' && (
            <div className="sm:col-span-3">
              <label htmlFor="permesso_soggiorno" className="block text-sm font-medium text-gray-700">
                Permesso di Soggiorno
              </label>
              <select
                id="permesso_soggiorno"
                name="permesso_soggiorno"
                required
                value={formData.permesso_soggiorno ? '1' : '3'}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Seleziona...</option>
                <option value="1">Con permesso di soggiorno</option>
                <option value="2">In attesa di permesso di soggiorno</option>
                <option value="3">Senza permesso di soggiorno</option>
              </select>
            </div>
          )}

          {/* Informazioni sulla permanenza */}
          <div className="sm:col-span-3">
            <label htmlFor="tempo_in_struttura" className="block text-sm font-medium text-gray-700">
              Tempo in Struttura
            </label>
            <select
              id="tempo_in_struttura"
              name="tempo_in_struttura"
              required
              value={formData.tempo_in_struttura}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {TEMPO_STRUTTURA.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="precedenti_strutture" className="block text-sm font-medium text-gray-700">
              Precedenti Strutture
            </label>
            <select
              id="precedenti_strutture"
              name="precedenti_strutture"
              required
              value={formData.precedenti_strutture}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {STRUTTURE_PRECEDENTI.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Fattori di vulnerabilità */}
          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Fattori di Vulnerabilità</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {FATTORI_VULNERABILITA.map(fattore => (
                  <div key={fattore} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.fattori_vulnerabilita.includes(fattore)}
                        onChange={() => handleArrayCheckboxChange('fattori_vulnerabilita', fattore)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{fattore}</label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Famiglia di origine */}
          <div className="sm:col-span-3">
            <label htmlFor="famiglia_origine" className="block text-sm font-medium text-gray-700">
              Famiglia di Origine
            </label>
            <select
              id="famiglia_origine"
              name="famiglia_origine"
              required
              value={formData.famiglia_origine}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {/* Add famiglia_origine options here */}
            </select>
          </div>

          {/* Titolo di studio e attività */}
          <div className="sm:col-span-3">
            <label htmlFor="titolo_studio" className="block text-sm font-medium text-gray-700">
              Titolo di Studio
            </label>
            <select
              id="titolo_studio"
              name="titolo_studio"
              required
              value={formData.titolo_studio}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {TITOLI_STUDIO.map(titolo => (
                <option key={titolo.value} value={titolo.value}>{titolo.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Condizioni di Lavoro</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {CONDIZIONI_LAVORO.map(condizione => (
                  <div key={condizione.value} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.condizioni_lavoro.includes(condizione.value)}
                        onChange={() => handleArrayCheckboxChange('condizioni_lavoro', condizione.value)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{condizione.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Motivi Non Studio</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {MOTIVI_NON_STUDIO.map(motivo => (
                  <div key={motivo.value} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.motivi_non_studio.includes(motivo.value)}
                        onChange={() => handleArrayCheckboxChange('motivi_non_studio', motivo.value)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{motivo.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Livelli di Utilità</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {LIVELLI_UTILITA.map(livello => (
                  <div key={livello.value} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.livelli_utilita.includes(livello.value)}
                        onChange={() => handleArrayCheckboxChange('livelli_utilita', livello.value)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{livello.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Livelli di Obiettivi</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {LIVELLI_OBIETTIVI.map(livello => (
                  <div key={livello.value} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.livelli_obiettivi.includes(livello.value)}
                        onChange={() => handleArrayCheckboxChange('livelli_obiettivi', livello.value)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{livello.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
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
              value={formData.luogo_nascita.italia ? '1' : '2'}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                luogo_nascita: {
                  italia: value === '1',
                  altro_paese: value === '2' ? prev.luogo_nascita.altro_paese : undefined
                } as LuogoNascita
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
                    } as LuogoNascita
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
                  id="attivita_studio"
                  checked={formData.attivita_precedenti.includes('studio')}
                  onChange={() => handleArrayCheckboxChange('attivita_precedenti', 'studio')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="attivita_studio">Studiavo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="attivita_lavoro_stabile"
                  checked={formData.attivita_precedenti.includes('lavoro_stabile')}
                  onChange={() => handleArrayCheckboxChange('attivita_precedenti', 'lavoro_stabile')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="attivita_lavoro_stabile">Lavoravo stabilmente</Label>
              </div>
              {/* ... altri checkbox per attività precedenti ... */}
            </div>
          </div>

          {/* C3-C4: Orientamento al lavoro */}
          <div className="space-y-4">
            <Label>C3. Hai mai usufruito di servizi di orientamento al lavoro?</Label>
            <RadioGroup
              value={formData.orientamento_lavoro?.usufruito ? "1" : "0"}
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

            {formData.orientamento_lavoro?.usufruito && (
              <div className="space-y-4">
                <Label>C4. Se sì, dove?</Label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Checkbox per luoghi orientamento */}
                </div>
                
                <div className="space-y-2">
                  <Label>Quanto lo ritieni utile?</Label>
                  <RadioGroup
                    value={formData.orientamento_lavoro.utilita || "1"}
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
                </div>
              </div>
            )}
          </div>

          {/* C5: Attività attuali */}
          <div className="space-y-4">
            <Label>C5. Attualmente in quali attività sei impegnato/a?</Label>
            <div className="grid grid-cols-2 gap-4">
              {/* Checkbox per attività attuali */}
            </div>
          </div>

          {/* ... altri campi della sezione C ... */}
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
            {loading ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </div>
    </form>
  )
}