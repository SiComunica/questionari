"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"
import AdminLayout from '@/components/layouts/AdminLayout'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Caricamento...</div>
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
} 