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

export default function SezioneBStruttureNew({ formData, setFormData }: Props) {
  const handlePersonaleRetribuitoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setFormData(prev => {
      const newPersonaleRetribuito = {
        ...prev.personale_retribuito,
        [name]: numValue
      };
      
      // Calcolo automatico del totale
      newPersonaleRetribuito.totale = 
        (newPersonaleRetribuito.uomini || 0) + 
        (newPersonaleRetribuito.donne || 0);

      return {
        ...prev,
        personale_retribuito: newPersonaleRetribuito
      };
    });
  };

  const handlePersonaleVolontarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setFormData(prev => {
      const newPersonaleVolontario = {
        ...prev.personale_volontario,
        [name]: numValue
      };
      
      // Calcolo automatico del totale
      newPersonaleVolontario.totale = 
        (newPersonaleVolontario.uomini || 0) + 
        (newPersonaleVolontario.donne || 0);

      return {
        ...prev,
        personale_volontario: newPersonaleVolontario
      };
    });
  };

  const handleFigureProfessionaliChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      figure_professionali: {
        ...prev.figure_professionali,
        [name]: checked
      }
    }));
  };

  const handleAltroSpecificareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      figure_professionali: {
        ...prev.figure_professionali,
        altro_specificare: e.target.value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione B: Informazioni sul personale</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">B1. Personale retribuito</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Uomini</Label>
              <Input
                type="number"
                name="uomini"
                value={formData.personale_retribuito.uomini}
                onChange={handlePersonaleRetribuitoChange}
                min={0}
              />
            </div>
            <div>
              <Label>Donne</Label>
              <Input
                type="number"
                name="donne"
                value={formData.personale_retribuito.donne}
                onChange={handlePersonaleRetribuitoChange}
                min={0}
              />
            </div>
            <div>
              <Label>Totale</Label>
              <Input
                type="number"
                value={formData.personale_retribuito.totale}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">B2. Personale volontario</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Uomini</Label>
              <Input
                type="number"
                name="uomini"
                value={formData.personale_volontario.uomini}
                onChange={handlePersonaleVolontarioChange}
                min={0}
              />
            </div>
            <div>
              <Label>Donne</Label>
              <Input
                type="number"
                name="donne"
                value={formData.personale_volontario.donne}
                onChange={handlePersonaleVolontarioChange}
                min={0}
              />
            </div>
            <div>
              <Label>Totale</Label>
              <Input
                type="number"
                value={formData.personale_volontario.totale}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">B3. Figure professionali</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="psicologi"
                checked={formData.figure_professionali.psicologi}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('psicologi', checked as boolean)}
              />
              <Label htmlFor="psicologi">Psicologi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="assistenti_sociali"
                checked={formData.figure_professionali.assistenti_sociali}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('assistenti_sociali', checked as boolean)}
              />
              <Label htmlFor="assistenti_sociali">Assistenti sociali</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="educatori"
                checked={formData.figure_professionali.educatori}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('educatori', checked as boolean)}
              />
              <Label htmlFor="educatori">Educatori</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mediatori"
                checked={formData.figure_professionali.mediatori}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('mediatori', checked as boolean)}
              />
              <Label htmlFor="mediatori">Mediatori</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="medici"
                checked={formData.figure_professionali.medici}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('medici', checked as boolean)}
              />
              <Label htmlFor="medici">Medici</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="personale_infermieristico"
                checked={formData.figure_professionali.personale_infermieristico}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('personale_infermieristico', checked as boolean)}
              />
              <Label htmlFor="personale_infermieristico">Personale infermieristico/operatori sanitari</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="insegnanti_formatori"
                checked={formData.figure_professionali.insegnanti_formatori}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('insegnanti_formatori', checked as boolean)}
              />
              <Label htmlFor="insegnanti_formatori">Insegnanti/formatori</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="operatori_religiosi"
                checked={formData.figure_professionali.operatori_religiosi}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('operatori_religiosi', checked as boolean)}
              />
              <Label htmlFor="operatori_religiosi">Cappellano/operatori religiosi e spirituali</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tutor"
                checked={formData.figure_professionali.tutor}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('tutor', checked as boolean)}
              />
              <Label htmlFor="tutor">Tutor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="operatori_legali"
                checked={formData.figure_professionali.operatori_legali}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('operatori_legali', checked as boolean)}
              />
              <Label htmlFor="operatori_legali">Operatori legali</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="operatori_multifunzionali"
                checked={formData.figure_professionali.operatori_multifunzionali}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('operatori_multifunzionali', checked as boolean)}
              />
              <Label htmlFor="operatori_multifunzionali">Operatori multifunzionali</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="amministrativi"
                checked={formData.figure_professionali.amministrativi}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('amministrativi', checked as boolean)}
              />
              <Label htmlFor="amministrativi">Amministrativi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="altro"
                checked={formData.figure_professionali.altro}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('altro', checked as boolean)}
              />
              <Label htmlFor="altro">Altro</Label>
            </div>
          </div>

          {formData.figure_professionali.altro && (
            <div className="mt-2">
              <Label>Specificare altro</Label>
              <Input
                value={formData.figure_professionali.altro_specificare || ''}
                onChange={handleAltroSpecificareChange}
                placeholder="Specificare altre figure professionali..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 