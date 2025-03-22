'use client'

export default function OperatoreDashboard() {
  console.log('OperatoreDashboard: Inizio rendering')
  
  if (typeof window === 'undefined') {
    console.log('OperatoreDashboard: Server side')
    return null
  }

  const userType = localStorage.getItem('userType')
  const codice = localStorage.getItem('codice')
  console.log('OperatoreDashboard: Check', { userType, codice })

  if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
    console.log('OperatoreDashboard: Accesso non autorizzato')
    window.location.replace('/')
    return null
  }

  console.log('OperatoreDashboard: Rendering dashboard')
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Operatore</h1>
      <p>Benvenuto nella dashboard operatore</p>
      <p className="text-sm text-gray-500">Codice: {codice}</p>
    </div>
  )
} 