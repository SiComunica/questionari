"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { QuestionarioProps } from '@/types/questionari'

interface PersonePerGenere {
  uomini: number;
  donne: number;
  totale: number;
}

interface PersonePerEta {
  fino_16: PersonePerGenere;
  da_16_a_18: PersonePerGenere;
  maggiorenni: PersonePerGenere;
  totale: PersonePerGenere;
}

interface AttivitaInserimento {
  nome: string;
  periodo: string;
  contenuto: string;
  destinatari: string;
  attori: string;
  punti_forza: string;
  criticita: string;
}

interface Collaborazione {
  denominazione: string;
  tipo: 'ricorrente' | 'occasionale';
  oggetto: string;
}

interface Fornitore {
  nome: string;
  tipo_sostegno: string;
}

interface FormData {
  // Sezione A: Descrizione della struttura
  id_struttura: string;
  forma_giuridica: string;
  forma_giuridica_altro: string;
  tipo_struttura: string;
  anno_inizio: string;
  mission: string;
  
  // Sezione B: Informazioni sul personale
  personale_retribuito: PersonePerGenere;
  personale_volontario: PersonePerGenere;
  figure_professionali: string[];
  figure_professionali_altro: string;

  // Sezione C: Persone seguite
  persone_ospitate: PersonePerEta;
  caratteristiche_ospiti: {
    adolescenti: string[];
    giovani: string[];
  };
  caratteristiche_ospiti_altro: string;
  persone_non_ospitate: PersonePerEta;
  caratteristiche_non_ospiti: {
    adolescenti: string[];
    giovani: string[];
  };
  caratteristiche_non_ospiti_altro: string;

  // Sezione D: Attività
  attivita_servizi: {
    alloggio: boolean;
    vitto: boolean;
    servizi_bassa_soglia: boolean;
    servizi_bassa_soglia_desc: string;
    ospitalita_diurna: boolean;
    ospitalita_diurna_desc: string;
    supporto_psicologico: boolean;
    supporto_psicologico_desc: string;
    sostegno_abitativo: boolean;
    sostegno_abitativo_desc: string;
    inserimento_lavorativo: boolean;
    inserimento_lavorativo_desc: string;
    orientamento_scolastico: boolean;
    orientamento_scolastico_desc: string;
    istruzione_scolastica: boolean;
    istruzione_scolastica_desc: string;
    formazione_professionale: boolean;
    formazione_professionale_desc: string;
    attivita_ricreative: boolean;
    attivita_ricreative_desc: string;
    altro: boolean;
    altro_desc: string;
  };
  esperienze_inserimento: boolean;
  attivita_inserimento: AttivitaInserimento[];
  nuove_attivita: string[];

  // Sezione E: Reti/collaborazioni
  collaborazioni: Collaborazione[];
  punti_forza_network: string;
  criticita_network: string;

  // Sezione F: Finanziamenti
  finanziamenti: {
    pubblici: number;
    privati: number;
  };
  fonti_finanziamento_pubblico: string;
  fonti_finanziamento_privato: string;
  fornitori: Fornitore[];

  // Metadati
  created_at: string;
  stato: string;
  fonte: string;
}

interface Props {
  fonte: string;
}

const QuestionarioStruttureNew: React.FC<Props> = ({ fonte }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id_struttura: '',
    forma_giuridica: '',
    forma_giuridica_altro: '',
    tipo_struttura: '',
    anno_inizio: '',
    mission: '',
    personale_retribuito: { uomini: 0, donne: 0, totale: 0 },
    personale_volontario: { uomini: 0, donne: 0, totale: 0 },
    figure_professionali: [],
    figure_professionali_altro: '',
    persone_ospitate: {
      fino_16: { uomini: 0, donne: 0, totale: 0 },
      da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
      maggiorenni: { uomini: 0, donne: 0, totale: 0 },
      totale: { uomini: 0, donne: 0, totale: 0 }
    },
    caratteristiche_ospiti: { adolescenti: [], giovani: [] },
    caratteristiche_ospiti_altro: '',
    persone_non_ospitate: {
      fino_16: { uomini: 0, donne: 0, totale: 0 },
      da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
      maggiorenni: { uomini: 0, donne: 0, totale: 0 },
      totale: { uomini: 0, donne: 0, totale: 0 }
    },
    caratteristiche_non_ospiti: { adolescenti: [], giovani: [] },
    caratteristiche_non_ospiti_altro: '',
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
    esperienze_inserimento: false,
    attivita_inserimento: [],
    nuove_attivita: [],
    collaborazioni: [],
    punti_forza_network: '',
    criticita_network: '',
    finanziamenti: { pubblici: 0, privati: 0 },
    fonti_finanziamento_pubblico: '',
    fonti_finanziamento_privato: '',
    fornitori: [],
    created_at: new Date().toISOString(),
    stato: 'nuovo',
    fonte: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    setLoading(true);
    try {
      const dataToInsert = {
        ...formData,
        fonte: fonte || 'form_web'
      };

      const { error } = await supabase
        .from('strutture')
        .insert(dataToInsert);

      if (error) throw error;

      toast.success('Questionario struttura salvato con successo!');
      router.push('/operatore/dashboard');
    } catch (err) {
      console.error('Errore durante il salvataggio:', err);
      toast.error('Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Sezione A: Descrizione della struttura</h2>

      <div>
        <label className="block mb-1">ID Struttura (fornito da Inapp)</label>
        <input
          type="text"
          name="id_struttura"
          value={formData.id_struttura}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Forma Giuridica</label>
        <select
          name="forma_giuridica"
          value={formData.forma_giuridica}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleziona...</option>
          <option value="ente_pubblico">Ente pubblico</option>
          <option value="impresa_profit">Impresa for profit</option>
          <option value="cooperativa">Cooperativa</option>
          <option value="impresa_sociale">Impresa sociale</option>
          <option value="ente_filantropico">Ente filantropico</option>
          <option value="associazione_promozione">Associazione di promozione sociale</option>
          <option value="organizzazione_volontariato">Organizzazione di volontariato</option>
          <option value="rete_associativa">Rete associativa</option>
          <option value="societa_mutuo_soccorso">Società di mutuo soccorso</option>
          <option value="altro">Altro</option>
        </select>
      </div>

      {formData.forma_giuridica === 'altro' && (
        <div>
          <label className="block mb-1">Specificare altra forma giuridica</label>
          <input
            type="text"
            name="forma_giuridica_altro"
            value={formData.forma_giuridica_altro}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}

      <div>
        <label className="block mb-1">Tipo Struttura</label>
        <input
          type="text"
          name="tipo_struttura"
          value={formData.tipo_struttura}
          placeholder="es: casa-famiglia, centro diurno, semiautonomia"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Anno di inizio delle attività</label>
        <input
          type="number"
          name="anno_inizio"
          value={formData.anno_inizio}
          onChange={handleChange}
          min="1900"
          max={new Date().getFullYear()}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Missione principale della struttura/finalità</label>
        <textarea
          name="mission"
          value={formData.mission}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Questionario Strutture</h1>
      
      <form onSubmit={handleSubmit}>
        {renderStep1()}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button 
              type="button" 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Indietro
            </button>
          )}
          {currentStep < totalSteps ? (
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