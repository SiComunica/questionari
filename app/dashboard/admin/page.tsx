'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import DettaglioQuestionario from '@/components/DettaglioQuestionario'
import { exportToExcel, exportToPDF } from '@/utils/export'
import { ArrowDownIcon } from '@heroicons/react/24/solid'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Struttura = Database['public']['Tables']['strutture']['Row']
type Operatore = Database['public']['Tables']['operatori']['Row']
type Giovane = Database['public']['Tables']['giovani']['Row']

type Submission = {
  id: string
  tipo: 'struttura' | 'operatore' | 'giovane'
  created_at: string
  created_by: string
  data: Struttura | Operatore | Giovane
}

type Questionario = {
  id: string
  created_at: string
  created_by: string
  tipo: 'giovani' | 'strutture' | 'operatori'
}

export default function DashboardAdmin() {
  const router = useRouter()
  const { userType } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [questionari, setQuestionari] = useState<Questionario[]>([])

  useEffect(() => {
    if (!userType) {
      router.push('/')
      return
    }

    if (userType !== 'admin') {
      router.push(`/dashboard/${userType}`)
      return
    }

    const fetchData = async () => {
      try {
        const [strutture, operatori, giovani] = await Promise.all([
          supabase.from('strutture').select('*'),
          supabase.from('operatori').select('*'),
          supabase.from('giovani').select('*')
        ])

        const allSubmissions: Submission[] = [
          ...(strutture.data?.map(s => ({
            id: s.id,
            tipo: 'struttura' as const,
            created_at: s.created_at,
            created_by: s.created_by,
            data: s
          })) || []),
          ...(operatori.data?.map(o => ({
            id: o.id,
            tipo: 'operatore' as const,
            created_at: o.created_at,
            created_by: o.created_by,
            data: o
          })) || []),
          ...(giovani.data?.map(g => ({
            id: g.id,
            tipo: 'giovane' as const,
            created_at: g.created_at,
            created_by: g.created_by,
            data: g
          })) || [])
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setSubmissions(allSubmissions)
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error)
        setError('Errore nel caricamento dei dati')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userType, router])

  useEffect(() => {
    async function fetchQuestionari() {
      try {
        // Fetch questionari giovani
        const { data: giovani, error: errGiovani } = await supabase
          .from('giovani')
          .select('id, created_at, created_by')
          .order('created_at', { ascending: false })

        if (errGiovani) throw errGiovani

        // Formatta i dati
        const questionariFormattati = (giovani || []).map(q => ({
          ...q,
          tipo: 'giovani' as const
        }))

        setQuestionari(questionariFormattati)
      } catch (error) {
        console.error('Errore nel caricamento dei questionari:', error)
      }
    }

    fetchQuestionari()
  }, [])

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      const [strutture, operatori, giovani] = await Promise.all([
        supabase.from('strutture').select('*'),
        supabase.from('operatori').select('*'),
        supabase.from('giovani').select('*')
      ])

      const data = {
        strutture: strutture.data || [],
        operatori: operatori.data || [],
        giovani: giovani.data || []
      }

      if (format === 'excel') {
        exportToExcel(data)
      } else {
        exportToPDF(data)
      }
    } catch (error) {
      console.error('Errore durante l\'esportazione:', error)
    }
  }

  if (!userType || userType !== 'admin') return null
  if (loading) return <div>Caricamento...</div>
  if (error) return <div>Errore: {error}</div>

  const getSubmissionsByType = (tipo: 'struttura' | 'operatore' | 'giovane') => {
    return submissions.filter(s => s.tipo === tipo)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => handleExport('excel')}
            variant="outline"
          >
            <ArrowDownIcon className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button 
            onClick={() => handleExport('pdf')}
            variant="outline"
          >
            <ArrowDownIcon className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tutti</TabsTrigger>
          <TabsTrigger value="strutture">Strutture</TabsTrigger>
          <TabsTrigger value="operatori">Operatori</TabsTrigger>
          <TabsTrigger value="giovani">Giovani</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <SubmissionsTable 
            submissions={submissions} 
            onView={setSelectedSubmission} 
          />
        </TabsContent>

        <TabsContent value="strutture">
          <SubmissionsTable 
            submissions={getSubmissionsByType('struttura')} 
            onView={setSelectedSubmission} 
          />
        </TabsContent>

        <TabsContent value="operatori">
          <SubmissionsTable 
            submissions={getSubmissionsByType('operatore')} 
            onView={setSelectedSubmission} 
          />
        </TabsContent>

        <TabsContent value="giovani">
          <SubmissionsTable 
            submissions={getSubmissionsByType('giovane')} 
            onView={setSelectedSubmission} 
          />
        </TabsContent>
      </Tabs>

      {selectedSubmission && (
        <DettaglioQuestionario
          data={selectedSubmission.data}
          tipo={selectedSubmission.tipo}
          onClose={() => setSelectedSubmission(null)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Questionari Ricevuti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questionari.map((q) => (
              <div
                key={q.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">ID: {q.id}</p>
                    <p className="text-sm text-gray-500">
                      Inviato da: {q.created_by}
                    </p>
                    <p className="text-sm text-gray-500">
                      Data: {new Date(q.created_at).toLocaleString('it-IT')}
                    </p>
                  </div>
                  <div className="text-sm text-blue-600">
                    {q.tipo.charAt(0).toUpperCase() + q.tipo.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SubmissionsTable({ 
  submissions, 
  onView 
}: { 
  submissions: Submission[]
  onView: (submission: Submission) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionari</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Compilato da</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map(submission => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.tipo}</TableCell>
                <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{submission.created_by}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => onView(submission)}
                  >
                    Visualizza
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 