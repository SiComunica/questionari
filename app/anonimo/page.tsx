'use client'

export default function AnonimoDashboard() {
  if (typeof window !== 'undefined') {
    const userType = window.localStorage.getItem('userType')
    const codice = window.localStorage.getItem('codice')
    
    console.log('Anonimo check:', { userType, codice })
    
    if (userType !== 'anonimo' || codice !== 'anonimo9999') {
      window.location.replace('/')
      return <div>Reindirizzamento...</div>
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Anonimo</h1>
      <p>Benvenuto nella dashboard anonimo</p>
    </div>
  )
} 