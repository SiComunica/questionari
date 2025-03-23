import React from 'react';
import type { QuestionarioOperatoriNuovo } from '@/types/questionari';

interface Props {
  formData: QuestionarioOperatoriNuovo;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioOperatoriNuovo>>;
}

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

  const caratteristiche = [
    { key: 'stranieri_migranti', label: 'Stranieri con problemi legati alla condizione migratoria' },
    { key: 'vittime_tratta', label: 'Vittime di tratta' },
    { key: 'vittime_violenza', label: 'Vittime di violenza domestica' },
    { key: 'allontanati_famiglia', label: 'Persone allontanate dalla famiglia' },
    { key: 'detenuti', label: 'Detenuti' },
    { key: 'ex_detenuti', label: 'Ex detenuti' },
    { key: 'misure_alternative', label: 'Persone in esecuzione penale esterna' },
    { key: 'indigenti_senzatetto', label: 'Indigenti e/o senza dimora' },
    { key: 'rom_sinti', label: 'Rom e Sinti' },
    { key: 'disabilita_fisica', label: 'Persone con disabilità fisica' },
    { key: 'disabilita_cognitiva', label: 'Persone con disabilità cognitiva' },
    { key: 'disturbi_psichiatrici', label: 'Persone con disturbi psichiatrici' },
    { key: 'dipendenze', label: 'Persone con dipendenze' },
    { key: 'genitori_precoci', label: 'Genitori precoci' },
    { key: 'problemi_orientamento', label: 'Persone con problemi legati all\'orientamento sessuale' }
  ] as const;

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
                  checked={formData.caratteristiche_persone[key as keyof typeof formData.caratteristiche_persone]}
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
                checked={formData.caratteristiche_persone.altro}
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
                onChange={(e) => handleCheckboxChange(e, 'caratteristiche_persone')}
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
            <label className="flex items-center">
              <input
                type="checkbox"
                name="sostegno_formazione"
                checked={formData.tipo_intervento.sostegno_formazione}
                onChange={(e) => handleCheckboxChange(e, 'tipo_intervento')}
                className="mr-2"
              />
              Sostegno per formazione e istruzione
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B5. Interventi da realizzare o potenziare</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="sostegno_formazione"
                checked={formData.interventi_potenziare.sostegno_formazione}
                onChange={(e) => handleCheckboxChange(e, 'interventi_potenziare')}
                className="mr-2"
              />
              Sostegno per formazione e istruzione
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 