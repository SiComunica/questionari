import React from 'react';
import type { QuestionarioStruttureNew } from '@/types/questionari';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface Props {
  formData: QuestionarioStruttureNew;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioStruttureNew>>;
}

export default function SezioneBStruttureNew({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacita_totale' || name === 'posti_occupati' ? 
        parseInt(value) || 0 : 
        value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione B: Informazioni sulla struttura</h2>

      <div className="space-y-4">
        <div>
          <Label>Tipo di struttura</Label>
          <Select 
            name="tipo_struttura"
            value={formData.tipo_struttura}
            onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_struttura: value }))}
          >
            <option value="">Seleziona tipo struttura</option>
            <option value="casa_accoglienza">Casa di accoglienza</option>
            <option value="comunita_alloggio">Comunità alloggio</option>
            <option value="centro_diurno">Centro diurno</option>
          </Select>
        </div>

        <div>
          <Label>Capacità ricettiva totale</Label>
          <Input
            type="number"
            name="capacita_totale"
            value={formData.capacita_totale}
            onChange={handleChange}
            min={0}
          />
        </div>

        <div>
          <Label>Posti attualmente occupati</Label>
          <Input
            type="number"
            name="posti_occupati"
            value={formData.posti_occupati}
            onChange={handleChange}
            min={0}
          />
        </div>
      </div>
    </div>
  );
} 