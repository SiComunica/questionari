"use client"

import React from 'react';
import { QuestionarioStruttureNew } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneDStruttureNew({ formData, setFormData }: Props) {
  const handleServizioChange = (servizio: keyof typeof formData.attività_servizi, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      attività_servizi: {
        ...prev.attività_servizi,
        [servizio]: checked
      }
    }));
  };

  const handleAltroSpecificareChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      attività_servizi: {
        ...prev.attività_servizi,
        altro_specificare: value
      }
    }));
  };

  const handleAttivitaSignificativeChange = (attivita: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      attivita_significative: checked 
        ? [...prev.attivita_significative, attivita]
        : prev.attivita_significative.filter(a => a !== attivita)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Servizi offerti</h3>
          <div className="space-y-2">
            {[
              'accoglienza_residenziale',
              'accoglienza_diurna',
              'orientamento_lavoro',
              'orientamento_formazione',
              'ascolto',
              'accompagnamento_sociale',
              'assistenza_legale',
              'assistenza_sanitaria',
              'assistenza_psicologica',
              'mediazione_linguistica',
              'mediazione_culturale',
              'mediazione_familiare',
              'pronto_intervento'
            ].map((servizio) => (
              <div key={servizio} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.attività_servizi[servizio as keyof typeof formData.attività_servizi]}
                  onCheckedChange={(checked) => handleServizioChange(servizio as keyof typeof formData.attività_servizi, checked as boolean)}
                />
                <Label>{servizio.replace(/_/g, ' ')}</Label>
              </div>
            ))}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.attività_servizi.altro}
                onCheckedChange={(checked) => handleServizioChange('altro', checked as boolean)}
              />
              <Label>Altro</Label>
            </div>

            {formData.attività_servizi.altro && (
              <div>
                <Label>Specificare altro</Label>
                <Input
                  value={formData.attività_servizi.altro_specificare}
                  onChange={(e) => handleAltroSpecificareChange(e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Attività significative</h3>
          <div className="space-y-2">
            {[
              'formazione_professionale',
              'tirocini',
              'laboratori',
              'attivita_culturali',
              'attivita_sportive'
            ].map((attivita) => (
              <div key={attivita} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.attivita_significative.includes(attivita)}
                  onCheckedChange={(checked) => handleAttivitaSignificativeChange(attivita, checked as boolean)}
                />
                <Label>{attivita.replace(/_/g, ' ')}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 