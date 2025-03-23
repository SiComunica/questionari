import React from 'react';
import type { QuestionarioOperatoriNuovo } from '@/types/questionari';

interface Props {
  formData: QuestionarioOperatoriNuovo;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioOperatoriNuovo>>;
}

export default function SezioneAOperatoriNuovo({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'professione.tipo' || name === 'professione.altro_specificare') {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        professione: {
          ...prev.professione,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione A: Descrizione dell'operatore</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-2">ID Struttura (fornito da Inapp)</label>
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
          <label className="block mb-2">Tipologia struttura</label>
          <input
            type="text"
            name="tipo_struttura"
            value={formData.tipo_struttura}
            onChange={handleChange}
            placeholder="es. casa-famiglia, centro diurno, semi autonomia, ecc."
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Professione dell'operatore</label>
          <select
            name="professione.tipo"
            value={formData.professione.tipo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="1">Psicologo</option>
            <option value="2">Assistente sociale</option>
            <option value="3">Educatore</option>
            <option value="4">Mediatore</option>
            <option value="5">Medico</option>
            <option value="6">Personale infermieristico/operatore sanitario</option>
            <option value="7">Insegnante/formatore</option>
            <option value="8">Cappellano/operatore religioso e spirituale</option>
            <option value="9">Tutor</option>
            <option value="10">Operatore legale</option>
            <option value="11">Operatore multifunzionale</option>
            <option value="12">Amministrativo</option>
            <option value="13">Altro</option>
          </select>

          {formData.professione.tipo === '13' && (
            <input
              type="text"
              name="professione.altro_specificare"
              value={formData.professione.altro_specificare}
              onChange={handleChange}
              placeholder="Specificare altra professione"
              className="w-full mt-2 p-2 border rounded"
              required
            />
          )}
        </div>
      </div>
    </div>
  );
} 