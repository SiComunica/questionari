"use client"

import React from 'react';
import { QuestionarioStruttureProps } from '@/types/questionari';

const SezioneBStrutture: React.FC<QuestionarioStruttureProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('personale_')) {
      const [categoria, campo] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [categoria]: {
          ...prev[categoria as keyof typeof prev],
          [campo]: parseInt(value) || 0
        }
      }));
    } else if (name.startsWith('figure_professionali.')) {
      const campo = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        figure_professionali: {
          ...prev.figure_professionali,
          [campo]: type === 'checkbox' ? checked : value
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione B: Informazioni sul Personale</h2>

      {/* Personale Retribuito */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personale Retribuito</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Uomini</label>
            <input
              type="number"
              name="personale_retribuito.uomini"
              value={formData.personale_retribuito.uomini}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Donne</label>
            <input
              type="number"
              name="personale_retribuito.donne"
              value={formData.personale_retribuito.donne}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Totale</label>
            <input
              type="number"
              name="personale_retribuito.totale"
              value={formData.personale_retribuito.totale}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Personale Volontario */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personale Volontario</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Uomini</label>
            <input
              type="number"
              name="personale_volontario.uomini"
              value={formData.personale_volontario.uomini}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Donne</label>
            <input
              type="number"
              name="personale_volontario.donne"
              value={formData.personale_volontario.donne}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Totale</label>
            <input
              type="number"
              name="personale_volontario.totale"
              value={formData.personale_volontario.totale}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Figure Professionali */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Figure Professionali</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.figure_professionali)
            .filter(([key]) => key !== 'altro_specificare')
            .map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={`figure_professionali.${key}`}
                  checked={value as boolean}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</label>
              </div>
            ))}
        </div>

        {formData.figure_professionali.altro && (
          <div>
            <label className="block mb-2">Specificare altre figure professionali</label>
            <input
              type="text"
              name="figure_professionali.altro_specificare"
              value={formData.figure_professionali.altro_specificare}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SezioneBStrutture; 