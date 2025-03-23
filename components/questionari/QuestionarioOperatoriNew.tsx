"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import SezioneA from './sezioni/SezioneA';
import SezioneB from './sezioni/SezioneB';
import SezioneC from './sezioni/SezioneC';
import SezioneD from './sezioni/SezioneD';

interface QuestionarioOperatori {
  // Sezione A
  nome: string;
  cognome: string;
  eta: number;
  genere: string;
  titolo_studio: string;
  anni_esperienza: number;
  tipo_contratto: string;
  email: string;
  telefono: string;
  ruolo_attuale: string;
  // ... aggiungi altre proprietà necessarie per il questionario operatori

  // Metadati
  id?: string;
  created_at: string;
  stato: string;
  fonte: string;
}

interface Props {
  fonte: string;
}

interface SezioneProps {
  formData: QuestionarioOperatori;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioOperatori>>;
}

export default function QuestionarioOperatoriNew({ fonte }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<QuestionarioOperatori>({
    nome: '',
    cognome: '',
    eta: 0,
    genere: '',
    titolo_studio: '',
    anni_esperienza: 0,
    tipo_contratto: '',
    email: '',
    telefono: '',
    ruolo_attuale: '',
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
        .from('questionari_operatori')  // tabella corretta per gli operatori
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
    const props: SezioneProps = { formData, setFormData };
    
    switch (currentStep) {
      case 1:
        return <SezioneA {...props} />;
      case 2:
        return <SezioneB {...props} />;
      case 3:
        return <SezioneC {...props} />;
      case 4:
        return <SezioneD {...props} />;
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
          
          {currentStep < 4 ? (
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