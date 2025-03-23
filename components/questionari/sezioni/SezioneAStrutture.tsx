"use client"

import React from 'react';
import { QuestionarioStruttureProps } from '@/types/questionari';

const SezioneAStrutture: React.FC<QuestionarioStruttureProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'forma_giuridica.tipo') {
      setFormData(prev => ({
        ...prev,
        forma_giuridica: {
          ...prev.forma_giuridica,
          tipo: value as '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
        }
      }));
    } else if (name === 'forma_giuridica.altro_specificare') {
      setFormData(prev => ({
        ...prev,
        forma_giuridica: {
          ...prev.forma_giuridica,
          altro_specificare: value
        }
      }));
    } else if (name === 'anno_inizio') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 2024
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione A: Informazioni Generali</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">ID Struttura *</label>
          <input
            type="text"
            name="id_struttura"
            value={formData.id_struttura}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Forma Giuridica *</label>
          <select
            name="forma_giuridica.tipo"
            value={formData.forma_giuridica.tipo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="1">Associazione</option>
            <option value="2">Cooperativa Sociale</option>
            <option value="3">Fondazione</option>
            <option value="4">Ente Religioso</option>
            <option value="5">Ente Pubblico</option>
            <option value="6">Società di Capitali</option>
            <option value="7">Consorzio</option>
            <option value="8">ONG</option>
            <option value="9">Altro</option>
          </select>
        </div>

        {formData.forma_giuridica.tipo === '9' && (
          <div>
            <label className="block mb-2">Specifica altra forma giuridica</label>
            <input
              type="text"
              name="forma_giuridica.altro_specificare"
              value={formData.forma_giuridica.altro_specificare}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div>
          <label className="block mb-2">Tipo di Struttura *</label>
          <select
            name="tipo_struttura"
            value={formData.tipo_struttura}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona il tipo di struttura</option>
            <option value="comunita_accoglienza">Comunità di accoglienza</option>
            <option value="centro_aggregazione">Centro di aggregazione</option>
            <option value="centro_diurno">Centro diurno</option>
            <option value="servizio_sociale">Servizio sociale</option>
            <option value="cooperativa">Cooperativa sociale</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Anno di Inizio Attività *</label>
          <input
            type="number"
            name="anno_inizio"
            value={formData.anno_inizio}
            onChange={handleChange}
            required
            min="1900"
            max="2024"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Mission *</label>
          <textarea
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Descrivi la mission della struttura..."
          />
        </div>
      </div>
    </div>
  );
};

export default SezioneAStrutture; 