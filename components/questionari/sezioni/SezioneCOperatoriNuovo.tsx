import React from 'react';
import type { QuestionarioOperatoriNuovo } from '@/types/questionari';

interface Props {
  formData: QuestionarioOperatoriNuovo;
  setFormData: React.Dispatch<React.SetStateAction<QuestionarioOperatoriNuovo>>;
}

type DifficoltaKey = keyof Omit<QuestionarioOperatoriNuovo['difficolta_uscita'], 'altro_specificare'>;

const difficolta: Array<{ key: DifficoltaKey; label: string }> = [
  { key: 'problemi_economici', label: 'Problemi economici' },
  { key: 'trovare_lavoro', label: 'Difficoltà di trovare un lavoro' },
  { key: 'lavori_qualita', label: 'Difficoltà di trovare lavori di qualità' },
  { key: 'trovare_casa', label: 'Difficoltà nel trovare casa' },
  { key: 'discriminazioni', label: 'Problemi di discriminazioni, stigma, pregiudizi' },
  { key: 'salute_fisica', label: 'Problemi di salute fisica' },
  { key: 'problemi_psicologici', label: 'Problemi psicologici o psichiatrici' },
  { key: 'difficolta_linguistiche', label: 'Difficoltà linguistiche' },
  { key: 'altro', label: 'Altro tipo di problema' }
];

export default function SezioneCOperatoriNuovo({ formData, setFormData }: Props) {
  const handleDifficoltaChange = (e: React.ChangeEvent<HTMLInputElement>, campo: DifficoltaKey) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 10) {
      setFormData(prev => ({
        ...prev,
        difficolta_uscita: {
          ...prev.difficolta_uscita,
          [campo]: value
        }
      }));
    }
  };

  const handleAltroSpecificaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      difficolta_uscita: {
        ...prev.difficolta_uscita,
        altro_specificare: e.target.value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Sezione C: Informazioni sulle persone che hanno lasciato la struttura/progetto
      </h2>

      <div>
        <h3 className="font-semibold mb-4">
          C1. Quali difficoltà le persone uscite dalle strutture/progetto si trovano ad affrontare?
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Per ciascuna opzione assegnare un punteggio da 1 a 10 (dove 1 significa nessuna difficoltà e 10 difficoltà massima)
        </p>
        
        <div className="w-full overflow-x-auto">
          <div className="grid gap-4 min-w-[800px]">
            <div className="grid grid-cols-[250px_repeat(10,40px)] gap-2 items-center">
              <div className="font-semibold">Tipologia di difficoltà</div>
              {[...Array(10)].map((_, i) => (
                <div key={i} className="text-center w-10">{i + 1}</div>
              ))}
            </div>
            
            {difficolta.map(({ key, label }) => (
              <div key={key} className="grid grid-cols-[250px_repeat(10,40px)] gap-2 items-center">
                <div>{label}</div>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex justify-center">
                    <input
                      type="radio"
                      name={`difficolta_${key}`}
                      value={i + 1}
                      checked={formData.difficolta_uscita[key] === (i + 1)}
                      onChange={(e) => handleDifficoltaChange(e, key)}
                      className="w-4 h-4"
                    />
                  </div>
                ))}
              </div>
            ))}

            {formData.difficolta_uscita.altro > 1 && (
              <div className="mt-4">
                <label className="block mb-2">Specificare altro tipo di problema:</label>
                <input
                  type="text"
                  value={formData.difficolta_uscita.altro_specificare}
                  onChange={handleAltroSpecificaChange}
                  className="w-full p-2 border rounded"
                  placeholder="Descrivi il problema..."
                  required
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 