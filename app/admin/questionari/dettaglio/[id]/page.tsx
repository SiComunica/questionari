'use client'

export default function DettaglioQuestionario({ params }: { params: { id: string } }) {
  const [tipo, id] = params.id.split('-')
  // ... resto del codice invariato ma usando tipo e id separati ...
} 