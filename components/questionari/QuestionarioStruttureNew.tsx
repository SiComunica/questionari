"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import SezioneAStruttureNew from './sezioni/SezioneAStruttureNew';
import SezioneBStruttureNew from './sezioni/SezioneBStruttureNew';
import SezioneCStruttureNew from './sezioni/SezioneCStruttureNew';
import SezioneDStrutture from './sezioni/SezioneDStrutture';
import SezioneEStrutture from './sezioni/SezioneEStrutture';
import SezioneFStrutture from './sezioni/SezioneFStrutture';
import type { QuestionarioStruttureNew } from '@/types/questionari';

interface Props {
  fonte?: string;
  readOnly?: boolean;
  initialData?: QuestionarioStruttureNew;
}

export default function QuestionarioStruttureNew({ fonte, readOnly, initialData }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<QuestionarioStruttureNew>(() => {
    if (initialData) return initialData;
    
    return {
      // Sezione A
      nome_struttura: '',
      indirizzo: '',
      comune: '',
      provincia: '',
      cap: '',
      telefono: '',
      email: '',
      referente: '',

      // Sezione B
      tipo_struttura: '',
      capacita_totale: 0,
      posti_occupati: 0,

      // Sezione C
      servizi_offerti: {
        accoglienza: false,
        orientamento: false,
        formazione: false,
        inserimento_lavorativo: false,
        assistenza_legale: false,
        assistenza_sanitaria: false,
        mediazione_culturale: false,
        supporto_psicologico: false,
        altro: false,
        altro_specificare: ''
      },

      // Sezione D
      caratteristiche_utenti: {
        minori: false,
        donne: false,
        famiglie: false,
        disabili: false,
        anziani: false,
        migranti: false,
        dipendenze: false,
        altro: false,
        altro_specificare: ''
      },

      // Sezione E
      risorse_umane: {
        operatori_totali: 0,
        operatori_part_time: 0,
        operatori_full_time: 0,
        volontari: 0
      },

      // Sezione F
      criticita: {
        finanziarie: false,
        personale: false,
        spazi: false,
        attrezzature: false,
        utenza: false,
        rete_servizi: false,
        altro: false,
        altro_specificare: ''
      }
    };
  });

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
        return <SezioneDStrutture formData={formData} setFormData={setFormData} />;
      case 5:
        return <SezioneEStrutture formData={formData} setFormData={setFormData} />;
      case 6:
        return <SezioneFStrutture formData={formData} setFormData={setFormData} />;
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