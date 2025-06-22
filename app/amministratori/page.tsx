'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import QuestionariStruttureNew from '@/components/dashboard/QuestionariStruttureNew'
import QuestionariOperatoriLista from '@/components/dashboard/QuestionariOperatoriLista'
import QuestionariGiovaniOperatori from '@/components/dashboard/QuestionariGiovaniOperatori'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export default function AmministratoriDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userType')
      localStorage.removeItem('codice')
      router.push('/')
    }
  }

  const generateStatistics = async () => {
    try {
      // Recupera tutti i dati
      const [struttureData, operatoriData, giovaniData] = await Promise.all([
        supabase.from('strutture').select('*'),
        supabase.from('operatori').select('*'),
        supabase.from('giovani').select('*')
      ])

      if (struttureData.error) throw struttureData.error
      if (operatoriData.error) throw operatoriData.error
      if (giovaniData.error) throw giovaniData.error

      const strutture = struttureData.data || []
      const operatori = operatoriData.data || []
      const giovani = giovaniData.data || []

      // Crea il workbook Excel
      const workbook = XLSX.utils.book_new()

      // Statistiche Questionari Strutture
      const struttureStats = generateStruttureStats(strutture)
      const struttureSheet = XLSX.utils.json_to_sheet(struttureStats)
      XLSX.utils.book_append_sheet(workbook, struttureSheet, "Strutture")

      // Statistiche Questionari Operatori
      const operatoriStats = generateOperatoriStats(operatori)
      const operatoriSheet = XLSX.utils.json_to_sheet(operatoriStats)
      XLSX.utils.book_append_sheet(workbook, operatoriSheet, "Operatori")

      // Statistiche Questionari Giovani
      const giovaniStats = generateGiovaniStats(giovani)
      const giovaniSheet = XLSX.utils.json_to_sheet(giovaniStats)
      XLSX.utils.book_append_sheet(workbook, giovaniSheet, "Giovani")

      // Salva il file
      const fileName = `statistiche_generali_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`
      XLSX.writeFile(workbook, fileName)

      toast.success('Statistiche generate con successo')
    } catch (error) {
      console.error('Errore:', error)
      toast.error('Errore nella generazione delle statistiche')
    }
  }

  const generateStruttureStats = (data: any[]) => {
    if (data.length === 0) return [{ Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]

    const stats: Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> = []
    const total = data.length

    // Tipo struttura
    const tipoStruttura = data.reduce((acc, item) => {
      acc[item.tipo_struttura || 'Non specificato'] = (acc[item.tipo_struttura || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(tipoStruttura).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Tipo Struttura',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Forma giuridica
    const formaGiuridica = data.reduce((acc, item) => {
      acc[item.forma_giuridica || 'Non specificato'] = (acc[item.forma_giuridica || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(formaGiuridica).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Forma Giuridica',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Anno inizio
    const annoInizio = data.reduce((acc, item) => {
      acc[item.anno_inizio || 'Non specificato'] = (acc[item.anno_inizio || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(annoInizio).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Anno Inizio',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    return stats
  }

  const generateOperatoriStats = (data: any[]) => {
    if (data.length === 0) return [{ Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]

    const stats: Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> = []
    const total = data.length

    // Professione
    const professione = data.reduce((acc, item) => {
      acc[item.professione || 'Non specificato'] = (acc[item.professione || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(professione).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Professione',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Caratteristiche persone seguite
    const caratteristiche = ['stranieri_migranti', 'vittime_tratta', 'vittime_violenza', 'allontanati_famiglia', 'detenuti', 'ex_detenuti', 'misure_alternative', 'indigenti_senzatetto', 'rom_sinti', 'disabilita_fisica', 'disabilita_cognitiva', 'disturbi_psichiatrici', 'dipendenze', 'genitori_precoci', 'problemi_orientamento']
    
    caratteristiche.forEach(car => {
      const count = data.filter(item => item.caratteristiche_persone_seguite?.includes(car)).length
      stats.push({
        Domanda: `Caratteristiche - ${car.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Caratteristiche - ${car.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    return stats
  }

  const generateGiovaniStats = (data: any[]) => {
    if (data.length === 0) return [{ Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]

    const stats: Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> = []
    const total = data.length

    // Percorso autonomia
    const percAut = data.filter(item => item.percorso_autonomia).length
    stats.push({
      Domanda: 'Percorso Autonomia',
      Risposta: 'Sì',
      Frequenza: percAut,
      Percentuale: `${((percAut / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Domanda: 'Percorso Autonomia',
      Risposta: 'No',
      Frequenza: total - percAut,
      Percentuale: `${(((total - percAut) / total) * 100).toFixed(1)}%`
    })

    // Vive in struttura
    const viveStruttura = data.filter(item => item.vive_in_struttura).length
    stats.push({
      Domanda: 'Vive in Struttura',
      Risposta: 'Sì',
      Frequenza: viveStruttura,
      Percentuale: `${((viveStruttura / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Domanda: 'Vive in Struttura',
      Risposta: 'No',
      Frequenza: total - viveStruttura,
      Percentuale: `${(((total - viveStruttura) / total) * 100).toFixed(1)}%`
    })

    // Sesso
    const sesso = data.reduce((acc, item) => {
      acc[item.sesso || 'Non specificato'] = (acc[item.sesso || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(sesso).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Sesso',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Classe età
    const classeEta = data.reduce((acc, item) => {
      acc[item.classe_eta || 'Non specificato'] = (acc[item.classe_eta || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(classeEta).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Classe Età',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Fattori vulnerabilità
    const fattoriVuln = ['stranieri', 'vittime_tratta', 'vittime_violenza', 'allontanati_famiglia', 'detenuti', 'ex_detenuti', 'misura_alternativa', 'senza_dimora', 'rom_sinti', 'disabilita_fisica', 'disabilita_cognitiva', 'disturbi_psichiatrici', 'dipendenze', 'genitori_precoci', 'orientamento_sessuale']
    
    fattoriVuln.forEach(fattore => {
      const count = data.filter(item => item.fattori_vulnerabilita?.includes(fattore)).length
      stats.push({
        Domanda: `Fattori Vulnerabilità - ${fattore.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Fattori Vulnerabilità - ${fattore.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    return stats
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Amministratori</h1>
        <div className="space-x-4">
          <button
            onClick={generateStatistics}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Statistiche Generali
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <QuestionariGiovaniOperatori />
      <QuestionariStruttureNew />
      <QuestionariOperatoriLista />
    </div>
  )
} 