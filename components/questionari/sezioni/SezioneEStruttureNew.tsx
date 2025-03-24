"use client"

import React from 'react';
import { QuestionarioStruttureNew } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneEStruttureNew({ formData, setFormData }: Props) {
  const handleSoggettoChange = (index: number, field: 'denominazione' | 'tipo' | 'oggetto', value: string) => {
    setFormData(prev => {
      const newSoggetti = [...(prev.collaborazioni.soggetti || [])];
      if (!newSoggetti[index]) {
        newSoggetti[index] = {
          denominazione: '',
          tipo: 'occasionale',
          oggetto: ''
        };
      }
      newSoggetti[index] = {
        ...newSoggetti[index],
        [field]: value
      };
      return {
        ...prev,
        collaborazioni: {
          ...prev.collaborazioni,
          soggetti: newSoggetti
        }
      };
    });
  };

  const handleNetworkChange = (field: 'punti_forza' | 'criticita', value: string) => {
    setFormData(prev => ({
      ...prev,
      collaborazioni: {
        ...prev.collaborazioni,
        [field]: value
      }
    }));
  };

  const handleCriticitaChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      collaborazioni: {
        ...prev.collaborazioni,
        criticita: {
          ...prev.collaborazioni.criticita,
          [field]: value
        }
      }
    }));
  };

  const handleAltroSpecificareChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      collaborazioni: {
        ...prev.collaborazioni,
        criticita: {
          ...prev.collaborazioni.criticita,
          altro_specificare: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            E1. Con quali soggetti/strutture collaborate?
          </h3>

          {[1, 2, 3].map((num, index) => (
            <div key={num} className="mb-8 p-4 border rounded">
              <h4 className="font-semibold mb-4">{num}° soggetto</h4>
              
              <div className="space-y-4">
                <div>
                  <Label>E1.{num}SOGG Denominazione</Label>
                  <Input
                    value={formData.collaborazioni.soggetti[index]?.denominazione || ''}
                    onChange={(e) => handleSoggettoChange(index, 'denominazione', e.target.value)}
                  />
                </div>

                <div>
                  <Label>E1.{num}TIPO Tipo di collaborazione</Label>
                  <RadioGroup
                    value={formData.collaborazioni.soggetti[index]?.tipo || 'occasionale'}
                    onValueChange={(value) => handleSoggettoChange(index, 'tipo', value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ricorrente" id={`ricorrente-${index}`} />
                      <Label htmlFor={`ricorrente-${index}`}>1. ricorrente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="occasionale" id={`occasionale-${index}`} />
                      <Label htmlFor={`occasionale-${index}`}>2. occasionale</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>E1.{num}OGGETTO Oggetto della collaborazione</Label>
                  <Input
                    value={formData.collaborazioni.soggetti[index]?.oggetto || ''}
                    onChange={(e) => handleSoggettoChange(index, 'oggetto', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            E2. Punti di forza del network
          </h3>
          <Textarea
            value={formData.collaborazioni.punti_forza || ''}
            onChange={(e) => handleNetworkChange('punti_forza', e.target.value)}
            placeholder="Descrivere brevemente"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            E3. Criticità del network
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.collaborazioni.criticita.finanziarie}
                onCheckedChange={(checked) => handleCriticitaChange('finanziarie', checked as boolean)}
              />
              <Label>Finanziarie</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.collaborazioni.criticita.personale}
                onCheckedChange={(checked) => handleCriticitaChange('personale', checked as boolean)}
              />
              <Label>Personale</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.collaborazioni.criticita.spazi}
                onCheckedChange={(checked) => handleCriticitaChange('spazi', checked as boolean)}
              />
              <Label>Spazi</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.collaborazioni.criticita.attrezzature}
                onCheckedChange={(checked) => handleCriticitaChange('attrezzature', checked as boolean)}
              />
              <Label>Attrezzature</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.collaborazioni.criticita.utenza}
                onCheckedChange={(checked) => handleCriticitaChange('utenza', checked as boolean)}
              />
              <Label>Utenza</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.collaborazioni.criticita.rete_servizi}
                onCheckedChange={(checked) => handleCriticitaChange('rete_servizi', checked as boolean)}
              />
              <Label>Rete servizi</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.collaborazioni.criticita.altro}
                onCheckedChange={(checked) => handleCriticitaChange('altro', checked as boolean)}
              />
              <Label>Altro</Label>
            </div>

            {formData.collaborazioni.criticita.altro && (
              <div>
                <Label>Specificare altro</Label>
                <Input
                  value={formData.collaborazioni.criticita.altro_specificare}
                  onChange={(e) => handleAltroSpecificareChange(e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 