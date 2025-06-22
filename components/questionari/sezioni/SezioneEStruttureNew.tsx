"use client"

import React from 'react';
import { QuestionarioStruttureNew, SoggettoCollaborazione } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneEStruttureNew({ formData, setFormData }: Props) {
  const handleCollaborazioneChange = (index: number, field: keyof SoggettoCollaborazione, value: string) => {
    setFormData(prev => {
      const newCollaborazioni = [...prev.collaborazioni];
      if (!newCollaborazioni[index]) {
        newCollaborazioni[index] = { denominazione: '', tipo: 1, oggetto: '' };
      }
      newCollaborazioni[index] = {
        ...newCollaborazioni[index],
        [field]: field === 'tipo' ? Number(value) : value
      };
      return {
        ...prev,
        collaborazioni: newCollaborazioni
      };
    });
  };

  const handlePuntiForzaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      punti_forza_network: value
    }));
  };

  const handleCriticaNetworkChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      critica_network: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Collaborazioni e partnership</h3>
          
          {[0, 1, 2].map((index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <h4 className="font-medium mb-4">Soggetto {index + 1}</h4>
              
              <div className="space-y-4">
                <div>
                  <Label>Denominazione</Label>
                  <Input
                    value={formData.collaborazioni[index]?.denominazione || ''}
                    onChange={(e) => handleCollaborazioneChange(index, 'denominazione', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Tipo di collaborazione</Label>
                  <Select
                    value={String(formData.collaborazioni[index]?.tipo || '1')}
                    onValueChange={(value) => handleCollaborazioneChange(index, 'tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ricorrente</SelectItem>
                      <SelectItem value="2">Occasionale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Oggetto della collaborazione</Label>
                  <Textarea
                    value={formData.collaborazioni[index]?.oggetto || ''}
                    onChange={(e) => handleCollaborazioneChange(index, 'oggetto', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Valutazione del network</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Punti di forza del network</Label>
              <Textarea
                value={formData.punti_forza_network}
                onChange={(e) => handlePuntiForzaChange(e.target.value)}
              />
            </div>

            <div>
              <Label>Criticità del network</Label>
              <Textarea
                value={formData.critica_network}
                onChange={(e) => handleCriticaNetworkChange(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 