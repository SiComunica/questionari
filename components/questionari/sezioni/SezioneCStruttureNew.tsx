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

export default function SezioneCStruttureNew({ formData, setFormData }: Props) {
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      servizi_offerti: {
        ...prev.servizi_offerti,
        [name]: checked
      }
    }));
  };

  const handleAltroSpecificareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      servizi_offerti: {
        ...prev.servizi_offerti,
        altro_specificare: e.target.value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione C: Servizi Offerti</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Label className="text-lg">Seleziona i servizi offerti dalla struttura:</Label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="accoglienza"
                checked={formData.servizi_offerti.accoglienza}
                onCheckedChange={(checked) => handleCheckboxChange('accoglienza', checked as boolean)}
              />
              <Label htmlFor="accoglienza">Accoglienza</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="orientamento"
                checked={formData.servizi_offerti.orientamento}
                onCheckedChange={(checked) => handleCheckboxChange('orientamento', checked as boolean)}
              />
              <Label htmlFor="orientamento">Orientamento</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="formazione"
                checked={formData.servizi_offerti.formazione}
                onCheckedChange={(checked) => handleCheckboxChange('formazione', checked as boolean)}
              />
              <Label htmlFor="formazione">Formazione</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="inserimento_lavorativo"
                checked={formData.servizi_offerti.inserimento_lavorativo}
                onCheckedChange={(checked) => handleCheckboxChange('inserimento_lavorativo', checked as boolean)}
              />
              <Label htmlFor="inserimento_lavorativo">Inserimento lavorativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="assistenza_legale"
                checked={formData.servizi_offerti.assistenza_legale}
                onCheckedChange={(checked) => handleCheckboxChange('assistenza_legale', checked as boolean)}
              />
              <Label htmlFor="assistenza_legale">Assistenza legale</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="assistenza_sanitaria"
                checked={formData.servizi_offerti.assistenza_sanitaria}
                onCheckedChange={(checked) => handleCheckboxChange('assistenza_sanitaria', checked as boolean)}
              />
              <Label htmlFor="assistenza_sanitaria">Assistenza sanitaria</Label>
            </div>

<<<<<<< Updated upstream
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mediazione_culturale"
                checked={formData.servizi_offerti.mediazione_culturale}
                onCheckedChange={(checked) => handleCheckboxChange('mediazione_culturale', checked as boolean)}
              />
              <Label htmlFor="mediazione_culturale">Mediazione culturale</Label>
            </div>
=======
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
>>>>>>> Stashed changes

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="supporto_psicologico"
                checked={formData.servizi_offerti.supporto_psicologico}
                onCheckedChange={(checked) => handleCheckboxChange('supporto_psicologico', checked as boolean)}
              />
              <Label htmlFor="supporto_psicologico">Supporto psicologico</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="altro"
                checked={formData.servizi_offerti.altro}
                onCheckedChange={(checked) => handleCheckboxChange('altro', checked as boolean)}
              />
              <Label htmlFor="altro">Altro</Label>
            </div>

            {formData.servizi_offerti.altro && (
              <div className="ml-6">
                <Label>Specificare altro</Label>
                <Input
                  value={formData.servizi_offerti.altro_specificare || ''}
                  onChange={handleAltroSpecificareChange}
                  placeholder="Specificare altri servizi..."
                />
              </div>
            )}
          </div>
<<<<<<< Updated upstream
        </div>
      </div>
=======
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
>>>>>>> Stashed changes
    </div>
  );
} 