'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import QuestionarioGiovani from '@/components/questionari/QuestionarioGiovani'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Configurazione per il rendering dinamico
export const dynamic = 'force-dynamic'
export const revalidate = 0

function DashboardContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

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

export default function DashboardAnonimo() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <DashboardContent />
    </Suspense>
  )
} 