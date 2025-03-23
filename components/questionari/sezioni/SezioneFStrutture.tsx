"use client"

import React from 'react';
import { QuestionarioStruttureProps } from '@/types/questionari';

const SezioneFStrutture: React.FC<QuestionarioStruttureProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('finanziamenti.')) {
      const campo = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        finanziamenti: {
          ...prev.finanziamenti,
          [campo]: parseInt(value) || 0
        }
      }));
    } else if (name.startsWith('fornitori')) {
      const index = parseInt(name.split('.')[1]);
      const campo = name.split('.')[2];
      
      setFormData(prev => ({
        ...prev,
        fornitori: prev.fornitori.map((f, i) => 
          i === index ? { ...f, [campo]: value } : f
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const aggiungiFornitori = () => {
    setFormData(prev => ({
      ...prev,
      fornitori: [
        ...prev.fornitori,
        { nome: '', tipo_sostegno: '' }
      ]
    }));
  };

  const rimuoviFornitore = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fornitori: prev.fornitori.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione F: Finanziamenti e Fornitori</h2>

      <div className="space-y-6">
        {/* Finanziamenti */}
        <div>
          <h3 className="text-lg font-medium mb-4">Finanziamenti</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Finanziamenti Pubblici (€)</label>
              <input
                type="number"
                name="finanziamenti.pubblici"
                value={formData.finanziamenti.pubblici}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Finanziamenti Privati (€)</label>
              <input
                type="number"
                name="finanziamenti.privati"
                value={formData.finanziamenti.privati}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Fonti di Finanziamento */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Fonti di Finanziamento Pubblico</label>
            <textarea
              name="fonti_finanziamento_pubblico"
              value={formData.fonti_finanziamento_pubblico}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Descrivi le fonti di finanziamento pubblico..."
            />
          </div>
          <div>
            <label className="block mb-2">Fonti di Finanziamento Privato</label>
            <textarea
              name="fonti_finanziamento_privato"
              value={formData.fonti_finanziamento_privato}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Descrivi le fonti di finanziamento privato..."
            />
          </div>
        </div>

        {/* Fornitori */}
        <div>
          <h3 className="text-lg font-medium mb-4">Fornitori di Sostegno</h3>
          {formData.fornitori.map((fornitore, index) => (
            <div key={index} className="p-4 border rounded mb-4">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Nome Fornitore</label>
                  <input
                    type="text"
                    name={`fornitori.${index}.nome`}
                    value={fornitore.nome}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Tipo di Sostegno</label>
                  <input
                    type="text"
                    name={`fornitori.${index}.tipo_sostegno`}
                    value={fornitore.tipo_sostegno}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => rimuoviFornitore(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Rimuovi
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={aggiungiFornitori}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Aggiungi Fornitore
          </button>
        </div>
      </div>
    </div>
  );
};

export default SezioneFStrutture; 