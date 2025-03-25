"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import SezioneAStruttureNew from './sezioni/SezioneAStruttureNew';
import SezioneBStruttureNew from './sezioni/SezioneBStruttureNew';
import SezioneCStruttureNew from './sezioni/SezioneCStruttureNew';
import SezioneDStruttureNew from './sezioni/SezioneDStruttureNew';
import SezioneEStruttureNew from './sezioni/SezioneEStruttureNew';
import SezioneFStruttureNew from './sezioni/SezioneFStruttureNew';
import type { QuestionarioStruttureNew } from '@/types/questionari';

interface Props {
  initialData?: QuestionarioStruttureNew;
  readOnly?: boolean;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
}

const defaultFormData: QuestionarioStruttureNew = {
  // Sezione A
  id_struttura: '',
  forma_giuridica: '',
  forma_giuridica_altro: '',
  tipo_struttura: '',
  anno_inizio: 0,
  missione: '',

  // Sezione B
  personale_retribuito: {
    uomini: 0,
    donne: 0,
    totale: 0,
    part_time: 0,
    full_time: 0
  },
  personale_volontario: {
    uomini: 0,
    donne: 0,
    totale: 0
  },
  figure_professionali: [],
  figure_professionali_altro: '',

  // Sezione C
  persone_ospitate: {
    fino_16: { uomini: 0, donne: 0, totale: 0 },
    da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
    maggiorenni: { uomini: 0, donne: 0, totale: 0 },
    totale: { uomini: 0, donne: 0, totale: 0 }
  },
  caratteristiche_ospiti: {
    adolescenti: {
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
    giovani_adulti: {
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
    }
  },
  persone_non_ospitate: {
    fino_16: { uomini: 0, donne: 0, totale: 0 },
    da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
    maggiorenni: { uomini: 0, donne: 0, totale: 0 },
    totale: { uomini: 0, donne: 0, totale: 0 }
  },
  caratteristiche_non_ospiti: {
    adolescenti: {
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
    giovani_adulti: {
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
    }
  },

  // Sezione D
  attività_servizi: {
    accoglienza_residenziale: false,
    accoglienza_diurna: false,
    orientamento_lavoro: false,
    orientamento_formazione: false,
    ascolto: false,
    accompagnamento_sociale: false,
    assistenza_legale: false,
    assistenza_sanitaria: false,
    assistenza_psicologica: false,
    mediazione_linguistica: false,
    mediazione_culturale: false,
    mediazione_familiare: false,
    pronto_intervento: false,
    altro: false,
    altro_specificare: ''
  },
  esperienze_inserimento_lavorativo: false,
  attività_inserimento: [],
  nuove_attività: [],

  // Sezione E
  collaborazioni: [],
  punti_forza_network: '',
  critica_network: '',

  // Sezione F
  finanziamenti: {
    fondi_pubblici: 0,
    fondi_privati: 0,
    totale: 0,
    fondi_pubblici_specifiche: '',
    fondi_privati_specifiche: '',
    fornitori: []
  }
};

export default function QuestionarioStruttureNew({ initialData, readOnly, setFormData: externalSetFormData }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setInternalFormData] = useState<QuestionarioStruttureNew>(() => ({
    ...defaultFormData,
    ...initialData
  }));

  const setFormData = (value: React.SetStateAction<QuestionarioStruttureNew>) => {
    const newValue = typeof value === 'function' ? value(formData) : value;
    setInternalFormData(newValue);
    if (externalSetFormData) {
      externalSetFormData(newValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('questionari_strutture')
        .insert({
          ...formData,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          stato: 'completato'
        });

      if (error) throw error;
      router.push('/operatore/dashboard');
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SezioneAStruttureNew formData={formData} setFormData={setFormData} />;
      case 2:
        return <SezioneBStruttureNew formData={formData} setFormData={setFormData} />;
      case 3:
        return <SezioneCStruttureNew formData={formData} setFormData={setFormData} />;
      case 4:
        return <SezioneDStruttureNew formData={formData} setFormData={setFormData} />;
      case 5:
        return <SezioneEStruttureNew formData={formData} setFormData={setFormData} />;
      case 6:
        return <SezioneFStruttureNew formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Questionario Strutture</h1>
      <form onSubmit={handleSubmit}>
        {renderStep()}
        
        <div className="flex justify-between mt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(step => step - 1)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Indietro
            </button>
          )}
          
          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(step => step + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Avanti
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading ? 'Salvataggio...' : 'Salva'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 