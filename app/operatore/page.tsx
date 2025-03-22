'use client'

export default function OperatoreDashboard() {
  if (typeof window !== 'undefined') {
    const userType = window.localStorage.getItem('userType')
    const codice = window.localStorage.getItem('codice')
    
    console.log('Operatore check:', { userType, codice })
    
    if (userType !== 'operatore' || !codice?.startsWith('operatore')) {
      window.location.replace('/')
      return <div>Reindirizzamento...</div>
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Operatore</h1>
      <p>Benvenuto nella dashboard operatore</p>
    </div>
  )
} 