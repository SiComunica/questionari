'use client'

import { useRouter } from 'next/navigation'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'

export default function QuestionarioOperatoriPage() {
  const router = useRouter()
  
  return (
    <div className="p-8">
      <button
        onClick={() => router.push('/operatore')}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Torna alla dashboard
      </button>
      <QuestionarioOperatoriNew fonte="operatore1" />
    </div>
  )
} 