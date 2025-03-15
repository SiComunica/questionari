'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Operatore = Database['public']['Tables']['operatori']['Row']

const TIPI_STRUTTURA = [
  'Comunità educativa',
  'Casa famiglia',
  'Gruppo appartamento',
  'Centro diurno',
  'Altro'
]

const PROFESSIONI = [
  'Educatore professionale',
  'Assistente sociale',
  'Psicologo',
  'Mediatore culturale',
  'Operatore sociale',
  'Altro'
]

const CARATTERISTICHE_PERSONE = [
  'Minori stranieri non accompagnati',
  'Minori italiani',
  'Giovani adulti stranieri',
  'Giovani adulti italiani',
  'Persone con dipendenze',
  'Persone con disagio psichico',
  'Altro'
]

const TIPI_INTERVENTO = [
  'Supporto educativo',
  'Supporto psicologico',
  'Mediazione culturale',
  'Orientamento lavorativo',
  'Supporto legale',
  'Altro'
]

export default function QuestionarioOperatori() {
  const router = useRouter()
  const { userType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<Omit<Operatore, 'id' | 'created_at' | 'created_by'>>({
    professione: '',
    persone_seguite_uomini: 0,
    persone_seguite_donne: 0,
    persone_seguite_maggiorenni_uomini: 0,
    persone_seguite_maggiorenni_donne: 0,
    caratteristiche_persone_seguite: [],
    tipo_interventi: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('operatori')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleArrayChange = (field: 'caratteristiche_persone_seguite' | 'tipo_interventi', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Questionario Operatori
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Compila tutti i campi richiesti per l'operatore
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="professione" className="block text-sm font-medium text-gray-700">
              Professione
            </label>
            <select
              id="professione"
              name="professione"
              required
              value={formData.professione}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {PROFESSIONI.map(prof => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Persone Seguite</h4>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="persone_seguite_uomini" className="block text-sm font-medium text-gray-700">
                  Uomini
                </label>
                <input
                  type="number"
                  name="persone_seguite_uomini"
                  id="persone_seguite_uomini"
                  min="0"
                  required
                  value={formData.persone_seguite_uomini}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="persone_seguite_donne" className="block text-sm font-medium text-gray-700">
                  Donne
                </label>
                <input
                  type="number"
                  name="persone_seguite_donne"
                  id="persone_seguite_donne"
                  min="0"
                  required
                  value={formData.persone_seguite_donne}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="persone_seguite_maggiorenni_uomini" className="block text-sm font-medium text-gray-700">
                  Maggiorenni - Uomini
                </label>
                <input
                  type="number"
                  name="persone_seguite_maggiorenni_uomini"
                  id="persone_seguite_maggiorenni_uomini"
                  min="0"
                  required
                  value={formData.persone_seguite_maggiorenni_uomini}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="persone_seguite_maggiorenni_donne" className="block text-sm font-medium text-gray-700">
                  Maggiorenni - Donne
                </label>
                <input
                  type="number"
                  name="persone_seguite_maggiorenni_donne"
                  id="persone_seguite_maggiorenni_donne"
                  min="0"
                  required
                  value={formData.persone_seguite_maggiorenni_donne}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Caratteristiche Persone Seguite</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {CARATTERISTICHE_PERSONE.map(caratteristica => (
                  <div key={caratteristica} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.caratteristiche_persone_seguite.includes(caratteristica)}
                        onChange={() => handleArrayChange('caratteristiche_persone_seguite', caratteristica)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{caratteristica}</label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Tipi di Interventi</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {TIPI_INTERVENTO.map(intervento => (
                  <div key={intervento} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.tipo_interventi.includes(intervento)}
                        onChange={() => handleArrayChange('tipo_interventi', intervento)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{intervento}</label>
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