import React from 'react';
import type { QuestionarioOperatoriNuovo } from '@/types/questionari';

interface Props {
  formData: QuestionarioOperatoriNuovo;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioOperatoriNuovo>>;
}

type CaratteristicaKey = keyof QuestionarioOperatoriNuovo['caratteristiche_persone'];
type InterventoKey = keyof QuestionarioOperatoriNuovo['tipo_intervento'];
type InterventoPotKey = keyof QuestionarioOperatoriNuovo['interventi_potenziare'];

export default function SezioneBOperatoriNuovo({ formData, setFormData }: Props) {
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'persone_seguite' | 'persone_maggiorenni') => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: numValue,
        totale: name === 'uomini' ? 
          numValue + prev[section].donne : 
          prev[section].uomini + numValue
      }
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'caratteristiche_persone' | 'tipo_intervento' | 'interventi_potenziare') => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: checked
      }
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'caratteristiche_persone' | 'tipo_intervento' | 'interventi_potenziare') => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const caratteristiche = [
    { key: 'stranieri_migranti' as CaratteristicaKey, label: 'Stranieri con problemi legati alla condizione migratoria' },
    { key: 'vittime_tratta' as CaratteristicaKey, label: 'Vittime di tratta' },
    { key: 'vittime_violenza' as CaratteristicaKey, label: 'Vittime di violenza domestica' },
    { key: 'allontanati_famiglia' as CaratteristicaKey, label: 'Persone allontanate dalla famiglia' },
    { key: 'detenuti' as CaratteristicaKey, label: 'Detenuti' },
    { key: 'ex_detenuti' as CaratteristicaKey, label: 'Ex detenuti' },
    { key: 'misure_alternative' as CaratteristicaKey, label: 'Persone in esecuzione penale esterna' },
    { key: 'indigenti_senzatetto' as CaratteristicaKey, label: 'Indigenti e/o senza dimora' },
    { key: 'rom_sinti' as CaratteristicaKey, label: 'Rom e Sinti' },
    { key: 'disabilita_fisica' as CaratteristicaKey, label: 'Persone con disabilità fisica' },
    { key: 'disabilita_cognitiva' as CaratteristicaKey, label: 'Persone con disabilità cognitiva' },
    { key: 'disturbi_psichiatrici' as CaratteristicaKey, label: 'Persone con disturbi psichiatrici' },
    { key: 'dipendenze' as CaratteristicaKey, label: 'Persone con dipendenze' },
    { key: 'genitori_precoci' as CaratteristicaKey, label: 'Genitori precoci' },
    { key: 'problemi_orientamento' as CaratteristicaKey, label: 'Persone con problemi legati all\'orientamento sessuale' }
  ];

  const interventi = [
    { key: 'sostegno_formazione' as InterventoKey, label: 'Sostegno per formazione e istruzione' },
    { key: 'sostegno_lavoro' as InterventoKey, label: 'Sostegno nella ricerca di lavoro' },
    { key: 'sostegno_abitativo' as InterventoKey, label: 'Sostegno all\'autonomia abitativa' },
    { key: 'sostegno_famiglia' as InterventoKey, label: 'Sostegno nel rapporto con la famiglia' },
    { key: 'sostegno_coetanei' as InterventoKey, label: 'Sostegno nelle relazioni con coetanei' },
    { key: 'sostegno_competenze' as InterventoKey, label: 'Sostegno alla valorizzazione delle competenze' },
    { key: 'sostegno_legale' as InterventoKey, label: 'Sostegno legale' },
    { key: 'sostegno_sociosanitario' as InterventoKey, label: 'Sostegno socio-sanitario' },
    { key: 'mediazione_interculturale' as InterventoKey, label: 'Mediazione linguistica e interculturale' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione B: Informazioni sulle persone seguite</h2>

      <div>
        <h3 className="text-lg font-medium mb-4">B1. Numero di persone seguite direttamente</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Uomini</label>
            <input
              type="number"
              name="uomini"
              min="0"
              value={formData.persone_seguite.uomini}
              onChange={(e) => handleNumericChange(e, 'persone_seguite')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Donne</label>
            <input
              type="number"
              name="donne"
              min="0"
              value={formData.persone_seguite.donne}
              onChange={(e) => handleNumericChange(e, 'persone_seguite')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Totale</label>
            <input
              type="number"
              value={formData.persone_seguite.totale}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B2. Numero di persone maggiorenni seguite direttamente</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Uomini</label>
            <input
              type="number"
              name="uomini"
              min="0"
              value={formData.persone_maggiorenni.uomini}
              onChange={(e) => handleNumericChange(e, 'persone_maggiorenni')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Donne</label>
            <input
              type="number"
              name="donne"
              min="0"
              value={formData.persone_maggiorenni.donne}
              onChange={(e) => handleNumericChange(e, 'persone_maggiorenni')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Totale</label>
            <input
              type="number"
              value={formData.persone_maggiorenni.totale}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B3. Caratteristiche delle persone seguite direttamente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {caratteristiche.map(({ key, label }) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={key}
                  checked={!!formData.caratteristiche_persone[key]}
                  onChange={(e) => handleCheckboxChange(e, 'caratteristiche_persone')}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="checkbox"
                name="altro"
                checked={!!formData.caratteristiche_persone.altro}
                onChange={(e) => handleCheckboxChange(e, 'caratteristiche_persone')}
                className="mr-2"
              />
              Altro
            </label>
            {formData.caratteristiche_persone.altro && (
              <input
                type="text"
                name="altro_specificare"
                value={formData.caratteristiche_persone.altro_specificare || ''}
                onChange={(e) => handleTextChange(e, 'caratteristiche_persone')}
                className="w-full mt-2 p-2 border rounded"
                placeholder="Specificare altro..."
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B4. Il suo intervento riguarda</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {interventi.map(({ key, label }) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={key}
                  checked={!!formData.tipo_intervento[key]}
                  onChange={(e) => handleCheckboxChange(e, 'tipo_intervento')}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B5. Interventi da realizzare o potenziare</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {interventi.map(({ key, label }) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={key}
                  checked={!!formData.interventi_potenziare[key]}
                  onChange={(e) => handleCheckboxChange(e, 'interventi_potenziare')}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 