'use client'

import { formatQuestionarioData } from '@/utils/questionarioMappings'

interface QuestionarioViewProps {
  questionario: any
  onClose: () => void
}

export default function QuestionarioView({ questionario, onClose }: QuestionarioViewProps) {
  const formattedData = formatQuestionarioData(questionario)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Dettaglio Questionario</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Chiudi
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-2">
            <p className="font-medium">ID: {formattedData.id}</p>
            <p>Data: {new Date(formattedData.created_at).toLocaleString('it-IT')}</p>
            <p>Fonte: {formattedData.fonte}</p>
            <p>Stato: {formattedData.stato}</p>
          </div>

          <div>
            <h3 className="font-semibold">Dati Personali</h3>
            <p>Sesso: {formattedData.sesso}</p>
            <p>Classe età: {formattedData.classe_eta}</p>
            <p>Cittadinanza: {formattedData.cittadinanza}</p>
            <p>Titolo di studio: {formattedData.titolo_studio}</p>
          </div>

          {/* Aggiungi altre sezioni per mostrare tutti i dati formattati */}
        </div>
      </div>
    </div>
  )
} 