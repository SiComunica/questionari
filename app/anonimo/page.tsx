'use client'

import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'

export default function AnonimoDashboard() {
  console.log('AnonimoDashboard: Inizio rendering')
  
  if (typeof window === 'undefined') {
    console.log('AnonimoDashboard: Server side')
    return null
  }

  const userType = localStorage.getItem('userType')
  const codice = localStorage.getItem('codice')
  console.log('AnonimoDashboard: Check', { userType, codice })

  if (userType !== 'anonimo' || codice !== 'anonimo9999') {
    console.log('AnonimoDashboard: Accesso non autorizzato')
    window.location.replace('/')
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Questionario Giovani</h1>
      <QuestionarioGiovaniNew />
    </div>
  )
} 