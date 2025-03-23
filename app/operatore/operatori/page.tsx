'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AuthCheck from '@/components/AuthCheck'
import QuestionarioOperatoriNuovo from '@/components/questionari/QuestionarioOperatoriNuovo'

export default function QuestionarioOperatoriPage() {
  const [fonte, setFonte] = useState('')

  useEffect(() => {
    setFonte(localStorage.getItem('codice') || '')
  }, [])

  return (
    <AuthCheck>
      <div className="p-8">
        <Link
          href="/operatore"
          className="inline-block mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Torna alla dashboard
        </Link>
        {fonte && <QuestionarioOperatoriNuovo fonte={fonte} />}
      </div>
    </AuthCheck>
  )
} 