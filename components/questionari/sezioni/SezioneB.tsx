"use client"

import React from 'react';
import type { QuestionarioOperatoriNuovo } from '@/types/questionari';

interface Props {
  formData: QuestionarioOperatoriNuovo;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioOperatoriNuovo>>;
}

export default function SezioneB({ formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sezione B: Informazioni sulle persone seguite</h2>
      
      <div className="space-y-4">
        {/* B1. Numero di persone seguite direttamente */}
        <div>
          <h3 className="text-lg mb-3">B1. Indicare il numero di persone seguite direttamente</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Uomini</label>
              <input
                type="number"
                name="persone_seguite.uomini"
                value={formData.persone_seguite.uomini}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Donne</label>
              <input
                type="number"
                name="persone_seguite.donne"
                value={formData.persone_seguite.donne}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Totale</label>
              <input
                type="number"
                value={formData.persone_seguite.totale}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* B2. Numero di persone maggiorenni */}
        <div>
          <h3 className="text-lg mb-3">B2. Indicare il numero di persone maggiorenni seguite direttamente</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Uomini</label>
              <input
                type="number"
                name="persone_maggiorenni.uomini"
                value={formData.persone_maggiorenni.uomini}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Donne</label>
              <input
                type="number"
                name="persone_maggiorenni.donne"
                value={formData.persone_maggiorenni.donne}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Totale</label>
              <input
                type="number"
                value={formData.persone_maggiorenni.totale}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* B3. Caratteristiche delle persone seguite */}
        <div>
          <h3 className="text-lg mb-3">B3. Caratteristiche delle persone seguite direttamente</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.caratteristiche_persone).map(([key, value]) => {
              if (key !== 'altro_specificare') {
                return (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`caratteristiche_persone.${key}`}
                      checked={value}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          caratteristiche_persone: {
                            ...prev.caratteristiche_persone,
                            [key]: e.target.checked
                          }
                        }));
                      }}
                      className="mr-2"
                    />
                    <label>{key.replace(/_/g, ' ')}</label>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* B4. Tipo di intervento */}
        <div>
          <h3 className="text-lg mb-3">B4. Il suo intervento riguarda</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.tipo_intervento).map(([key, value]) => {
              if (key !== 'altro_specificare') {
                return (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`tipo_intervento.${key}`}
                      checked={value}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          tipo_intervento: {
                            ...prev.tipo_intervento,
                            [key]: e.target.checked
                          }
                        }));
                      }}
                      className="mr-2"
                    />
                    <label>{key.replace(/_/g, ' ')}</label>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* B5. Interventi da potenziare */}
        <div>
          <h3 className="text-lg mb-3">B5. Interventi da realizzare o potenziare</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.interventi_potenziare).map(([key, value]) => {
              if (key !== 'altro_specificare') {
                return (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`interventi_potenziare.${key}`}
                      checked={value}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          interventi_potenziare: {
                            ...prev.interventi_potenziare,
                            [key]: e.target.checked
                          }
                        }));
                      }}
                      className="mr-2"
                    />
                    <label>{key.replace(/_/g, ' ')}</label>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 