import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import OperatoreLayout from '@/components/layouts/OperatoreLayout'
import Link from 'next/link'

export default function OperatoreDashboard() {
  const { user, userType, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userType !== 'operatore')) {
      router.push('/')
    }
  }, [user, loading, userType, router])

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <OperatoreLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard Operatore</h1>
        <div className="mt-4">
          <Link href="/operatore/questionari/nuovo">
            <a className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Compila Questionario Operatore
            </a>
          </Link>
        </div>
      </div>
    </OperatoreLayout>
  )
} 