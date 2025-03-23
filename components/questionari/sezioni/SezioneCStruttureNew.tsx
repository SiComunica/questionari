"use client"

import React from 'react';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneCStruttureNew({ formData, setFormData }: Props) {
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      servizi_offerti: {
        ...prev.servizi_offerti,
        [name]: checked
      }
    }));
  };

  const handleAltroSpecificareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      servizi_offerti: {
        ...prev.servizi_offerti,
        altro_specificare: e.target.value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione C: Servizi Offerti</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Label className="text-lg">Seleziona i servizi offerti dalla struttura:</Label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="accoglienza"
                checked={formData.servizi_offerti.accoglienza}
                onCheckedChange={(checked) => handleCheckboxChange('accoglienza', checked as boolean)}
              />
              <Label htmlFor="accoglienza">Accoglienza</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="orientamento"
                checked={formData.servizi_offerti.orientamento}
                onCheckedChange={(checked) => handleCheckboxChange('orientamento', checked as boolean)}
              />
              <Label htmlFor="orientamento">Orientamento</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="formazione"
                checked={formData.servizi_offerti.formazione}
                onCheckedChange={(checked) => handleCheckboxChange('formazione', checked as boolean)}
              />
              <Label htmlFor="formazione">Formazione</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="inserimento_lavorativo"
                checked={formData.servizi_offerti.inserimento_lavorativo}
                onCheckedChange={(checked) => handleCheckboxChange('inserimento_lavorativo', checked as boolean)}
              />
              <Label htmlFor="inserimento_lavorativo">Inserimento lavorativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="assistenza_legale"
                checked={formData.servizi_offerti.assistenza_legale}
                onCheckedChange={(checked) => handleCheckboxChange('assistenza_legale', checked as boolean)}
              />
              <Label htmlFor="assistenza_legale">Assistenza legale</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="assistenza_sanitaria"
                checked={formData.servizi_offerti.assistenza_sanitaria}
                onCheckedChange={(checked) => handleCheckboxChange('assistenza_sanitaria', checked as boolean)}
              />
              <Label htmlFor="assistenza_sanitaria">Assistenza sanitaria</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mediazione_culturale"
                checked={formData.servizi_offerti.mediazione_culturale}
                onCheckedChange={(checked) => handleCheckboxChange('mediazione_culturale', checked as boolean)}
              />
              <Label htmlFor="mediazione_culturale">Mediazione culturale</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="supporto_psicologico"
                checked={formData.servizi_offerti.supporto_psicologico}
                onCheckedChange={(checked) => handleCheckboxChange('supporto_psicologico', checked as boolean)}
              />
              <Label htmlFor="supporto_psicologico">Supporto psicologico</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="altro"
                checked={formData.servizi_offerti.altro}
                onCheckedChange={(checked) => handleCheckboxChange('altro', checked as boolean)}
              />
              <Label htmlFor="altro">Altro</Label>
            </div>

            {formData.servizi_offerti.altro && (
              <div className="ml-6">
                <Label>Specificare altro</Label>
                <Input
                  value={formData.servizi_offerti.altro_specificare || ''}
                  onChange={handleAltroSpecificareChange}
                  placeholder="Specificare altri servizi..."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 