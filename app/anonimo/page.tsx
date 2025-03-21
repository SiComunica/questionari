'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function AnonimoPage() {
  const { userType } = useAuth()

  useEffect(() => {
    if (!userType || userType !== 'anonimo') {
      window.location.href = '/'
    }
  }, [userType])

  if (!userType || userType !== 'anonimo') {
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Anonimo</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Questionario Giovani</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Compila il questionario per i giovani</p>
            <Link 
              href="/anonimo/questionari-giovani"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Inizia Questionario
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 