"use client"

import React from 'react';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

const opzioniTipoStruttura = [
  { value: 1, label: "Casa famiglia" },
  { value: 2, label: "Comunità educativa" },
  { value: 3, label: "Comunità familiare" },
  { value: 4, label: "Alloggio per l'autonomia" },
  { value: 5, label: "Centro diurno" },
  { value: 6, label: "Centro di aggregazione" },
  { value: 7, label: "Comunità mamma-bambino" },
  { value: 8, label: "Altro" }
];

const opzioniCaratteristichePersone = [
  { id: 'C2.1', label: 'Stranieri con problemi legati alla condizione migratoria' },
  { id: 'C2.2', label: 'Vittime di tratta' },
  { id: 'C2.3', label: 'Vittime di violenza domestica' },
  { id: 'C2.4', label: 'Persone allontanate dalla famiglia' },
  { id: 'C2.5', label: 'Detenuti' },
  { id: 'C2.6', label: 'Ex detenuti' },
  { id: 'C2.7', label: 'Persone in esecuzione penale esterna' },
  { id: 'C2.8', label: 'Indigenti e/o senza dimora' },
  { id: 'C2.9', label: 'Rom e Sinti' },
  { id: 'C2.10', label: 'Persone con disabilità fisica' },
  { id: 'C2.11', label: 'Persone con disabilità cognitiva' },
  { id: 'C2.12', label: 'Persone con disturbi psichiatrici' },
  { id: 'C2.13', label: 'Persone con dipendenze' },
  { id: 'C2.14', label: 'Genitori precoci' },
  { id: 'C2.15', label: 'Persone con problemi legati all\'orientamento sessuale' },
  { id: 'C2.16', label: 'Altro' }
];

export default function SezioneAStruttureNew({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const year = parseInt(value);
    if (!isNaN(year) && year >= 1900 && year <= new Date().getFullYear()) {
      setFormData(prev => ({
        ...prev,
        [name]: year
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione A: Descrizione della struttura</h2>

      <div className="space-y-4">
        <div>
          <Label>ID Struttura (fornito da Inapp)</Label>
          <Input
            name="id_struttura"
            value={formData.id_struttura}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Forma giuridica della struttura</Label>
          <select
            name="forma_giuridica"
            value={formData.forma_giuridica}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona forma giuridica</option>
            <option value="ente_pubblico">1. Ente pubblico</option>
            <option value="impresa_profit">2. Impresa for profit (ditta individuale, SNC, SAS, SS, SRL, SRLS, SPA, SAPA)</option>
            <option value="cooperativa">3. Cooperativa</option>
            <option value="impresa_sociale">4. Impresa sociale (o Cooperativa sociale)</option>
            <option value="ente_filantropico">5. Ente filantropico (o Fondazione)</option>
            <option value="aps">6. Associazione di promozione sociale</option>
            <option value="odv">7. Organizzazione di volontariato</option>
            <option value="rete_associativa">8. Rete associativa</option>
            <option value="mutuo_soccorso">9. Società di mutuo soccorso</option>
            <option value="altro">10. Altro</option>
          </select>
        </div>

        {formData.forma_giuridica === 'altro' && (
          <div>
            <Label>Specificare altra forma giuridica</Label>
            <Input
              name="forma_giuridica_altro"
              value={formData.forma_giuridica_altro}
              onChange={handleChange}
              className="w-full"
              placeholder="Specificare..."
            />
          </div>
        )}

        <div>
          <Label>Tipo di struttura (casa-famiglia, centro diurno, semiautonomia, ecc.)</Label>
          <Select
            name="tipo_struttura"
            value={formData.tipo_struttura}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              tipo_struttura: value
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona tipo di struttura" />
            </SelectTrigger>
            <SelectContent>
              {opzioniTipoStruttura.map((opzione) => (
                <SelectItem key={opzione.value} value={opzione.value.toString()}>
                  {opzione.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Anno di inizio delle attività</Label>
          <Input
            type="number"
            name="anno_inizio"
            value={formData.anno_inizio || ''}
            onChange={handleNumberChange}
            min={1900}
            max={new Date().getFullYear()}
            className="w-full"
            placeholder="AAAA"
          />
        </div>

        <div>
          <Label>Missione principale della struttura/finalità</Label>
          <Textarea
            name="missione"
            value={formData.missione}
            onChange={handleChange}
            className="w-full min-h-[100px]"
            placeholder="Descrivi la missione principale della struttura..."
          />
        </div>
      </div>
    </div>
  );
} 