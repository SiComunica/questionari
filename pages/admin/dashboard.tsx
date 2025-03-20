import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/layouts/AdminLayout'
import QuestionariOperatoriList from '../../components/dashboard/QuestionariOperatoriList';

export default function AdminDashboard() {
  const { user, userType, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userType !== 'admin')) {
      router.push('/')
    }
  }, [user, loading, userType, router])

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Questionari Operatori</h2>
          <QuestionariOperatoriList />
        </div>
      </div>
    </AdminLayout>
  )
} 