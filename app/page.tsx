'use client'
// Pagina di login
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const { userType } = useAuth()

  if (userType) {
    router.push('/dashboard')
  }

  return (
    <div>
      <h1>Login Page</h1>
      {/* Form di login qui */}
    </div>
  )
}

