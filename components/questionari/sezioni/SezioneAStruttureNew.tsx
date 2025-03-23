"use client"

import React from 'react';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneAStruttureNew({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione A: Anagrafica Struttura</h2>

      <div className="space-y-4">
        <div>
          <Label>Nome struttura</Label>
          <Input
            name="nome_struttura"
            value={formData.nome_struttura}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Indirizzo</Label>
          <Input
            name="indirizzo"
            value={formData.indirizzo}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Comune</Label>
          <Input
            name="comune"
            value={formData.comune}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Provincia</Label>
          <Input
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>CAP</Label>
          <Input
            name="cap"
            value={formData.cap}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Telefono</Label>
          <Input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Referente</Label>
          <Input
            name="referente"
            value={formData.referente}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
} 