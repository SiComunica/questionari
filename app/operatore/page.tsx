'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function OperatoreDashboard() {
  const { userType } = useAuth()

  if (userType !== 'operatore') {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Operatore</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Questionario Giovani</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href="/operatore/questionari-giovani"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Compila Questionario
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questionario Operatori</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href="/operatore/questionari-operatori"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Compila Questionario
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questionario Strutture</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href="/operatore/questionari-strutture"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Compila Questionario
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 