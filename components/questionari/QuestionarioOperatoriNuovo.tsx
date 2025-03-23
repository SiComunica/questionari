import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { QuestionarioOperatoriNuovo } from '@/types/questionari';
import SezioneAOperatoriNuovo from './sezioni/SezioneAOperatoriNuovo';
import SezioneBOperatoriNuovo from './sezioni/SezioneBOperatoriNuovo';
import SezioneCOperatoriNuovo from './sezioni/SezioneCOperatoriNuovo';

interface Props {
  fonte: string;
}

export default function QuestionarioOperatoriNuovo({ fonte }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<QuestionarioOperatoriNuovo>({
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
    fonte: fonte
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('questionari_operatori_nuovo')
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
          
          {currentStep < 3 ? (
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