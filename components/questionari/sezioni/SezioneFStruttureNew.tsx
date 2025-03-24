"use client"

import React from 'react';
import { QuestionarioStruttureNew, Fornitore } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneFStruttureNew({ formData, setFormData }: Props) {
  const handleFondiChange = (tipo: 'fondi_pubblici' | 'fondi_privati', value: string) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    
    setFormData(prev => {
      const newData = {
        ...prev,
        finanziamenti: {
          ...prev.finanziamenti,
          [tipo]: numValue
        }
      };
      
      // Calcola il totale
      newData.finanziamenti.totale = 
        (newData.finanziamenti.fondi_pubblici || 0) + 
        (newData.finanziamenti.fondi_privati || 0);
      
      return newData;
    });
  };

  const handleSpecificheChange = (
    tipo: 'fondi_pubblici_specifiche' | 'fondi_privati_specifiche',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      finanziamenti: {
        ...prev.finanziamenti,
        [tipo]: value
      }
    }));
  };

  const handleFornitoreChange = (index: number, field: keyof Fornitore, value: string) => {
    setFormData(prev => {
      const newFornitori = [...prev.finanziamenti.fornitori];
      if (!newFornitori[index]) {
        newFornitori[index] = { nome: '', tipo_sostegno: '' };
      }
      newFornitori[index] = {
        ...newFornitori[index],
        [field]: value
      };
      return {
        ...prev,
        finanziamenti: {
          ...prev.finanziamenti,
          fornitori: newFornitori
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            F1. Finanziamento della struttura
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fondi Pubblici (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.finanziamenti.fondi_pubblici}
                  onChange={(e) => handleFondiChange('fondi_pubblici', e.target.value)}
                />
              </div>
              <div>
                <Label>Fondi Privati (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.finanziamenti.fondi_privati}
                  onChange={(e) => handleFondiChange('fondi_privati', e.target.value)}
                />
              </div>
            </div>

            <div className="font-semibold">
              Totale: {formData.finanziamenti.totale}%
            </div>

            <div className="space-y-4">
              <div>
                <Label>Specificare le fonti dei finanziamenti pubblici</Label>
                <Textarea
                  value={formData.finanziamenti.fondi_pubblici_specifiche}
                  onChange={(e) => handleSpecificheChange('fondi_pubblici_specifiche', e.target.value)}
                />
              </div>
              <div>
                <Label>Specificare le fonti dei finanziamenti privati</Label>
                <Textarea
                  value={formData.finanziamenti.fondi_privati_specifiche}
                  onChange={(e) => handleSpecificheChange('fondi_privati_specifiche', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            F2. Fornitura di beni e servizi
          </h3>
          
          {[0, 1].map((index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <h4 className="font-semibold mb-4">Fornitore {index + 1}</h4>
              
              <div className="space-y-4">
                <div>
                  <Label>Nome del fornitore</Label>
                  <Input
                    value={formData.finanziamenti.fornitori[index]?.nome || ''}
                    onChange={(e) => handleFornitoreChange(index, 'nome', e.target.value)}
                    placeholder="Specificare il nome"
                  />
                </div>
                <div>
                  <Label>Tipo di sostegno fornito</Label>
                  <Textarea
                    value={formData.finanziamenti.fornitori[index]?.tipo_sostegno || ''}
                    onChange={(e) => handleFornitoreChange(index, 'tipo_sostegno', e.target.value)}
                    placeholder="Specificare il tipo di sostegno fornito"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 