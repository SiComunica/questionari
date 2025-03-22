'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AnonimoPage() {
  const router = useRouter()

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType')
    console.log('UserType corrente:', storedUserType)
    
    if (storedUserType !== 'anonimo') {
      console.log('Utente non autorizzato, reindirizzamento...')
      router.push('/')
      return
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Area Anonimo</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Benvenuto nell'area anonimo</p>
      </div>
    </div>
  )
} 