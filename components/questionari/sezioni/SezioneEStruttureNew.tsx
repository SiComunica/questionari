"use client"

import React from 'react';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneEStruttureNew({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      risorse_umane: {
        ...prev.risorse_umane,
        [name]: parseInt(value) || 0
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione E: Risorse Umane</h2>

      <div className="space-y-4">
        <div>
          <Label>Numero totale operatori</Label>
          <Input
            type="number"
            name="operatori_totali"
            value={formData.risorse_umane.operatori_totali}
            onChange={handleChange}
            min={0}
          />
        </div>

        <div>
          <Label>Operatori part-time</Label>
          <Input
            type="number"
            name="operatori_part_time"
            value={formData.risorse_umane.operatori_part_time}
            onChange={handleChange}
            min={0}
          />
        </div>

        <div>
          <Label>Operatori full-time</Label>
          <Input
            type="number"
            name="operatori_full_time"
            value={formData.risorse_umane.operatori_full_time}
            onChange={handleChange}
            min={0}
          />
        </div>

        <div>
          <Label>Numero volontari</Label>
          <Input
            type="number"
            name="volontari"
            value={formData.risorse_umane.volontari}
            onChange={handleChange}
            min={0}
          />
        </div>
      </div>
    </div>
  );
} 