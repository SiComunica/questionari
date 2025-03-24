"use client"

import React from 'react';
import { QuestionarioStruttureNew } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckedState } from '@radix-ui/react-checkbox';

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export const SezioneCStruttureNew: React.FC<Props> = ({ formData, setFormData }) => {
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

  const handleCaratteristicheChange = (
    tipo: 'ospiti' | 'non_ospiti',
    categoria: 'adolescenti' | 'giovani_adulti',
    campo: string,
    checked: CheckedState
  ) => {
    setFormData(prev => ({
      ...prev,
      [`caratteristiche_${tipo}`]: {
        ...prev[`caratteristiche_${tipo}`],
        [categoria]: {
          ...prev[`caratteristiche_${tipo}`][categoria],
          [campo]: checked === true
        }
      }
    }));
  };

  const handleAltroSpecificareChange = (
    tipo: 'ospiti' | 'non_ospiti',
    categoria: 'adolescenti' | 'giovani_adulti',
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

            {[
              { key: 'stranieri_migranti', label: 'Stranieri con problemi legati alla condizione migratoria' },
              { key: 'vittime_tratta', label: 'Vittime di tratta' },
              { key: 'vittime_violenza', label: 'Vittime di violenza domestica' },
              { key: 'allontanati_famiglia', label: 'Persone allontanate dalla famiglia' },
              { key: 'detenuti', label: 'Detenuti' },
              { key: 'ex_detenuti', label: 'Ex detenuti' },
              { key: 'misure_alternative', label: 'Persone in esecuzione penale esterna' },
              { key: 'indigenti_senzatetto', label: 'Indigenti e/o senza dimora' },
              { key: 'rom_sinti', label: 'Rom e Sinti' },
              { key: 'disabilita_fisica', label: 'Persone con disabilità fisica' },
              { key: 'disabilita_cognitiva', label: 'Persone con disabilità cognitiva' },
              { key: 'disturbi_psichiatrici', label: 'Persone con disturbi psichiatrici' },
              { key: 'dipendenze', label: 'Persone con dipendenze' },
              { key: 'genitori_precoci', label: 'Genitori precoci' },
              { key: 'problemi_orientamento', label: 'Persone con problemi legati all\'orientamento sessuale' },
              { key: 'altro', label: 'Altro' }
            ].map(({ key, label }) => (
              <React.Fragment key={key}>
                <div>{label}</div>
                <Checkbox
                  checked={Boolean(formData.caratteristiche_ospiti.adolescenti[key as keyof typeof formData.caratteristiche_ospiti.adolescenti])}
                  onCheckedChange={(checked) => handleCaratteristicheChange('ospiti', 'adolescenti', key, checked)}
                />
                <Checkbox
                  checked={Boolean(formData.caratteristiche_ospiti.giovani_adulti[key as keyof typeof formData.caratteristiche_ospiti.giovani_adulti])}
                  onCheckedChange={(checked) => handleCaratteristicheChange('ospiti', 'giovani_adulti', key, checked)}
                />
              </React.Fragment>
            ))}

            {formData.caratteristiche_ospiti.adolescenti.altro && (
              <>
                <div>Specificare altro:</div>
                <Input
                  value={formData.caratteristiche_ospiti.adolescenti.altro_specificare || ''}
                  onChange={(e) => handleAltroSpecificareChange('ospiti', 'adolescenti', e.target.value)}
                />
              </>
            )}
            {formData.caratteristiche_ospiti.giovani_adulti.altro && (
              <>
                <div></div>
                <Input
                  value={formData.caratteristiche_ospiti.giovani_adulti.altro_specificare || ''}
                  onChange={(e) => handleAltroSpecificareChange('ospiti', 'giovani_adulti', e.target.value)}
                />
              </>
            )}
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

            {[
              { key: 'stranieri_migranti', label: 'Stranieri non accompagnati e/o con problemi legati alla condizione migratoria' },
              { key: 'vittime_tratta', label: 'Vittime di tratta' },
              { key: 'vittime_violenza', label: 'Vittime di violenza domestica' },
              { key: 'allontanati_famiglia', label: 'Persone allontanate dalla famiglia' },
              { key: 'detenuti', label: 'Detenuti' },
              { key: 'ex_detenuti', label: 'Ex detenuti' },
              { key: 'misure_alternative', label: 'Persone in esecuzione penale esterna' },
              { key: 'indigenti_senzatetto', label: 'Indigenti' },
              { key: 'rom_sinti', label: 'Rom e Sinti' },
              { key: 'disabilita_fisica', label: 'Persone con disabilità fisica' },
              { key: 'disabilita_cognitiva', label: 'Persone con disabilità cognitiva' },
              { key: 'disturbi_psichiatrici', label: 'Persone con disturbi psichiatrici' },
              { key: 'dipendenze', label: 'Persone con dipendenze' },
              { key: 'genitori_precoci', label: 'Genitori precoci' },
              { key: 'problemi_orientamento', label: 'Persone con problemi legati all\'orientamento sessuale' },
              { key: 'altro', label: 'Altro' }
            ].map(({ key, label }) => (
              <React.Fragment key={key}>
                <div>{label}</div>
                <Checkbox
                  checked={Boolean(formData.caratteristiche_non_ospiti.adolescenti[key as keyof typeof formData.caratteristiche_non_ospiti.adolescenti])}
                  onCheckedChange={(checked) => handleCaratteristicheChange('non_ospiti', 'adolescenti', key, checked)}
                />
                <Checkbox
                  checked={Boolean(formData.caratteristiche_non_ospiti.giovani_adulti[key as keyof typeof formData.caratteristiche_non_ospiti.giovani_adulti])}
                  onCheckedChange={(checked) => handleCaratteristicheChange('non_ospiti', 'giovani_adulti', key, checked)}
                />
              </React.Fragment>
            ))}

            {formData.caratteristiche_non_ospiti.adolescenti.altro && (
              <>
                <div>Specificare altro:</div>
                <Input
                  value={formData.caratteristiche_non_ospiti.adolescenti.altro_specificare || ''}
                  onChange={(e) => handleAltroSpecificareChange('non_ospiti', 'adolescenti', e.target.value)}
                />
              </>
            )}
            {formData.caratteristiche_non_ospiti.giovani_adulti.altro && (
              <>
                <div></div>
                <Input
                  value={formData.caratteristiche_non_ospiti.giovani_adulti.altro_specificare || ''}
                  onChange={(e) => handleAltroSpecificareChange('non_ospiti', 'giovani_adulti', e.target.value)}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 