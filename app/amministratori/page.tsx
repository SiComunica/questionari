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
        supabase.from('operatorinew').select('*')
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

  // Utility per statistiche numeriche
  function getNumericStatsStrutture(arr: number[], label: string, domanda: string): Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    const valid = arr.filter((x: number) => typeof x === 'number' && !isNaN(x))
    if (valid.length === 0) return []
    const total = arr.length
    const validCount = valid.length
    return [
      { Domanda: domanda, Risposta: `${label}`, Frequenza: validCount, Percentuale: `${((validCount / total) * 100).toFixed(1)}%` },
    ]
  }

  // Utility per testo libero
  function getTextStatsStruttureCustom(arr: string[], label: string, domanda: string): Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    const valid = arr.filter((x: string) => typeof x === 'string' && x.trim() !== '')
    if (valid.length === 0) return []
    const total = arr.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq,
      Percentuale: `${((freq / total) * 100).toFixed(1)}%`
    }))
  }

  function generateStruttureStats(data: any[]): Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    if (data.length === 0) return [{ Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    const stats: Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> = []
    const total = data.length

    // Campi base
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.nome_struttura), 'Nome Struttura', 'Nome Struttura'))
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura'))
    stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.anno_inizio), 'Anno Inizio', 'Anno Inizio'))
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.missione), 'Missione', 'Missione'))

    // Forma giuridica altro
    const formaGiuridicaAltroStats = getTextStatsStruttureCustom(data.map((x:any)=>x.forma_giuridica_altro), 'Forma Giuridica Altro', 'Forma Giuridica Altro')
    for (const stat of formaGiuridicaAltroStats) {
      stats.push(stat)
    }

    // Personale retribuito/volontario
    const personaleKeys = ['personale_retribuito','personale_volontario'] as const
    const personaleSubKeys = ['uomini','donne','totale','part_time','full_time'] as const
    
    for (const key of personaleKeys) {
      for (const sub of personaleSubKeys) {
        if (data[0][key] && data[0][key][sub] !== undefined)
          stats.push(...getNumericStatsStrutture(data.map((x:any)=>x[key]?.[sub]), `${key} ${sub}`, `${key} - ${sub}`))
      }
    }

    // Persone ospitate/non ospitate
    const personeKeys = ['persone_ospitate','persone_non_ospitate'] as const
    const personeGruppi = ['fino_16','da_16_a_18','maggiorenni','totale'] as const
    const personeSubKeys = ['uomini','donne','totale'] as const
    
    for (const key of personeKeys) {
      for (const gruppo of personeGruppi) {
        for (const sub of personeSubKeys) {
          if (data[0][key] && data[0][key][gruppo] && data[0][key][gruppo][sub] !== undefined)
            stats.push(...getNumericStatsStrutture(data.map((x:any)=>x[key]?.[gruppo]?.[sub]), `${key} ${gruppo} ${sub}`, `${key} - ${gruppo} - ${sub}`))
        }
      }
    }

    // Caratteristiche altro
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.caratteristiche_ospiti_altro), 'Caratt. Ospiti Altro', 'Caratteristiche Ospiti Altro'))
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.caratteristiche_non_ospiti_altro), 'Caratt. Non Ospiti Altro', 'Caratteristiche Non Ospiti Altro'))

    // Attività inserimento, nuove attività, collaborazioni
    stats.push(...getTextStatsStruttureCustom(data.flatMap((x:any)=>x.attivita_inserimento||[]), 'Attività Inserimento', 'Attività Inserimento'))
    stats.push(...getTextStatsStruttureCustom(data.flatMap((x:any)=>x.nuove_attivita||[]), 'Nuove Attività', 'Nuove Attività'))
    stats.push(...getTextStatsStruttureCustom(data.flatMap((x:any)=>x.collaborazioni||[]), 'Collaborazioni', 'Collaborazioni'))

    // Punti forza, critica network
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.punti_forza_network), 'Punti Forza Network', 'Punti Forza Network'))
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.critica_network), 'Critica Network', 'Critica Network'))

    // Finanziamenti
    if (data[0].finanziamenti) {
      const finanziamentiKeys = ['fondi_pubblici','fondi_privati','totale'] as const
      for (const f of finanziamentiKeys) {
        stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.finanziamenti?.[f]), `Finanziamenti ${f}`, `Finanziamenti - ${f}`))
      }
      stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.finanziamenti?.fondi_pubblici_specifiche), 'Fondi Pubblici Specifiche', 'Fondi Pubblici Specifiche'))
      stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.finanziamenti?.fondi_privati_specifiche), 'Fondi Privati Specifiche', 'Fondi Privati Specifiche'))
      stats.push(...getTextStatsStruttureCustom(data.flatMap((x:any)=>x.finanziamenti?.fornitori||[]), 'Fornitori', 'Fornitori'))
    }

    // Aggiungo le statistiche già esistenti (domande chiuse)
    stats.push(...generateStruttureStats_OLD(data))

    return stats
  }

  // Copia la vecchia funzione con nome diverso per non perdere la logica delle domande chiuse
  function generateStruttureStats_OLD(data: any[]): Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    if (data.length === 0) return []
    
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

    // Figure professionali - gestisco sia array che oggetti
    const figureProf = ['Psicologi', 'Assistenti sociali', 'Educatori', 'Mediatori', 'Medici', 'Personale infermieristico/operatori sanitari', 'Insegnanti/formatori', 'Cappellano/operatori religiosi e spirituali', 'Tutor', 'Operatore legale', 'Operatore multifunzionale', 'Amministrativo', 'Altro']
    
    figureProf.forEach(figura => {
      const count = data.filter(item => {
        if (Array.isArray(item.figure_professionali)) {
          return item.figure_professionali.includes(figura)
        } else if (typeof item.figure_professionali === 'object' && item.figure_professionali !== null) {
          return item.figure_professionali[figura.toLowerCase().replace(/[^a-z]/g, '_')] === true
        }
        return false
      }).length
      
      stats.push({
        Domanda: `Figures Professionali - ${figura}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Figures Professionali - ${figura}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Persone ospitate - caratteristiche
    const caratteristicheOspiti = ['stranieri_migranti', 'vittime_tratta', 'vittime_violenza', 'allontanati_famiglia', 'detenuti', 'ex_detenuti', 'misure_alternative', 'indigenti_senzatetto', 'rom_sinti', 'disabilita_fisica', 'disabilita_cognitiva', 'disturbi_psichiatrici', 'dipendenze', 'genitori_precoci', 'problemi_orientamento']
    
    caratteristicheOspiti.forEach(car => {
      const count = data.filter(item => {
        const ospitiAdolescenti = Array.isArray(item.caratteristiche_ospiti_adolescenti) ? item.caratteristiche_ospiti_adolescenti : []
        const ospitiGiovani = Array.isArray(item.caratteristiche_ospiti_giovani) ? item.caratteristiche_ospiti_giovani : []
        return ospitiAdolescenti.includes(car) || ospitiGiovani.includes(car)
      }).length
      
      stats.push({
        Domanda: `Caratteristiche Ospiti - ${car.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Caratteristiche Ospiti - ${car.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Persone non ospitate - caratteristiche
    caratteristicheOspiti.forEach(car => {
      const count = data.filter(item => {
        const nonOspitiAdolescenti = Array.isArray(item.caratteristiche_non_ospiti_adolescenti) ? item.caratteristiche_non_ospiti_adolescenti : []
        const nonOspitiGiovani = Array.isArray(item.caratteristiche_non_ospiti_giovani) ? item.caratteristiche_non_ospiti_giovani : []
        return nonOspitiAdolescenti.includes(car) || nonOspitiGiovani.includes(car)
      }).length
      
      stats.push({
        Domanda: `Caratteristiche Non Ospiti - ${car.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Caratteristiche Non Ospiti - ${car.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Attività servizi
    const attivitaServizi = ['alloggio', 'vitto', 'servizi_bassa_soglia', 'ospitalita_diurna', 'supporto_psicologico', 'sostegno_autonomia', 'orientamento_lavoro', 'orientamento_formazione', 'istruzione', 'formazione_professionale', 'attivita_socializzazione', 'altro']
    
    attivitaServizi.forEach(servizio => {
      const count = data.filter(item => {
        return item.attivita_servizi?.[servizio]?.attivo === true
      }).length
      
      stats.push({
        Domanda: `Attività Servizi - ${servizio.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Attività Servizi - ${servizio.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Esperienze inserimento lavorativo
    const esperienzeLavoro = data.filter(item => item.esperienze_inserimento_lavorativo === true).length
    stats.push({
      Domanda: 'Esperienze Inserimento Lavorativo',
      Risposta: 'Sì',
      Frequenza: esperienzeLavoro,
      Percentuale: `${((esperienzeLavoro / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Domanda: 'Esperienze Inserimento Lavorativo',
      Risposta: 'No',
      Frequenza: total - esperienzeLavoro,
      Percentuale: `${(((total - esperienzeLavoro) / total) * 100).toFixed(1)}%`
    })

    return stats
  }

  // Utility per statistiche numeriche operatori
  function getNumericStatsOperatori(arr: number[], label: string, domanda: string): Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    const valid = arr.filter((x: number) => typeof x === 'number' && !isNaN(x))
    if (valid.length === 0) return []
    const total = arr.length
    const validCount = valid.length
    return [
      { Domanda: domanda, Risposta: `${label}`, Frequenza: validCount, Percentuale: `${((validCount / total) * 100).toFixed(1)}%` },
    ]
  }

  // Utility per testo libero operatori
  function getTextStatsOperatori(arr: string[], label: string, domanda: string): Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    const valid = arr.filter((x: string) => typeof x === 'string' && x.trim() !== '')
    if (valid.length === 0) return []
    const total = arr.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq,
      Percentuale: `${((freq / total) * 100).toFixed(1)}%`
    }))
  }

  function generateOperatoriStats(data: any[]): Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    if (data.length === 0) return [{ Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    
    const stats: Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> = []
    const total = data.length

    // Campi base
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura')) {
      stats.push(stat)
    }
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.tipo_struttura), 'Tipo Struttura', 'Tipo Struttura')) {
      stats.push(stat)
    }
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.professione?.altro_specificare), 'Professione Altro', 'Professione Altro')) {
      stats.push(stat)
    }

    // Persone seguite (numerici)
    (['persone_seguite','persone_maggiorenni'] as const).forEach((key: 'persone_seguite'|'persone_maggiorenni') => {
      (['uomini','donne','totale'] as const).forEach((sub: 'uomini'|'donne'|'totale') => {
        if (data[0][key] && data[0][key][sub] !== undefined)
          stats.push(...getNumericStatsOperatori(data.map((x:any)=>x[key]?.[sub]), `${key} ${sub}`, `${key} - ${sub}`))
      })
    })

    // Caratteristiche altro specificare
    stats.push(...getTextStatsOperatori(data.map((x:any)=>x.caratteristiche_persone?.altro_specificare), 'Caratteristiche Altro', 'Caratteristiche Altro'))

    // Tipo intervento altro specificare
    stats.push(...getTextStatsOperatori(data.map((x:any)=>x.tipo_intervento?.altro_specificare), 'Tipo Intervento Altro', 'Tipo Intervento Altro'))

    // Interventi potenziare altro specificare
    stats.push(...getTextStatsOperatori(data.map((x:any)=>x.interventi_potenziare?.altro_specificare), 'Interventi Potenziare Altro', 'Interventi Potenziare Altro'))

    // Difficoltà uscita (numerici)
    if (data[0].difficolta_uscita) {
      (['problemi_economici','trovare_lavoro','lavori_qualita','trovare_casa','discriminazioni','salute_fisica','problemi_psicologici','difficolta_linguistiche','altro'] as const).forEach((f: any) => {
        stats.push(...getNumericStatsOperatori(data.map((x:any)=>x.difficolta_uscita?.[f]), `Difficoltà Uscita ${f}`, `Difficoltà Uscita - ${f}`))
      })
      stats.push(...getTextStatsOperatori(data.map((x:any)=>x.difficolta_uscita?.altro_specificare), 'Difficoltà Uscita Altro', 'Difficoltà Uscita Altro'))
    }

    // Aggiungo le statistiche già esistenti (domande chiuse)
    stats.push(...generateOperatoriStats_OLD(data))

    return stats
  }

  // Copia la vecchia funzione per le domande chiuse
  function generateOperatoriStats_OLD(data: any[]): Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    if (data.length === 0) return []
    
    const stats: Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> = []
    const total = data.length

    // Professione
    const professione = data.reduce((acc, item) => {
      acc[item.professione?.tipo || 'Non specificato'] = (acc[item.professione?.tipo || 'Non specificato'] || 0) + 1
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
      const count = data.filter(item => {
        if (Array.isArray(item.caratteristiche_persone_seguite)) {
          return item.caratteristiche_persone_seguite.includes(car)
        } else if (typeof item.caratteristiche_persone === 'object' && item.caratteristiche_persone !== null) {
          return item.caratteristiche_persone[car] === true
        }
        return false
      }).length
      
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

    // Tipo interventi
    const tipoInterventi = ['sostegno_formazione', 'sostegno_lavoro', 'sostegno_abitativo', 'sostegno_famiglia', 'sostegno_coetanei', 'sostegno_competenze', 'sostegno_legale', 'sostegno_sociosanitario', 'mediazione_interculturale']
    
    tipoInterventi.forEach(intervento => {
      const count = data.filter(item => {
        if (Array.isArray(item.tipo_interventi)) {
          return item.tipo_interventi.includes(intervento)
        } else if (typeof item.tipo_intervento === 'object' && item.tipo_intervento !== null) {
          return item.tipo_intervento[intervento] === true
        }
        return false
      }).length
      
      stats.push({
        Domanda: `Tipo Intervento - ${intervento.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Tipo Intervento - ${intervento.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Interventi da potenziare
    const interventiPotenziare = ['sostegno_formazione', 'sostegno_lavoro', 'sostegno_abitativo', 'sostegno_famiglia', 'sostegno_coetanei', 'sostegno_competenze', 'sostegno_legale', 'sostegno_sociosanitario', 'mediazione_interculturale', 'nessuno', 'altro']
    
    interventiPotenziare.forEach(intervento => {
      const count = data.filter(item => {
        return item.interventi_potenziare?.[intervento] === true
      }).length
      
      stats.push({
        Domanda: `Interventi da Potenziare - ${intervento.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Interventi da Potenziare - ${intervento.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    return stats
  }

  // Utility per statistiche numeriche giovani
  function getNumericStatsGiovani(arr: number[], label: string, domanda: string): Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    const valid = arr.filter((x: number) => typeof x === 'number' && !isNaN(x))
    if (valid.length === 0) return []
    const total = arr.length
    const validCount = valid.length
    return [
      { Domanda: domanda, Risposta: `${label} (valori validi)`, Frequenza: validCount, Percentuale: `${((validCount / total) * 100).toFixed(1)}%` },
      { Domanda: domanda, Risposta: `${label} (media)`, Frequenza: (valid.reduce((a: number,b: number)=>a+b,0)/valid.length).toFixed(2), Percentuale: '' },
      { Domanda: domanda, Risposta: `${label} (min)`, Frequenza: Math.min(...valid), Percentuale: '' },
      { Domanda: domanda, Risposta: `${label} (max)`, Frequenza: Math.max(...valid), Percentuale: '' },
    ]
  }

  // Utility per testo libero giovani
  function getTextStatsGiovani(arr: string[], label: string, domanda: string): Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    const valid = arr.filter((x: string) => typeof x === 'string' && x.trim() !== '')
    if (valid.length === 0) return []
    const total = arr.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq,
      Percentuale: `${((freq / total) * 100).toFixed(1)}%`
    }))
  }

  function generateGiovaniStats(data: any[]): Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    if (data.length === 0) return [{ Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    
    const stats: Array<{Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> = []
    const total = data.length

    // Campi base
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.tipo_struttura), 'Tipo Struttura', 'Tipo Struttura'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.tipo_percorso), 'Tipo Percorso', 'Tipo Percorso'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.collocazione_attuale_spec), 'Collocazione Attuale Spec', 'Collocazione Attuale Spec'))

    // Luogo nascita
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.luogo_nascita?.altro_paese), 'Luogo Nascita Altro Paese', 'Luogo Nascita Altro Paese'))

    // Madre e Padre
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.madre?.titolo_studio), 'Madre Titolo Studio', 'Madre Titolo Studio'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.madre?.lavoro), 'Madre Lavoro', 'Madre Lavoro'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.padre?.titolo_studio), 'Padre Titolo Studio', 'Padre Titolo Studio'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.padre?.lavoro), 'Padre Lavoro', 'Padre Lavoro'))

    // Motivi non studio, corso formazione, lavoro attuale
    stats.push(...getTextStatsGiovani(data.flatMap((x:any)=>x.motivi_non_studio||[]), 'Motivi Non Studio', 'Motivi Non Studio'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.corso_formazione?.descrizione), 'Corso Formazione Descrizione', 'Corso Formazione Descrizione'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.lavoro_attuale?.descrizione), 'Lavoro Attuale Descrizione', 'Lavoro Attuale Descrizione'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.lavoro_attuale?.tipo_contratto), 'Lavoro Attuale Tipo Contratto', 'Lavoro Attuale Tipo Contratto'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.lavoro_attuale?.settore), 'Lavoro Attuale Settore', 'Lavoro Attuale Settore'))

    // Orientamento lavoro
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.orientamento_lavoro?.utilita), 'Orientamento Lavoro Utilità', 'Orientamento Lavoro Utilità'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.orientamento_lavoro?.dove?.altro_specificare), 'Orientamento Lavoro Dove Altro', 'Orientamento Lavoro Dove Altro'))

    // Ricerca lavoro altro specificare
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.ricerca_lavoro?.altro_specificare), 'Ricerca Lavoro Altro', 'Ricerca Lavoro Altro'))

    // Aspetti lavoro (numerici)
    if (data[0].aspetti_lavoro) {
      (['stabilita','flessibilita','valorizzazione','retribuzione','fatica','sicurezza','utilita_sociale','vicinanza_casa'] as const).forEach((f: any) => {
        stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.aspetti_lavoro?.[f]), `Aspetti Lavoro ${f}`, `Aspetti Lavoro - ${f}`))
      })
    }

    // Livelli utilità (C8.1-C8.4)
    if (data[0].livelli_utilita) {
      const livelliLabels = ['Studiare', 'Formazione', 'Lavorare', 'Ricerca Lavoro']
      livelliLabels.forEach((label, index) => {
        const count = data.filter(item => item.livelli_utilita?.[index] !== undefined && item.livelli_utilita?.[index] !== '').length
        if (count > 0) {
          stats.push({
            Domanda: `Livelli Utilità - ${label}`,
            Risposta: 'Valore presente',
            Frequenza: count,
            Percentuale: `${((count / total) * 100).toFixed(1)}%`
          })
        }
      })
    }

    // Canali ricerca lavoro (C9)
    if (data[0].ricerca_lavoro) {
      (['centro_impiego','sportelli','inps_patronati','servizi_sociali','agenzie_interinali','cooperative','struttura','conoscenti','portali_online','social','altro'] as const).forEach((f: any) => {
        const count = data.filter(item => item.ricerca_lavoro?.[f] === true).length
        stats.push({
          Domanda: `Canali Ricerca Lavoro - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Domanda: `Canali Ricerca Lavoro - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
      stats.push(...getTextStatsGiovani(data.map((x:any)=>x.ricerca_lavoro?.altro_specificare), 'Canali Ricerca Lavoro Altro', 'Canali Ricerca Lavoro Altro'))
    }

    // Curriculum vitae, centro impiego, lavoro autonomo (C10-C12)
    const cvCount = data.filter(item => item.curriculum_vitae === '1').length
    stats.push({
      Domanda: 'Curriculum Vitae',
      Risposta: 'Sì',
      Frequenza: cvCount,
      Percentuale: `${((cvCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Domanda: 'Curriculum Vitae',
      Risposta: 'No',
      Frequenza: total - cvCount,
      Percentuale: `${(((total - cvCount) / total) * 100).toFixed(1)}%`
    })

    const centroCount = data.filter(item => item.centro_impiego === '1').length
    stats.push({
      Domanda: 'Centro Impiego',
      Risposta: 'Sì',
      Frequenza: centroCount,
      Percentuale: `${((centroCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Domanda: 'Centro Impiego',
      Risposta: 'No',
      Frequenza: total - centroCount,
      Percentuale: `${(((total - centroCount) / total) * 100).toFixed(1)}%`
    })

    const autonomoCount = data.filter(item => item.lavoro_autonomo === '1').length
    stats.push({
      Domanda: 'Lavoro Autonomo',
      Risposta: 'Sì',
      Frequenza: autonomoCount,
      Percentuale: `${((autonomoCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Domanda: 'Lavoro Autonomo',
      Risposta: 'No',
      Frequenza: total - autonomoCount,
      Percentuale: `${(((total - autonomoCount) / total) * 100).toFixed(1)}%`
    })

    // Abitazione precedente
    if (data[0].abitazione_precedente) {
      (['solo','struttura','madre','padre','partner','figli','fratelli','nonni','altri_parenti','amici'] as const).forEach((f: any) => {
        const count = data.filter(item => item.abitazione_precedente?.[f] === true).length
        stats.push({
          Domanda: `Abitazione Precedente - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Domanda: `Abitazione Precedente - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
    }

    // Figura aiuto (D2)
    if (data[0].figura_aiuto) {
      (['padre','madre','fratelli','altri_parenti','amici','tutore','insegnanti','figure_sostegno','volontari','altri'] as const).forEach((f: any) => {
        const count = data.filter(item => item.figura_aiuto?.[f] === true).length
        stats.push({
          Domanda: `Figura Aiuto - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Domanda: `Figura Aiuto - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
      stats.push(...getTextStatsGiovani(data.map((x:any)=>x.figura_aiuto?.altri_specificare), 'Figura Aiuto Altri Spec', 'Figura Aiuto Altri Spec'))
    }

    // Emozioni uscita
    if (data[0].emozioni_uscita) {
      (['felicita','tristezza','curiosita','preoccupazione','paura','liberazione','solitudine','rabbia','speranza','determinazione'] as const).forEach((f: any) => {
        const count = data.filter(item => item.emozioni_uscita?.[f] === true).length
        stats.push({
          Domanda: `Emozioni Uscita - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Domanda: `Emozioni Uscita - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
    }

    // Pronto uscita, aiuto futuro, desiderio, nota aggiuntiva
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.pronto_uscita?.motivazione), 'Pronto Uscita Motivazione', 'Pronto Uscita Motivazione'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.aiuto_futuro), 'Aiuto Futuro', 'Aiuto Futuro'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.desiderio), 'Desiderio', 'Desiderio'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.nota_aggiuntiva), 'Nota Aggiuntiva', 'Nota Aggiuntiva'))

    // Preoccupazioni futuro (Sezione E1)
    if (data[0].preoccupazioni_futuro) {
      (['pregiudizi','mancanza_lavoro','mancanza_aiuto','mancanza_casa','solitudine','salute','perdita_persone'] as const).forEach((f: any) => {
        const count = data.filter(item => item.preoccupazioni_futuro?.[f] !== undefined && item.preoccupazioni_futuro?.[f] !== '').length
        if (count > 0) {
          stats.push({
            Domanda: `Preoccupazioni Futuro - ${f.replace(/_/g, ' ')}`,
            Risposta: 'Valore presente',
            Frequenza: count,
            Percentuale: `${((count / total) * 100).toFixed(1)}%`
          })
        }
      })
      stats.push(...getTextStatsGiovani(data.map((x:any)=>x.preoccupazioni_futuro?.altro_specificare), 'Preoccupazioni Futuro Altro', 'Preoccupazioni Futuro Altro'))
    }

    // Obiettivi realizzabili (Sezione E2)
    if (data[0].obiettivi_realizzabili) {
      (['lavoro_piacevole','autonomia','famiglia','trovare_lavoro','salute','casa'] as const).forEach((f: any) => {
        const count = data.filter(item => item.obiettivi_realizzabili?.[f] !== undefined && item.obiettivi_realizzabili?.[f] !== '').length
        if (count > 0) {
          stats.push({
            Domanda: `Obiettivi Realizzabili - ${f.replace(/_/g, ' ')}`,
            Risposta: 'Valore presente',
            Frequenza: count,
            Percentuale: `${((count / total) * 100).toFixed(1)}%`
          })
        }
      })
    }

    // Aggiungo le statistiche già esistenti (domande chiuse)
    stats.push(...generateGiovaniStats_OLD(data))

    return stats
  }

  // Copia la vecchia funzione per le domande chiuse
  function generateGiovaniStats_OLD(data: any[]): Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    if (data.length === 0) return []
    
    const stats: Array<{Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> = []
    const total = data.length

    // Percorso autonomia
    const percAut = data.filter(item => item.percorso_autonomia === true).length
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

    // Tipo percorso
    const tipoPercorso = data.reduce((acc, item) => {
      acc[item.tipo_percorso || 'Non specificato'] = (acc[item.tipo_percorso || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(tipoPercorso).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Tipo Percorso',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Vive in struttura
    const viveStruttura = data.filter(item => item.vive_in_struttura === true).length
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

    // Collocazione attuale
    const collocazioneAttuale = data.reduce((acc, item) => {
      acc[item.collocazione_attuale || 'Non specificato'] = (acc[item.collocazione_attuale || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(collocazioneAttuale).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Collocazione Attuale',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
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

    // Luogo nascita
    const luogoNascita = data.reduce((acc, item) => {
      acc[item.luogo_nascita || 'Non specificato'] = (acc[item.luogo_nascita || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(luogoNascita).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Luogo Nascita',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Cittadinanza
    const cittadinanza = data.reduce((acc, item) => {
      acc[item.cittadinanza || 'Non specificato'] = (acc[item.cittadinanza || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(cittadinanza).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Cittadinanza',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Permesso soggiorno
    const permessoSoggiorno = data.reduce((acc, item) => {
      acc[item.permesso_soggiorno || 'Non specificato'] = (acc[item.permesso_soggiorno || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(permessoSoggiorno).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Permesso Soggiorno',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Titolo studio
    const titoloStudio = data.reduce((acc, item) => {
      acc[item.titolo_studio || 'Non specificato'] = (acc[item.titolo_studio || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(titoloStudio).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Titolo Studio',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Tempo in struttura
    const tempoStruttura = data.reduce((acc, item) => {
      acc[item.tempo_in_struttura || 'Non specificato'] = (acc[item.tempo_in_struttura || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(tempoStruttura).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Tempo in Struttura',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Precedenti strutture
    const precedentiStrutture = data.reduce((acc, item) => {
      acc[item.precedenti_strutture || 'Non specificato'] = (acc[item.precedenti_strutture || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(precedentiStrutture).forEach(([key, value]) => {
      stats.push({
        Domanda: 'Precedenti Strutture',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Fattori vulnerabilità
    const fattoriVuln = ['stranieri', 'vittime_tratta', 'vittime_violenza', 'allontanati_famiglia', 'detenuti', 'ex_detenuti', 'misura_alternativa', 'senza_dimora', 'rom_sinti', 'disabilita_fisica', 'disabilita_cognitiva', 'disturbi_psichiatrici', 'dipendenze', 'genitori_precoci', 'orientamento_sessuale']
    
    fattoriVuln.forEach(fattore => {
      const count = data.filter(item => {
        if (Array.isArray(item.fattori_vulnerabilita)) {
          return item.fattori_vulnerabilita.includes(fattore)
        } else if (typeof item.fattori_vulnerabilita === 'object' && item.fattori_vulnerabilita !== null) {
          return item.fattori_vulnerabilita[`fv${fattoriVuln.indexOf(fattore) + 1}_${fattore}`] === true
        }
        return false
      }).length
      
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

    // Famiglia origine
    const famigliaOrigine = ['padre', 'madre', 'fratelli_sorelle', 'nonni', 'altri_parenti', 'altri_conviventi']
    
    famigliaOrigine.forEach(membro => {
      const count = data.filter(item => {
        if (Array.isArray(item.famiglia_origine)) {
          return item.famiglia_origine.includes(membro)
        } else if (typeof item.famiglia_origine === 'object' && item.famiglia_origine !== null) {
          return item.famiglia_origine[membro] === true
        }
        return false
      }).length
      
      stats.push({
        Domanda: `Famiglia Origine - ${membro.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Domanda: `Famiglia Origine - ${membro.replace(/_/g, ' ')}`,
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