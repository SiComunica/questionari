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
  attivita_significative: [],
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
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [operatore, setOperatore] = useState<string>('');
  const totalSteps = 6;

  const [formData, setInternalFormData] = useState<QuestionarioStruttureNew>(() => ({
    ...defaultFormData,
    ...initialData
  }));

  useEffect(() => {
    // Accediamo a localStorage solo dopo il mount del componente
    const codiceOperatore = localStorage.getItem('codiceOperatore');
    if (!codiceOperatore) {
      router.push('/');
    } else {
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInviaQuestionario = async () => {
    try {
      const codiceOperatore = localStorage.getItem('codiceOperatore');
      if (!codiceOperatore) {
        alert('Sessione scaduta. Effettua nuovamente l\'accesso.');
        router.push('/');
        return;
      }

      // Prepariamo i dati del questionario
      const datiQuestionario = {
        ...formData,
        id: uuidv4(),
        creato_da: codiceOperatore,
        creato_a: new Date().toISOString(),
        stato: 'inviato'
      };

      // Inviamo i dati a Supabase
      const supabase = createClientComponentClient();
      const { error: saveError } = await supabase
        .from('strutturanuova')
        .insert(datiQuestionario);

      if (saveError) {
        throw new Error(`Errore durante il salvataggio: ${saveError.message}`);
      }

      alert('Questionario inviato con successo!');
      router.push('/operatori');

    } catch (error) {
      console.error('Errore:', error);
      alert('Errore durante l\'invio del questionario. Riprova.');
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
              onClick={handlePrevious}
            >
              Indietro
            </Button>
          )}

          {currentStep < totalSteps && (
            <Button 
              onClick={handleNext}
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