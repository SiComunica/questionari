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
  // Assicuriamoci che i dati siano inizializzati correttamente
  const personaleRetribuito = formData?.personale_retribuito || { uomini: 0, donne: 0, totale: 0 };
  const personaleVolontario = formData?.personale_volontario || { uomini: 0, donne: 0, totale: 0 };
  const figureProfessionali = formData?.figure_professionali || {
    psicologi: false,
    assistenti_sociali: false,
    educatori: false,
    mediatori: false,
    medici: false,
    personale_infermieristico: false,
    insegnanti_formatori: false,
    operatori_religiosi: false,
    tutor: false,
    operatori_legali: false,
    operatori_multifunzionali: false,
    amministrativi: false,
    altro: false,
    altro_specificare: ''
  };

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
          <h3 className="text-lg font-medium">B1. Personale retribuito impegnato stabilmente presso la struttura</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Uomini</Label>
              <Input
                type="number"
                name="uomini"
                value={personaleRetribuito.uomini}
                onChange={handlePersonaleRetribuitoChange}
                min={0}
              />
            </div>
            <div>
              <Label>Donne</Label>
              <Input
                type="number"
                name="donne"
                value={personaleRetribuito.donne}
                onChange={handlePersonaleRetribuitoChange}
                min={0}
              />
            </div>
            <div>
              <Label>Totale</Label>
              <Input
                type="number"
                value={personaleRetribuito.totale}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">B2. Personale volontario di supporto alle attività</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Uomini</Label>
              <Input
                type="number"
                name="uomini"
                value={personaleVolontario.uomini}
                onChange={handlePersonaleVolontarioChange}
                min={0}
              />
            </div>
            <div>
              <Label>Donne</Label>
              <Input
                type="number"
                name="donne"
                value={personaleVolontario.donne}
                onChange={handlePersonaleVolontarioChange}
                min={0}
              />
            </div>
            <div>
              <Label>Totale</Label>
              <Input
                type="number"
                value={personaleVolontario.totale}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">B3. Figure professionali che operano presso la struttura</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'psicologi', label: 'Psicologi' },
              { id: 'assistenti_sociali', label: 'Assistenti sociali' },
              { id: 'educatori', label: 'Educatori' },
              { id: 'mediatori', label: 'Mediatori' },
              { id: 'medici', label: 'Medici' },
              { id: 'personale_infermieristico', label: 'Personale infermieristico/operatori sanitari' },
              { id: 'insegnanti_formatori', label: 'Insegnanti/formatori' },
              { id: 'operatori_religiosi', label: 'Cappellano/operatori religiosi e spirituali' },
              { id: 'tutor', label: 'Tutor' },
              { id: 'operatori_legali', label: 'Operatori legali' },
              { id: 'operatori_multifunzionali', label: 'Operatori multifunzionali' },
              { id: 'amministrativi', label: 'Amministrativi' }
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox 
                  id={id}
                  checked={figureProfessionali[id as keyof typeof figureProfessionali] as boolean}
                  onCheckedChange={(checked) => handleFigureProfessionaliChange(id, checked as boolean)}
                />
                <Label htmlFor={id}>{label}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="altro"
                checked={figureProfessionali.altro}
                onCheckedChange={(checked) => handleFigureProfessionaliChange('altro', checked as boolean)}
              />
              <Label htmlFor="altro">Altro</Label>
            </div>
          </div>

          {figureProfessionali.altro && (
            <div className="mt-2">
              <Label>Specificare altro</Label>
              <Input
                value={figureProfessionali.altro_specificare}
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