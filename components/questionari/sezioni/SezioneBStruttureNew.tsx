"use client"

import React from 'react';
import { QuestionarioStruttureNew, PersonaleRetribuito, PersonaleVolontario } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneBStruttureNew({ formData, setFormData }: Props) {
  const handlePersonaleRetribuitoChange = (field: keyof PersonaleRetribuito, value: number) => {
    setFormData(prev => ({
      ...prev,
      personale_retribuito: {
        ...prev.personale_retribuito,
        [field]: value,
        totale: field === 'totale' ? value : 
          (field === 'uomini' || field === 'donne') ? 
          (field === 'uomini' ? value + (prev.personale_retribuito.donne || 0) : 
          (prev.personale_retribuito.uomini || 0) + value) :
          prev.personale_retribuito.totale
      }
    }));
  };

  const handlePersonaleVolontarioChange = (field: keyof PersonaleVolontario, value: number) => {
    setFormData(prev => ({
      ...prev,
      personale_volontario: {
        ...prev.personale_volontario,
        [field]: value,
        totale: field === 'totale' ? value :
          (field === 'uomini' || field === 'donne') ?
          (field === 'uomini' ? value + (prev.personale_volontario.donne || 0) :
          (prev.personale_volontario.uomini || 0) + value) :
          prev.personale_volontario.totale
      }
    }));
  };

  const handleFigureProfessionaliChange = (figura: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      figure_professionali: checked 
        ? [...prev.figure_professionali, figura]
        : prev.figure_professionali.filter(f => f !== figura)
    }));
  };

  const handleAltroSpecificareChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      figure_professionali_altro: value
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Personale della struttura</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Personale retribuito</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Uomini</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.personale_retribuito.uomini}
                  onChange={(e) => handlePersonaleRetribuitoChange('uomini', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Donne</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.personale_retribuito.donne}
                  onChange={(e) => handlePersonaleRetribuitoChange('donne', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Part-time</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.personale_retribuito.part_time}
                  onChange={(e) => handlePersonaleRetribuitoChange('part_time', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Full-time</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.personale_retribuito.full_time}
                  onChange={(e) => handlePersonaleRetribuitoChange('full_time', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="mt-2">
              <Label>Totale personale retribuito</Label>
              <Input
                type="number"
                min={0}
                value={formData.personale_retribuito.totale}
                readOnly
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Personale volontario</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Uomini</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.personale_volontario.uomini}
                  onChange={(e) => handlePersonaleVolontarioChange('uomini', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Donne</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.personale_volontario.donne}
                  onChange={(e) => handlePersonaleVolontarioChange('donne', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="mt-2">
              <Label>Totale personale volontario</Label>
              <Input
                type="number"
                min={0}
                value={formData.personale_volontario.totale}
                readOnly
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Figure professionali presenti</h4>
            <div className="space-y-2">
              {[
                'Educatori professionali',
                'Psicologi',
                'Assistenti sociali',
                'Mediatori',
                'Operatori di strada',
                'Amministrativi'
              ].map((figura) => (
                <div key={figura} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.figure_professionali.includes(figura)}
                    onCheckedChange={(checked) => handleFigureProfessionaliChange(figura, checked as boolean)}
                  />
                  <Label>{figura}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.figure_professionali.includes('Altro')}
                  onCheckedChange={(checked) => handleFigureProfessionaliChange('Altro', checked as boolean)}
                />
                <Label>Altro</Label>
              </div>
              {formData.figure_professionali.includes('Altro') && (
                <div>
                  <Label>Specificare altro</Label>
                  <Input
                    value={formData.figure_professionali_altro}
                    onChange={(e) => handleAltroSpecificareChange(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 