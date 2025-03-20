"use client"

import React from 'react';
import { FormData } from '@/types/questionario-operatori';

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const SezioneB: React.FC<Props> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      const arrayField = formData[name as keyof FormData] as string[];
      
      setFormData(prev => ({
        ...prev,
        [name]: isChecked 
          ? [...arrayField, value]
          : arrayField.filter(item => item !== value)
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
      <h2 className="text-xl font-semibold">Sezione B: Struttura e ruolo</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">ID Struttura *</label>
          <input
            type="text"
            name="id_struttura"
            value={formData.id_struttura}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Tipo di struttura *</label>
          <select
            name="tipo_struttura"
            value={formData.tipo_struttura}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona...</option>
            <option value="comunita_accoglienza">Comunità di accoglienza</option>
            <option value="centro_aggregazione">Centro di aggregazione</option>
            <option value="centro_diurno">Centro diurno</option>
            <option value="servizio_sociale">Servizio sociale</option>
            <option value="cooperativa">Cooperativa sociale</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Professione *</label>
          <select
            name="professione"
            value={formData.professione}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona...</option>
            <option value="educatore">Educatore professionale</option>
            <option value="assistente_sociale">Assistente sociale</option>
            <option value="psicologo">Psicologo</option>
            <option value="mediatore">Mediatore culturale</option>
            <option value="operatore">Operatore sociale</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        {formData.professione === 'altro' && (
          <div>
            <label className="block mb-2">Specifica altra professione</label>
            <input
              type="text"
              name="professione_altro"
              value={formData.professione_altro}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div>
          <label className="block mb-2">Mansioni principali *</label>
          <div className="space-y-2">
            {[
              'accoglienza',
              'supporto_educativo',
              'supporto_psicologico',
              'orientamento_lavoro',
              'mediazione_culturale',
              'accompagnamento_servizi',
              'progettazione',
              'coordinamento'
            ].map(mansione => (
              <div key={mansione} className="flex items-center">
                <input
                  type="checkbox"
                  name="mansioni_principali"
                  value={mansione}
                  checked={(formData.mansioni_principali || []).includes(mansione)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{mansione.replace('_', ' ').charAt(0).toUpperCase() + mansione.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Competenze specifiche *</label>
          <div className="space-y-2">
            {[
              'progettazione_educativa',
              'gestione_gruppi',
              'counseling',
              'mediazione_conflitti',
              'valutazione_bisogni',
              'networking',
              'competenze_digitali',
              'lingue_straniere'
            ].map(competenza => (
              <div key={competenza} className="flex items-center">
                <input
                  type="checkbox"
                  name="competenze_specifiche"
                  value={competenza}
                  checked={(formData.competenze_specifiche || []).includes(competenza)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{competenza.replace('_', ' ').charAt(0).toUpperCase() + competenza.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Formazione specialistica</label>
          <textarea
            name="formazione_specialistica"
            value={formData.formazione_specialistica}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Descrivi eventuali formazioni specialistiche..."
          />
        </div>

        <div>
          <label className="block mb-2">Certificazioni</label>
          <div className="space-y-2">
            {[
              'counseling',
              'mediazione',
              'project_management',
              'lingue',
              'informatica',
              'primo_soccorso'
            ].map(certificazione => (
              <div key={certificazione} className="flex items-center">
                <input
                  type="checkbox"
                  name="certificazioni"
                  value={certificazione}
                  checked={(formData.certificazioni || []).includes(certificazione)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{certificazione.replace('_', ' ').charAt(0).toUpperCase() + certificazione.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Lingue conosciute</label>
          <div className="space-y-2">
            {[
              'inglese',
              'francese',
              'spagnolo',
              'arabo',
              'cinese',
              'altro'
            ].map(lingua => (
              <div key={lingua} className="flex items-center">
                <input
                  type="checkbox"
                  name="lingue_conosciute"
                  value={lingua}
                  checked={(formData.lingue_conosciute || []).includes(lingua)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{lingua.charAt(0).toUpperCase() + lingua.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SezioneB; 