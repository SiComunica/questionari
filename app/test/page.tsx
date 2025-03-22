'use client'

export default function TestDashboard() {
  if (typeof window !== 'undefined') {
    const userType = window.localStorage.getItem('userType')
    const codice = window.localStorage.getItem('codice')
    
    console.log('Test check:', { userType, codice })
    
    if (userType !== 'test' || codice !== 'test1234') {
      window.location.replace('/')
      return <div>Reindirizzamento...</div>
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Test</h1>
      <p>Benvenuto nella dashboard test</p>
    </div>
  )
} 