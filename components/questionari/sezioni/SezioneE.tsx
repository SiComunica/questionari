"use client"

import React from 'react';
import { FormData } from '@/types/questionario-operatori';

type DifficoltaUscitaKey = keyof FormData['difficolta_uscita'];

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const SezioneE: React.FC<Props> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('difficolta_uscita.')) {
      const key = name.split('.')[1] as DifficoltaUscitaKey;
      setFormData(prev => ({
        ...prev,
        difficolta_uscita: {
          ...prev.difficolta_uscita,
          [key]: parseInt(value) || 1
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const difficoltaOptions = [
    { key: 'problemi_economici', label: 'Problemi economici' },
    { key: 'trovare_lavoro', label: 'Difficoltà nel trovare lavoro' },
    { key: 'lavori_qualita', label: 'Accesso a lavori di qualità' },
    { key: 'trovare_casa', label: 'Difficoltà nel trovare casa' },
    { key: 'discriminazioni', label: 'Discriminazioni' },
    { key: 'salute_fisica', label: 'Problemi di salute fisica' },
    { key: 'problemi_psicologici', label: 'Problemi psicologici' },
    { key: 'difficolta_linguistiche', label: 'Difficoltà linguistiche' },
    { key: 'altro', label: 'Altro' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione E: Difficoltà riscontrate</h2>
      
      <div className="space-y-6">
        <div>
          <p className="mb-4">Per ogni difficoltà, indica il livello di rilevanza da 1 (minimo) a 5 (massimo) *</p>
          
          <div className="space-y-4">
            {difficoltaOptions.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <label className="block">{label}</label>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className="flex items-center">
                      <input
                        type="radio"
                        name={`difficolta_uscita.${key}`}
                        value={value}
                        checked={formData.difficolta_uscita[key as DifficoltaUscitaKey] === value}
                        onChange={handleChange}
                        required
                        className="mr-1"
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {formData.difficolta_uscita?.altro > 1 && (
          <div>
            <label className="block mb-2">Specifica altre difficoltà</label>
            <textarea
              name="difficolta_altro_spec"
              value={formData.difficolta_altro_spec}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Descrivi altre difficoltà riscontrate..."
            />
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-blue-800">
            Nota: La valutazione delle difficoltà aiuta a comprendere meglio le sfide 
            affrontate dai giovani nel loro percorso di autonomia e a sviluppare 
            strategie più efficaci di supporto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SezioneE; 