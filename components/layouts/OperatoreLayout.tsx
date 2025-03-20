import { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface OperatoreLayoutProps {
  children: ReactNode
}

const OperatoreLayout = ({ children }: OperatoreLayoutProps) => {
  const { user, userType, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div>Caricamento...</div>
  }

  if (!user || userType !== 'operatore') {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Operatore Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default OperatoreLayout 