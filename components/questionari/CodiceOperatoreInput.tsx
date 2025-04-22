import React from 'react';

interface CodiceOperatoreInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodiceOperatoreInput: React.FC<CodiceOperatoreInputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Codice Operatore</h2>
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="es: operatore1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}; 