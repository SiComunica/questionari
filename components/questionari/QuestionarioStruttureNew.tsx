"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import SezioneAStruttureNew from './sezioni/SezioneAStruttureNew';
import SezioneBStruttureNew from './sezioni/SezioneBStruttureNew';
import SezioneCStruttureNew from './sezioni/SezioneCStruttureNew';
import SezioneDStruttureNew from './sezioni/SezioneDStruttureNew';
import SezioneEStruttureNew from './sezioni/SezioneEStruttureNew';
import SezioneFStruttureNew from './sezioni/SezioneFStruttureNew';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  initialData?: QuestionarioStruttureNew;
  readOnly?: boolean;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
}

const defaultFormData: QuestionarioStruttureNew = {
  creato_da: '',
  creato_a: new Date().toISOString(),
  stato: 'bozza',
  
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
  caratteristiche_ospiti_adolescenti: [],
  caratteristiche_ospiti_giovani: [],
  caratteristiche_ospiti_altro: '',
  
  persone_non_ospitate: {
    fino_16: { uomini: 0, donne: 0, totale: 0 },
    da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
    maggiorenni: { uomini: 0, donne: 0, totale: 0 },
    totale: { uomini: 0, donne: 0, totale: 0 }
  },
  caratteristiche_non_ospiti_adolescenti: [],
  caratteristiche_non_ospiti_giovani: [],
  caratteristiche_non_ospiti_altro: '',

  // Sezione D
  attivita_servizi: {
    alloggio: false,
    vitto: false,
    servizi_bassa_soglia: false,
    servizi_bassa_soglia_desc: '',
    ospitalita_diurna: false,
    ospitalita_diurna_desc: '',
    supporto_psicologico: false,
    supporto_psicologico_desc: '',
    sostegno_abitativo: false,
    sostegno_abitativo_desc: '',
    inserimento_lavorativo: false,
    inserimento_lavorativo_desc: '',
    orientamento_scolastico: false,
    orientamento_scolastico_desc: '',
    istruzione_scolastica: false,
    istruzione_scolastica_desc: '',
    formazione_professionale: false,
    formazione_professionale_desc: '',
    attivita_ricreative: false,
    attivita_ricreative_desc: '',
    altro: false,
    altro_desc: ''
  },
  esperienze_inserimento_lavorativo: false,
  attivita_inserimento: [],
  nuove_attivita: [],

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
  const supabase = createClientComponentClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [operatore, setOperatore] = useState<string>('');
  const totalSteps = 6;

  const [formData, setInternalFormData] = useState<QuestionarioStruttureNew>(() => ({
    ...defaultFormData,
    ...initialData,
    creato_da: '',
  }));

  useEffect(() => {
    // Rimuoviamo il redirect automatico e ci limitiamo a impostare l'operatore
    const codiceOperatore = localStorage.getItem('codiceOperatore');
    if (codiceOperatore) {
      setOperatore(codiceOperatore);
    }
  }, []);

  const setFormData = (value: React.SetStateAction<QuestionarioStruttureNew>) => {
    const newValue = typeof value === 'function' ? value(formData) : value;
    setInternalFormData(newValue);
    if (externalSetFormData) {
      externalSetFormData(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInternalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInviaQuestionario = async () => {
    try {
      if (!formData.creato_da) {
        alert('Inserisci il codice operatore prima di inviare il questionario');
        return;
      }

      // Prepariamo i dati da salvare
      const datiDaSalvare = {
        ...formData,
        creato_a: new Date().toISOString(),
        stato: 'inviato'
      };

      // Salviamo direttamente su Supabase
      const { error } = await supabase
        .from('strutturanuova')
        .insert(datiDaSalvare);

      if (error) {
        console.error('Errore Supabase:', error);
        throw new Error(`Errore durante il salvataggio: ${error.message}`);
      }

      alert('Questionario inviato con successo!');
      router.push('/operatori');

    } catch (error) {
      console.error('Errore completo:', error);
      alert('Errore durante l\'invio del questionario. Riprova.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <Label htmlFor="creato_da">Codice Operatore *</Label>
              <Input
                id="creato_da"
                name="creato_da"
                value={formData.creato_da}
                onChange={handleChange}
                placeholder="Inserisci il tuo codice (es. operatore1)"
                className="mt-1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Inserisci il tuo codice operatore nel formato "operatoreX" (es. operatore1)
              </p>
            </div>
            
            <SezioneAStruttureNew formData={formData} setFormData={setFormData} />
          </div>
        );
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Questionario Strutture</h1>
        <p className="text-gray-600">Operatore: {operatore}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Sezione {currentStep} di {totalSteps}
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {renderStep()}
        
        <div className="flex gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/operatori')}
          >
            Torna alla dashboard
          </Button>

          {currentStep > 1 && (
            <Button 
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Indietro
            </Button>
          )}

          {currentStep < totalSteps && (
            <Button 
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              Avanti
            </Button>
          )}

          {currentStep === totalSteps && (
            <Button 
              onClick={handleInviaQuestionario}
              className="bg-green-600 hover:bg-green-700"
            >
              Invia questionario
            </Button>
          )}
        </div>
      </form>
    </div>
  );
} 