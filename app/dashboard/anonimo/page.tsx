'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import QuestionarioGiovani from '@/components/questionari/QuestionarioGiovani'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DashboardAnonimo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  // Se c'è il parametro success, mostra il messaggio di successo
  if (success) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="success">
          <AlertDescription>
            Questionario inviato con successo! Grazie per la tua partecipazione.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <QuestionarioGiovani />
        </CardContent>
      </Card>
    </div>
  )
} 