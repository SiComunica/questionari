import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import type { Database } from '@/types/database'

// Dichiariamo l'estensione del tipo jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

type Struttura = Database['public']['Tables']['strutture']['Row']
type Operatore = Database['public']['Tables']['operatori']['Row']
type Giovane = Database['public']['Tables']['giovani']['Row']

type ExportData = {
  strutture: Struttura[]
  operatori: Operatore[]
  giovani: Giovane[]
}

export const exportToExcel = (data: ExportData) => {
  const workbook = XLSX.utils.book_new()

  // Foglio strutture
  if (data.strutture.length > 0) {
    const struttureWs = XLSX.utils.json_to_sheet(data.strutture)
    XLSX.utils.book_append_sheet(workbook, struttureWs, 'Strutture')
  }

  // Foglio operatori
  if (data.operatori.length > 0) {
    const operatoriWs = XLSX.utils.json_to_sheet(data.operatori)
    XLSX.utils.book_append_sheet(workbook, operatoriWs, 'Operatori')
  }

  // Foglio giovani
  if (data.giovani.length > 0) {
    const giovaniWs = XLSX.utils.json_to_sheet(data.giovani)
    XLSX.utils.book_append_sheet(workbook, giovaniWs, 'Giovani')
  }

  XLSX.writeFile(workbook, 'questionari.xlsx')
}

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF()
  
  let yPos = 10

  // Strutture
  if (data.strutture.length > 0) {
    doc.setFontSize(16)
    doc.text('Strutture', 14, yPos)
    yPos += 10

    doc.autoTable({
      startY: yPos,
      head: [Object.keys(data.strutture[0])],
      body: data.strutture.map(Object.values),
    })
    yPos = (doc as any).lastAutoTable.finalY + 20
  }

  // Operatori
  if (data.operatori.length > 0) {
    if (yPos > 250) {
      doc.addPage()
      yPos = 10
    }

    doc.setFontSize(16)
    doc.text('Operatori', 14, yPos)
    yPos += 10

    doc.autoTable({
      startY: yPos,
      head: [Object.keys(data.operatori[0])],
      body: data.operatori.map(Object.values),
    })
    yPos = (doc as any).lastAutoTable.finalY + 20
  }

  // Giovani
  if (data.giovani.length > 0) {
    if (yPos > 250) {
      doc.addPage()
      yPos = 10
    }

    doc.setFontSize(16)
    doc.text('Giovani', 14, yPos)
    yPos += 10

    doc.autoTable({
      startY: yPos,
      head: [Object.keys(data.giovani[0])],
      body: data.giovani.map(Object.values),
    })
  }

  doc.save('questionari.pdf')
} 