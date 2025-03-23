"use client"

import React from 'react';
import { QuestionarioStruttureProps } from '@/types/questionari';

const SezioneEStrutture: React.FC<QuestionarioStruttureProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('network.')) {
      const campo = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        network: {
          ...prev.network,
          [campo]: value
        }
      }));
    } else if (name.startsWith('collaborazioni')) {
      const index = parseInt(name.split('.')[1]);
      const campo = name.split('.')[2];
      
      setFormData(prev => ({
        ...prev,
        collaborazioni: prev.collaborazioni.map((collab, i) => 
          i === index ? { ...collab, [campo]: value } : collab
        )
      }));
    }
  };

  const aggiungiCollaborazione = () => {
    setFormData(prev => ({
      ...prev,
      collaborazioni: [
        ...prev.collaborazioni,
        { denominazione: '', tipo: 'ricorrente', oggetto: '' }
      ]
    }));
  };

  const rimuoviCollaborazione = (index: number) => {
    setFormData(prev => ({
      ...prev,
      collaborazioni: prev.collaborazioni.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione E: Reti e Collaborazioni</h2>

      <div className="space-y-6">
        {/* Collaborazioni */}
        <div>
          <h3 className="text-lg font-medium mb-4">Collaborazioni</h3>
          {formData.collaborazioni.map((collab, index) => (
            <div key={index} className="p-4 border rounded mb-4">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Denominazione Ente/Organizzazione</label>
                  <input
                    type="text"
                    name={`collaborazioni.${index}.denominazione`}
                    value={collab.denominazione}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Tipo di Collaborazione</label>
                  <select
                    name={`collaborazioni.${index}.tipo`}
                    value={collab.tipo}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="ricorrente">Ricorrente</option>
                    <option value="occasionale">Occasionale</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Oggetto della Collaborazione</label>
                  <textarea
                    name={`collaborazioni.${index}.oggetto`}
                    value={collab.oggetto}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => rimuoviCollaborazione(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Rimuovi
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={aggiungiCollaborazione}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Aggiungi Collaborazione
          </button>
        </div>

        {/* Network */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Punti di Forza del Network</label>
            <textarea
              name="network.punti_forza"
              value={formData.network.punti_forza}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Descrivi i punti di forza della rete..."
            />
          </div>
          <div>
            <label className="block mb-2">Criticità del Network</label>
            <textarea
              name="network.criticita"
              value={formData.network.criticita}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Descrivi le criticità della rete..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SezioneEStrutture; 