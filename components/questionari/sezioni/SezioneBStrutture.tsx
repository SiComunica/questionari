"use client"

import React from 'react';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneBStrutture({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonaleChange = (
    tipo: 'retribuito' | 'volontario',
    genere: 'uomini' | 'donne',
    value: number
  ) => {
    setFormData(prev => ({
      ...prev,
      personale: {
        ...prev.personale,
        [`${tipo}`]: {
          ...prev.personale[tipo],
          [genere]: value,
          totale: tipo === 'retribuito' 
            ? (genere === 'uomini' ? value + prev.personale.retribuito.donne : prev.personale.retribuito.uomini + value)
            : (genere === 'uomini' ? value + prev.personale.volontario.donne : prev.personale.volontario.uomini + value)
        }
      }
    }));
  };

  const handleFiguraProfessionaleChange = (figura: keyof typeof formData.figure_professionali) => {
    setFormData(prev => ({
      ...prev,
      figure_professionali: {
        ...prev.figure_professionali,
        [figura]: !prev.figure_professionali[figura]
      }
    }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione B: Informazioni sulla struttura</h2>

      <div>
        <h3 className="text-lg font-medium mb-4">B1. Tipo struttura</h3>
        <select
          name="tipo"
          value={formData.tipo || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Seleziona tipologia</option>
          <option value="casa_accoglienza">Casa di accoglienza</option>
          <option value="comunita_alloggio">Comunità alloggio</option>
          <option value="centro_diurno">Centro diurno</option>
          <option value="altro">Altro</option>
        </select>
        
        {formData.tipo === 'altro' && (
          <input
            type="text"
            name="tipo_altro"
            value={formData.tipo_altro || ''}
            onChange={handleChange}
            className="mt-2 w-full p-2 border rounded"
            placeholder="Specificare altra tipologia..."
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B2. Capacità ricettiva massima</h3>
        <input
          type="number"
          name="capacita_massima"
          value={formData.capacita_massima || ''}
          onChange={handleChange}
          min="0"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B3. Personale della struttura</h3>
        
        {/* Personale Retribuito */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Personale Retribuito</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personale_retribuito_uomini">Uomini</Label>
              <Input
                id="personale_retribuito_uomini"
                type="number"
                min={0}
                value={formData.personale.retribuito.uomini}
                onChange={(e) => handlePersonaleChange('retribuito', 'uomini', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personale_retribuito_donne">Donne</Label>
              <Input
                id="personale_retribuito_donne"
                type="number"
                min={0}
                value={formData.personale.retribuito.donne}
                onChange={(e) => handlePersonaleChange('retribuito', 'donne', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Totale personale retribuito</Label>
            <div className="text-lg font-medium">
              {formData.personale.retribuito.totale}
            </div>
          </div>
        </div>

        {/* Personale Volontario */}
        <div className="space-y-4 mt-6">
          <h4 className="text-md font-medium">Personale Volontario</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personale_volontario_uomini">Uomini</Label>
              <Input
                id="personale_volontario_uomini"
                type="number"
                min={0}
                value={formData.personale.volontario.uomini}
                onChange={(e) => handlePersonaleChange('volontario', 'uomini', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personale_volontario_donne">Donne</Label>
              <Input
                id="personale_volontario_donne"
                type="number"
                min={0}
                value={formData.personale.volontario.donne}
                onChange={(e) => handlePersonaleChange('volontario', 'donne', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Totale personale volontario</Label>
            <div className="text-lg font-medium">
              {formData.personale.volontario.totale}
            </div>
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
                  onChange={() => handleFiguraProfessionaleChange(key as keyof typeof formData.figure_professionali)}
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
} 