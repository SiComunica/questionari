'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function AnonimoDashboard() {
  const { userType } = useAuth()

  if (userType !== 'anonimo') {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Area Questionari</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Questionario Giovani</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Compila il questionario per i giovani</p>
            <Link 
              href="/questionari/giovani/nuovo"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Inizia Questionario
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 