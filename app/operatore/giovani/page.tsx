'use client'

import Link from 'next/link'
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'

export default function QuestionarioGiovaniPage() {
  return (
    <div className="p-8">
      <Link
        href="/operatore"
        className="inline-block mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Torna alla dashboard
      </Link>
      <QuestionarioGiovaniNew fonte="operatore1" />
    </div>
  )
} 