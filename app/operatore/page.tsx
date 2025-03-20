import Link from 'next/link'

export default function OperatorePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Area Operatore</h1>
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Questionari</h2>
          <div className="space-y-4">
            <Link 
              href="/questionari/operatori/nuovo"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Compila Nuovo Questionario
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 