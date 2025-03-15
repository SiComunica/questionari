'use client'

import { useState } from 'react'
import type { QuestionarioGiovani } from '@/types/forms'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import type { Database } from '@/types/database'

type Giovane = Database['public']['Tables']['giovani']['Row']

const TIPI_PERCORSO = [
  'Formazione professionale',
  'Scuola superiore',
  'Università',
  'Tirocinio',
  'Lavoro',
  'Altro'
]

const COLLOCAZIONI = [
  'Famiglia affidataria',
  'Famiglia di origine',
  'Autonomia abitativa',
  'Altro'
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
  '14-17',
  '18-21',
  '22-25',
  '26+'
]

const TITOLI_STUDIO = [
  'Nessun titolo',
  'Licenza elementare',
  'Licenza media',
  'Qualifica professionale',
  'Diploma superiore',
  'Laurea',
  'Altro'
]

const ATTIVITA = [
  'Studio',
  'Lavoro',
  'Tirocinio',
  'Volontariato',
  'Sport',
  'Altro'
]

const FAMIGLIA_ORIGINE = [
  'Presente e collaborativa',
  'Presente ma non collaborativa',
  'Assente',
  'Conflittuale',
  'Altro'
]

// Aggiorniamo il tipo per gli array
type ArrayFields = {
  fattori_vulnerabilita: string[]
  attivita_precedenti: string[]
  attivita_attuali: string[]
}

export default function QuestionarioGiovani() {
  const router = useRouter()
  const { userType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<Omit<Giovane, 'id' | 'created_at' | 'created_by'>>({
    percorso_autonomia: false,
    tipo_percorso: null,
    vive_in_struttura: false,
    collocazione_attuale: null,
    fattori_vulnerabilita: [],
    sesso: '',
    classe_eta: '',
    luogo_nascita: '',
    cittadinanza: '',
    permesso_soggiorno: false,
    tempo_in_struttura: '',
    precedenti_strutture: 0,
    famiglia_origine: '',
    titolo_studio: '',
    attivita_precedenti: [],
    attivita_attuali: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('giovani')
        .insert([
          {
            ...formData,
            created_by: userType === 'operatore' ? userType : 'anonimo'
          }
        ])

      if (error) throw error

      router.push(`/dashboard/${userType}`)
    } catch (error) {
      console.error('Errore durante il salvataggio:', error)
      setError('Errore durante il salvataggio del questionario')
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

  const handleCheckboxChange = (array: keyof ArrayFields, value: string) => {
    setFormData(prev => ({
      ...prev,
      [array]: Array.isArray(prev[array]) 
        ? (prev[array] as string[]).filter(item => item !== value)
        : [value]
    }))
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
                checked={formData.percorso_autonomia}
                onChange={handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="percorso_autonomia" className="ml-2 block text-sm text-gray-900">
                In percorso di autonomia
              </label>
            </div>
          </div>

          {formData.percorso_autonomia && (
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
                value={formData.collocazione_attuale || ''}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Seleziona...</option>
                {COLLOCAZIONI.map(collocazione => (
                  <option key={collocazione} value={collocazione}>{collocazione}</option>
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
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
              <option value="Altro">Altro</option>
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
                <option key={classe} value={classe}>{classe}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="luogo_nascita" className="block text-sm font-medium text-gray-700">
              Luogo di Nascita
            </label>
            <input
              type="text"
              name="luogo_nascita"
              id="luogo_nascita"
              required
              value={formData.luogo_nascita}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="cittadinanza" className="block text-sm font-medium text-gray-700">
              Cittadinanza
            </label>
            <input
              type="text"
              name="cittadinanza"
              id="cittadinanza"
              required
              value={formData.cittadinanza}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {formData.cittadinanza !== 'Italiana' && (
            <div className="sm:col-span-3">
              <label htmlFor="permesso_soggiorno" className="block text-sm font-medium text-gray-700">
                Permesso di Soggiorno
              </label>
              <input
                type="checkbox"
                name="permesso_soggiorno"
                id="permesso_soggiorno"
                checked={formData.permesso_soggiorno}
                onChange={handleChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          )}

          {/* Informazioni sulla permanenza */}
          <div className="sm:col-span-3">
            <label htmlFor="tempo_in_struttura" className="block text-sm font-medium text-gray-700">
              Tempo in Struttura
            </label>
            <input
              type="text"
              name="tempo_in_struttura"
              id="tempo_in_struttura"
              required
              value={formData.tempo_in_struttura}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="precedenti_strutture" className="block text-sm font-medium text-gray-700">
              Precedenti Strutture
            </label>
            <input
              type="text"
              name="precedenti_strutture"
              id="precedenti_strutture"
              required
              value={formData.precedenti_strutture}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
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
                        onChange={() => handleCheckboxChange('fattori_vulnerabilita', fattore)}
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
              {FAMIGLIA_ORIGINE.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
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
                <option key={titolo} value={titolo}>{titolo}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Attività Precedenti</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {ATTIVITA.map(attivita => (
                  <div key={attivita} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.attivita_precedenti.includes(attivita)}
                        onChange={() => handleCheckboxChange('attivita_precedenti', attivita)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{attivita}</label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Attività Attuali</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {ATTIVITA.map(attivita => (
                  <div key={attivita} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.attivita_attuali.includes(attivita)}
                        onChange={() => handleCheckboxChange('attivita_attuali', attivita)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{attivita}</label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </div>

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