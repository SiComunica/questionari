"use client"

import React from 'react';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { utils, writeFile } from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { Database } from '@/types/database'

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

const opzioniPersoneTrattateAdolescenti = [
  { id: 'C2.1A', label: 'Stranieri con problemi legati alla condizione migratoria' },
  { id: 'C2.2A', label: 'Vittime di tratta' },
  { id: 'C2.3A', label: 'Vittime di violenza domestica' },
  { id: 'C2.4A', label: 'Persone allontanate dalla famiglia' },
  { id: 'C2.5A', label: 'Detenuti' },
  { id: 'C2.6A', label: 'Ex detenuti' },
  { id: 'C2.7A', label: 'Persone in esecuzione penale esterna /misura alternativa alla detenzione' },
  { id: 'C2.8A', label: 'Indigenti e/o senza dimora' },
  { id: 'C2.9A', label: 'Rom e Sinti' },
  { id: 'C2.10A', label: 'Persone con disabilità fisica' },
  { id: 'C2.11A', label: 'Persone con disabilità cognitiva' },
  { id: 'C2.12A', label: 'Persone con disturbi psichiatrici' },
  { id: 'C2.13A', label: 'Persone con dipendenze' },
  { id: 'C2.14A', label: 'Genitori precoci' },
  { id: 'C2.15A', label: 'Persone con problemi legati all\'orientamento sessuale' },
  { id: 'C2.16A', label: 'Altro' }
];

const opzioniPersoneTrattateGiovani = [
  { id: 'C2.1B', label: 'Stranieri con problemi legati alla condizione migratoria' },
  { id: 'C2.2B', label: 'Vittime di tratta' },
  { id: 'C2.3B', label: 'Vittime di violenza domestica' },
  { id: 'C2.4B', label: 'Persone allontanate dalla famiglia' },
  { id: 'C2.5B', label: 'Detenuti' },
  { id: 'C2.6B', label: 'Ex detenuti' },
  { id: 'C2.7B', label: 'Persone in esecuzione penale esterna /misura alternativa alla detenzione' },
  { id: 'C2.8B', label: 'Indigenti e/o senza dimora' },
  { id: 'C2.9B', label: 'Rom e Sinti' },
  { id: 'C2.10B', label: 'Persone con disabilità fisica' },
  { id: 'C2.11B', label: 'Persone con disabilità cognitiva' },
  { id: 'C2.12B', label: 'Persone con disturbi psichiatrici' },
  { id: 'C2.13B', label: 'Persone con dipendenze' },
  { id: 'C2.14B', label: 'Genitori precoci' },
  { id: 'C2.15B', label: 'Persone con problemi legati all\'orientamento sessuale' },
  { id: 'C2.16B', label: 'Altro' }
];

export default function SezioneAStruttureNew({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'forma_giuridica') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
        </div>

        {formData.forma_giuridica === 10 && (
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