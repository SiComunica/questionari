'use client'
// Pagina di login
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (userType) {
      switch (userType) {
        case 'admin':
          router.push('/admin/questionari/lista')
          break
        case 'operatore':
          router.push('/operatore')
          break
        case 'anonimo':
          router.push('/anonimo')
          break
      }
    }
  }, [userType, router])

  return null
}

