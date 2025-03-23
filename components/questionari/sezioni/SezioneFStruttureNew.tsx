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

export default function SezioneFStruttureNew({ formData, setFormData }: Props) {
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      criticita: {
        ...prev.criticita,
        [name]: checked
      }
    }));
  };

  const handleAltroSpecificareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      criticita: {
        ...prev.criticita,
        altro_specificare: e.target.value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione F: Criticità</h2>

      <div className="space-y-4">
        <Label className="text-lg">Principali criticità riscontrate:</Label>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="finanziarie"
              checked={formData.criticita.finanziarie}
              onCheckedChange={(checked) => handleCheckboxChange('finanziarie', checked as boolean)}
            />
            <Label htmlFor="finanziarie">Difficoltà finanziarie</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="personale"
              checked={formData.criticita.personale}
              onCheckedChange={(checked) => handleCheckboxChange('personale', checked as boolean)}
            />
            <Label htmlFor="personale">Carenza di personale</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="spazi"
              checked={formData.criticita.spazi}
              onCheckedChange={(checked) => handleCheckboxChange('spazi', checked as boolean)}
            />
            <Label htmlFor="spazi">Inadeguatezza degli spazi</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="attrezzature"
              checked={formData.criticita.attrezzature}
              onCheckedChange={(checked) => handleCheckboxChange('attrezzature', checked as boolean)}
            />
            <Label htmlFor="attrezzature">Carenza di attrezzature</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="utenza"
              checked={formData.criticita.utenza}
              onCheckedChange={(checked) => handleCheckboxChange('utenza', checked as boolean)}
            />
            <Label htmlFor="utenza">Difficoltà con l'utenza</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rete_servizi"
              checked={formData.criticita.rete_servizi}
              onCheckedChange={(checked) => handleCheckboxChange('rete_servizi', checked as boolean)}
            />
            <Label htmlFor="rete_servizi">Problemi di rete con altri servizi</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="altro"
              checked={formData.criticita.altro}
              onCheckedChange={(checked) => handleCheckboxChange('altro', checked as boolean)}
            />
            <Label htmlFor="altro">Altro</Label>
          </div>

          {formData.criticita.altro && (
            <div className="ml-6">
              <Label>Specificare altro</Label>
              <Input
                value={formData.criticita.altro_specificare || ''}
                onChange={handleAltroSpecificareChange}
                placeholder="Specificare altre criticità..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 