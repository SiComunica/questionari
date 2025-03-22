'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Definiamo il tipo per il questionario
interface Questionario {
  id: string
  created_at: string
  fonte: string
  stato: string
}

export default function AmministratoriDashboard() {
  const [questionari, setQuestionari] = useState<Questionario[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        console.log('Fetching questionari...')
        const { data, error } = await supabase
          .from('giovani')
          .select('id, created_at, fonte, stato')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Errore nel caricamento questionari:', error)
          throw error
        }

        console.log('Questionari ricevuti:', data)
        setQuestionari(data || [])
      } catch (err) {
        console.error('Errore:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionari()
  }, [])

  if (typeof window === 'undefined') return null

  const userType = localStorage.getItem('userType')
  const codice = localStorage.getItem('codice')

  if (userType !== 'admin' || codice !== 'admin2025') {
    window.location.replace('/')
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Amministratori</h1>
      
      {loading ? (
        <p>Caricamento questionari...</p>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Questionari Ricevuti ({questionari.length})</h2>
          
          {questionari.length === 0 ? (
            <p className="text-gray-500">Nessun questionario ricevuto</p>
          ) : (
            <div className="grid gap-4">
              {questionari.map((q) => (
                <div key={q.id} className="border p-4 rounded-lg bg-white shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">ID: {q.id}</p>
                      <p className="text-sm text-gray-500">
                        Data: {new Date(q.created_at).toLocaleString('it-IT')}
                      </p>
                      <p className="text-sm">Fonte: {q.fonte}</p>
                    </div>
                    <div className="text-sm">
                      Stato: <span className="font-medium">{q.stato}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 