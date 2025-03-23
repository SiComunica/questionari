"use client"

import React from 'react';
import type { QuestionarioOperatoriProps } from '@/types/questionari';

export default function SezioneC({ formData, setFormData }: QuestionarioOperatoriProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      const arrayField = formData.caratteristiche_persone || [];
      
      setFormData(prev => ({
        ...prev,
        caratteristiche_persone: isChecked 
          ? [...arrayField, value]
          : arrayField.filter(item => item !== value)
      }));
    } else if (name.includes('persone_seguite') || name.includes('persone_maggiorenni')) {
      const [parent, child] = name.split('.');
      const parentKey = parent as 'persone_seguite' | 'persone_maggiorenni';
      const childKey = child as 'uomini' | 'donne' | 'totale';
      
      setFormData(prev => {
        const currentParentValue = prev[parentKey] || {
          uomini: 0,
          donne: 0,
          totale: 0
        };

        return {
          ...prev,
          [parentKey]: {
            ...currentParentValue,
            [childKey]: parseInt(value) || 0
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione C: Esperienza con giovani</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Esperienza con giovani *</label>
          <textarea
            name="esperienza_giovani"
            value={formData.esperienza_giovani}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Descrivi la tua esperienza nel lavoro con i giovani..."
          />
        </div>

        <div>
          <label className="block mb-2">Numero di persone seguite attualmente *</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm">Uomini</label>
              <input
                type="number"
                name="persone_seguite.uomini"
                value={formData.persone_seguite?.uomini || 0}
                onChange={handleChange}
                min="0"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Donne</label>
              <input
                type="number"
                name="persone_seguite.donne"
                value={formData.persone_seguite?.donne || 0}
                onChange={handleChange}
                min="0"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Totale</label>
              <input
                type="number"
                name="persone_seguite.totale"
                value={formData.persone_seguite?.totale || 0}
                onChange={handleChange}
                min="0"
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2">Di cui maggiorenni *</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm">Uomini</label>
              <input
                type="number"
                name="persone_maggiorenni.uomini"
                value={formData.persone_maggiorenni?.uomini || 0}
                onChange={handleChange}
                min="0"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Donne</label>
              <input
                type="number"
                name="persone_maggiorenni.donne"
                value={formData.persone_maggiorenni?.donne || 0}
                onChange={handleChange}
                min="0"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Totale</label>
              <input
                type="number"
                name="persone_maggiorenni.totale"
                value={formData.persone_maggiorenni?.totale || 0}
                onChange={handleChange}
                min="0"
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2">Caratteristiche delle persone seguite *</label>
          <div className="space-y-2">
            {[
              'minori_stranieri',
              'giovani_stranieri',
              'minori_italiani',
              'giovani_italiani',
              'msna',
              'neet',
              'disabilita',
              'dipendenze',
              'problemi_giustizia',
              'disagio_psichico',
              'poverta_educativa',
              'dispersione_scolastica'
            ].map(caratteristica => (
              <div key={caratteristica} className="flex items-center">
                <input
                  type="checkbox"
                  name="caratteristiche_persone"
                  value={caratteristica}
                  checked={(formData.caratteristiche_persone || []).includes(caratteristica)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{caratteristica.replace('_', ' ').charAt(0).toUpperCase() + caratteristica.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        {(formData.caratteristiche_persone || []).includes('altro') && (
          <div>
            <label className="block mb-2">Specifica altre caratteristiche</label>
            <input
              type="text"
              name="caratteristiche_altro"
              value={formData.caratteristiche_altro}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
} 