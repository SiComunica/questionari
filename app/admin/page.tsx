'use client'

export default function AdminDashboard() {
  console.log('AdminDashboard: Inizio rendering')
  
  if (typeof window === 'undefined') {
    console.log('AdminDashboard: Server side')
    return null
  }

  const userType = localStorage.getItem('userType')
  const codice = localStorage.getItem('codice')
  console.log('AdminDashboard: Check', { userType, codice })

  if (userType !== 'admin' || codice !== 'admin2025') {
    console.log('AdminDashboard: Accesso non autorizzato')
    window.location.replace('/')
    return null
  }

  console.log('AdminDashboard: Rendering dashboard')
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Benvenuto nella dashboard admin</p>
      <p className="text-sm text-gray-500">Codice: {codice}</p>
    </div>
  )
} 