"use client"

import React from 'react';
import type { QuestionarioOperatoriProps } from '@/types/questionari';

export default function SezioneD({ formData, setFormData }: QuestionarioOperatoriProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      const arrayField = formData[name as keyof typeof formData] as string[];
      
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
      <h2 className="text-xl font-semibold">Sezione D: Approccio e metodologia</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Approccio educativo *</label>
          <textarea
            name="approccio_educativo"
            value={formData.approccio_educativo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Descrivi il tuo approccio educativo nel lavoro con i giovani..."
          />
        </div>

        <div>
          <label className="block mb-2">Tipo di intervento *</label>
          <div className="space-y-2">
            {[
              'colloqui_individuali',
              'lavoro_gruppo',
              'supporto_familiare',
              'mediazione_culturale',
              'orientamento_formativo',
              'orientamento_lavorativo',
              'supporto_psicologico',
              'attivita_laboratoriali',
              'attivita_sportive',
              'attivita_artistiche',
              'accompagnamento_servizi',
              'altro'
            ].map(intervento => (
              <div key={intervento} className="flex items-center">
                <input
                  type="checkbox"
                  name="tipo_intervento"
                  value={intervento}
                  checked={(formData.tipo_intervento || []).includes(intervento)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{intervento.replace('_', ' ').charAt(0).toUpperCase() + intervento.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        {(formData.tipo_intervento || []).includes('altro') && (
          <div>
            <label className="block mb-2">Specifica altro tipo di intervento</label>
            <input
              type="text"
              name="intervento_altro"
              value={formData.intervento_altro}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div>
          <label className="block mb-2">Sfide principali incontrate *</label>
          <div className="space-y-2">
            {[
              'barriere_linguistiche',
              'differenze_culturali',
              'resistenza_cambiamento',
              'mancanza_motivazione',
              'problemi_comportamentali',
              'difficolta_apprendimento',
              'problemi_familiari',
              'trauma',
              'poverta',
              'isolamento_sociale',
              'dipendenze',
              'salute_mentale'
            ].map(sfida => (
              <div key={sfida} className="flex items-center">
                <input
                  type="checkbox"
                  name="sfide_principali"
                  value={sfida}
                  checked={(formData.sfide_principali || []).includes(sfida)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{sfida.replace('_', ' ').charAt(0).toUpperCase() + sfida.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Strategie di supporto utilizzate *</label>
          <div className="space-y-2">
            {[
              'ascolto_attivo',
              'empowerment',
              'mediazione',
              'lavoro_rete',
              'peer_education',
              'laboratori_creativi',
              'sport',
              'tecnologie_digitali',
              'supporto_psicologico',
              'orientamento',
              'formazione_professionale',
              'tirocini'
            ].map(strategia => (
              <div key={strategia} className="flex items-center">
                <input
                  type="checkbox"
                  name="strategie_supporto"
                  value={strategia}
                  checked={(formData.strategie_supporto || []).includes(strategia)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{strategia.replace('_', ' ').charAt(0).toUpperCase() + strategia.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Casi di successo *</label>
          <textarea
            name="casi_successo"
            value={formData.casi_successo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Descrivi alcuni casi di successo significativi..."
          />
        </div>
      </div>
    </div>
  );
} 