"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';
import SezioneA from './sezioni/SezioneA';
import SezioneB from './sezioni/SezioneB';
import SezioneC from './sezioni/SezioneC';
import SezioneD from './sezioni/SezioneD';
import SezioneE from './sezioni/SezioneE';
import SezioneF from './sezioni/SezioneF';
import { FormData } from '@/types/questionario-operatori';
import { QuestionarioProps } from '@/types/questionari';

interface Props {
  fonte: string;
}

const QuestionarioOperatoriNew: React.FC<Props> = ({ fonte }) => {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Metadati
    stato: 'bozza',
    fonte: 'form_web',

    // SezioneA
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    eta: '',
    genere: '',
    titolo_studio: '',
    anni_esperienza: '',
    tipo_contratto: '',
    ruolo_attuale: '',

    // SezioneB
    id_struttura: '',
    tipo_struttura: '',
    professione: '',
    professione_altro: '',
    mansioni_principali: [],
    competenze_specifiche: [],
    formazione_specialistica: '',
    certificazioni: [],
    lingue_conosciute: [],

    // SezioneC
    ruolo: '',
    esperienza_giovani: '',
    persone_seguite: {
      uomini: 0,
      donne: 0,
      totale: 0
    },
    persone_maggiorenni: {
      uomini: 0,
      donne: 0,
      totale: 0
    },
    caratteristiche_persone: [],
    caratteristiche_altro: '',

    // SezioneD
    approccio_educativo: '',
    metodologie_utilizzate: [],
    strumenti_lavoro: [],
    modalita_coinvolgimento: '',
    sfide_principali: [],
    strategie_motivazionali: '',
    gestione_conflitti: '',
    valutazione_impatto: '',
    tipo_intervento: [],
    intervento_altro: '',
    strategie_supporto: [],
    strategie_altro: '',
    metodi_valutazione: [],
    metodi_altro: '',
    risorse_utilizzate: [],
    risorse_altro: '',
    frequenza_incontri: '',
    durata_media_incontri: '',
    setting_lavoro: [],
    setting_altro: '',
    casi_successo: '',
    lezioni_apprese: '',
    buone_pratiche: [],
    feedback_giovani: '',
    risultati_ottenuti: '',
    indicatori_successo: [],
    collaborazioni_attive: [],
    reti_territoriali: [],
    progetti_futuri: '',
    innovazioni_introdotte: [],

    // SezioneE
    difficolta_incontrate: [],
    difficolta_uscita: {
      problemi_economici: 1,
      trovare_lavoro: 1,
      lavori_qualita: 1,
      trovare_casa: 1,
      discriminazioni: 1,
      salute_fisica: 1,
      problemi_psicologici: 1,
      difficolta_linguistiche: 1,
      altro: 1
    },
    difficolta_altro_spec: '',
    barriere_comunicazione: [],
    barriere_altro: '',
    supporto_necessario: [],
    supporto_altro: '',
    ostacoli_principali: [],
    ostacoli_altro: '',
    risorse_mancanti: [],
    risorse_mancanti_altro: '',
    criticita_sistema: [],
    proposte_miglioramento: [],
    bisogni_territorio: [],

    // SezioneF
    punti_forza: [],
    aree_miglioramento: [],
    obiettivi_professionali: '',
    formazione_desiderata: [],
    suggerimenti: '',
    competenze_da_sviluppare: [],
    competenze_altro: '',
    bisogni_formativi: [],
    bisogni_altro: '',
    feedback_ricevuti: '',
    impatto_percepito: '',
    sviluppi_carriera: '',
    aspettative_professionali: '',
    disponibilita_formazione: false,
    aree_interesse: [],
    mentoring_desiderato: false,
    networking_interesse: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('operatori')
        .insert([
          {
            ...formData,
            fonte: fonte || 'form_web',
            created_by: user?.id
          }
        ]);

      if (error) throw error;

      router.push('/operatore/dashboard?success=true');
    } catch (err) {
      console.error('Errore nel salvataggio:', err);
      alert('Errore nel salvataggio del questionario');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Dati anagrafici', component: SezioneA },
    { number: 2, title: 'Struttura e ruolo', component: SezioneB },
    { number: 3, title: 'Esperienza con giovani', component: SezioneC },
    { number: 4, title: 'Approccio e metodologia', component: SezioneD },
    { number: 5, title: 'Difficoltà riscontrate', component: SezioneE },
    { number: 6, title: 'Sviluppo professionale', component: SezioneF }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Questionario Operatori</h2>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`flex flex-col items-center ${
                currentStep >= step.number 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200'
              }`}>
                {step.number}
              </div>
              <span className="text-xs text-center">{step.title}</span>
            </button>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-blue-600 rounded transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Render current section */}
        {React.createElement(steps[currentStep - 1].component, {
          formData,
          setFormData
        })}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Indietro
            </button>
          )}
          
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
            >
              Avanti
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 ml-auto"
            >
              {loading ? 'Salvataggio...' : 'Invia Questionario'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuestionarioOperatoriNew; 