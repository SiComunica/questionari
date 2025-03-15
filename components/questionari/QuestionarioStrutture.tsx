'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Struttura = Database['public']['Tables']['strutture']['Row']

const FORME_GIURIDICHE = [
  'Cooperativa sociale',
  'Associazione',
  'Fondazione',
  'Ente religioso',
  'Ente pubblico',
  'Altro'
]

const TIPI_STRUTTURA = [
  'Comunità educativa',
  'Casa famiglia',
  'Gruppo appartamento',
  'Centro diurno',
  'Altro'
]

const FIGURE_PROFESSIONALI = [
  'Educatore professionale',
  'Assistente sociale',
  'Psicologo',
  'Mediatore culturale',
  'Operatore sociale',
  'Coordinatore',
  'Supervisore',
  'Altro'
]

export default function QuestionarioStrutture() {
  const router = useRouter()
  const { userType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<Omit<Struttura, 'id' | 'created_at' | 'created_by'>>({
    id_struttura: '',
    forma_giuridica: '',
    tipo_struttura: '',
    anno_inizio: new Date().getFullYear(),
    mission: '',
    personale_retribuito_uomini: 0,
    personale_retribuito_donne: 0,
    personale_volontario_uomini: 0,
    personale_volontario_donne: 0,
    figure_professionali: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('strutture')
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
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleArrayChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      figure_professionali: prev.figure_professionali.includes(value)
        ? prev.figure_professionali.filter((item: string) => item !== value)
        : [...prev.figure_professionali, value]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 max-w-3xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Questionario Strutture
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Compila tutti i campi richiesti per la struttura
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="id_struttura" className="block text-sm font-medium text-gray-700">
              ID Struttura
            </label>
            <input
              type="text"
              name="id_struttura"
              id="id_struttura"
              required
              value={formData.id_struttura}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="forma_giuridica" className="block text-sm font-medium text-gray-700">
              Forma Giuridica
            </label>
            <select
              id="forma_giuridica"
              name="forma_giuridica"
              required
              value={formData.forma_giuridica}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {FORME_GIURIDICHE.map(forma => (
                <option key={forma} value={forma}>{forma}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="tipo_struttura" className="block text-sm font-medium text-gray-700">
              Tipo Struttura
            </label>
            <select
              id="tipo_struttura"
              name="tipo_struttura"
              required
              value={formData.tipo_struttura}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Seleziona...</option>
              {TIPI_STRUTTURA.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="anno_inizio" className="block text-sm font-medium text-gray-700">
              Anno di Inizio Attività
            </label>
            <input
              type="number"
              name="anno_inizio"
              id="anno_inizio"
              required
              min="1900"
              max={new Date().getFullYear()}
              value={formData.anno_inizio}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="mission" className="block text-sm font-medium text-gray-700">
              Mission
            </label>
            <textarea
              id="mission"
              name="mission"
              rows={3}
              value={formData.mission}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Personale</h4>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="personale_retribuito_uomini" className="block text-sm font-medium text-gray-700">
                  Personale Retribuito - Uomini
                </label>
                <input
                  type="number"
                  name="personale_retribuito_uomini"
                  id="personale_retribuito_uomini"
                  min="0"
                  required
                  value={formData.personale_retribuito_uomini}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="personale_retribuito_donne" className="block text-sm font-medium text-gray-700">
                  Personale Retribuito - Donne
                </label>
                <input
                  type="number"
                  name="personale_retribuito_donne"
                  id="personale_retribuito_donne"
                  min="0"
                  required
                  value={formData.personale_retribuito_donne}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="personale_volontario_uomini" className="block text-sm font-medium text-gray-700">
                  Personale Volontario - Uomini
                </label>
                <input
                  type="number"
                  name="personale_volontario_uomini"
                  id="personale_volontario_uomini"
                  min="0"
                  required
                  value={formData.personale_volontario_uomini}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="personale_volontario_donne" className="block text-sm font-medium text-gray-700">
                  Personale Volontario - Donne
                </label>
                <input
                  type="number"
                  name="personale_volontario_donne"
                  id="personale_volontario_donne"
                  min="0"
                  required
                  value={formData.personale_volontario_donne}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Figure Professionali</legend>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {FIGURE_PROFESSIONALI.map(figura => (
                  <div key={figura} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.figure_professionali.includes(figura)}
                        onChange={() => handleArrayChange(figura)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">{figura}</label>
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