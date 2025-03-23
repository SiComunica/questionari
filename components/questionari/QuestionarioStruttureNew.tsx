"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { QuestionarioStrutture } from '@/types/questionari';
import { v4 as uuidv4 } from 'uuid';
import SezioneAStrutture from './sezioni/SezioneAStrutture';
import SezioneBStrutture from './sezioni/SezioneBStrutture';
import SezioneCStrutture from './sezioni/SezioneCStrutture';
import SezioneDStrutture from './sezioni/SezioneDStrutture';
import SezioneEStrutture from './sezioni/SezioneEStrutture';
import SezioneFStrutture from './sezioni/SezioneFStrutture';

interface Props {
  fonte: string;
}

const QuestionarioStruttureNew: React.FC<Props> = ({ fonte }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<QuestionarioStrutture>({
    // Sezione A
    id_struttura: '',
    forma_giuridica: {
      tipo: '1',
      altro_specificare: ''
    },
    tipo_struttura: '',
    anno_inizio: 2024,
    mission: '',

    // Sezione B
    personale_retribuito: {
      uomini: 0,
      donne: 0,
      totale: 0
    },
    personale_volontario: {
      uomini: 0,
      donne: 0,
      totale: 0
    },
    figure_professionali: {
      psicologi: false,
      assistenti_sociali: false,
      educatori: false,
      mediatori: false,
      medici: false,
      personale_infermieristico: false,
      insegnanti: false,
      operatori_religiosi: false,
      tutor: false,
      operatori_legali: false,
      operatori_multifunzionali: false,
      amministrativi: false,
      altro: false,
      altro_specificare: ''
    },

    // Sezione C
    persone_ospitate: {
      fino_16_anni: { uomini: 0, donne: 0, totale: 0 },
      da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
      maggiorenni: { uomini: 0, donne: 0, totale: 0 },
      totali: { uomini: 0, donne: 0, totale: 0 }
    },
    persone_non_ospitate: {
      fino_16_anni: { uomini: 0, donne: 0, totale: 0 },
      da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
      maggiorenni: { uomini: 0, donne: 0, totale: 0 },
      totali: { uomini: 0, donne: 0, totale: 0 }
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
    attivita_servizi: {
      alloggio: { attivo: false, descrizione: '' },
      vitto: { attivo: false, descrizione: '' },
      servizi_bassa_soglia: { attivo: false, descrizione: '' },
      ospitalita_diurna: { attivo: false, descrizione: '' },
      supporto_psicologico: { attivo: false, descrizione: '' },
      sostegno_autonomia: { attivo: false, descrizione: '' },
      orientamento_lavoro: { attivo: false, descrizione: '' },
      orientamento_formazione: { attivo: false, descrizione: '' },
      istruzione: { attivo: false, descrizione: '' },
      formazione_professionale: { attivo: false, descrizione: '' },
      attivita_socializzazione: { attivo: false, descrizione: '' },
      altro: { attivo: false, descrizione: '' }
    },

    esperienze_inserimento: {
      presenti: false,
      attivita: []
    },

    // Sezione E
    collaborazioni: [],
    network: {
      punti_forza: '',
      criticita: ''
    },

    // Sezione F
    finanziamenti: {
      pubblici: 0,
      privati: 0
    },
    fonti_finanziamento_pubblico: '',
    fonti_finanziamento_privato: '',
    fornitori: [],

    // Metadati
    created_at: new Date().toISOString(),
    stato: 'nuovo',
    fonte: fonte || '',

    attivita_future: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    setLoading(true);
    try {
      console.log('Saving questionnaire:', formData);
      const id = uuidv4();
      const { error } = await supabase
        .from('strutture')
        .insert({
          id,
          ...formData,
          fonte,
          stato: 'nuovo',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Questionario struttura salvato con successo!');
      router.push('/operatori');
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      toast.error('Errore nel salvataggio del questionario');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SezioneAStrutture formData={formData} setFormData={setFormData} />;
      case 2:
        return <SezioneBStrutture formData={formData} setFormData={setFormData} />;
      case 3:
        return <SezioneCStrutture formData={formData} setFormData={setFormData} />;
      case 4:
        return <SezioneDStrutture formData={formData} setFormData={setFormData} />;
      case 5:
        return <SezioneEStrutture formData={formData} setFormData={setFormData} />;
      case 6:
        return <SezioneFStrutture formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Questionario Strutture</h1>
      
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Sezione {currentStep} di {totalSteps}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div className="flex justify-between mt-6">
          {!isFirstStep && (
            <button 
              type="button" 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Indietro
            </button>
          )}
          {!isLastStep ? (
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

export default QuestionarioStruttureNew; 