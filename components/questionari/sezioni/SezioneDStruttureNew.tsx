"use client"

import React from 'react';
import { QuestionarioStruttureNew, AttivitaInserimento } from '@/types/questionari';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckedState } from "@radix-ui/react-checkbox";

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneDStruttureNew({ formData, setFormData }: Props) {
  const servizi = [
    { id: 'alloggio', label: 'Alloggio', hasDesc: false },
    { id: 'vitto', label: 'Vitto', hasDesc: false },
    { id: 'servizi_bassa_soglia', label: 'Altri servizi a bassa soglia (docce, lavanderia, offerta beni di prima necessità, etc.)', hasDesc: true },
    { id: 'ospitalita_diurna', label: 'Ospitalità solo diurna', hasDesc: true },
    { id: 'supporto_psicologico', label: 'Supporto psicologico', hasDesc: true },
    { id: 'sostegno_abitativo', label: 'Sostegno all\'autonomia abitativa', hasDesc: true },
    { id: 'inserimento_lavorativo', label: 'Orientamento e sostegno all\'inserimento lavorativo', hasDesc: true },
    { id: 'orientamento_scolastico', label: 'Orientamento scolastico/formativo', hasDesc: true },
    { id: 'istruzione_scolastica', label: 'Istruzione scolastica', hasDesc: true },
    { id: 'formazione_professionale', label: 'Formazione professionale', hasDesc: true },
    { id: 'attivita_ricreative', label: 'Attività ricreative e di socializzazione', hasDesc: true },
    { id: 'altro', label: 'Altro', hasDesc: true }
  ] as const;

  const handleAttivitaInserimentoChange = (index: number, field: keyof AttivitaInserimento, value: string) => {
    setFormData(prev => {
      const newAttivita = [...prev.attivita_inserimento];
      if (!newAttivita[index]) {
        newAttivita[index] = {
          nome: '', periodo: '', contenuto: '', destinatari: '',
          attori: '', punti_forza: '', criticita: ''
        };
      }
      newAttivita[index] = { ...newAttivita[index], [field]: value };
      return { ...prev, attivita_inserimento: newAttivita };
    });
  };

  const handleCheckboxChange = (id: string, checked: CheckedState) => {
    setFormData(prev => ({
      ...prev,
      attivita_servizi: {
        ...prev.attivita_servizi,
        [id]: checked === true
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">D1. Attività/servizi attualmente disponibili</h3>
          <div className="space-y-4">
            {Object.entries(formData.attivita_servizi).map(([key, servizio], index) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={servizio.attivo}
                    onCheckedChange={(checked) => handleCheckboxChange(key, checked)}
                  />
                  <Label htmlFor={key}>{servizi[index].label}</Label>
                </div>
                {servizi[index].hasDesc && servizio.attivo && (
                  <div className="ml-6">
                    <Label>Descrivere il servizio/attività</Label>
                    <Textarea
                      value={servizio.descrizione}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          attivita_servizi: {
                            ...prev.attivita_servizi,
                            [key]: {
                              ...servizio,
                              descrizione: e.target.value
                            }
                          }
                        }));
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">D2. Esperienze di inserimento socio-lavorativo</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="esperienze_inserimento"
                checked={formData.esperienze_inserimento_lavorativo}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    esperienze_inserimento_lavorativo: checked === true
                  }));
                }}
              />
              <Label htmlFor="esperienze_inserimento">
                Negli ultimi 3 anni (2022-24) avete realizzato esperienze significative?
              </Label>
            </div>

            {formData.esperienze_inserimento_lavorativo && (
              <div className="space-y-6">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="p-4 border rounded space-y-4">
                    <h4 className="font-medium">Attività {index + 1}</h4>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome del progetto o dell'attività</Label>
                        <Input
                          value={formData.attivita_inserimento[index]?.nome || ''}
                          onChange={(e) => handleAttivitaInserimentoChange(index, 'nome', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Periodo di realizzazione</Label>
                        <Input
                          value={formData.attivita_inserimento[index]?.periodo || ''}
                          onChange={(e) => handleAttivitaInserimentoChange(index, 'periodo', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Contenuto dell'attività</Label>
                        <Textarea
                          value={formData.attivita_inserimento[index]?.contenuto || ''}
                          onChange={(e) => handleAttivitaInserimentoChange(index, 'contenuto', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Destinatari</Label>
                        <Textarea
                          value={formData.attivita_inserimento[index]?.destinatari || ''}
                          onChange={(e) => handleAttivitaInserimentoChange(index, 'destinatari', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Attori coinvolti</Label>
                        <Input
                          value={formData.attivita_inserimento[index]?.attori || ''}
                          onChange={(e) => handleAttivitaInserimentoChange(index, 'attori', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Punti di forza</Label>
                        <Textarea
                          value={formData.attivita_inserimento[index]?.punti_forza || ''}
                          onChange={(e) => handleAttivitaInserimentoChange(index, 'punti_forza', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Criticità</Label>
                        <Textarea
                          value={formData.attivita_inserimento[index]?.criticita || ''}
                          onChange={(e) => handleAttivitaInserimentoChange(index, 'criticita', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">D4. Nuove attività previste</h3>
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index}>
                <Label>Nuova attività {index + 1}</Label>
                <Textarea
                  value={formData.nuove_attivita[index] || ''}
                  onChange={(e) => {
                    setFormData(prev => {
                      const newAttivita = [...prev.nuove_attivita];
                      newAttivita[index] = e.target.value;
                      return { ...prev, nuove_attivita: newAttivita };
                    });
                  }}
                  placeholder="Descrivere brevemente"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 