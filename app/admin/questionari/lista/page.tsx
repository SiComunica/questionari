'use client'

export default function ListaQuestionariPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl mb-4">Lista Questionari</h2>
        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h3 className="font-medium">Questionario 1</h3>
            <p className="text-gray-600">Risposte: 10</p>
          </div>
        </div>
      </div>
    </div>
  )
} 