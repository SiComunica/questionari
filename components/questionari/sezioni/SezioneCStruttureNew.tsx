"use client"

import React, { useState } from 'react';
import { QuestionarioStruttureNew } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckedState } from '@radix-ui/react-checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: (data: QuestionarioStruttureNew) => void;
}

export default function SezioneCStruttureNew({ formData, setFormData }: Props) {
  const handlePersoneOspitateChange = (
    categoria: 'fino_16' | 'da_16_a_18' | 'maggiorenni',
    genere: 'uomini' | 'donne',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    
    setFormData(prev => {
      const newData = { ...prev };
      newData.persone_ospitate[categoria][genere] = numValue;
      
      // Calcolo totale per categoria
      newData.persone_ospitate[categoria].totale = 
        newData.persone_ospitate[categoria].uomini + 
        newData.persone_ospitate[categoria].donne;
      
      // Calcolo totali generali
      newData.persone_ospitate.totale.uomini = 
        newData.persone_ospitate.fino_16.uomini +
        newData.persone_ospitate.da_16_a_18.uomini +
        newData.persone_ospitate.maggiorenni.uomini;
        
      newData.persone_ospitate.totale.donne = 
        newData.persone_ospitate.fino_16.donne +
        newData.persone_ospitate.da_16_a_18.donne +
        newData.persone_ospitate.maggiorenni.donne;
        
      newData.persone_ospitate.totale.totale = 
        newData.persone_ospitate.totale.uomini +
        newData.persone_ospitate.totale.donne;
        
      return newData;
    });
  };

  const handlePersoneNonOspitateChange = (
    categoria: 'fino_16' | 'da_16_a_18' | 'maggiorenni',
    genere: 'uomini' | 'donne',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    
    setFormData(prev => {
      const newData = { ...prev };
      newData.persone_non_ospitate[categoria][genere] = numValue;
      
      // Calcolo totale per categoria
      newData.persone_non_ospitate[categoria].totale = 
        newData.persone_non_ospitate[categoria].uomini + 
        newData.persone_non_ospitate[categoria].donne;
      
      // Calcolo totali generali
      newData.persone_non_ospitate.totale.uomini = 
        newData.persone_non_ospitate.fino_16.uomini +
        newData.persone_non_ospitate.da_16_a_18.uomini +
        newData.persone_non_ospitate.maggiorenni.uomini;
        
      newData.persone_non_ospitate.totale.donne = 
        newData.persone_non_ospitate.fino_16.donne +
        newData.persone_non_ospitate.da_16_a_18.donne +
        newData.persone_non_ospitate.maggiorenni.donne;
        
      newData.persone_non_ospitate.totale.totale = 
        newData.persone_non_ospitate.totale.uomini +
        newData.persone_non_ospitate.totale.donne;
        
      return newData;
    });
  };

  const handleCaratteristicheOspitiChange = (
    categoria: 'adolescenti' | 'giovani',
    value: string,
    checked: boolean
  ) => {
    const fieldName = `caratteristiche_ospiti_${categoria}` as const;
    setFormData({
      ...formData,
      [fieldName]: checked 
        ? [...(formData[fieldName] || []), value]
        : (formData[fieldName] || []).filter(v => v !== value)
    });
  };

  const handleCaratteristicheNonOspitiChange = (
    categoria: 'adolescenti' | 'giovani',
    value: string,
    checked: boolean
  ) => {
    const fieldName = `caratteristiche_non_ospiti_${categoria}` as const;
    setFormData({
      ...formData,
      [fieldName]: checked 
        ? [...(formData[fieldName] || []), value]
        : (formData[fieldName] || []).filter(v => v !== value)
    });
  };

  const handleAltroSpecificareChange = (
    tipo: 'ospiti' | 'non_ospiti',
    categoria: 'adolescenti' | 'giovani',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [`caratteristiche_${tipo}`]: {
        ...prev[`caratteristiche_${tipo}`],
        [categoria]: {
          ...prev[`caratteristiche_${tipo}`][categoria],
          altro_specificare: value
        }
      }
    }));
  };

  const opzioniCaratteristicheAdolescenti = [
    "MSNA",
    "Minori stranieri accompagnati",
    "Minori italiani",
    "Minori vittime di tratta",
    "Minori con problemi di giustizia",
    "Altro"
  ];

  const opzioniCaratteristicheGiovani = [
    "Giovani italiani",
    "Giovani stranieri",
    "Giovani vittime di tratta",
    "Giovani con problemi di giustizia",
    "Altro"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            C1. Persone ospitate o di cui la struttura si occupa in modo continuativo
          </h3>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="font-semibold">Classe di età</div>
            <div className="font-semibold">Uomini</div>
            <div className="font-semibold">Donne</div>
            <div className="font-semibold">Totale</div>

            <div>Fino a 16 anni non compiuti</div>
            <Input
              type="number"
              min={0}
              value={formData.persone_ospitate.fino_16.uomini}
              onChange={(e) => handlePersoneOspitateChange('fino_16', 'uomini', e.target.value)}
            />
            <Input
              type="number"
              min={0}
              value={formData.persone_ospitate.fino_16.donne}
              onChange={(e) => handlePersoneOspitateChange('fino_16', 'donne', e.target.value)}
            />
            <div className="py-2">{formData.persone_ospitate.fino_16.totale}</div>

            <div>Dai 16 anni ai 18 non compiuti</div>
            <Input
              type="number"
              min={0}
              value={formData.persone_ospitate.da_16_a_18.uomini}
              onChange={(e) => handlePersoneOspitateChange('da_16_a_18', 'uomini', e.target.value)}
            />
            <Input
              type="number"
              min={0}
              value={formData.persone_ospitate.da_16_a_18.donne}
              onChange={(e) => handlePersoneOspitateChange('da_16_a_18', 'donne', e.target.value)}
            />
            <div className="py-2">{formData.persone_ospitate.da_16_a_18.totale}</div>

            <div>Maggiorenni</div>
            <Input
              type="number"
              min={0}
              value={formData.persone_ospitate.maggiorenni.uomini}
              onChange={(e) => handlePersoneOspitateChange('maggiorenni', 'uomini', e.target.value)}
            />
            <Input
              type="number"
              min={0}
              value={formData.persone_ospitate.maggiorenni.donne}
              onChange={(e) => handlePersoneOspitateChange('maggiorenni', 'donne', e.target.value)}
            />
            <div className="py-2">{formData.persone_ospitate.maggiorenni.totale}</div>

            <div className="font-semibold">Totale</div>
            <div className="py-2">{formData.persone_ospitate.totale.uomini}</div>
            <div className="py-2">{formData.persone_ospitate.totale.donne}</div>
            <div className="py-2">{formData.persone_ospitate.totale.totale}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            C2. Caratteristiche delle persone ospitate
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div></div>
            <div className="font-semibold">Adolescenti (16-18)</div>
            <div className="font-semibold">Giovani adulti (18-25)</div>

            {opzioniCaratteristicheAdolescenti.map((opzione) => (
              <div key={opzione} className="flex items-center space-x-2">
                <Checkbox
                  id={`ospiti-adolescenti-${opzione}`}
                  checked={(formData.caratteristiche_ospiti_adolescenti || []).includes(opzione)}
                  onCheckedChange={(checked: boolean) => 
                    handleCaratteristicheOspitiChange('adolescenti', opzione, checked)
                  }
                />
                <Label htmlFor={`ospiti-adolescenti-${opzione}`}>{opzione}</Label>
                {opzione === "Altro" && 
                  (formData.caratteristiche_ospiti_adolescenti || []).includes("Altro") && (
                  <Input
                    value={formData.caratteristiche_ospiti_adolescenti.find(v => v === 'altro')?.altro_specificare || ''}
                    onChange={(e) => handleAltroSpecificareChange('ospiti', 'adolescenti', e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            C3. Persone non ospitate che si sono rivolte alla struttura nel 2024
          </h3>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="font-semibold">Classe di età</div>
            <div className="font-semibold">Uomini</div>
            <div className="font-semibold">Donne</div>
            <div className="font-semibold">Totale</div>

            <div>Fino a 16 anni non compiuti</div>
            <Input
              type="number"
              min={0}
              value={formData.persone_non_ospitate.fino_16.uomini}
              onChange={(e) => handlePersoneNonOspitateChange('fino_16', 'uomini', e.target.value)}
            />
            <Input
              type="number"
              min={0}
              value={formData.persone_non_ospitate.fino_16.donne}
              onChange={(e) => handlePersoneNonOspitateChange('fino_16', 'donne', e.target.value)}
            />
            <div className="py-2">{formData.persone_non_ospitate.fino_16.totale}</div>

            <div>Dai 16 anni ai 18 non compiuti</div>
            <Input
              type="number"
              min={0}
              value={formData.persone_non_ospitate.da_16_a_18.uomini}
              onChange={(e) => handlePersoneNonOspitateChange('da_16_a_18', 'uomini', e.target.value)}
            />
            <Input
              type="number"
              min={0}
              value={formData.persone_non_ospitate.da_16_a_18.donne}
              onChange={(e) => handlePersoneNonOspitateChange('da_16_a_18', 'donne', e.target.value)}
            />
            <div className="py-2">{formData.persone_non_ospitate.da_16_a_18.totale}</div>

            <div>Maggiorenni</div>
            <Input
              type="number"
              min={0}
              value={formData.persone_non_ospitate.maggiorenni.uomini}
              onChange={(e) => handlePersoneNonOspitateChange('maggiorenni', 'uomini', e.target.value)}
            />
            <Input
              type="number"
              min={0}
              value={formData.persone_non_ospitate.maggiorenni.donne}
              onChange={(e) => handlePersoneNonOspitateChange('maggiorenni', 'donne', e.target.value)}
            />
            <div className="py-2">{formData.persone_non_ospitate.maggiorenni.totale}</div>

            <div className="font-semibold">Totale</div>
            <div className="py-2">{formData.persone_non_ospitate.totale.uomini}</div>
            <div className="py-2">{formData.persone_non_ospitate.totale.donne}</div>
            <div className="py-2">{formData.persone_non_ospitate.totale.totale}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            C4. Caratteristiche delle persone non ospitate
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div></div>
            <div className="font-semibold">Adolescenti (16-18)</div>
            <div className="font-semibold">Giovani adulti (18-25)</div>

            {opzioniCaratteristicheAdolescenti.map((opzione) => (
              <div key={opzione} className="flex items-center space-x-2">
                <Checkbox
                  id={`non-ospiti-adolescenti-${opzione}`}
                  checked={(formData.caratteristiche_non_ospiti_adolescenti || []).includes(opzione)}
                  onCheckedChange={(checked: boolean) => 
                    handleCaratteristicheNonOspitiChange('adolescenti', opzione, checked)
                  }
                />
                <Label htmlFor={`non-ospiti-adolescenti-${opzione}`}>{opzione}</Label>
                {opzione === "Altro" && 
                  (formData.caratteristiche_non_ospiti_adolescenti || []).includes("Altro") && (
                  <Input
                    value={formData.caratteristiche_non_ospiti_adolescenti.find(v => v === 'altro')?.altro_specificare || ''}
                    onChange={(e) => handleAltroSpecificareChange('non_ospiti', 'adolescenti', e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            C5. Caratteristiche delle persone ospitate giovani
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div></div>
            <div className="font-semibold">Giovani adulti (18-25)</div>

            {opzioniCaratteristicheGiovani.map((opzione) => (
              <div key={opzione} className="flex items-center space-x-2">
                <Checkbox
                  id={`ospiti-giovani-${opzione}`}
                  checked={(formData.caratteristiche_ospiti_giovani || []).includes(opzione)}
                  onCheckedChange={(checked: boolean) => 
                    handleCaratteristicheOspitiChange('giovani', opzione, checked)
                  }
                />
                <Label htmlFor={`ospiti-giovani-${opzione}`}>{opzione}</Label>
                {opzione === "Altro" && 
                  (formData.caratteristiche_ospiti_giovani || []).includes("Altro") && (
                  <Input
                    value={formData.caratteristiche_ospiti_giovani.find(v => v === 'altro')?.altro_specificare || ''}
                    onChange={(e) => handleAltroSpecificareChange('ospiti', 'giovani', e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            C6. Caratteristiche delle persone non ospitate giovani
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div></div>
            <div className="font-semibold">Giovani adulti (18-25)</div>

            {opzioniCaratteristicheGiovani.map((opzione) => (
              <div key={opzione} className="flex items-center space-x-2">
                <Checkbox
                  id={`non-ospiti-giovani-${opzione}`}
                  checked={(formData.caratteristiche_non_ospiti_giovani || []).includes(opzione)}
                  onCheckedChange={(checked: boolean) => 
                    handleCaratteristicheNonOspitiChange('giovani', opzione, checked)
                  }
                />
                <Label htmlFor={`non-ospiti-giovani-${opzione}`}>{opzione}</Label>
                {opzione === "Altro" && 
                  (formData.caratteristiche_non_ospiti_giovani || []).includes("Altro") && (
                  <Input
                    value={formData.caratteristiche_non_ospiti_giovani.find(v => v === 'altro')?.altro_specificare || ''}
                    onChange={(e) => handleAltroSpecificareChange('non_ospiti', 'giovani', e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 