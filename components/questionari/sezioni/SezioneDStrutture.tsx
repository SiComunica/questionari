"use client"

import React from 'react';
import { QuestionarioStruttureProps } from '@/types/questionari';

type ServizioKey = keyof QuestionarioStrutture['attivita_servizi'];

const SezioneDStrutture: React.FC<QuestionarioStruttureProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [categoria, servizio, campo] = name.split('.') as [string, ServizioKey, string];
      
      if (categoria === 'attivita_servizi') {
        setFormData(prev => ({
          ...prev,
          attivita_servizi: {
            ...prev.attivita_servizi,
            [servizio]: {
              ...prev.attivita_servizi[servizio],
              [campo]: campo === 'attivo' ? checked : value
            }
          }
        }));
      }
    } else if (name === 'esperienze_inserimento.presenti') {
      setFormData(prev => ({
        ...prev,
        esperienze_inserimento: {
          ...prev.esperienze_inserimento,
          presenti: checked,
          attivita: prev.esperienze_inserimento.attivita || []
        }
      }));
    }
  };

  const servizi = [
    { key: 'alloggio' as ServizioKey, label: 'Alloggio' },
    { key: 'vitto' as ServizioKey, label: 'Vitto' },
    { key: 'servizi_bassa_soglia' as ServizioKey, label: 'Servizi di bassa soglia' },
    { key: 'ospitalita_diurna' as ServizioKey, label: 'Ospitalità diurna' },
    { key: 'supporto_psicologico' as ServizioKey, label: 'Supporto psicologico' },
    { key: 'sostegno_autonomia' as ServizioKey, label: 'Sostegno all\'autonomia' },
    { key: 'orientamento_lavoro' as ServizioKey, label: 'Orientamento al lavoro' },
    { key: 'orientamento_formazione' as ServizioKey, label: 'Orientamento alla formazione' },
    { key: 'istruzione' as ServizioKey, label: 'Istruzione' },
    { key: 'formazione_professionale' as ServizioKey, label: 'Formazione professionale' },
    { key: 'attivita_socializzazione' as ServizioKey, label: 'Attività di socializzazione' },
    { key: 'altro' as ServizioKey, label: 'Altro' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione D: Attività e Servizi</h2>

      <div className="space-y-6">
        {servizi.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name={`attivita_servizi.${key}.attivo`}
                checked={formData.attivita_servizi[key].attivo}
                onChange={handleChange}
                className="mr-2"
              />
              <label>{label}</label>
            </div>
            
            {formData.attivita_servizi[key].attivo && (
              <textarea
                name={`attivita_servizi.${key}.descrizione`}
                value={formData.attivita_servizi[key].descrizione}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder={`Descrivi ${label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}

        <div className="space-y-4 mt-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="esperienze_inserimento.presenti"
              checked={formData.esperienze_inserimento.presenti}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Sono presenti esperienze di inserimento</label>
          </div>

          {formData.esperienze_inserimento.presenti && (
            <div className="pl-6">
              {formData.esperienze_inserimento.attivita?.map((attivita, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                  <h4 className="font-medium mb-2">Esperienza {index + 1}</h4>
                  {/* Campi per le attività di inserimento */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SezioneDStrutture; 