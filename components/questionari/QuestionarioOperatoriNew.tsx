import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';
import SezioneA from './sezioni/SezioneA';
import SezioneB from './sezioni/SezioneB';
import SezioneC from './sezioni/SezioneC';
import SezioneD from './sezioni/SezioneD';
import SezioneE from './sezioni/SezioneE';
import SezioneF from './sezioni/SezioneF';

export interface FormData {
  // Metadati
  created_at: string;
  stato: string;
  fonte: string;
  created_by?: string;

  // Sezione A
  nome: string;
  cognome: string;
  eta: string;
  genere: string;
  titolo_studio: string;
  anni_esperienza: string;
  tipo_contratto: string;
  ruolo_attuale: string;

  // Sezione B
  id_struttura: string;
  tipo_struttura: string;
  professione: string;
  professione_altro?: string;
  mansioni_principali: string[];
  competenze_specifiche: string[];
  formazione_specialistica?: string;
  certificazioni: string[];
  lingue_conosciute: string[];

  // Sezione C
  esperienza_giovani: string;
  persone_seguite: {
    uomini: number;
    donne: number;
    totale: number;
  };
  persone_maggiorenni: {
    uomini: number;
    donne: number;
    totale: number;
  };
  caratteristiche_persone: string[];
  caratteristiche_altro?: string;

  // Sezione D
  approccio_educativo: string;
  tipo_intervento: string[];
  intervento_altro?: string;
  sfide_principali: string[];
  strategie_supporto: string[];
  casi_successo: string;

  // Sezione E
  difficolta_uscita: {
    problemi_economici: number;
    trovare_lavoro: number;
    lavori_qualita: number;
    trovare_casa: number;
    discriminazioni: number;
    salute_fisica: number;
    problemi_psicologici: number;
    difficolta_linguistiche: number;
    altro: number;
  };
  difficolta_altro_spec?: string;

  // Sezione F
  punti_forza: string[];
  aree_miglioramento: string[];
  obiettivi_professionali: string;
  formazione_desiderata: string[];
  suggerimenti?: string;
}

const QuestionarioOperatoriNew = () => {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Inizializzazione dei campi
    created_at: new Date().toISOString(),
    stato: 'nuovo',
    fonte: 'form_web',
    nome: '',
    cognome: '',
    eta: '',
    genere: '',
    titolo_studio: '',
    anni_esperienza: '',
    tipo_contratto: '',
    ruolo_attuale: '',
    id_struttura: '',
    tipo_struttura: '',
    professione: '',
    mansioni_principali: [],
    competenze_specifiche: [],
    certificazioni: [],
    lingue_conosciute: [],
    esperienza_giovani: '',
    persone_seguite: { uomini: 0, donne: 0, totale: 0 },
    persone_maggiorenni: { uomini: 0, donne: 0, totale: 0 },
    caratteristiche_persone: [],
    approccio_educativo: '',
    tipo_intervento: [],
    sfide_principali: [],
    strategie_supporto: [],
    casi_successo: '',
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
    punti_forza: [],
    aree_miglioramento: [],
    obiettivi_professionali: '',
    formazione_desiderata: []
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
      <h1 className="text-2xl font-bold mb-6">Questionario Operatori</h1>
      
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