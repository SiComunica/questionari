'use client'

export default function OperatoreDashboard() {
  console.log('1. Operatore Dashboard - Inizio rendering')

  if (typeof window !== 'undefined') {
    console.log('2. Operatore Dashboard - Window definito')
    
    try {
      const userType = window.localStorage.getItem('userType')
      const codice = window.localStorage.getItem('codice')
      
      console.log('3. Operatore Dashboard - Dati:', { userType, codice })
      
      if (userType !== 'operatore') {
        console.log('4a. Operatore Dashboard - Tipo utente non valido')
        window.location.replace('/')
        return null
      }

      if (!codice?.startsWith('operatore')) {
        console.log('4b. Operatore Dashboard - Formato codice non valido')
        window.location.replace('/')
        return null
      }

      const num = parseInt(codice.replace('operatore', ''))
      if (num < 1 || num > 300) {
        console.log('4c. Operatore Dashboard - Numero non valido')
        window.location.replace('/')
        return null
      }

      console.log('5. Operatore Dashboard - Accesso consentito')
    } catch (error) {
      console.error('Operatore Dashboard - Errore:', error)
      window.location.replace('/')
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