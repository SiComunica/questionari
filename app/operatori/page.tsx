'use client'

export default function OperatoriDashboard() {
  console.log('OperatoriDashboard: Inizio rendering')
  
  if (typeof window === 'undefined') {
    console.log('OperatoriDashboard: Server side')
    return null
  }

  const userType = localStorage.getItem('userType')
  const codice = localStorage.getItem('codice')
  console.log('OperatoriDashboard: Check', { userType, codice })

  if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
    console.log('OperatoriDashboard: Accesso non autorizzato')
    window.location.replace('/')
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Operatori</h1>
      <p>Benvenuto nella dashboard operatori</p>
      <p className="text-sm text-gray-500">Codice: {codice}</p>
    </div>
  )
} 