'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'
import { Button } from "@/components/ui/button"

export default function CompilaQuestionarioOperatori() {
  const { userType } = useAuth()
  const router = useRouter()

  if (userType !== 'operatore') {
    return null
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nuovo Questionario Operatori</h1>
        <Button onClick={() => router.push('/operatore')}>
          Torna alla dashboard
        </Button>
      </div>
      <QuestionarioOperatoriNew />
    </div>
  )
} 