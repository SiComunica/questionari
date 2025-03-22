'use client'

export default function AmministratoriDashboard() {
  console.log('AmministratoriDashboard: Inizio rendering')
  
  if (typeof window === 'undefined') {
    console.log('AmministratoriDashboard: Server side')
    return null
  }

  const userType = localStorage.getItem('userType')
  const codice = localStorage.getItem('codice')
  console.log('AmministratoriDashboard: Check', { userType, codice })

  if (userType !== 'admin' || codice !== 'admin2025') {
    console.log('AmministratoriDashboard: Accesso non autorizzato')
    window.location.replace('/')
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Amministratori</h1>
      <p>Benvenuto nella dashboard amministratori</p>
      <p className="text-sm text-gray-500">Codice: {codice}</p>
    </div>
  )
} 