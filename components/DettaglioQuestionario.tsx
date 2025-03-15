'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { Database } from '@/types/database'

type Struttura = Database['public']['Tables']['strutture']['Row']
type Operatore = Database['public']['Tables']['operatori']['Row']
type Giovane = Database['public']['Tables']['giovani']['Row']

type Props = {
  data: Struttura | Operatore | Giovane
  tipo: 'struttura' | 'operatore' | 'giovane'
  onClose: () => void
}

export default function DettaglioQuestionario({ data, tipo, onClose }: Props) {
  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    if (typeof value === 'boolean') {
      return value ? 'Sì' : 'No'
    }
    if (value === null || value === undefined) {
      return '-'
    }
    return value.toString()
  }

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      // Campi comuni
      id: 'ID',
      created_at: 'Data creazione',
      created_by: 'Creato da',

      // Campi strutture
      id_struttura: 'ID Struttura',
      forma_giuridica: 'Forma giuridica',
      tipo_struttura: 'Tipo struttura',
      anno_inizio: 'Anno inizio attività',
      mission: 'Mission',
      personale_retribuito_uomini: 'Personale retribuito - Uomini',
      personale_retribuito_donne: 'Personale retribuito - Donne',
      personale_volontario_uomini: 'Personale volontario - Uomini',
      personale_volontario_donne: 'Personale volontario - Donne',
      figure_professionali: 'Figure professionali',

      // Campi operatori
      professione: 'Professione',
      persone_seguite_uomini: 'Persone seguite - Uomini',
      persone_seguite_donne: 'Persone seguite - Donne',
      persone_seguite_maggiorenni_uomini: 'Persone seguite maggiorenni - Uomini',
      persone_seguite_maggiorenni_donne: 'Persone seguite maggiorenni - Donne',
      caratteristiche_persone_seguite: 'Caratteristiche persone seguite',
      tipo_interventi: 'Tipi di intervento',

      // Campi giovani
      percorso_autonomia: 'Percorso autonomia',
      tipo_percorso: 'Tipo percorso',
      vive_in_struttura: 'Vive in struttura',
      collocazione_attuale: 'Collocazione attuale',
      fattori_vulnerabilita: 'Fattori di vulnerabilità',
      sesso: 'Sesso',
      classe_eta: 'Classe età',
      luogo_nascita: 'Luogo di nascita',
      cittadinanza: 'Cittadinanza',
      permesso_soggiorno: 'Permesso di soggiorno',
      tempo_in_struttura: 'Tempo in struttura',
      precedenti_strutture: 'Precedenti strutture',
      famiglia_origine: 'Famiglia di origine',
      titolo_studio: 'Titolo di studio',
      attivita_precedenti: 'Attività precedenti',
      attivita_attuali: 'Attività attuali'
    }

    return labels[key] || key
  }

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Chiudi</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Dettaglio Questionario {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </Dialog.Title>
                    <div className="mt-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        {Object.entries(data).map(([key, value]) => (
                          <div key={key} className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">{getFieldLabel(key)}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{renderValue(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 