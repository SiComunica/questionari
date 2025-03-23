"use client"

import React from 'react';
import { QuestionarioStruttureProps } from '@/types/questionari';

const SezioneDStrutture: React.FC<QuestionarioStruttureProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [categoria, servizio, campo] = name.split('.');
      
      if (categoria === 'attivita_servizi') {
        if (campo) {
          setFormData(prev => ({
            ...prev,
            attivita_servizi: {
              ...prev.attivita_servizi,
              [servizio]: {
                ...prev.attivita_servizi[servizio as keyof typeof prev.attivita_servizi],
                [campo]: type === 'checkbox' ? checked : value
              }
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            attivita_servizi: {
              ...prev.attivita_servizi,
              [servizio]: type === 'checkbox' ? checked : value
            }
          }));
        }
      }
    } else if (name === 'esperienze_inserimento.presenti') {
      setFormData(prev => ({
        ...prev,
        esperienze_inserimento: {
          ...prev.esperienze_inserimento,
          presenti: checked
        }
      }));
    }
  };

  const servizi = [
    { key: 'alloggio', label: 'Alloggio' },
    { key: 'vitto', label: 'Vitto' },
    { key: 'servizi_bassa_soglia', label: 'Servizi di bassa soglia' },
    { key: 'ospitalita_diurna', label: 'Ospitalità diurna' },
    { key: 'supporto_psicologico', label: 'Supporto psicologico' },
    { key: 'sostegno_autonomia', label: 'Sostegno all\'autonomia' },
    { key: 'orientamento_lavoro', label: 'Orientamento al lavoro' },
    { key: 'orientamento_formazione', label: 'Orientamento alla formazione' },
    { key: 'istruzione', label: 'Istruzione' },
    { key: 'formazione_professionale', label: 'Formazione professionale' },
    { key: 'attivita_socializzazione', label: 'Attività di socializzazione' },
    { key: 'altro', label: 'Altro' }
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
                checked={formData.attivita_servizi[key as keyof typeof formData.attivita_servizi].attivo}
                onChange={handleChange}
                className="mr-2"
              />
              <label>{label}</label>
            </div>
            
            {formData.attivita_servizi[key as keyof typeof formData.attivita_servizi].attivo && (
              <textarea
                name={`attivita_servizi.${key}.descrizione`}
                value={formData.attivita_servizi[key as keyof typeof formData.attivita_servizi].descrizione}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder={`Descrivi ${label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="esperienze_inserimento.presenti"
              checked={formData.esperienze_inserimento.presenti}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Esperienze di inserimento presenti</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SezioneDStrutture; 