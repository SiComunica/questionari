"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { QuestionarioOperatoriNuovo } from '@/types/questionari';
import SezioneAOperatoriNuovo from './sezioni/SezioneAOperatoriNuovo';
import SezioneBOperatoriNuovo from './sezioni/SezioneBOperatoriNuovo';
import SezioneCOperatoriNuovo from './sezioni/SezioneCOperatoriNuovo';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

interface Props {
  initialData?: QuestionarioOperatoriNuovo;
  readOnly?: boolean;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
}

const QuestionarioOperatoriNuovo = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [codiceOperatore, setCodiceOperatore] = useState('');
  const totalSteps = 3;

  const [formData, setFormData] = useState<QuestionarioOperatoriNuovo>(() => ({
    // Sezione A
    id_struttura: '',
    tipo_struttura: '',
    professione: {
      tipo: '1',
      altro_specificare: ''
    },

    // Sezione B
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
    caratteristiche_persone: {
      stranieri_migranti: false,
      vittime_tratta: false,
      vittime_violenza: false,
      allontanati_famiglia: false,
      detenuti: false,
      ex_detenuti: false,
      misure_alternative: false,
      indigenti_senzatetto: false,
      rom_sinti: false,
      disabilita_fisica: false,
      disabilita_cognitiva: false,
      disturbi_psichiatrici: false,
      dipendenze: false,
      genitori_precoci: false,
      problemi_orientamento: false,
      altro: false,
      altro_specificare: ''
    },
    tipo_intervento: {
      sostegno_formazione: false,
      sostegno_lavoro: false,
      sostegno_abitativo: false,
      sostegno_famiglia: false,
      sostegno_coetanei: false,
      sostegno_competenze: false,
      sostegno_legale: false,
      sostegno_sociosanitario: false,
      mediazione_interculturale: false,
      altro: false,
      altro_specificare: ''
    },
    interventi_potenziare: {
      sostegno_formazione: false,
      sostegno_lavoro: false,
      sostegno_abitativo: false,
      sostegno_famiglia: false,
      sostegno_coetanei: false,
      sostegno_competenze: false,
      sostegno_legale: false,
      sostegno_sociosanitario: false,
      mediazione_interculturale: false,
      nessuno: false,
      altro: false,
      altro_specificare: ''
    },

    // Sezione C
    difficolta_uscita: {
      problemi_economici: 1,
      trovare_lavoro: 1,
      lavori_qualita: 1,
      trovare_casa: 1,
      discriminazioni: 1,
      salute_fisica: 1,
      problemi_psicologici: 1,
      difficolta_linguistiche: 1,
      altro: 1,
      altro_specificare: ''
    },

    // Metadati
    created_at: new Date().toISOString(),
    stato: 'bozza',
    fonte: ''
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!codiceOperatore) {
        toast.error('Inserire il codice operatore');
        return;
      }

      const questionarioData = {
        ...formData,
        id: uuidv4(),
        creato_a: new Date().toISOString(),
        creato_da: codiceOperatore,
        stato: 'inviato'
      };

      const { data, error } = await supabase
        .from('operatori')
        .insert(questionarioData)
        .select();

      if (error) {
        console.error('Errore salvataggio:', error);
        toast.error(`Errore: ${error.message}`);
        return;
      }

      toast.success('Questionario inviato con successo!');
      router.push('/operatori');

    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante l\'invio del questionario');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SezioneAOperatoriNuovo formData={formData} setFormData={setFormData} />;
      case 2:
        return <SezioneBOperatoriNuovo formData={formData} setFormData={setFormData} />;
      case 3:
        return <SezioneCOperatoriNuovo formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Codice Operatore</h2>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={codiceOperatore}
              onChange={(e) => setCodiceOperatore(e.target.value)}
              placeholder="Inserisci il codice operatore"
              className="flex-1 p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Sezione {currentStep} di {totalSteps}
            </h2>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
              >
                Indietro
              </button>

              <div>
                {currentStep === totalSteps ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !codiceOperatore}
                    className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Invio in corso...' : 'Invia Questionario'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Avanti
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => router.push('/operatori')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md w-full"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionarioOperatoriNuovo; 