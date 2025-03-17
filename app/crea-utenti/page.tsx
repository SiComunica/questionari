'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

export default function CreaUtenti() {
  const [status, setStatus] = useState('')
  const supabase = createClientComponentClient()

  const creaUtente = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return `Creato utente ${email}`
    } catch (error) {
      console.error('Errore:', error)
      return `Errore per ${email}: ${error.message}`
    }
  }

  const creaTuttiUtenti = async () => {
    setStatus('Creazione utenti in corso...')
    
    // Crea admin
    const adminResult = await creaUtente('admin@ferro.com', 'admin2025')
    setStatus(prev => prev + '\n' + adminResult)

    // Crea anonimo
    const anonimoResult = await creaUtente('anonimo@ferro.com', 'anonimo9999')
    setStatus(prev => prev + '\n' + anonimoResult)

    // Crea operatori
    for (let i = 1; i <= 100; i++) {
      const result = await creaUtente(
        `operatore${i}@ferro.com`,
        `operatore${i}`
      )
      setStatus(prev => prev + '\n' + result)
    }

    setStatus(prev => prev + '\nCompletato!')
  }

  return (
    <div className="p-4">
      <button
        onClick={creaTuttiUtenti}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Crea Tutti gli Utenti
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {status}
      </pre>
    </div>
  )
} 