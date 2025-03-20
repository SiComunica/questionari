"use client"

import React from 'react';
import { FormData } from '@/types/questionario-operatori';

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const SezioneF: React.FC<Props> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <h2 className="text-xl font-semibold">Sezione F: Sviluppo professionale</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block mb-2">Punti di forza nel tuo lavoro *</label>
          <div className="space-y-2">
            {[
              'empatia',
              'capacita_ascolto',
              'problem_solving',
              'lavoro_squadra',
              'flessibilita',
              'creativita',
              'gestione_stress',
              'comunicazione',
              'leadership',
              'competenze_tecniche',
              'competenze_interculturali',
              'networking'
            ].map(punto => (
              <div key={punto} className="flex items-center">
                <input
                  type="checkbox"
                  name="punti_forza"
                  value={punto}
                  checked={(formData.punti_forza || []).includes(punto)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{punto.replace('_', ' ').charAt(0).toUpperCase() + punto.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Aree di miglioramento *</label>
          <div className="space-y-2">
            {[
              'competenze_digitali',
              'lingue_straniere',
              'gestione_conflitti',
              'metodologie_innovative',
              'progettazione',
              'valutazione_impatto',
              'fundraising',
              'supervisione',
              'normativa',
              'amministrazione',
              'coordinamento',
              'ricerca'
            ].map(area => (
              <div key={area} className="flex items-center">
                <input
                  type="checkbox"
                  name="aree_miglioramento"
                  value={area}
                  checked={(formData.aree_miglioramento || []).includes(area)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{area.replace('_', ' ').charAt(0).toUpperCase() + area.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Obiettivi professionali *</label>
          <textarea
            name="obiettivi_professionali"
            value={formData.obiettivi_professionali}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Descrivi i tuoi obiettivi di sviluppo professionale..."
          />
        </div>

        <div>
          <label className="block mb-2">Formazione desiderata *</label>
          <div className="space-y-2">
            {[
              'metodologie_educative',
              'psicologia_adolescenza',
              'mediazione_culturale',
              'progettazione_sociale',
              'valutazione_servizi',
              'supervisione_equipe',
              'tecnologie_educative',
              'normativa_settore',
              'fundraising',
              'project_management',
              'comunicazione_sociale',
              'ricerca_sociale'
            ].map(formazione => (
              <div key={formazione} className="flex items-center">
                <input
                  type="checkbox"
                  name="formazione_desiderata"
                  value={formazione}
                  checked={(formData.formazione_desiderata || []).includes(formazione)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{formazione.replace('_', ' ').charAt(0).toUpperCase() + formazione.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Suggerimenti per migliorare il servizio</label>
          <textarea
            name="suggerimenti"
            value={formData.suggerimenti}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Hai suggerimenti per migliorare il servizio offerto?"
          />
        </div>

        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm text-green-800">
            Nota: Le tue risposte ci aiuteranno a pianificare attività di formazione 
            e sviluppo professionale più mirate alle esigenze degli operatori.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SezioneF; 