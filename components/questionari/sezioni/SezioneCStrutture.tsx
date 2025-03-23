"use client"

import React from 'react';
import { QuestionarioStruttureProps } from '@/types/questionari';

const SezioneCStrutture: React.FC<QuestionarioStruttureProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [categoria, subcategoria, campo] = name.split('.');
      
      if (categoria === 'persone_ospitate') {
        setFormData(prev => ({
          ...prev,
          persone_ospitate: {
            ...prev.persone_ospitate,
            [subcategoria]: {
              ...prev.persone_ospitate[subcategoria as keyof typeof prev.persone_ospitate],
              [campo]: parseInt(value) || 0
            }
          }
        }));
      } else if (categoria === 'caratteristiche_ospiti') {
        setFormData(prev => ({
          ...prev,
          caratteristiche_ospiti: {
            ...prev.caratteristiche_ospiti,
            [subcategoria]: {
              ...prev.caratteristiche_ospiti[subcategoria as 'adolescenti' | 'giovani_adulti'],
              [campo]: type === 'checkbox' ? checked : value
            }
          }
        }));
      }
    }
  };

  const caratteristiche = [
    { key: 'stranieri_migranti', label: 'Stranieri/Migranti' },
    { key: 'vittime_tratta', label: 'Vittime di tratta' },
    { key: 'vittime_violenza', label: 'Vittime di violenza' },
    { key: 'allontanati_famiglia', label: 'Allontanati dalla famiglia' },
    { key: 'detenuti', label: 'Detenuti' },
    { key: 'ex_detenuti', label: 'Ex detenuti' },
    { key: 'misure_alternative', label: 'Misure alternative' },
    { key: 'indigenti_senzatetto', label: 'Indigenti/Senzatetto' },
    { key: 'rom_sinti', label: 'Rom/Sinti' },
    { key: 'disabilita_fisica', label: 'Disabilità fisica' },
    { key: 'disabilita_cognitiva', label: 'Disabilità cognitiva' },
    { key: 'disturbi_psichiatrici', label: 'Disturbi psichiatrici' },
    { key: 'dipendenze', label: 'Dipendenze' },
    { key: 'genitori_precoci', label: 'Genitori precoci' },
    { key: 'problemi_orientamento', label: 'Problemi di orientamento' },
    { key: 'altro', label: 'Altro' }
  ];

  const renderPersoneSection = (title: string, categoria: 'fino_16_anni' | 'da_16_a_18' | 'maggiorenni' | 'totali') => (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Uomini</label>
          <input
            type="number"
            name={`persone_ospitate.${categoria}.uomini`}
            value={formData.persone_ospitate[categoria].uomini}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Donne</label>
          <input
            type="number"
            name={`persone_ospitate.${categoria}.donne`}
            value={formData.persone_ospitate[categoria].donne}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Totale</label>
          <input
            type="number"
            name={`persone_ospitate.${categoria}.totale`}
            value={formData.persone_ospitate[categoria].totale}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione C: Persone Assistite</h2>

      {/* Persone Ospitate */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Persone Ospitate</h3>
        {renderPersoneSection('Fino a 16 anni', 'fino_16_anni')}
        {renderPersoneSection('Da 16 a 18 anni', 'da_16_a_18')}
        {renderPersoneSection('Maggiorenni', 'maggiorenni')}
        {renderPersoneSection('Totali', 'totali')}
      </div>

      {/* Caratteristiche Ospiti */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Caratteristiche Adolescenti (fino a 18 anni)</h3>
        <div className="grid grid-cols-2 gap-4">
          {caratteristiche.map(({ key, label }) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                name={`caratteristiche_ospiti.adolescenti.${key}`}
                checked={formData.caratteristiche_ospiti.adolescenti[key as keyof typeof formData.caratteristiche_ospiti.adolescenti]}
                onChange={handleChange}
                className="mr-2"
              />
              <label>{label}</label>
            </div>
          ))}
        </div>

        {formData.caratteristiche_ospiti.adolescenti.altro && (
          <div>
            <label className="block mb-2">Specificare altre caratteristiche</label>
            <input
              type="text"
              name="caratteristiche_ospiti.adolescenti.altro_specificare"
              value={formData.caratteristiche_ospiti.adolescenti.altro_specificare}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <h3 className="text-lg font-medium mt-6">Caratteristiche Giovani Adulti (18-35 anni)</h3>
        <div className="grid grid-cols-2 gap-4">
          {caratteristiche.map(({ key, label }) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                name={`caratteristiche_ospiti.giovani_adulti.${key}`}
                checked={formData.caratteristiche_ospiti.giovani_adulti[key as keyof typeof formData.caratteristiche_ospiti.giovani_adulti]}
                onChange={handleChange}
                className="mr-2"
              />
              <label>{label}</label>
            </div>
          ))}
        </div>

        {formData.caratteristiche_ospiti.giovani_adulti.altro && (
          <div>
            <label className="block mb-2">Specificare altre caratteristiche</label>
            <input
              type="text"
              name="caratteristiche_ospiti.giovani_adulti.altro_specificare"
              value={formData.caratteristiche_ospiti.giovani_adulti.altro_specificare}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SezioneCStrutture; 