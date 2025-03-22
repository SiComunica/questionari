'use client'

export default function AdminDashboard() {
  if (typeof window !== 'undefined') {
    const userType = window.localStorage.getItem('userType')
    const codice = window.localStorage.getItem('codice')
    
    console.log('Admin check:', { userType, codice })
    
    if (userType !== 'admin' || codice !== 'admin2025') {
      window.location.replace('/')
      return <div>Reindirizzamento...</div>
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Benvenuto nella dashboard admin</p>
    </div>
  )
} 