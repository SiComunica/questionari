"use client"

import React from 'react';
import type { QuestionarioOperatoriProps } from '@/types/questionari';

export default function SezioneA({ formData, setFormData }: QuestionarioOperatoriProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione A: Dati anagrafici e professionali</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Nome *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Cognome *</label>
          <input
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Età *</label>
          <select
            name="eta"
            value={formData.eta}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona...</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46-55">46-55</option>
            <option value="over 55">Over 55</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Genere *</label>
          <select
            name="genere"
            value={formData.genere}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona...</option>
            <option value="uomo">Uomo</option>
            <option value="donna">Donna</option>
            <option value="altro">Altro</option>
            <option value="preferisco_non_specificare">Preferisco non specificare</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Titolo di studio *</label>
          <select
            name="titolo_studio"
            value={formData.titolo_studio}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona...</option>
            <option value="diploma">Diploma</option>
            <option value="laurea_triennale">Laurea triennale</option>
            <option value="laurea_magistrale">Laurea magistrale</option>
            <option value="master">Master</option>
            <option value="dottorato">Dottorato</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Anni di esperienza *</label>
          <select
            name="anni_esperienza"
            value={formData.anni_esperienza}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona...</option>
            <option value="0-2">0-2 anni</option>
            <option value="3-5">3-5 anni</option>
            <option value="6-10">6-10 anni</option>
            <option value="11-15">11-15 anni</option>
            <option value="over 15">Oltre 15 anni</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Tipo di contratto *</label>
          <select
            name="tipo_contratto"
            value={formData.tipo_contratto}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Seleziona...</option>
            <option value="indeterminato">Tempo indeterminato</option>
            <option value="determinato">Tempo determinato</option>
            <option value="collaborazione">Collaborazione</option>
            <option value="libero_professionista">Libero professionista</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Ruolo attuale *</label>
          <input
            type="text"
            name="ruolo_attuale"
            value={formData.ruolo_attuale}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Es: Educatore, Assistente sociale..."
          />
        </div>
      </div>
    </div>
  );
} 