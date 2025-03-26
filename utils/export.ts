import { utils, writeFile } from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { Database } from '@/types/database'
import type { QuestionarioStruttureNew } from '@/types/questionari'

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
  strutture: QuestionarioStruttureNew[]
  operatori: any[]
  giovani: any[]
}

export const exportToExcel = (data: ExportData) => {
  try {
    // Creiamo un nuovo workbook
    const wb = utils.book_new()

    // Se ci sono dati strutture, creiamo un foglio
    if (data.strutture.length > 0) {
      const wsStrutture = utils.json_to_sheet(data.strutture)
      utils.book_append_sheet(wb, wsStrutture, 'Strutture')
    }

    // Se ci sono dati giovani, creiamo un foglio
    if (data.giovani.length > 0) {
      const wsGiovani = utils.json_to_sheet(data.giovani)
      utils.book_append_sheet(wb, wsGiovani, 'Giovani')
    }

    // Se ci sono dati operatori, creiamo un foglio
    if (data.operatori.length > 0) {
      const wsOperatori = utils.json_to_sheet(data.operatori)
      utils.book_append_sheet(wb, wsOperatori, 'Operatori')
    }

    // Salviamo il file
    const filename = `export_${new Date().toISOString().split('T')[0]}.xlsx`
    writeFile(wb, filename)
  } catch (error) {
    console.error('Errore durante l\'export Excel:', error)
    throw error
  }
}

export const exportToPDF = (data: ExportData) => {
  try {
    const doc = new jsPDF()
    let yPos = 10

    // Funzione helper per aggiungere una sezione
    const addSection = (title: string, items: any[]) => {
      if (items.length > 0) {
        doc.setFontSize(16)
        doc.text(title, 10, yPos)
        yPos += 10

        doc.autoTable({
          startY: yPos,
          head: [Object.keys(items[0])],
          body: items.map(item => Object.values(item)),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] },
        })

        yPos = (doc as any).lastAutoTable.finalY + 20
      }
    }

    // Aggiungiamo le sezioni
    addSection('Questionari Strutture', data.strutture)
    addSection('Questionari Giovani', data.giovani)
    addSection('Questionari Operatori', data.operatori)

    // Salviamo il file
    const filename = `export_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
  } catch (error) {
    console.error('Errore durante l\'export PDF:', error)
    throw error
  }
} 