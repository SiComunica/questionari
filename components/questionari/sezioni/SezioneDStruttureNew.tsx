"use client"

import React from 'react';
import { QuestionarioStruttureNew, AttivitaSignificativa } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckedState } from '@radix-ui/react-checkbox';

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

  const handleAttivitaChange = (campo: keyof typeof formData.attività_servizi, checked: CheckedState) => {
    setFormData(prev => ({
      ...prev,
      attività_servizi: {
        ...prev.attività_servizi,
        [campo]: checked === true
      }
    }));
  };

  const handleDescrizioneChange = (campo: string, value: string) => {
    const descKey = `${campo}_desc` as keyof typeof formData.attività_servizi;
    setFormData(prev => ({
      ...prev,
      attività_servizi: {
        ...prev.attività_servizi,
        [descKey]: value
      }
    }));
  };

  const handleAttivitaSignificativaChange = (index: number, campo: keyof AttivitaSignificativa, value: string) => {
    setFormData(prev => {
      const newAttivita = [...prev.attivita_significative];
      if (!newAttivita[index]) {
        newAttivita[index] = {
          nome: '',
          periodo: '',
          contenuto: '',
          destinatari: '',
          attori: '',
          punti_forza: '',
          criticita: ''
        };
      }
      newAttivita[index] = {
        ...newAttivita[index],
        [campo]: value
      };
      return {
        ...prev,
        attivita_significative: newAttivita
      };
    });
  };

  const handleNuovaAttivitaChange = (index: number, value: string) => {
    setFormData(prev => {
      const newAttivita = [...prev.nuove_attivita];
      newAttivita[index] = value;
      return {
        ...prev,
        nuove_attivita: newAttivita
      };
    });
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
          <h3 className="text-lg font-semibold mb-4">
            D1. Attività/servizi attualmente disponibili
          </h3>
          
          <div className="space-y-4">
            {[
              { key: 'alloggio', label: 'Alloggio', hasDesc: false },
              { key: 'vitto', label: 'Vitto', hasDesc: false },
              { key: 'servizi_bassa_soglia', label: 'Altri servizi a bassa soglia (docce, lavanderia, offerta beni di prima necessità, etc.)', hasDesc: true },
              { key: 'ospitalita_diurna', label: 'Ospitalità solo diurna', hasDesc: true },
              { key: 'supporto_psicologico', label: 'Supporto psicologico', hasDesc: true },
              { key: 'sostegno_autonomia', label: 'Sostegno all\'autonomia abitativa', hasDesc: true },
              { key: 'inserimento_lavorativo', label: 'Orientamento e sostegno all\'inserimento lavorativo', hasDesc: true },
              { key: 'orientamento_scolastico', label: 'Orientamento scolastico/formativo', hasDesc: true },
              { key: 'istruzione_scolastica', label: 'Istruzione scolastica', hasDesc: true },
              { key: 'formazione_professionale', label: 'Formazione professionale', hasDesc: true },
              { key: 'attivita_ricreative', label: 'Attività ricreative e di socializzazione', hasDesc: true },
              { key: 'altro', label: 'Altro', hasDesc: true }
            ].map(({ key, label, hasDesc }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={Boolean(formData.attività_servizi[key as keyof typeof formData.attività_servizi])}
                    onCheckedChange={(checked) => handleAttivitaChange(key as keyof typeof formData.attività_servizi, checked)}
                  />
                  <Label>{label}</Label>
                </div>
                {hasDesc && formData.attività_servizi[key as keyof typeof formData.attività_servizi] && (
                  <Textarea
                    value={formData.attività_servizi[`${key}_desc` as keyof typeof formData.attività_servizi] as string}
                    onChange={(e) => handleDescrizioneChange(key, e.target.value)}
                    placeholder="Descrivere il servizio/attività"
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
            D2. Esperienze significative in materia di inserimento socio-lavorativo (2022-24)
          </h3>
          
          <RadioGroup
            value={formData.esperienze_inserimento ? "1" : "0"}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              esperienze_inserimento: value === "1"
            }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="no" />
              <Label htmlFor="no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="si" />
              <Label htmlFor="si">Sì</Label>
            </div>
          </RadioGroup>

          {formData.esperienze_inserimento && (
            <div className="mt-4 space-y-6">
              {[1, 2, 3].map((num, index) => (
                <div key={num} className="space-y-4 border p-4 rounded">
                  <h4 className="font-semibold">Attività {num}</h4>
                  <div className="space-y-2">
                    <Label>Nome del progetto o dell'attività</Label>
                    <Input
                      value={formData.attivita_significative[index]?.nome || ''}
                      onChange={(e) => handleAttivitaSignificativaChange(index, 'nome', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Periodo di realizzazione</Label>
                    <Input
                      value={formData.attivita_significative[index]?.periodo || ''}
                      onChange={(e) => handleAttivitaSignificativaChange(index, 'periodo', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contenuto dell'attività</Label>
                    <Textarea
                      value={formData.attivita_significative[index]?.contenuto || ''}
                      onChange={(e) => handleAttivitaSignificativaChange(index, 'contenuto', e.target.value)}
                      placeholder="Descrivere brevemente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Destinatari</Label>
                    <Textarea
                      value={formData.attivita_significative[index]?.destinatari || ''}
                      onChange={(e) => handleAttivitaSignificativaChange(index, 'destinatari', e.target.value)}
                      placeholder="Indicare sinteticamente gli aspetti socio anagrafici dei destinatari"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Attori coinvolti</Label>
                    <Input
                      value={formData.attivita_significative[index]?.attori || ''}
                      onChange={(e) => handleAttivitaSignificativaChange(index, 'attori', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Punti di forza</Label>
                    <Input
                      value={formData.attivita_significative[index]?.punti_forza || ''}
                      onChange={(e) => handleAttivitaSignificativaChange(index, 'punti_forza', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Criticità</Label>
                    <Input
                      value={formData.attivita_significative[index]?.criticita || ''}
                      onChange={(e) => handleAttivitaSignificativaChange(index, 'criticita', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            D4. Previsione di realizzazione di esperienze significative nei prossimi due anni
          </h3>
          
          <RadioGroup
            value={formData.previsione_attivita ? "1" : "0"}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              previsione_attivita: value === "1"
            }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="no_previsione" />
              <Label htmlFor="no_previsione">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="si_previsione" />
              <Label htmlFor="si_previsione">Sì</Label>
            </div>
          </RadioGroup>

          {formData.previsione_attivita && (
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((num, index) => (
                <div key={num} className="space-y-2">
                  <Label>Nuova attività {num}</Label>
                  <Textarea
                    value={formData.nuove_attivita[index] || ''}
                    onChange={(e) => handleNuovaAttivitaChange(index, e.target.value)}
                    placeholder="Descrivere brevemente"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 