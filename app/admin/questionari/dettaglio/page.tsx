'use client'
// Dettaglio questionario
import { useSearchParams } from 'next/navigation'

export default function DettaglioQuestionario() {
  const searchParams = useSearchParams()
  const tipo = searchParams?.get('tipo')
  const id = searchParams?.get('id')

  // ... codice per visualizzare il questionario ...

  return (
    <div>
      <h1>Dettaglio Questionario</h1>
      {/* Contenuto questionario */}
    </div>
  )
} 