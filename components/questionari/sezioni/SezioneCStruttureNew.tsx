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
    
    // Creiamo una copia completa dell'oggetto formData
    const newData: QuestionarioStruttureNew = {
      ...formData,
      persone_ospitate: {
        ...formData.persone_ospitate,
        [categoria]: {
          ...formData.persone_ospitate[categoria],
          [genere]: numValue,
          totale: genere === 'uomini' 
            ? numValue + formData.persone_ospitate[categoria].donne
            : formData.persone_ospitate[categoria].uomini + numValue
        }
      }
    };

    // Aggiorniamo i totali
    newData.persone_ospitate.totale = {
      uomini: newData.persone_ospitate.fino_16.uomini +
              newData.persone_ospitate.da_16_a_18.uomini +
              newData.persone_ospitate.maggiorenni.uomini,
      donne: newData.persone_ospitate.fino_16.donne +
             newData.persone_ospitate.da_16_a_18.donne +
             newData.persone_ospitate.maggiorenni.donne,
      totale: 0 // Sarà calcolato sotto
    };
    
    newData.persone_ospitate.totale.totale = 
      newData.persone_ospitate.totale.uomini +
      newData.persone_ospitate.totale.donne;

    setFormData(newData);
  };

  const handlePersoneNonOspitateChange = (
    categoria: 'fino_16' | 'da_16_a_18' | 'maggiorenni',
    genere: 'uomini' | 'donne',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    
    const newData: QuestionarioStruttureNew = {
      ...formData,
      persone_non_ospitate: {
        ...formData.persone_non_ospitate,
        [categoria]: {
          ...formData.persone_non_ospitate[categoria],
          [genere]: numValue,
          totale: genere === 'uomini' 
            ? numValue + formData.persone_non_ospitate[categoria].donne
            : formData.persone_non_ospitate[categoria].uomini + numValue
        }
      }
    };

    // Aggiorniamo i totali
    newData.persone_non_ospitate.totale = {
      uomini: newData.persone_non_ospitate.fino_16.uomini +
              newData.persone_non_ospitate.da_16_a_18.uomini +
              newData.persone_non_ospitate.maggiorenni.uomini,
      donne: newData.persone_non_ospitate.fino_16.donne +
             newData.persone_non_ospitate.da_16_a_18.donne +
             newData.persone_non_ospitate.maggiorenni.donne,
      totale: 0
    };
    
    newData.persone_non_ospitate.totale.totale = 
      newData.persone_non_ospitate.totale.uomini +
      newData.persone_non_ospitate.totale.donne;

    setFormData(newData);
  };

  const handleCaratteristicheOspitiChange = (
    categoria: 'adolescenti' | 'giovani',
    value: string,
    checked: boolean
  ) => {
    const newFormData = { ...formData };
    
    if (categoria === 'adolescenti') {
      newFormData.caratteristiche_ospiti_adolescenti = checked
        ? [...(formData.caratteristiche_ospiti_adolescenti || []), value]
        : (formData.caratteristiche_ospiti_adolescenti || []).filter(v => v !== value);
    } else {
      newFormData.caratteristiche_ospiti_giovani = checked
        ? [...(formData.caratteristiche_ospiti_giovani || []), value]
        : (formData.caratteristiche_ospiti_giovani || []).filter(v => v !== value);
    }

    setFormData(newFormData);
  };

  const handleCaratteristicheNonOspitiChange = (
    categoria: 'adolescenti' | 'giovani',
    value: string,
    checked: boolean
  ) => {
    const newFormData = { ...formData };
    
    if (categoria === 'adolescenti') {
      newFormData.caratteristiche_non_ospiti_adolescenti = checked
        ? [...(formData.caratteristiche_non_ospiti_adolescenti || []), value]
        : (formData.caratteristiche_non_ospiti_adolescenti || []).filter(v => v !== value);
    } else {
      newFormData.caratteristiche_non_ospiti_giovani = checked
        ? [...(formData.caratteristiche_non_ospiti_giovani || []), value]
        : (formData.caratteristiche_non_ospiti_giovani || []).filter(v => v !== value);
    }

    setFormData(newFormData);
  };

  const handleAltroChange = (
    tipo: 'ospiti' | 'non_ospiti',
    value: string
  ) => {
    const newFormData = { ...formData };
    
    if (tipo === 'ospiti') {
      newFormData.caratteristiche_ospiti_altro = value;
    } else {
      newFormData.caratteristiche_non_ospiti_altro = value;
    }

    setFormData(newFormData);
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

  const opzioniServizi = [
    { id: 'D1.1', label: 'Alloggio', hasDesc: false },
    { id: 'D1.2', label: 'Vitto', hasDesc: false },
    { id: 'D1.3', label: 'Altri servizi a bassa soglia', hasDesc: true },
    { id: 'D1.4', label: 'Ospitalità solo diurna', hasDesc: true },
    { id: 'D1.5', label: 'Supporto psicologico', hasDesc: true },
    { id: 'D1.6', label: 'Sostegno all\'autonomia abitativa', hasDesc: true },
    { id: 'D1.7', label: 'Orientamento lavorativo', hasDesc: true },
    { id: 'D1.8', label: 'Orientamento scolastico', hasDesc: true },
    { id: 'D1.9', label: 'Istruzione scolastica', hasDesc: true },
    { id: 'D1.10', label: 'Formazione professionale', hasDesc: true },
    { id: 'D1.11', label: 'Attività ricreative', hasDesc: true },
    { id: 'D1.12', label: 'Altro', hasDesc: true }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'forma_giuridica') {
      setFormData({
        ...formData,
        [name]: Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

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

            <CheckboxGroup
              values={formData.caratteristiche_ospiti_adolescenti || []}
              onChange={(value, checked) => 
                handleCaratteristicheOspitiChange('adolescenti', value, checked)
              }
              options={opzioniCaratteristicheAdolescenti}
            />
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

            <CheckboxGroup
              values={formData.caratteristiche_non_ospiti_adolescenti || []}
              onChange={(value, checked) => 
                handleCaratteristicheNonOspitiChange('adolescenti', value, checked)
              }
              options={opzioniCaratteristicheAdolescenti}
            />
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

            <CheckboxGroup
              values={formData.caratteristiche_ospiti_giovani || []}
              onChange={(value, checked) => 
                handleCaratteristicheOspitiChange('giovani', value, checked)
              }
              options={opzioniCaratteristicheGiovani}
            />
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

            <CheckboxGroup
              values={formData.caratteristiche_non_ospiti_giovani || []}
              onChange={(value, checked) => 
                handleCaratteristicheNonOspitiChange('giovani', value, checked)
              }
              options={opzioniCaratteristicheGiovani}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            C7. Forma giuridica
          </h3>
          
          <select
            name="forma_giuridica"
            value={formData.forma_giuridica}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value={1}>Ente pubblico</option>
            <option value={2}>Impresa for profit</option>
            <option value={3}>Cooperativa</option>
            <option value={4}>Impresa sociale</option>
            <option value={5}>Ente filantropico</option>
            <option value={6}>Associazione di promozione sociale</option>
            <option value={7}>Organizzazione di volontariato</option>
            <option value={8}>Rete associativa</option>
            <option value={9}>Società di mutuo soccorso</option>
            <option value={10}>Altro</option>
          </select>
        </CardContent>
      </Card>
    </div>
  );
} 