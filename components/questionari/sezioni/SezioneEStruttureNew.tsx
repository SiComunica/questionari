"use client"

import React from 'react';
import { QuestionarioStruttureNew } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
          <Textarea
            value={formData.collaborazioni.criticita || ''}
            onChange={(e) => handleNetworkChange('criticita', e.target.value)}
            placeholder="Descrivere brevemente"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
} 