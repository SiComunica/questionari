'use client'

export default function OperatoreDashboard() {
  if (typeof window !== 'undefined') {
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')
    
    if (userType !== 'operatore') {
      window.location.href = '/'
      return null
    }

    if (!codice?.startsWith('operatore')) {
      window.location.href = '/'
      return null
    }

    const num = parseInt(codice.replace('operatore', ''))
    if (isNaN(num) || num < 1 || num > 300) {
      window.location.href = '/'
      return null
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Operatore</h1>
      <p>Benvenuto nella dashboard operatore</p>
    </div>
  )
} 