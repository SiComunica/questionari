'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { PDFDocument, rgb } from 'pdf-lib'

interface Questionario {
  id: string
  created_at: string
  fonte: string
  stato: string
  tipo: 'giovani' | 'operatori' | 'strutture'
}

export default function AdminDashboard() {
  const { userType } = useAuth()
  const [questionari, setQuestionari] = useState<Questionario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userType !== 'admin') return

    const fetchQuestionari = async () => {
      try {
        // Fetch questionari giovani (solo quelli anonimi)
        const { data: questionariGiovani, error: errorGiovani } = await supabase
          .from('giovani')
          .select('*')
          .eq('stato', 'inviato')
          .order('created_at', { ascending: false })

        // Fetch questionari operatori
        const { data: questionariOperatori, error: errorOperatori } = await supabase
          .from('operatori')
          .select('*')
          .eq('stato', 'inviato')
          .order('created_at', { ascending: false })

        // Fetch questionari strutture
        const { data: questionariStrutture, error: errorStrutture } = await supabase
          .from('strutture')
          .select('*')
          .eq('stato', 'inviato')
          .order('created_at', { ascending: false })

        if (errorGiovani || errorOperatori || errorStrutture) {
          throw new Error('Errore nel caricamento dei questionari')
        }

        const allQuestionari = [
          ...(questionariGiovani || []).map(q => ({ ...q, tipo: 'giovani' as const })),
          ...(questionariOperatori || []).map(q => ({ ...q, tipo: 'operatori' as const })),
          ...(questionariStrutture || []).map(q => ({ ...q, tipo: 'strutture' as const }))
        ]

        setQuestionari(allQuestionari)
      } catch (error) {
        console.error('Errore nel caricamento dei questionari:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionari()
  }, [userType])

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(questionari)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Questionari')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(data, 'questionari.xlsx')
  }

  const downloadPDF = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    let yOffset = height - 50

    // Intestazione
    page.drawText('Report Questionari', {
      x: 50,
      y: yOffset,
      size: 20,
      color: rgb(0, 0, 0)
    })

    yOffset -= 40

    // Dati questionari
    questionari.forEach((q) => {
      if (yOffset < 50) {
        // Nuova pagina se non c'è più spazio
        const newPage = pdfDoc.addPage()
        yOffset = height - 50
      }

      page.drawText(`ID: ${q.id}`, { x: 50, y: yOffset, size: 12 })
      yOffset -= 20
      page.drawText(`Tipo: ${q.tipo}`, { x: 50, y: yOffset, size: 12 })
      yOffset -= 20
      page.drawText(`Fonte: ${q.fonte}`, { x: 50, y: yOffset, size: 12 })
      yOffset -= 20
      page.drawText(`Data: ${new Date(q.created_at).toLocaleDateString()}`, { x: 50, y: yOffset, size: 12 })
      yOffset -= 40
    })

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, 'questionari.pdf')
  }

  if (userType !== 'admin') {
    return null
  }

  if (loading) {
    return <div>Caricamento...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <div className="space-x-4">
          <Button onClick={downloadExcel}>
            Scarica Excel
          </Button>
          <Button onClick={downloadPDF}>
            Scarica PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {questionari.map((questionario) => (
          <Card key={`${questionario.tipo}-${questionario.id}`}>
            <CardHeader>
              <CardTitle>
                Questionario {questionario.tipo.charAt(0).toUpperCase() + questionario.tipo.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p>Fonte: {questionario.fonte}</p>
                  <p>Data: {new Date(questionario.created_at).toLocaleDateString()}</p>
                  <p>Stato: {questionario.stato}</p>
                </div>
                <Link 
                  href={`/admin/dettaglio-questionario?tipo=${questionario.tipo}&id=${questionario.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Visualizza Dettagli
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 