"use client"

import React from 'react';
import type { QuestionarioStrutture } from '@/types/questionari';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Props {
  formData: QuestionarioStrutture;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStrutture>>;
}

export default function SezioneBStrutture({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (!prev) {
        return {
          ...formData,
          [name]: value
        };
      }
      
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handlePersonaleChange = (
    tipo: 'retribuito' | 'volontario',
    genere: 'uomini' | 'donne',
    value: number
  ) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [`personale_${tipo}`]: {
          ...prev[`personale_${tipo}`],
          [genere]: value,
          totale: tipo === 'retribuito' 
            ? (genere === 'uomini' ? value + prev.personale_retribuito.donne : prev.personale_retribuito.uomini + value)
            : (genere === 'uomini' ? value + prev.personale_volontario.donne : prev.personale_volontario.uomini + value)
        }
      }
      return newData
    })
  }

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
        <h3 className="text-lg font-medium mb-4">B1. Tipologia struttura</h3>
        <select
          name="tipologia_struttura"
          value={formData.tipologia_struttura || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Seleziona tipologia</option>
          <option value="casa_accoglienza">Casa di accoglienza</option>
          <option value="comunita_alloggio">Comunità alloggio</option>
          <option value="centro_diurno">Centro diurno</option>
          <option value="altro">Altro</option>
        </select>
        
        {formData.tipologia_struttura === 'altro' && (
          <input
            type="text"
            name="tipologia_struttura_altro"
            value={formData.tipologia_struttura_altro || ''}
            onChange={handleChange}
            className="mt-2 w-full p-2 border rounded"
            placeholder="Specificare altra tipologia..."
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B2. Capacità ricettiva</h3>
        <input
          type="number"
          name="capacita_ricettiva"
          value={formData.capacita_ricettiva || ''}
          onChange={handleChange}
          min="0"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">B3. Numero di persone attualmente ospitate</h3>
        <input
          type="number"
          name="persone_ospitate"
          value={formData.persone_ospitate || ''}
          onChange={handleChange}
          min="0"
          className="w-full p-2 border rounded"
        />
      </div>

      <h2 className="text-xl font-semibold mt-6">Sezione B: Informazioni sul Personale</h2>

      {/* Personale Retribuito */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personale Retribuito</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="personale_retribuito_uomini">Uomini</Label>
            <Input
              id="personale_retribuito_uomini"
              type="number"
              min={0}
              value={formData.personale_retribuito.uomini}
              onChange={(e) => handlePersonaleChange('retribuito', 'uomini', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personale_retribuito_donne">Donne</Label>
            <Input
              id="personale_retribuito_donne"
              type="number"
              min={0}
              value={formData.personale_retribuito.donne}
              onChange={(e) => handlePersonaleChange('retribuito', 'donne', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Totale personale retribuito</Label>
          <div className="text-lg font-medium">
            {formData.personale_retribuito.totale}
          </div>
        </div>
      </div>

      {/* Personale Volontario */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personale Volontario</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="personale_volontario_uomini">Uomini</Label>
            <Input
              id="personale_volontario_uomini"
              type="number"
              min={0}
              value={formData.personale_volontario.uomini}
              onChange={(e) => handlePersonaleChange('volontario', 'uomini', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personale_volontario_donne">Donne</Label>
            <Input
              id="personale_volontario_donne"
              type="number"
              min={0}
              value={formData.personale_volontario.donne}
              onChange={(e) => handlePersonaleChange('volontario', 'donne', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Totale personale volontario</Label>
          <div className="text-lg font-medium">
            {formData.personale_volontario.totale}
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