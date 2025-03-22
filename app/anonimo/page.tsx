'use client'

export default function AnonimoDashboard() {
  // Verifica accesso
  if (typeof window !== 'undefined') {
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')
    
    if (userType !== 'anonimo' || codice !== 'anonimo9999') {
      window.location.href = '/'
      return null
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Anonimo</h1>
      <p>Benvenuto nella dashboard anonimo</p>
    </div>
  )
} 