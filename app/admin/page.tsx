'use client'

export default function AdminDashboard() {
  console.log('1. Admin Dashboard - Inizio rendering')

  if (typeof window !== 'undefined') {
    console.log('2. Admin Dashboard - Window definito')
    
    try {
      const userType = window.localStorage.getItem('userType')
      const codice = window.localStorage.getItem('codice')
      
      console.log('3. Admin Dashboard - Dati:', { userType, codice })
      
      if (userType !== 'admin' || codice !== 'admin2025') {
        console.log('4. Admin Dashboard - Accesso negato, reindirizzamento...')
        window.location.replace('/')
        return null
      }

      console.log('5. Admin Dashboard - Accesso consentito')
    } catch (error) {
      console.error('Admin Dashboard - Errore:', error)
      window.location.replace('/')
      return null
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Benvenuto nella dashboard admin</p>
    </div>
  )
} 