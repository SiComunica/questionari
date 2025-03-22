'use client'

interface QuestionarioViewProps {
  questionario: any
  onClose: () => void
}

export default function QuestionarioView({ questionario, onClose }: QuestionarioViewProps) {
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
            <p className="font-medium">ID: {questionario.id}</p>
            <p>Data: {new Date(questionario.created_at).toLocaleString('it-IT')}</p>
            <p>Fonte: {questionario.fonte}</p>
            <p>Stato: {questionario.stato}</p>
          </div>

          {/* Mostra i dati del questionario in sezioni */}
          <div>
            <h3 className="font-semibold">Dati Personali</h3>
            <p>Sesso: {questionario.sesso}</p>
            <p>Classe età: {questionario.classe_eta}</p>
            <p>Cittadinanza: {questionario.cittadinanza}</p>
          </div>

          {/* Altre sezioni del questionario... */}
        </div>
      </div>
    </div>
  )
} 