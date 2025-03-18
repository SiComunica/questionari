'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [questionari, setQuestionari] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchQuestionari()
  }, [])

  const fetchQuestionari = async () => {
    try {
      const { data, error } = await supabase
        .from('giovani')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuestionari(data || [])
    } catch (error) {
      console.error('Errore nel caricamento dei questionari:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin - Questionari Giovani</h1>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div>Caricamento questionari...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Compilazione</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Sesso</TableHead>
                  <TableHead>Età</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionari.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{formatDate(q.created_at)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        q.fonte === 'operatore' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {q.fonte === 'operatore' ? 'Operatore' : 'Anonimo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {q.sesso === "1" ? "M" : q.sesso === "2" ? "F" : "Altro"}
                    </TableCell>
                    <TableCell>
                      {q.classe_eta === "1" ? "18-21" : 
                       q.classe_eta === "2" ? "22-24" : 
                       q.classe_eta === "3" ? "25-27" : "28-34"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        q.stato === 'nuovo' ? 'bg-green-100 text-green-800' :
                        q.stato === 'in_revisione' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {q.stato === 'nuovo' ? 'Nuovo' :
                         q.stato === 'in_revisione' ? 'In Revisione' :
                         'Completato'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline"
                        onClick={() => router.push(`/admin/questionari/${q.id}`)}
                      >
                        Visualizza
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 