'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import QuestionariStruttureNew from '@/components/dashboard/QuestionariStruttureNew'
import QuestionariOperatoriLista from '@/components/dashboard/QuestionariOperatoriLista'
import QuestionariGiovaniOperatori from '@/components/dashboard/QuestionariGiovaniOperatori'
import QuestionariGiovaniAnonimi from '@/components/dashboard/QuestionariGiovaniAnonimi'

export default function AmministratoriDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userType')
      localStorage.removeItem('codice')
      router.push('/')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Amministratori</h1>
        <Button onClick={handleLogout} variant="destructive" className="flex gap-2">
          <LogOut size={20} />
          Logout
        </Button>
      </div>

      <QuestionariGiovaniAnonimi />
      <QuestionariGiovaniOperatori />
      <QuestionariStruttureNew />
      <QuestionariOperatoriLista />
    </div>
  )
} 