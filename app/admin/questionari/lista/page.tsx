'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function ListaQuestionariPage() {
  const { userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Verifica se l'utente è autenticato come admin
    const storedUserType = localStorage.getItem('userType')
    console.log('UserType corrente:', storedUserType)
    
    if (storedUserType !== 'admin') {
      console.log('Utente non autorizzato, reindirizzamento...')
      router.push('/')
      return
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Lista Questionari</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Questionari Sottomessi</h2>
        <div className="space-y-4">
          {/* Lista questionari qui */}
          <div className="p-4 border rounded">
            <p className="font-medium">Questionario Giovani</p>
            <p className="text-sm text-gray-600">Sottomessi: 10</p>
          </div>
          <div className="p-4 border rounded">
            <p className="font-medium">Questionario Operatori</p>
            <p className="text-sm text-gray-600">Sottomessi: 5</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminPage() {
  return (
    <div className="p-8">
      <h1>Dashboard Admin</h1>
    </div>
  )
} 