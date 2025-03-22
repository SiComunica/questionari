'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const userType = localStorage.getItem('userType')
      const codice = localStorage.getItem('codice')
      
      if (userType === 'operatore' && codice?.startsWith('operatore')) {
        setIsAuthorized(true)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="p-8">Verifica accesso...</div>
  }

  if (!isAuthorized) {
    return null
  }

  return children
} 