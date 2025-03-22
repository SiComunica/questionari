'use client'

export default function OperatoreDashboard() {
  if (typeof window !== 'undefined') {
    const userType = localStorage.getItem('userType')
    const codice = localStorage.getItem('codice')
    
    console.log('Operatore check:', { userType, codice }) // Debug log

    // Prima verifica il tipo utente
    if (userType !== 'operatore') {
      window.location.replace('/')
      return <div>Reindirizzamento...</div>
    }

    // Poi verifica il formato del codice
    if (!codice?.startsWith('operatore')) {
      window.location.replace('/')
      return <div>Reindirizzamento...</div>
    }

    // Infine verifica il numero
    const num = parseInt(codice.replace('operatore', ''))
    if (isNaN(num) || num < 1 || num > 300) {
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