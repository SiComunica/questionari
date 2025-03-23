"use client"

import React from 'react';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneDStruttureNew({ formData, setFormData }: Props) {
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      caratteristiche_utenti: {
        ...prev.caratteristiche_utenti,
        [name]: checked
      }
    }));
  };

  const handleAltroSpecificareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      caratteristiche_utenti: {
        ...prev.caratteristiche_utenti,
        altro_specificare: e.target.value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione D: Caratteristiche Utenti</h2>

      <div className="space-y-4">
        <Label className="text-lg">Tipologia di utenti accolti:</Label>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="minori"
              checked={formData.caratteristiche_utenti.minori}
              onCheckedChange={(checked) => handleCheckboxChange('minori', checked as boolean)}
            />
            <Label htmlFor="minori">Minori</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="donne"
              checked={formData.caratteristiche_utenti.donne}
              onCheckedChange={(checked) => handleCheckboxChange('donne', checked as boolean)}
            />
            <Label htmlFor="donne">Donne</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="famiglie"
              checked={formData.caratteristiche_utenti.famiglie}
              onCheckedChange={(checked) => handleCheckboxChange('famiglie', checked as boolean)}
            />
            <Label htmlFor="famiglie">Famiglie</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="disabili"
              checked={formData.caratteristiche_utenti.disabili}
              onCheckedChange={(checked) => handleCheckboxChange('disabili', checked as boolean)}
            />
            <Label htmlFor="disabili">Persone con disabilità</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anziani"
              checked={formData.caratteristiche_utenti.anziani}
              onCheckedChange={(checked) => handleCheckboxChange('anziani', checked as boolean)}
            />
            <Label htmlFor="anziani">Anziani</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="migranti"
              checked={formData.caratteristiche_utenti.migranti}
              onCheckedChange={(checked) => handleCheckboxChange('migranti', checked as boolean)}
            />
            <Label htmlFor="migranti">Migranti</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dipendenze"
              checked={formData.caratteristiche_utenti.dipendenze}
              onCheckedChange={(checked) => handleCheckboxChange('dipendenze', checked as boolean)}
            />
            <Label htmlFor="dipendenze">Persone con dipendenze</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="altro"
              checked={formData.caratteristiche_utenti.altro}
              onCheckedChange={(checked) => handleCheckboxChange('altro', checked as boolean)}
            />
            <Label htmlFor="altro">Altro</Label>
          </div>

          {formData.caratteristiche_utenti.altro && (
            <div className="ml-6">
              <Label>Specificare altro</Label>
              <Input
                value={formData.caratteristiche_utenti.altro_specificare || ''}
                onChange={handleAltroSpecificareChange}
                placeholder="Specificare altre caratteristiche..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 