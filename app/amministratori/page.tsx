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
      // Recupera tutti i dati (esclusi quelli cancellati se hanno campo stato)
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
      const struttureSheet = XLSX.utils.json_to_sheet(struttureStats, {
        header: ['Codice', 'Domanda', 'Risposta', 'Frequenza', 'Percentuale']
      })
      XLSX.utils.book_append_sheet(workbook, struttureSheet, "Strutture")

      // Statistiche Questionari Operatori
      const operatoriStats = generateOperatoriStats(operatori)
      const operatoriSheet = XLSX.utils.json_to_sheet(operatoriStats, {
        header: ['Codice', 'Domanda', 'Risposta', 'Frequenza', 'Percentuale']
      })
      XLSX.utils.book_append_sheet(workbook, operatoriSheet, "Operatori")

      // Statistiche Questionari Giovani
      const giovaniStats = generateGiovaniStats(giovani)
      const giovaniSheet = XLSX.utils.json_to_sheet(giovaniStats, {
        header: ['Codice', 'Domanda', 'Risposta', 'Frequenza', 'Percentuale']
      })
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

  // Tipo per le statistiche con codice
  type StatRow = {Codice?: string, Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}

  // Utility per statistiche numeriche
  function getNumericStatsStrutture(arr: number[], label: string, domanda: string, codice: string, totalQuestionari?: number): Array<StatRow> {
    const valid = arr.filter((x: number) => typeof x === 'number' && !isNaN(x) && x !== null && x !== undefined)
    if (valid.length === 0) return []
    // Usa il totale dei questionari ricevuti, non solo i valori validi
    const total = totalQuestionari || arr.length
    
    // Raggruppa per valore per mostrare la distribuzione
    const valueCounts = valid.reduce((acc: Record<number, number>, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})
    
    const results: Array<StatRow> = []
    
    Object.entries(valueCounts).forEach(([value, count]) => {
      results.push({
        Codice: codice,
        Domanda: domanda,
        Risposta: `${label}: ${value}`,
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
    })
    
    return results
  }

  // Utility per testo libero
  function getTextStatsStruttureCustom(arr: string[], label: string, domanda: string, codice: string, totalQuestionari?: number): Array<StatRow> {
    const valid = arr.filter((x: string) => typeof x === 'string' && x.trim() !== '')
    if (valid.length === 0) return []
    // Usa il totale dei questionari ricevuti, non solo i valori validi
    const total = totalQuestionari || arr.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Codice: codice,
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq,
      Percentuale: `${((freq / total) * 100).toFixed(1)}%`
    }))
  }

  function generateStruttureStats(data: any[]): Array<StatRow> {
    if (data.length === 0) return [{ Codice: '', Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    const stats: Array<StatRow> = []
    const total = data.length

    // Campi base
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.nome_struttura), 'Nome Struttura', 'Nome Struttura', '-', total))
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura', 'ID_QUEST', total))
    stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.anno_inizio), 'Anno Inizio', 'Anno Inizio', 'ANNO_INIZIO', total))
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.missione), 'Missione', 'Missione', 'MISSION', total))
    
    // Tipo struttura (aggregato)
    const tipoStruttura = data.reduce((acc, item) => {
      acc[item.tipo_struttura || 'Non specificato'] = (acc[item.tipo_struttura || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    Object.entries(tipoStruttura).forEach(([key, value]) => {
      stats.push({
        Codice: 'TIPO_STRUTTURA',
        Domanda: 'Tipo Struttura',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })
    
    // Forma giuridica (aggregato)
    const formaGiuridica = data.reduce((acc, item) => {
      acc[item.forma_giuridica || 'Non specificato'] = (acc[item.forma_giuridica || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    Object.entries(formaGiuridica).forEach(([key, value]) => {
      stats.push({
        Codice: 'FORMAGIU',
        Domanda: 'Forma Giuridica',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Forma giuridica altro
    const formaGiuridicaAltro = data.map((x:any)=>x.forma_giuridica_altro).filter(val => val && val.trim() !== '')
    if (formaGiuridicaAltro.length > 0) {
      const formaGiuridicaAltroStats = getTextStatsStruttureCustom(formaGiuridicaAltro, 'Forma Giuridica Altro', 'Forma Giuridica Altro', 'FORMAGIU_SPEC', total)
    for (const stat of formaGiuridicaAltroStats) {
      stats.push(stat)
      }
    }
    
    // Figure professionali
    const figureProf = [
      { nome: 'Psicologi', cod: 'B3.1' },
      { nome: 'Assistenti sociali', cod: 'B3.2' },
      { nome: 'Educatori', cod: 'B3.3' },
      { nome: 'Mediatori', cod: 'B3.4' },
      { nome: 'Medici', cod: 'B3.5' },
      { nome: 'Personale infermieristico/operatori sanitari', cod: 'B3.6' },
      { nome: 'Insegnanti/formatori', cod: 'B3.7' },
      { nome: 'Cappellano/operatori religiosi e spirituali', cod: 'B3.8' },
      { nome: 'Tutor', cod: 'B3.9' },
      { nome: 'Operatore legale', cod: 'B3.10' },
      { nome: 'Operatore multifunzionale', cod: 'B3.11' },
      { nome: 'Amministrativo', cod: 'B3.12' },
      { nome: 'Altro', cod: 'B3.13' }
    ]
    figureProf.forEach(({ nome, cod }) => {
      const count = data.filter(item => {
        if (Array.isArray(item.figure_professionali)) {
          return item.figure_professionali.includes(nome)
        } else if (typeof item.figure_professionali === 'object' && item.figure_professionali !== null) {
          return item.figure_professionali[nome.toLowerCase().replace(/[^a-z]/g, '_')] === true
        }
        return false
      }).length
      stats.push({
        Codice: cod,
        Domanda: `Figure Professionali - ${nome}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: cod,
        Domanda: `Figure Professionali - ${nome}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Personale retribuito/volontario
    const personaleKeysLabels: Record<string, string> = {
      'personale_retribuito': 'Personale Retribuito',
      'personale_volontario': 'Personale Volontario'
    }
    const personaleSubKeysLabels: Record<string, Record<string, string>> = {
      'personale_retribuito': {
        'uomini': 'B1U',
        'donne': 'B1D',
        'totale': 'B1T'
      },
      'personale_volontario': {
        'uomini': 'B2U',
        'donne': 'B2D',
        'totale': 'B2T'
      }
    }
    const personaleKeys = ['personale_retribuito','personale_volontario'] as const
    const personaleSubKeys = ['uomini','donne','totale'] as const
    
    for (const key of personaleKeys) {
      for (const sub of personaleSubKeys) {
        if (data[0][key] && data[0][key][sub] !== undefined) {
          const labelChiara = `${personaleKeysLabels[key]} - ${sub.charAt(0).toUpperCase() + sub.slice(1)}`
          const codice = personaleSubKeysLabels[key][sub]
          stats.push(...getNumericStatsStrutture(data.map((x:any)=>x[key]?.[sub]), labelChiara, labelChiara, codice, total))
        }
      }
    }

    // Persone ospitate/non ospitate
    const personeKeysLabels: Record<string, string> = {
      'persone_ospitate': 'Persone Ospitate',
      'persone_non_ospitate': 'Persone Non Ospitate'
    }
    // Mapping codici esatti per persone
    const personeCodici: Record<string, Record<string, Record<string, string>>> = {
      'persone_ospitate': {
        'fino_16': { 'uomini': 'C1A.U', 'donne': 'C1A.D', 'totale': 'C1A.T' },
        'da_16_a_18': { 'uomini': 'C1B.U', 'donne': 'C1B.D', 'totale': 'C1B.T' },
        'maggiorenni': { 'uomini': 'C1C.U', 'donne': 'C1C.D', 'totale': 'C1C.T' },
        'totale': { 'uomini': 'C1.T.U', 'donne': 'C1T.D', 'totale': 'C1T.T' }
      },
      'persone_non_ospitate': {
        'fino_16': { 'uomini': 'C3A.U', 'donne': 'C3A.D', 'totale': 'C3A.T' },
        'da_16_a_18': { 'uomini': 'C3B.U', 'donne': 'C3B.D', 'totale': 'C3B.T' },
        'maggiorenni': { 'uomini': 'C3C.U', 'donne': 'C3C.D', 'totale': 'C3C.T' },
        'totale': { 'uomini': 'C3.T.U', 'donne': 'C3T.D', 'totale': 'C3T.T' }
      }
    }
    const personeKeys = ['persone_ospitate','persone_non_ospitate'] as const
    const personeGruppi = ['fino_16','da_16_a_18','maggiorenni','totale'] as const
    const personeSubKeys = ['uomini','donne','totale'] as const
    
    for (const key of personeKeys) {
      for (const gruppo of personeGruppi) {
        for (const sub of personeSubKeys) {
          if (data[0][key] && data[0][key][gruppo] && data[0][key][gruppo][sub] !== undefined) {
            const labelChiara = `${personeKeysLabels[key]} - ${gruppo} - ${sub}`
            const codice = personeCodici[key][gruppo][sub]
            stats.push(...getNumericStatsStrutture(data.map((x:any)=>x[key]?.[gruppo]?.[sub]), labelChiara, labelChiara, codice, total))
          }
        }
      }
    }

    // Caratteristiche altro
    const caratteristicheOspitiAltro = data.map((x:any)=>x.caratteristiche_ospiti_altro).filter(val => val && val.trim() !== '')
    if (caratteristicheOspitiAltro.length > 0) {
      stats.push(...getTextStatsStruttureCustom(caratteristicheOspitiAltro, 'Caratt. Ospiti Altro', 'Caratteristiche Ospiti Altro', 'C2.16A_SPEC', total))
    }
    
    const caratteristicheNonOspitiAltro = data.map((x:any)=>x.caratteristiche_non_ospiti_altro).filter(val => val && val.trim() !== '')
    if (caratteristicheNonOspitiAltro.length > 0) {
      stats.push(...getTextStatsStruttureCustom(caratteristicheNonOspitiAltro, 'Caratt. Non Ospiti Altro', 'Caratteristiche Non Ospiti Altro', 'C2.16C_SPEC', total))
    }

    // Attività inserimento (D3): array di oggetti con nome, periodo, contenuto, destinatari, attori, punti_forza, criticita
    const attivitaInserimentoNomi = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.nome) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoNomi.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoNomi, 'Attività Inserimento Nome (D3.x NOM)', 'Attività Inserimento Nome', 'D3', total))
    }
    const attivitaInserimentoPeriodo = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.periodo) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoPeriodo.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoPeriodo, 'Attività Inserimento Periodo (D3.x PER)', 'Attività Inserimento Periodo', 'D3', total))
    }
    const attivitaInserimentoContenuto = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.contenuto) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoContenuto.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoContenuto, 'Attività Inserimento Contenuto (D3.x CONT)', 'Attività Inserimento Contenuto', 'D3', total))
    }
    const attivitaInserimentoDestinatari = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.destinatari) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoDestinatari.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoDestinatari, 'Attività Inserimento Destinatari (D3.x DEST)', 'Attività Inserimento Destinatari', 'D3', total))
    }
    const attivitaInserimentoAttori = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.attori) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoAttori.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoAttori, 'Attività Inserimento Attori (D3.x ATT)', 'Attività Inserimento Attori', 'D3', total))
    }
    const attivitaInserimentoPuntiForza = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.punti_forza) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoPuntiForza.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoPuntiForza, 'Attività Inserimento Punti Forza (D3.x PFOR)', 'Attività Inserimento Punti Forza', 'D3', total))
    }
    const attivitaInserimentoCriticita = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.criticita) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoCriticita.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoCriticita, 'Attività Inserimento Criticità (D3.x CRIT)', 'Attività Inserimento Criticità', 'D3', total))
    }
    
    // Nuove attività
    stats.push(...getTextStatsStruttureCustom(data.flatMap((x:any)=>x.nuove_attivita||[]), 'Nuove Attività', 'Nuove Attività', 'D4', total))
    
    // Collaborazioni (E1): array di oggetti con soggetto, tipo, oggetto
    const collaborazioniSoggetto = data.flatMap((x:any)=>x.collaborazioni?.map((c:any)=>c.soggetto) || []).filter(v => v && v.trim() !== '')
    if (collaborazioniSoggetto.length > 0) {
      stats.push(...getTextStatsStruttureCustom(collaborazioniSoggetto, 'Collaborazioni Soggetto (E1.x SOGG)', 'Collaborazioni Soggetto', 'E1', total))
    }
    const collaborazioniTipo = data.flatMap((x:any)=>x.collaborazioni?.map((c:any)=>c.tipo) || []).filter(v => v !== undefined && v !== null && v !== '')
    if (collaborazioniTipo.length > 0) {
      stats.push(...getNumericStatsStrutture(collaborazioniTipo, 'Collaborazioni Tipo (E1.x TIPO)', 'Collaborazioni Tipo', 'E1', total))
    }
    const collaborazioniOggetto = data.flatMap((x:any)=>x.collaborazioni?.map((c:any)=>c.oggetto) || []).filter(v => v && v.trim() !== '')
    if (collaborazioniOggetto.length > 0) {
      stats.push(...getTextStatsStruttureCustom(collaborazioniOggetto, 'Collaborazioni Oggetto (E1.x OGGETTO)', 'Collaborazioni Oggetto', 'E1', total))
    }

    // Punti forza, critica network (E2, E3)
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.punti_forza_network), 'Punti Forza Network (E2)', 'Punti Forza Network', 'E2', total))
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.critica_network), 'Critica Network (E3)', 'Critica Network', 'E3', total))

    // Finanziamenti
    if (data[0].finanziamenti) {
      const finanziamentiKeys = ['fondi_pubblici','fondi_privati','totale'] as const
      for (const f of finanziamentiKeys) {
        stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.finanziamenti?.[f]), `Finanziamenti ${f}`, `Finanziamenti - ${f}`, 'F', total))
      }
      stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.finanziamenti?.fondi_pubblici_specifiche), 'Fondi Pubblici Specifiche', 'Fondi Pubblici Specifiche', 'F', total))
      stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.finanziamenti?.fondi_privati_specifiche), 'Fondi Privati Specifiche', 'Fondi Privati Specifiche', 'F', total))
      stats.push(...getTextStatsStruttureCustom(data.flatMap((x:any)=>x.finanziamenti?.fornitori||[]), 'Fornitori', 'Fornitori', 'F', total))
    }

    // Mapping valori form -> valori standard per caratteristiche adolescenti
    const mappingAdolescenti: Record<string, string[]> = {
      'Stranieri con problemi legati alla condizione migratoria': ['MSNA', 'Minori stranieri accompagnati'],
      'Vittime di tratta': ['Minori vittime di tratta'],
      'Detenuti': ['Minori con problemi di giustizia']
    };

    // Mapping valori form -> valori standard per caratteristiche giovani
    const mappingGiovani: Record<string, string[]> = {
      'Stranieri con problemi legati alla condizione migratoria': ['Giovani stranieri'],
      'Vittime di tratta': ['Giovani vittime di tratta'],
      'Detenuti': ['Giovani con problemi di giustizia']
    };

    // Funzione helper per verificare se un array contiene un valore standard O un valore form che mappa a quel valore
    const hasCaratteristica = (arr: string[] | undefined, valoreStandard: string, valoriForm: string[]) => {
      if (!arr || !Array.isArray(arr)) return false;
      // Verifica se contiene il valore standard
      if (arr.includes(valoreStandard)) return true;
      // Verifica se contiene uno dei valori form che mappano a quel valore standard
      return valoriForm.some(val => arr.includes(val));
    };

    // Persone ospitate - caratteristiche (adolescenti)
    const caratteristicheOspitiAdolescenti = [
      "Stranieri con problemi legati alla condizione migratoria",
      "Vittime di tratta",
      "Vittime di violenza domestica",
      "Persone allontanate dalla famiglia",
      "Detenuti",
      "Ex detenuti",
      "Persone in esecuzione penale esterna",
      "Indigenti e/o senza dimora",
      "Rom e Sinti",
      "Persone con disabilità fisica",
      "Persone con disabilità cognitiva",
      "Persone con disturbi psichiatrici",
      "Persone con dipendenze",
      "Genitori precoci",
      "Persone con problemi legati all'orientamento sessuale",
      "Altro"
    ]
    
    // Persone ospitate - caratteristiche (giovani)
    const caratteristicheOspitiGiovani = [
      "Stranieri con problemi legati alla condizione migratoria",
      "Vittime di tratta",
      "Vittime di violenza domestica",
      "Persone allontanate dalla famiglia",
      "Detenuti",
      "Ex detenuti",
      "Persone in esecuzione penale esterna",
      "Indigenti e/o senza dimora",
      "Rom e Sinti",
      "Persone con disabilità fisica",
      "Persone con disabilità cognitiva",
      "Persone con disturbi psichiatrici",
      "Persone con dipendenze",
      "Genitori precoci",
      "Persone con problemi legati all'orientamento sessuale",
      "Altro"
    ]
    
    // Caratteristiche ospiti adolescenti - solo valori standard
    caratteristicheOspitiAdolescenti.forEach((car, idx) => {
      const count = data.filter(item => {
        const ospitiAdolescenti = Array.isArray(item.caratteristiche_ospiti_adolescenti) ? item.caratteristiche_ospiti_adolescenti : []
        return hasCaratteristica(ospitiAdolescenti, car, mappingAdolescenti[car] || [])
      }).length
      
      const codice = `C2.${idx + 1}A`
      stats.push({
        Codice: codice,
        Domanda: `C4 Caratteristiche Ospiti Adolescenti - ${car}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `C4 Caratteristiche Ospiti Adolescenti - ${car}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })
    
    // Caratteristiche ospiti giovani - solo valori standard
    caratteristicheOspitiGiovani.forEach((car, idx) => {
      const count = data.filter(item => {
        const ospitiGiovani = Array.isArray(item.caratteristiche_ospiti_giovani) ? item.caratteristiche_ospiti_giovani : []
        return hasCaratteristica(ospitiGiovani, car, mappingGiovani[car] || [])
      }).length
      
      const codice = `C2.${idx + 1}B`
      stats.push({
        Codice: codice,
        Domanda: `C5 Caratteristiche Ospiti Giovani - ${car}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `C5 Caratteristiche Ospiti Giovani - ${car}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Caratteristiche non ospiti adolescenti - solo valori standard
    caratteristicheOspitiAdolescenti.forEach((car, idx) => {
      const count = data.filter(item => {
        const nonOspitiAdolescenti = Array.isArray(item.caratteristiche_non_ospiti_adolescenti) ? item.caratteristiche_non_ospiti_adolescenti : []
        return hasCaratteristica(nonOspitiAdolescenti, car, mappingAdolescenti[car] || [])
      }).length
      
      const codice = `C4.${idx + 1}A`
      stats.push({
        Codice: codice,
        Domanda: `C6 Caratteristiche Non Ospiti Adolescenti - ${car}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `C6 Caratteristiche Non Ospiti Adolescenti - ${car}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })
    
    // Caratteristiche non ospiti giovani - solo valori standard
    caratteristicheOspitiGiovani.forEach((car, idx) => {
      const count = data.filter(item => {
        const nonOspitiGiovani = Array.isArray(item.caratteristiche_non_ospiti_giovani) ? item.caratteristiche_non_ospiti_giovani : []
        return hasCaratteristica(nonOspitiGiovani, car, mappingGiovani[car] || [])
      }).length
      
      const codice = `C4.${idx + 1}B`
      stats.push({
        Codice: codice,
        Domanda: `C6 Caratteristiche Non Ospiti Giovani - ${car}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `C6 Caratteristiche Non Ospiti Giovani - ${car}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Attività servizi
    const attivitaServizi = ['alloggio', 'vitto', 'servizi_bassa_soglia', 'ospitalita_diurna', 'supporto_psicologico', 'sostegno_autonomia', 'orientamento_lavoro', 'orientamento_formazione', 'istruzione', 'formazione_professionale', 'attivita_socializzazione', 'altro']
    
    attivitaServizi.forEach((servizio, idx) => {
      const count = data.filter(item => {
        const servizioData = item.attivita_servizi?.[servizio]
        // Gestisce entrambi i casi: oggetto {attivo: boolean} o valore booleano diretto
        if (typeof servizioData === 'boolean') {
          return servizioData === true
        } else if (typeof servizioData === 'object' && servizioData !== null) {
          return servizioData.attivo === true
        }
        return false
      }).length
      
      const codice = `D1.${idx + 1}`
      stats.push({
        Codice: codice,
        Domanda: `Attività Servizi - ${servizio.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Attività Servizi - ${servizio.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Esperienze inserimento lavorativo
    const esperienzeLavoro = data.filter(item => item.esperienze_inserimento_lavorativo === true).length
    stats.push({
      Codice: 'D2',
      Domanda: 'Esperienze Inserimento Lavorativo',
      Risposta: 'Sì',
      Frequenza: esperienzeLavoro,
      Percentuale: `${((esperienzeLavoro / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'D2',
      Domanda: 'Esperienze Inserimento Lavorativo',
      Risposta: 'No',
      Frequenza: total - esperienzeLavoro,
      Percentuale: `${(((total - esperienzeLavoro) / total) * 100).toFixed(1)}%`
    })

    return stats
  }

  // Utility per statistiche numeriche operatori
  function getNumericStatsOperatori(arr: number[], label: string, domanda: string, codice: string = ''): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    const valid = arr.filter((x: number) => typeof x === 'number' && !isNaN(x) && x !== null && x !== undefined)
    if (valid.length === 0) return []
    const total = arr.length
    
    // Raggruppa per valore per mostrare la distribuzione
    const valueCounts = valid.reduce((acc: Record<number, number>, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})
    
    const results: Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> = []
    
    Object.entries(valueCounts).forEach(([value, count]) => {
      results.push({
        Codice: codice,
        Domanda: domanda,
        Risposta: `${label}: ${value}`,
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
    })
    
    return results
  }

  // Utility per testo libero operatori
  function getTextStatsOperatori(arr: string[], label: string, domanda: string, codice: string = ''): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    const valid = arr.filter((x: string) => typeof x === 'string' && x.trim() !== '')
    if (valid.length === 0) return []
    const total = arr.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Codice: codice,
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq,
      Percentuale: `${((freq / total) * 100).toFixed(1)}%`
    }))
  }

  function generateOperatoriStats(data: any[]): Array<StatRow> {
    if (data.length === 0) return [{ Codice: '', Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    
    const stats: Array<StatRow> = []
    const total = data.length

    // Campi base
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura', 'ID_QUEST')) {
      stats.push(stat)
    }
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.tipo_struttura), 'Tipo Struttura', 'Tipo Struttura', 'TIPO_STRUTTURA')) {
      stats.push(stat)
    }
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.professione?.altro_specificare), 'Professione Altro', 'Professione Altro', 'PROF_SPEC')) {
      stats.push(stat)
    }

    // Persone seguite (numerici)
    const personaleLabels = {
      'persone_seguite': 'Persone Seguite',
      'persone_maggiorenni': 'Persone Maggiorenni'
    }
    const personaleCodici = {
      'persone_seguite': { 'uomini': 'B1U', 'donne': 'B1D', 'totale': 'B1T' },
      'persone_maggiorenni': { 'uomini': 'B2U', 'donne': 'B2D', 'totale': 'B2T' }
    };
    
    (['persone_seguite','persone_maggiorenni'] as const).forEach((key: 'persone_seguite'|'persone_maggiorenni') => {
      (['uomini','donne','totale'] as const).forEach((sub: 'uomini'|'donne'|'totale') => {
        if (data[0][key] && data[0][key][sub] !== undefined) {
          const labelChiara = `${personaleLabels[key]} - ${sub.charAt(0).toUpperCase() + sub.slice(1)}`
          const codice = personaleCodici[key][sub]
          stats.push(...getNumericStatsOperatori(data.map((x:any)=>x[key]?.[sub]), labelChiara, labelChiara, codice))
        }
      })
    })

    // Caratteristiche altro specificare
    const caratteristicheAltro = data.map((x:any)=>x.caratteristiche_persone?.altro_specificare).filter(val => val && val.trim() !== '')
    if (caratteristicheAltro.length > 0) {
      stats.push(...getTextStatsOperatori(caratteristicheAltro, 'Caratteristiche Altro', 'Caratteristiche Altro', 'B3_16SPEC'))
    }

    // Tipo intervento altro specificare
    const tipoInterventoAltro = data.map((x:any)=>x.tipo_intervento?.altro_specificare).filter(val => val && val.trim() !== '')
    if (tipoInterventoAltro.length > 0) {
      stats.push(...getTextStatsOperatori(tipoInterventoAltro, 'Tipo Intervento Altro', 'Tipo Intervento Altro', 'B4_10SPEC'))
    }

    // Interventi potenziare altro specificare
    const interventiPotenziareAltro = data.map((x:any)=>x.interventi_potenziare?.altro_specificare).filter(val => val && val.trim() !== '')
    if (interventiPotenziareAltro.length > 0) {
      stats.push(...getTextStatsOperatori(interventiPotenziareAltro, 'Interventi Potenziare Altro', 'Interventi Potenziare Altro', 'B5_11SPEC'))
    }

    // Professione (aggregato)
    const professione = data.reduce((acc, item) => {
      acc[item.professione?.tipo || 'Non specificato'] = (acc[item.professione?.tipo || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(professione).forEach(([key, value]) => {
      stats.push({
        Codice: 'PROF',
        Domanda: 'Professione',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Caratteristiche persone seguite
    const caratteristiche = ['stranieri_migranti', 'vittime_tratta', 'vittime_violenza', 'allontanati_famiglia', 'detenuti', 'ex_detenuti', 'misure_alternative', 'indigenti_senzatetto', 'rom_sinti', 'disabilita_fisica', 'disabilita_cognitiva', 'disturbi_psichiatrici', 'dipendenze', 'genitori_precoci', 'problemi_orientamento']
    
    caratteristiche.forEach((car, idx) => {
      const count = data.filter(item => {
        if (typeof item.caratteristiche_persone === 'object' && item.caratteristiche_persone !== null) {
          return item.caratteristiche_persone[car] === true
        }
        return false
      }).length
      
      const codice = `B3_${idx + 1}`
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche - ${car.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche - ${car.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Tipo interventi
    const tipoInterventi = ['sostegno_formazione', 'sostegno_lavoro', 'sostegno_abitativo', 'sostegno_famiglia', 'sostegno_coetanei', 'sostegno_competenze', 'sostegno_legale', 'sostegno_sociosanitario', 'mediazione_interculturale']
    
    tipoInterventi.forEach((intervento, idx) => {
      const count = data.filter(item => {
        if (typeof item.tipo_intervento === 'object' && item.tipo_intervento !== null) {
          return item.tipo_intervento[intervento] === true
        }
        return false
      }).length
      
      const codice = `B4_${idx + 1}`
      stats.push({
        Codice: codice,
        Domanda: `Tipo Intervento - ${intervento.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Tipo Intervento - ${intervento.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Interventi da potenziare
    const interventiPotenziare = ['sostegno_formazione', 'sostegno_lavoro', 'sostegno_abitativo', 'sostegno_famiglia', 'sostegno_coetanei', 'sostegno_competenze', 'sostegno_legale', 'sostegno_sociosanitario', 'mediazione_interculturale', 'nessuno', 'altro']
    
    interventiPotenziare.forEach((intervento, idx) => {
      const count = data.filter(item => {
        return item.interventi_potenziare?.[intervento] === true
      }).length
      
      const codice = `B5_${idx + 1}`
      stats.push({
        Codice: codice,
        Domanda: `Interventi da Potenziare - ${intervento.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Interventi da Potenziare - ${intervento.replace(/_/g, ' ')}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Difficoltà uscita (numerici da 1 a 10)
    if (data[0].difficolta_uscita) {
      const difficoltaKeys = ['problemi_economici','trovare_lavoro','lavori_qualita','trovare_casa','discriminazioni','salute_fisica','problemi_psicologici','difficolta_linguistiche','altro']
      difficoltaKeys.forEach((f: any, idx) => {
        const values = data.map((x:any)=>x.difficolta_uscita?.[f]).filter(val => val !== undefined && val !== null && val !== '')
        
        if (values.length > 0) {
          const codice = `C${idx + 1}`
          // Raggruppa per grado di difficoltà (1-10)
          const valueCounts = values.reduce((acc: Record<number, number>, val) => {
            acc[val] = (acc[val] || 0) + 1
            return acc
          }, {})
          
          Object.entries(valueCounts).forEach(([grado, count]) => {
            stats.push({
              Codice: codice,
              Domanda: `Difficoltà Uscita - ${f.replace(/_/g, ' ')}`,
              Risposta: `Grado ${grado}`,
              Frequenza: count,
              Percentuale: `${((count / data.length) * 100).toFixed(1)}%`
            })
          })
        }
      })
      const difficoltaAltro = data.map((x:any)=>x.difficolta_uscita?.altro_specificare).filter(val => val && val.trim() !== '')
      if (difficoltaAltro.length > 0) {
        stats.push(...getTextStatsOperatori(difficoltaAltro, 'Difficoltà Uscita Altro', 'Difficoltà Uscita Altro', 'C9SPEC'))
      }
    }

    return stats
  }

  // Utility per statistiche numeriche giovani
  function getNumericStatsGiovani(arr: number[], label: string, domanda: string, codice: string = ''): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    const valid = arr.filter((x: number) => typeof x === 'number' && !isNaN(x) && x !== null && x !== undefined)
    if (valid.length === 0) return []
    const total = arr.length
    
    // Raggruppa per valore per mostrare la distribuzione
    const valueCounts = valid.reduce((acc: Record<number, number>, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})
    
    const results: Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> = []
    
    Object.entries(valueCounts).forEach(([value, count]) => {
      results.push({
        Codice: codice,
        Domanda: domanda,
        Risposta: `${label}: ${value}`,
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
    })
    
    return results
  }

  // Utility per testo libero giovani
  function getTextStatsGiovani(arr: string[], label: string, domanda: string, codice: string = ''): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    const valid = arr.filter((x: string) => typeof x === 'string' && x.trim() !== '')
    if (valid.length === 0) return []
    const total = arr.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Codice: codice,
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq,
      Percentuale: `${((freq / total) * 100).toFixed(1)}%`
    }))
  }

  function generateGiovaniStats(data: any[]): Array<StatRow> {
    if (data.length === 0) return [{ Codice: '', Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    
    const stats: Array<StatRow> = []
    const total = data.length

    // Campi base
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura', 'ID_QUEST'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.tipo_struttura), 'Tipo Struttura', 'Tipo Struttura', 'FONTE'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.tipo_percorso), 'Tipo Percorso', 'Tipo Percorso', 'PERCAUT_SPEC'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.collocazione_attuale_spec), 'Collocazione Attuale Spec', 'Collocazione Attuale Spec', 'CONDATT_SPEC'))

    // Luogo nascita
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.luogo_nascita?.altro_paese), 'Luogo Nascita Altro Paese', 'Luogo Nascita Altro Paese', 'B3SPEC'))

    // Madre e Padre
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.madre?.titolo_studio), 'Madre Titolo Studio', 'Madre Titolo Studio', 'B9'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.madre?.situazione), 'Madre Situazione', 'Madre Situazione', 'B10'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.padre?.titolo_studio), 'Padre Titolo Studio', 'Padre Titolo Studio', 'B11'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.padre?.situazione), 'Padre Situazione', 'Padre Situazione', 'B12'))

    // Motivi non studio, corso formazione, lavoro attuale
    const motiviNonStudio = data.flatMap((x:any)=>x.motivi_non_studio||[])
    if (motiviNonStudio.length > 0) {
      stats.push(...getTextStatsGiovani(motiviNonStudio, 'Motivi Non Studio', 'Motivi Non Studio', 'C6'))
    }
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.corso_formazione?.descrizione), 'Corso Formazione Descrizione', 'Corso Formazione Descrizione', 'C7'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.lavoro_attuale?.descrizione), 'Lavoro Attuale Descrizione', 'Lavoro Attuale Descrizione', 'C8'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.lavoro_attuale?.tipo_contratto), 'Lavoro Attuale Tipo Contratto', 'Lavoro Attuale Tipo Contratto', 'C8'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.lavoro_attuale?.settore), 'Lavoro Attuale Settore', 'Lavoro Attuale Settore', 'C8'))

    // Orientamento lavoro
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.orientamento_lavoro?.utilita), 'Orientamento Lavoro Utilità', 'Orientamento Lavoro Utilità', 'C4_BIS'))
    
    const orientamentoLavoroDoveAltro = data.map((x:any)=>x.orientamento_lavoro?.dove?.altro_specificare)
    if (orientamentoLavoroDoveAltro.some(val => val && val.trim() !== '')) {
      stats.push(...getTextStatsGiovani(orientamentoLavoroDoveAltro, 'Orientamento Lavoro Dove Altro', 'Orientamento Lavoro Dove Altro', 'C4.5SPEC'))
    }

    // Ricerca lavoro altro specificare
    const ricercaLavoroAltro = data.map((x:any)=>x.ricerca_lavoro?.altro_specificare)
    if (ricercaLavoroAltro.some(val => val && val.trim() !== '')) {
      stats.push(...getTextStatsGiovani(ricercaLavoroAltro, 'Ricerca Lavoro Altro', 'Ricerca Lavoro Altro', 'C9.11SPEC'))
    }

    // Condizioni lavoro (C13.1-C13.8, numerici)
    if (data[0].condizioni_lavoro || data[0].aspetti_lavoro) {
      const condizioniCodici = ['C13.1', 'C13.2', 'C13.3', 'C13.4', 'C13.5', 'C13.6', 'C13.7', 'C13.8'];
      (['stabilita','flessibilita','valorizzazione','retribuzione','fatica','sicurezza','utilita_sociale','vicinanza_casa'] as const).forEach((f: any, idx) => {
        const values = data.map((x:any)=> (x.condizioni_lavoro?.[f] || x.aspetti_lavoro?.[f]))
        stats.push(...getNumericStatsGiovani(values, `Condizioni Lavoro ${f}`, `Condizioni Lavoro - ${f}`, condizioniCodici[idx]))
      })
    }

    // Livelli utilità (C8.1-C8.4)
    if (data[0].livelli_utilita) {
      const livelliLabels = ['Studiare', 'Formazione', 'Lavorare', 'Ricerca Lavoro']
      const utilitaLabels = ['Per niente', 'Poco', 'Abbastanza', 'Molto']
      
      livelliLabels.forEach((label, index) => {
        const values = data.map(item => item.livelli_utilita?.[index]).filter(val => val !== undefined && val !== '' && val !== null)
        
        if (values.length > 0) {
          // Raggruppa per valore di utilità
          const valueCounts = values.reduce((acc: Record<string, number>, val) => {
            const utilitaLabel = utilitaLabels[val] || `Valore ${val}`
            acc[utilitaLabel] = (acc[utilitaLabel] || 0) + 1
            return acc
          }, {})
          
          Object.entries(valueCounts).forEach(([utilitaLabel, count]) => {
          stats.push({
            Codice: 'C8',
            Domanda: `Livelli Utilità - ${label}`,
              Risposta: utilitaLabel,
            Frequenza: count,
            Percentuale: `${((count / total) * 100).toFixed(1)}%`
            })
          })
        }
      })
    }

    // Canali ricerca lavoro (C9) - chiavi corrette dal database
    if (data[0].ricerca_lavoro) {
      const canaliCodici = ['C9.1', 'C9.2', 'C9.3', 'C9.4', 'C9.5', 'C9.6', 'C9.7', 'C9.8', 'C9.9', 'C9.10', 'C9.11'];
      (['centro_impiego','sportelli','inps','servizi_sociali','agenzie','cooperative','struttura','conoscenti','portali','social','altro'] as const).forEach((f: any, idx) => {
        const count = data.filter(item => item.ricerca_lavoro?.[f] === true).length
        stats.push({
          Codice: canaliCodici[idx],
          Domanda: `Canali Ricerca Lavoro - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Codice: canaliCodici[idx],
          Domanda: `Canali Ricerca Lavoro - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
      const canaliRicercaLavoroAltro = data.map((x:any)=>x.ricerca_lavoro?.altro_specificare)
      if (canaliRicercaLavoroAltro.some(val => val && val.trim() !== '')) {
        stats.push(...getTextStatsGiovani(canaliRicercaLavoroAltro, 'Canali Ricerca Lavoro Altro', 'Canali Ricerca Lavoro Altro', 'C9.11SPEC'))
      }
    }

    // Attività precedenti (C2)
    if (data[0].attivita_precedenti) {
      const attivitaPrecCodici = ['C2.1', 'C2.2', 'C2.3', 'C2.4', 'C2.5', 'C2.6'];
      (['studiavo','lavoravo_stabile','lavoravo_saltuario','corso_formazione','altro','nessuna'] as const).forEach((f: any, idx) => {
        const count = data.filter(item => item.attivita_precedenti?.[f] === true).length
        stats.push({
          Codice: attivitaPrecCodici[idx],
          Domanda: `Attività Precedenti - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Codice: attivitaPrecCodici[idx],
          Domanda: `Attività Precedenti - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
      const attivitaPrecedentiAltro = data.map((x:any)=>x.attivita_precedenti?.altro_spec).filter(val => val && val.trim() !== '')
      if (attivitaPrecedentiAltro.length > 0) {
        stats.push(...getTextStatsGiovani(attivitaPrecedentiAltro, 'Attività Precedenti Altro', 'Attività Precedenti Altro', 'C2.5SPEC'))
      }
    }

    // Attività attuali (C5)
    if (data[0].attivita_attuali) {
      const attivitaAttCodici = ['C5.1', 'C5.2', 'C5.3', 'C5.4', 'C5.5'];
      (['studio','formazione','lavoro','ricerca_lavoro','nessuna'] as const).forEach((f: any, idx) => {
        const count = data.filter(item => item.attivita_attuali?.[f] === true).length
        stats.push({
          Codice: attivitaAttCodici[idx],
          Domanda: `Attività Attuali - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Codice: attivitaAttCodici[idx],
          Domanda: `Attività Attuali - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
    }

    // Orientamento luoghi (C4)
    if (data[0].orientamento_luoghi) {
      const orientamentoCodici = ['C4.1', 'C4.2', 'C4.3', 'C4.4', 'C4.5'];
      (['scuola','enti_formazione','servizi_impiego','struttura','altro'] as const).forEach((f: any, idx) => {
        const count = data.filter(item => item.orientamento_luoghi?.[f] === true).length
        stats.push({
          Codice: orientamentoCodici[idx],
          Domanda: `Orientamento Luoghi - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Codice: orientamentoCodici[idx],
          Domanda: `Orientamento Luoghi - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
      const orientamentoLuoghiAltro = data.map((x:any)=>x.orientamento_luoghi?.altro_spec).filter(val => val && val.trim() !== '')
      if (orientamentoLuoghiAltro.length > 0) {
        stats.push(...getTextStatsGiovani(orientamentoLuoghiAltro, 'Orientamento Luoghi Altro', 'Orientamento Luoghi Altro', 'C4.5SPEC'))
      }
    }

    // Curriculum vitae, centro impiego, lavoro autonomo (C10-C12)
    const cvCount = data.filter(item => item.curriculum_vitae === true || item.curriculum_vitae === '1').length
    stats.push({
      Codice: 'C10',
      Domanda: 'Curriculum Vitae',
      Risposta: 'Sì',
      Frequenza: cvCount,
      Percentuale: `${((cvCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'C10',
      Domanda: 'Curriculum Vitae',
      Risposta: 'No',
      Frequenza: total - cvCount,
      Percentuale: `${(((total - cvCount) / total) * 100).toFixed(1)}%`
    })

    const centroCount = data.filter(item => item.centro_impiego === true || item.centro_impiego === '1').length
    stats.push({
      Codice: 'C11',
      Domanda: 'Centro Impiego',
      Risposta: 'Sì',
      Frequenza: centroCount,
      Percentuale: `${((centroCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'C11',
      Domanda: 'Centro Impiego',
      Risposta: 'No',
      Frequenza: total - centroCount,
      Percentuale: `${(((total - centroCount) / total) * 100).toFixed(1)}%`
    })

    const autonomoCount = data.filter(item => item.lavoro_autonomo === true || item.lavoro_autonomo === '1').length
    stats.push({
      Codice: 'C12',
      Domanda: 'Lavoro Autonomo',
      Risposta: 'Sì',
      Frequenza: autonomoCount,
      Percentuale: `${((autonomoCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'C12',
      Domanda: 'Lavoro Autonomo',
      Risposta: 'No',
      Frequenza: total - autonomoCount,
      Percentuale: `${(((total - autonomoCount) / total) * 100).toFixed(1)}%`
    })

    // Abitazione precedente
    if (data[0].abitazione_precedente) {
      const abitazioneCodici = ['D1.1', 'D1.2', 'D1.3', 'D1.4', 'D1.5', 'D1.6', 'D1.7', 'D1.8', 'D1.9', 'D1.10'];
      (['solo','struttura','madre','padre','partner','figli','fratelli','nonni','altri_parenti','amici'] as const).forEach((f: any, idx) => {
        const count = data.filter(item => item.abitazione_precedente?.[f] === true).length
        stats.push({
          Codice: abitazioneCodici[idx],
          Domanda: `Abitazione Precedente - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Codice: abitazioneCodici[idx],
          Domanda: `Abitazione Precedente - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
    }

    // Figura aiuto (D2)
    if (data[0].figura_aiuto) {
      const figuraAiutoCodici = ['D2.1', 'D2.2', 'D2.3', 'D2.4', 'D2.5', 'D2.6', 'D2.7', 'D2.8', 'D2.9', 'D2.10'];
      (['padre','madre','fratelli','altri_parenti','amici','tutore','insegnanti','figure_sostegno','volontari','altre_persone'] as const).forEach((f: any, idx) => {
        const count = data.filter(item => item.figura_aiuto?.[f] === true).length
        stats.push({
          Codice: figuraAiutoCodici[idx],
          Domanda: `Figura Aiuto - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Codice: figuraAiutoCodici[idx],
          Domanda: `Figura Aiuto - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
      const figuraAiutoAltriSpec = data.map((x:any)=>x.figura_aiuto?.altre_persone_spec)
      if (figuraAiutoAltriSpec.some(val => val && val.trim() !== '')) {
        stats.push(...getTextStatsGiovani(figuraAiutoAltriSpec, 'Figura Aiuto Altri Spec', 'Figura Aiuto Altri Spec', 'D2.10SPEC'))
      }
    }

    // Emozioni uscita (E5.1-E5.10)
    if (data[0].emozioni_uscita) {
      const emozioniCodici = ['E5.1', 'E5.2', 'E5.3', 'E5.4', 'E5.5', 'E5.6', 'E5.7', 'E5.8', 'E5.9', 'E5.10'];
      (['felicita','tristezza','curiosita','preoccupazione','paura','liberazione','solitudine','rabbia','speranza','determinazione'] as const).forEach((f: any, idx) => {
        const count = data.filter(item => item.emozioni_uscita?.[f] === true).length
        stats.push({
          Codice: emozioniCodici[idx],
          Domanda: `Emozioni Uscita - ${f.replace(/_/g, ' ')}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Codice: emozioniCodici[idx],
          Domanda: `Emozioni Uscita - ${f.replace(/_/g, ' ')}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
    }

    // Pronto uscita (E4 boolean, E4.1 e E4.2 motivazioni)
    const prontoUscitaCount = data.filter(item => item.pronto_uscita === true || item.pronto_uscita === 1 || item.pronto_uscita === '1').length
    stats.push({
      Codice: 'E4',
      Domanda: 'Pronto Uscita (E4)',
      Risposta: 'Sì',
      Frequenza: prontoUscitaCount,
      Percentuale: `${((prontoUscitaCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'E4',
      Domanda: 'Pronto Uscita (E4)',
      Risposta: 'No',
      Frequenza: total - prontoUscitaCount,
      Percentuale: `${(((total - prontoUscitaCount) / total) * 100).toFixed(1)}%`
    })
    
    // E4.1 e E4.2: motivazioni pronto uscita
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.pronto_uscita_perche_no), 'Pronto Uscita Perché No (E4.1)', 'Pronto Uscita Perché No', 'E4.1'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.pronto_uscita_perche_si), 'Pronto Uscita Perché Sì (E4.2)', 'Pronto Uscita Perché Sì', 'E4.2'))
    
    // Aiuto futuro, desiderio, nota aggiuntiva (E3, E6, E7)
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.aiuto_futuro), 'Aiuto Futuro (E3)', 'Aiuto Futuro', 'E3'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.desiderio), 'Desiderio (E6)', 'Desiderio', 'E6'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.nota_aggiuntiva), 'Nota Aggiuntiva (E7)', 'Nota Aggiuntiva', 'E7'))

    // Preoccupazioni futuro (Sezione E1)
    if (data[0].preoccupazioni_futuro) {
      const preoccupazioniLabels = ['Per niente', 'Poco', 'Abbastanza', 'Molto'];
      const preoccupazioniCodici = ['E1.1', 'E1.2', 'E1.3', 'E1.4', 'E1.5', 'E1.6', 'E1.7', 'E1.8'];
      
      (['pregiudizi','mancanza_lavoro','mancanza_aiuto','mancanza_casa','solitudine','salute','perdita_persone','altro'] as const).forEach((f: any, idx) => {
        const values = data.map(item => item.preoccupazioni_futuro?.[f]).filter(val => val !== undefined && val !== '' && val !== null)
        
        if (values.length > 0) {
          // Raggruppa per valore di preoccupazione
          const valueCounts = values.reduce((acc: Record<string, number>, val) => {
            const preoccupazioneLabel = preoccupazioniLabels[val] || `Valore ${val}`
            acc[preoccupazioneLabel] = (acc[preoccupazioneLabel] || 0) + 1
            return acc
          }, {})
          
          Object.entries(valueCounts).forEach(([preoccupazioneLabel, count]) => {
          stats.push({
            Codice: preoccupazioniCodici[idx],
            Domanda: `Preoccupazioni Futuro - ${f.replace(/_/g, ' ')}`,
              Risposta: preoccupazioneLabel,
            Frequenza: count,
            Percentuale: `${((count / total) * 100).toFixed(1)}%`
            })
          })
        }
      })
      const preoccupazioniFuturoAltroSpec = data.map((x:any)=>x.preoccupazioni_futuro?.altro_spec)
      if (preoccupazioniFuturoAltroSpec.some(val => val && val.trim() !== '')) {
        stats.push(...getTextStatsGiovani(preoccupazioniFuturoAltroSpec, 'Preoccupazioni Futuro Altro Spec', 'Preoccupazioni Futuro Altro Spec', 'E1.8SPEC'))
      }
    }

    // Obiettivi realizzabili (Sezione E2)
    if (data[0].obiettivi_realizzabili) {
      const obiettiviLabels = ['Per niente', 'Poco', 'Abbastanza', 'Molto'];
      const obiettiviCodici = ['E2.1', 'E2.2', 'E2.3', 'E2.4', 'E2.5', 'E2.6'];
      
      (['lavoro_piacevole','autonomia','famiglia','trovare_lavoro','salute','casa'] as const).forEach((f: any, idx) => {
        const values = data.map(item => item.obiettivi_realizzabili?.[f]).filter(val => val !== undefined && val !== '' && val !== null)
        
        if (values.length > 0) {
          // Raggruppa per valore di obiettivo
          const valueCounts = values.reduce((acc: Record<string, number>, val) => {
            const obiettivoLabel = obiettiviLabels[val] || `Valore ${val}`
            acc[obiettivoLabel] = (acc[obiettivoLabel] || 0) + 1
            return acc
          }, {})
          
          Object.entries(valueCounts).forEach(([obiettivoLabel, count]) => {
          stats.push({
            Codice: obiettiviCodici[idx],
            Domanda: `Obiettivi Realizzabili - ${f.replace(/_/g, ' ')}`,
              Risposta: obiettivoLabel,
            Frequenza: count,
            Percentuale: `${((count / total) * 100).toFixed(1)}%`
            })
          })
        }
      })
    }

    // Percorso autonomia (A1)
    const percAut = data.filter(item => item.percorso_autonomia === true).length
    stats.push({
      Codice: 'PERCAUT',
      Domanda: 'A1 Percorso Autonomia',
      Risposta: 'Sì',
      Frequenza: percAut,
      Percentuale: `${((percAut / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'PERCAUT',
      Domanda: 'A1 Percorso Autonomia',
      Risposta: 'No',
      Frequenza: total - percAut,
      Percentuale: `${(((total - percAut) / total) * 100).toFixed(1)}%`
    })

    // Vive in struttura (A2)
    const viveStruttura = data.filter(item => item.vive_in_struttura === true).length
    stats.push({
      Codice: 'VIVE',
      Domanda: 'A2 Vive in Struttura',
      Risposta: 'Sì',
      Frequenza: viveStruttura,
      Percentuale: `${((viveStruttura / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'VIVE',
      Domanda: 'A2 Vive in Struttura',
      Risposta: 'No',
      Frequenza: total - viveStruttura,
      Percentuale: `${(((total - viveStruttura) / total) * 100).toFixed(1)}%`
    })

    // Collocazione attuale (A3)
    const collocazioneAttuale = data.reduce((acc, item) => {
      acc[item.collocazione_attuale || 'Non specificato'] = (acc[item.collocazione_attuale || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(collocazioneAttuale).forEach(([key, value]) => {
      stats.push({
        Codice: 'CONDATT',
        Domanda: 'A3 Collocazione Attuale',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Sesso (B1)
    const sesso = data.reduce((acc, item) => {
      acc[item.sesso || 'Non specificato'] = (acc[item.sesso || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(sesso).forEach(([key, value]) => {
      stats.push({
        Codice: 'B1',
        Domanda: 'B1 Sesso',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Classe età (B2)
    const classeEta = data.reduce((acc, item) => {
      acc[item.classe_eta || 'Non specificato'] = (acc[item.classe_eta || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(classeEta).forEach(([key, value]) => {
      stats.push({
        Codice: 'B2',
        Domanda: 'B2 Classe Età',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Cittadinanza (B4)
    const cittadinanza = data.reduce((acc, item) => {
      acc[item.cittadinanza || 'Non specificato'] = (acc[item.cittadinanza || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(cittadinanza).forEach(([key, value]) => {
      stats.push({
        Codice: 'B4',
        Domanda: 'B4 Cittadinanza',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Titolo studio (C1)
    const titoloStudio = data.reduce((acc, item) => {
      acc[item.titolo_studio || 'Non specificato'] = (acc[item.titolo_studio || 'Non specificato'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(titoloStudio).forEach(([key, value]) => {
      stats.push({
        Codice: 'C1',
        Domanda: 'C1 Titolo Studio',
        Risposta: key,
        Frequenza: value as number,
        Percentuale: `${((value as number / total) * 100).toFixed(1)}%`
      })
    })

    // Fattori vulnerabilità (A4)
    const fattoriVulnMapping = [
      { key: 'fv1_stranieri', label: 'Stranieri', codice: 'FV.1' },
      { key: 'fv2_vittime_tratta', label: 'Vittime tratta', codice: 'FV.2' },
      { key: 'fv3_vittime_violenza', label: 'Vittime violenza', codice: 'FV.3' },
      { key: 'fv4_allontanati_famiglia', label: 'Allontanati famiglia', codice: 'FV.4' },
      { key: 'fv5_detenuti', label: 'Detenuti', codice: 'FV.5' },
      { key: 'fv6_ex_detenuti', label: 'Ex detenuti', codice: 'FV.6' },
      { key: 'fv7_esecuzione_penale', label: 'Esecuzione penale', codice: 'FV.7' },
      { key: 'fv8_indigenti', label: 'Indigenti senza dimora', codice: 'FV.8' },
      { key: 'fv9_rom_sinti', label: 'Rom Sinti', codice: 'FV.9' },
      { key: 'fv10_disabilita_fisica', label: 'Disabilità fisica', codice: 'FV.10' },
      { key: 'fv11_disabilita_cognitiva', label: 'Disabilità cognitiva', codice: 'FV.11' },
      { key: 'fv12_disturbi_psichiatrici', label: 'Disturbi psichiatrici', codice: 'FV.12' },
      { key: 'fv13_dipendenze', label: 'Dipendenze', codice: 'FV.13' },
      { key: 'fv14_genitori_precoci', label: 'Genitori precoci', codice: 'FV.14' },
      { key: 'fv15_orientamento_sessuale', label: 'Orientamento sessuale', codice: 'FV.15' }
    ]
    
    fattoriVulnMapping.forEach(({ key, label, codice }) => {
      const count = data.filter(item => {
        if (Array.isArray(item.fattori_vulnerabilita)) {
          return item.fattori_vulnerabilita.includes(label) || item.fattori_vulnerabilita.includes(key)
        } else if (typeof item.fattori_vulnerabilita === 'object' && item.fattori_vulnerabilita !== null) {
          return item.fattori_vulnerabilita[key] === true
        }
        return false
      }).length
      
      stats.push({
        Codice: codice,
        Domanda: `A4 Fattori Vulnerabilità - ${label}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `A4 Fattori Vulnerabilità - ${label}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Famiglia origine (B8)
    const famigliaOrigine = [
      { membro: 'padre', codice: 'B8.1' },
      { membro: 'madre', codice: 'B8.2' },
      { membro: 'fratelli', codice: 'B8.3' },
      { membro: 'nonni', codice: 'B8.4' },
      { membro: 'altri_parenti', codice: 'B8.5' },
      { membro: 'non_parenti', codice: 'B8.6' }
    ]
    
    famigliaOrigine.forEach(({ membro, codice }) => {
      const count = data.filter(item => {
        if (Array.isArray(item.famiglia_origine)) {
          return item.famiglia_origine.includes(membro)
        } else if (typeof item.famiglia_origine === 'object' && item.famiglia_origine !== null) {
          return item.famiglia_origine[membro] === true || 
                 item.famiglia_origine[membro.replace('fratelli', 'fratelli_sorelle')] === true ||
                 item.famiglia_origine[membro.replace('non_parenti', 'altri_conviventi')] === true
        }
        return false
      }).length
      
      stats.push({
        Codice: codice,
        Domanda: `B8 Famiglia Origine - ${membro.replace(/_/g, ' ')}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `B8 Famiglia Origine - ${membro.replace(/_/g, ' ')}`,
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