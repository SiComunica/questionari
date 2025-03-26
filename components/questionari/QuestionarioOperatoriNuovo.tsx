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
        id: uuidv4(),
        creato_a: new Date().toISOString(),
        creato_da: codiceOperatore,
        stato: 'inviato',
        ...formData
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
      <h1 className="text-2xl font-bold mb-4">Questionario Operatori</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Codice Operatore
          </label>
          <input
            type="text"
            value={codiceOperatore}
            onChange={(e) => setCodiceOperatore(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        {renderStep()}
        
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => router.push('/operatori')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Torna alla Dashboard
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !codiceOperatore}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Invio in corso...' : 'Invia Questionario'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionarioOperatoriNuovo; 