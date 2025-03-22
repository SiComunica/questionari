'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'

export default function OperatorePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [fonte, setFonte] = useState('')

  useEffect(() => {
    console.log('OperatorePage: Checking auth...')
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')
    console.log('Auth data:', { userType, codice })

    if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
      console.log('Unauthorized, redirecting...')
      router.push('/')
      return
    }

    setFonte(codice)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div className="p-8">Caricamento...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Operatore</h1>
      <QuestionarioGiovaniNew fonte={fonte} />
    </div>
  )
} 