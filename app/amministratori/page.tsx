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

  // Utility per totali aggregati (SOMMA, non distribuzione)
  function getSumStatsStrutture(arr: number[], label: string, domanda: string, codice: string): Array<StatRow> {
    // Calcola la SOMMA di tutti i valori
    const sum = arr.reduce((acc, val) => acc + (val || 0), 0)
    
    return [{
      Codice: codice,
      Domanda: domanda,
      Risposta: label,
      Frequenza: sum,
      Percentuale: '100%' // Per i totali aggregati la percentuale è sempre 100%
    }]
  }

  // Helper per filtrare stringhe valide in modo sicuro
  function isValidString(val: any): val is string {
    return val != null && typeof val === 'string' && val.trim() !== ''
  }

  // Utility per testo libero
  function getTextStatsStruttureCustom(arr: any[], label: string, domanda: string, codice: string, totalQuestionari?: number): Array<StatRow> {
    const valid = arr.filter((x: any) => {
      if (x == null) return false
      if (typeof x !== 'string') return false
      if (x.trim() === '') return false
      return true
    })
    if (valid.length === 0) return []
    // Usa il totale dei questionari ricevuti, non solo i valori validi
    const total = totalQuestionari || arr.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Codice: codice,
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq as number,
      Percentuale: `${(((freq as number) / total) * 100).toFixed(1)}%`
    }))
  }

  function generateStruttureStats(data: any[]): Array<StatRow> {
    if (data.length === 0) return [{ Codice: '', Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    const stats: Array<StatRow> = []
    const total = data.length

    // ==== ORDINE ESATTO DEL TRACCIATO DI ESPORTAZIONE ====

    // 1. COD_OPE - Codice Operatore (creato_da)
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.creato_da), 'Codice Operatore', 'Codice Operatore', 'COD_OPE', total))

    // 2. ID_QUEST - ID Struttura
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura', 'ID_QUEST', total))

    // 3. TIPO_STRUTTURA - Tipo Struttura (aggregato)
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

    // 4. FORMAGIU - Forma Giuridica (aggregato)
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

    // 5. FORMAGIU_SPEC - Forma Giuridica Altro
    const formaGiuridicaAltro = data.map((x:any)=>x.forma_giuridica_altro).filter(isValidString)
    if (formaGiuridicaAltro.length > 0) {
      const formaGiuridicaAltroStats = getTextStatsStruttureCustom(formaGiuridicaAltro, 'Forma Giuridica Altro', 'Forma Giuridica Altro', 'FORMAGIU_SPEC', total)
      for (const stat of formaGiuridicaAltroStats) {
        stats.push(stat)
      }
    }

    // 6. ANNO_INIZIO - Anno Inizio
    stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.anno_inizio), 'Anno Inizio', 'Anno Inizio', 'ANNO_INIZIO', total))

    // 7. MISSION - Missione
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.missione), 'Missione', 'Missione', 'MISSION', total))
    
    // Personale retribuito/volontario (B1 e B2 DEVONO VENIRE PRIMA DI B3)
    const personaleKeysLabels: Record<string, string> = {
      'personale_retribuito': 'Personale Retribuito',
      'personale_volontario': 'Personale Volontario'
    }
    // Personale Retribuito (B1U, B1D, B1T)
    // B1U - Uomini
    stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.personale_retribuito_uomini), 'Personale Retribuito - Uomini', 'Personale Retribuito - Uomini', 'B1U', total))
    
    // B1D - Donne
    stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.personale_retribuito_donne), 'Personale Retribuito - Donne', 'Personale Retribuito - Donne', 'B1D', total))
    
    // B1T - Totale (FREQUENZA di uomini + donne per ogni questionario)
    const b1Totale = data.map((x:any) => (x.personale_retribuito_uomini || 0) + (x.personale_retribuito_donne || 0))
    stats.push(...getNumericStatsStrutture(b1Totale, 'Totale', 'Personale Retribuito - Totale', 'B1T', total))

    // Personale Volontario (B2U, B2D, B2T)
    // B2U - Uomini
    stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.personale_volontario_uomini), 'Personale Volontario - Uomini', 'Personale Volontario - Uomini', 'B2U', total))
    
    // B2D - Donne
    stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.personale_volontario_donne), 'Personale Volontario - Donne', 'Personale Volontario - Donne', 'B2D', total))
    
    // B2T - Totale (FREQUENZA di uomini + donne per ogni questionario)
    const b2Totale = data.map((x:any) => (x.personale_volontario_uomini || 0) + (x.personale_volontario_donne || 0))
    stats.push(...getNumericStatsStrutture(b2Totale, 'Totale', 'Personale Volontario - Totale', 'B2T', total))

    // Figure professionali (B3)
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

    // B3.13_SPEC - Figure Professionali Altro Specificare
    const figureProfAltro = data.map((x:any)=>x.figure_professionali_altro).filter(isValidString)
    if (figureProfAltro.length > 0) {
      stats.push(...getTextStatsStruttureCustom(figureProfAltro, 'Figure Professionali Altro Specificare', 'Figure Professionali Altro Specificare', 'B3.13_SPEC', total))
    }

    // Persone ospitate (C1 - gestite solo per persone_ospitate, non persone_non_ospitate che vengono dopo le caratteristiche)
    const personeOspitateCodici = {
      'fino_16': { 'uomini': 'C1A.U', 'donne': 'C1A.D', 'totale': 'C1A.T' },
      'da_16_a_18': { 'uomini': 'C1B.U', 'donne': 'C1B.D', 'totale': 'C1B.T' },
      'maggiorenni': { 'uomini': 'C1C.U', 'donne': 'C1C.D', 'totale': 'C1C.T' }
    }
    const personeGruppi = ['fino_16','da_16_a_18','maggiorenni'] as const
    const personeSubKeys = ['uomini','donne','totale'] as const
    
    // Persone Ospitate C1A, C1B, C1C (i gruppi effettivi dal database)
    for (const gruppo of personeGruppi) {
      // UOMINI
      const uominiValues = data.map((x:any)=>x.persone_ospitate?.[gruppo]?.uomini || 0)
      stats.push(...getNumericStatsStrutture(uominiValues, `Persone Ospitate - ${gruppo} - uomini`, `Persone Ospitate - ${gruppo} - uomini`, personeOspitateCodici[gruppo]['uomini'], total))
      
      // DONNE
      const donneValues = data.map((x:any)=>x.persone_ospitate?.[gruppo]?.donne || 0)
      stats.push(...getNumericStatsStrutture(donneValues, `Persone Ospitate - ${gruppo} - donne`, `Persone Ospitate - ${gruppo} - donne`, personeOspitateCodici[gruppo]['donne'], total))
      
      // TOTALE = Conta quanti questionari hanno uomini + donne = valore specifico
      // Calcola il totale per ogni questionario
      const totaliValues = data.map((x:any) => 
        (x.persone_ospitate?.[gruppo]?.uomini || 0) + (x.persone_ospitate?.[gruppo]?.donne || 0)
      )
      stats.push(...getNumericStatsStrutture(totaliValues, `Totale`, `Persone Ospitate - ${gruppo} - totale`, personeOspitateCodici[gruppo]['totale'], total))
    }

    // Totali complessivi C1.T.U (frequenza uomini totali), C1T.D (frequenza donne totali), C1T.T (frequenza tutti)
    // C1.T.U = Frequenza di (C1A.U + C1B.U + C1C.U) per ogni questionario
    const totalUomini = data.map((x:any) => 
      (x.persone_ospitate?.fino_16?.uomini || 0) + 
      (x.persone_ospitate?.da_16_a_18?.uomini || 0) + 
      (x.persone_ospitate?.maggiorenni?.uomini || 0)
    )
    stats.push(...getNumericStatsStrutture(totalUomini, 'Totale Uomini', 'Persone Ospitate - Totale Uomini', 'C1.T.U', total))

    // C1T.D = Frequenza di (C1A.D + C1B.D + C1C.D) per ogni questionario
    const totalDonne = data.map((x:any) => 
      (x.persone_ospitate?.fino_16?.donne || 0) + 
      (x.persone_ospitate?.da_16_a_18?.donne || 0) + 
      (x.persone_ospitate?.maggiorenni?.donne || 0)
    )
    stats.push(...getNumericStatsStrutture(totalDonne, 'Totale Donne', 'Persone Ospitate - Totale Donne', 'C1T.D', total))

    // C1T.T = Frequenza totale di tutti (uomini + donne di tutte le fasce)
    const totalTotale = data.map((x:any) => 
      (x.persone_ospitate?.fino_16?.uomini || 0) + 
      (x.persone_ospitate?.da_16_a_18?.uomini || 0) + 
      (x.persone_ospitate?.maggiorenni?.uomini || 0) +
      (x.persone_ospitate?.fino_16?.donne || 0) + 
      (x.persone_ospitate?.da_16_a_18?.donne || 0) + 
      (x.persone_ospitate?.maggiorenni?.donne || 0)
    )
    stats.push(...getNumericStatsStrutture(totalTotale, 'Totale Generale', 'Persone Ospitate - Totale Generale', 'C1T.T', total))

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
    
    // Caratteristiche ospiti adolescenti - solo valori standard (C2.xA nell'export)
    caratteristicheOspitiAdolescenti.forEach((car, idx) => {
      const count = data.filter(item => {
        const ospitiAdolescenti = Array.isArray(item.caratteristiche_ospiti_adolescenti) ? item.caratteristiche_ospiti_adolescenti : []
        return hasCaratteristica(ospitiAdolescenti, car, mappingAdolescenti[car] || [])
      }).length
      
      const codice = `C2.${idx + 1}A`
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche Ospiti Adolescenti - ${car}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche Ospiti Adolescenti - ${car}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })
    
    // Caratteristiche ospiti giovani - solo valori standard (C2.xB nell'export)
    caratteristicheOspitiGiovani.forEach((car, idx) => {
      const count = data.filter(item => {
        const ospitiGiovani = Array.isArray(item.caratteristiche_ospiti_giovani) ? item.caratteristiche_ospiti_giovani : []
        return hasCaratteristica(ospitiGiovani, car, mappingGiovani[car] || [])
      }).length
      
      const codice = `C2.${idx + 1}B`
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche Ospiti Giovani - ${car}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche Ospiti Giovani - ${car}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Caratteristiche altro ospiti (C2.16A_SPEC per ospiti adolescenti, C2.16B_SPEC per ospiti giovani)
    const caratteristicheOspitiAltro = data.map((x:any)=>x.caratteristiche_ospiti_altro).filter(isValidString)
    if (caratteristicheOspitiAltro.length > 0) {
      stats.push(...getTextStatsStruttureCustom(caratteristicheOspitiAltro, 'Caratt. Ospiti Altro (Adolescenti)', 'Caratteristiche Ospiti Altro', 'C2.16A_SPEC', total))
      stats.push(...getTextStatsStruttureCustom(caratteristicheOspitiAltro, 'Caratt. Ospiti Altro (Giovani)', 'Caratteristiche Ospiti Altro', 'C2.16B_SPEC', total))
    }
    
    // Persone NON ospitate (C3)
    const personeNonOspitateCodici = {
      'fino_16': { 'uomini': 'C3A.U', 'donne': 'C3A.D', 'totale': 'C3A.T' },
      'da_16_a_18': { 'uomini': 'C3B.U', 'donne': 'C3B.D', 'totale': 'C3B.T' },
      'maggiorenni': { 'uomini': 'C3C.U', 'donne': 'C3C.D', 'totale': 'C3C.T' }
    }
    
    // Persone Non Ospitate C3A, C3B, C3C (i gruppi effettivi dal database)
    for (const gruppo of personeGruppi) {
      // UOMINI
      const uominiValues = data.map((x:any)=>x.persone_non_ospitate?.[gruppo]?.uomini || 0)
      stats.push(...getNumericStatsStrutture(uominiValues, `Persone Non Ospitate - ${gruppo} - uomini`, `Persone Non Ospitate - ${gruppo} - uomini`, personeNonOspitateCodici[gruppo]['uomini'], total))
      
      // DONNE
      const donneValues = data.map((x:any)=>x.persone_non_ospitate?.[gruppo]?.donne || 0)
      stats.push(...getNumericStatsStrutture(donneValues, `Persone Non Ospitate - ${gruppo} - donne`, `Persone Non Ospitate - ${gruppo} - donne`, personeNonOspitateCodici[gruppo]['donne'], total))
      
      // TOTALE = Conta quanti questionari hanno uomini + donne = valore specifico
      const totaliValues = data.map((x:any) => 
        (x.persone_non_ospitate?.[gruppo]?.uomini || 0) + (x.persone_non_ospitate?.[gruppo]?.donne || 0)
      )
      stats.push(...getNumericStatsStrutture(totaliValues, `Totale`, `Persone Non Ospitate - ${gruppo} - totale`, personeNonOspitateCodici[gruppo]['totale'], total))
    }

    // Totali complessivi C3.T.U (frequenza uomini totali), C3T.D (frequenza donne totali), C3T.T (frequenza tutti)
    // C3.T.U = Frequenza di (C3A.U + C3B.U + C3C.U) per ogni questionario
    const totalNonOspitatiUomini = data.map((x:any) => 
      (x.persone_non_ospitate?.fino_16?.uomini || 0) + 
      (x.persone_non_ospitate?.da_16_a_18?.uomini || 0) + 
      (x.persone_non_ospitate?.maggiorenni?.uomini || 0)
    )
    stats.push(...getNumericStatsStrutture(totalNonOspitatiUomini, 'Totale Uomini', 'Persone Non Ospitate - Totale Uomini', 'C3.T.U', total))

    // C3T.D = Frequenza di (C3A.D + C3B.D + C3C.D) per ogni questionario
    const totalNonOspitateDonne = data.map((x:any) => 
      (x.persone_non_ospitate?.fino_16?.donne || 0) + 
      (x.persone_non_ospitate?.da_16_a_18?.donne || 0) + 
      (x.persone_non_ospitate?.maggiorenni?.donne || 0)
    )
    stats.push(...getNumericStatsStrutture(totalNonOspitateDonne, 'Totale Donne', 'Persone Non Ospitate - Totale Donne', 'C3T.D', total))

    // C3T.T = Frequenza totale di tutti (uomini + donne di tutte le fasce)
    const totalNonOspitateTotale = data.map((x:any) => 
      (x.persone_non_ospitate?.fino_16?.uomini || 0) + 
      (x.persone_non_ospitate?.da_16_a_18?.uomini || 0) + 
      (x.persone_non_ospitate?.maggiorenni?.uomini || 0) +
      (x.persone_non_ospitate?.fino_16?.donne || 0) + 
      (x.persone_non_ospitate?.da_16_a_18?.donne || 0) + 
      (x.persone_non_ospitate?.maggiorenni?.donne || 0)
    )
    stats.push(...getNumericStatsStrutture(totalNonOspitateTotale, 'Totale Generale', 'Persone Non Ospitate - Totale Generale', 'C3T.T', total))

    // Caratteristiche non ospiti adolescenti - solo valori standard (C4.xA nell'export)
    caratteristicheOspitiAdolescenti.forEach((car, idx) => {
      const count = data.filter(item => {
        const nonOspitiAdolescenti = Array.isArray(item.caratteristiche_non_ospiti_adolescenti) ? item.caratteristiche_non_ospiti_adolescenti : []
        return hasCaratteristica(nonOspitiAdolescenti, car, mappingAdolescenti[car] || [])
      }).length
      
      const codice = `C4.${idx + 1}A`
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche Non Ospiti Adolescenti - ${car}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche Non Ospiti Adolescenti - ${car}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })
    
    // Caratteristiche non ospiti giovani - solo valori standard (C4.xB nell'export)
    caratteristicheOspitiGiovani.forEach((car, idx) => {
      const count = data.filter(item => {
        const nonOspitiGiovani = Array.isArray(item.caratteristiche_non_ospiti_giovani) ? item.caratteristiche_non_ospiti_giovani : []
        return hasCaratteristica(nonOspitiGiovani, car, mappingGiovani[car] || [])
      }).length
      
      const codice = `C4.${idx + 1}B`
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche Non Ospiti Giovani - ${car}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Caratteristiche Non Ospiti Giovani - ${car}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // Caratteristiche altro NON ospiti (C4.16ALTRO)
    const caratteristicheNonOspitiAltro = data.map((x:any)=>x.caratteristiche_non_ospiti_altro).filter(isValidString)
    if (caratteristicheNonOspitiAltro.length > 0) {
      stats.push(...getTextStatsStruttureCustom(caratteristicheNonOspitiAltro, 'Caratt. Non Ospiti Altro', 'Caratteristiche Non Ospiti Altro', 'C4.16ALTRO', total))
    }

    // Attività servizi (D1)
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

    // Esperienze inserimento lavorativo (D2)
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

    // Attività inserimento (D3): array di oggetti con nome, periodo, contenuto, destinatari, attori, punti_forza, criticita
    // Codici: D3.1NOM, D3.2NOM, D3.3NOM, D3.1PER, ecc. → usiamo D3.NOM, D3.PER, ecc. per aggregare tutti i progetti
    const attivitaInserimentoNomi = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.nome) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoNomi.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoNomi, 'Attività Inserimento Nome (D3.NOM)', 'Attività Inserimento Nome', 'D3.NOM', total))
    }
    const attivitaInserimentoPeriodo = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.periodo) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoPeriodo.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoPeriodo, 'Attività Inserimento Periodo (D3.PER)', 'Attività Inserimento Periodo', 'D3.PER', total))
    }
    const attivitaInserimentoContenuto = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.contenuto) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoContenuto.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoContenuto, 'Attività Inserimento Contenuto (D3.CONT)', 'Attività Inserimento Contenuto', 'D3.CONT', total))
    }
    const attivitaInserimentoDestinatari = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.destinatari) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoDestinatari.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoDestinatari, 'Attività Inserimento Destinatari (D3.DEST)', 'Attività Inserimento Destinatari', 'D3.DEST', total))
    }
    const attivitaInserimentoAttori = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.attori) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoAttori.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoAttori, 'Attività Inserimento Attori (D3.ATT)', 'Attività Inserimento Attori', 'D3.ATT', total))
    }
    const attivitaInserimentoPuntiForza = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.punti_forza) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoPuntiForza.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoPuntiForza, 'Attività Inserimento Punti Forza (D3.PFOR)', 'Attività Inserimento Punti Forza', 'D3.PFOR', total))
    }
    const attivitaInserimentoCriticita = data.flatMap((x:any)=>x.attivita_inserimento?.map((a:any)=>a.criticita) || []).filter(v => v && v.trim() !== '')
    if (attivitaInserimentoCriticita.length > 0) {
      stats.push(...getTextStatsStruttureCustom(attivitaInserimentoCriticita, 'Attività Inserimento Criticità (D3.CRIT)', 'Attività Inserimento Criticità', 'D3.CRIT', total))
    }
    
    // D4 - Prevedete di realizzare nei prossimi due anni esperienze significative? (0=No, 1=Sì)
    const d4Values = data.map((x:any) => {
      if (x.nuove_esperienze_previste !== undefined) {
        return x.nuove_esperienze_previste ? 1 : 0
      }
      if (x.nuove_attivita && Array.isArray(x.nuove_attivita) && x.nuove_attivita.some(isValidString)) {
        return 1
      }
      return 0
    })
    const d4Si = d4Values.filter((v: number) => v === 1).length
    const d4No = d4Values.filter((v: number) => v === 0).length
    stats.push({
      Codice: 'D4',
      Domanda: 'Nuove esperienze previste prossimi 2 anni',
      Risposta: 'Sì',
      Frequenza: d4Si,
      Percentuale: `${((d4Si / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'D4',
      Domanda: 'Nuove esperienze previste prossimi 2 anni',
      Risposta: 'No',
      Frequenza: d4No,
      Percentuale: `${((d4No / total) * 100).toFixed(1)}%`
    })
    
    // Collaborazioni (E1): array di oggetti con soggetto, tipo, oggetto
    // Codici: E1.1SOGG, E1.2SOGG, E1.3SOGG, E1.1TIPO, ecc. → usiamo E1.SOGG, E1.TIPO, E1.OGGETTO per aggregare
    const collaborazioniSoggetto = data.flatMap((x:any)=>x.collaborazioni?.map((c:any)=>c.soggetto) || []).filter(v => v && v.trim() !== '')
    if (collaborazioniSoggetto.length > 0) {
      stats.push(...getTextStatsStruttureCustom(collaborazioniSoggetto, 'Collaborazioni Soggetto (E1.SOGG)', 'Collaborazioni Soggetto', 'E1.SOGG', total))
    }
    const collaborazioniTipo = data.flatMap((x:any)=>x.collaborazioni?.map((c:any)=>c.tipo) || []).filter(v => v !== undefined && v !== null && v !== '')
    if (collaborazioniTipo.length > 0) {
      stats.push(...getNumericStatsStrutture(collaborazioniTipo, 'Collaborazioni Tipo (E1.TIPO)', 'Collaborazioni Tipo', 'E1.TIPO', total))
    }
    const collaborazioniOggetto = data.flatMap((x:any)=>x.collaborazioni?.map((c:any)=>c.oggetto) || []).filter(v => v && v.trim() !== '')
    if (collaborazioniOggetto.length > 0) {
      stats.push(...getTextStatsStruttureCustom(collaborazioniOggetto, 'Collaborazioni Oggetto (E1.OGGETTO)', 'Collaborazioni Oggetto', 'E1.OGGETTO', total))
    }

    // Punti forza, critica network (E2, E3)
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.punti_forza_network), 'Punti Forza Network (E2)', 'Punti Forza Network', 'E2', total))
    stats.push(...getTextStatsStruttureCustom(data.map((x:any)=>x.critica_network), 'Critica Network (E3)', 'Critica Network', 'E3', total))

    // Finanziamenti (F1.1, F1.2, F1.1SPEC, F1.2SPEC, F2.xforn, F2.xsost)
    if (data[0].finanziamenti) {
      stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.finanziamenti?.fondi_pubblici), 'Fondi Pubblici', 'Finanziamenti - Fondi Pubblici', 'F1.1', total))
      stats.push(...getNumericStatsStrutture(data.map((x:any)=>x.finanziamenti?.fondi_privati), 'Fondi Privati', 'Finanziamenti - Fondi Privati', 'F1.2', total))
      
      const fondiPubbliciSpec = data.map((x:any)=>x.finanziamenti?.fondi_pubblici_specifica || x.finanziamenti?.fondi_pubblici_specifiche).filter(isValidString)
      if (fondiPubbliciSpec.length > 0) {
        stats.push(...getTextStatsStruttureCustom(fondiPubbliciSpec, 'Fondi Pubblici Specifiche', 'Fondi Pubblici Specifiche', 'F1.1SPEC', total))
      }
      
      const fondiPrivatiSpec = data.map((x:any)=>x.finanziamenti?.fondi_privati_specifica || x.finanziamenti?.fondi_privati_specifiche).filter(isValidString)
      if (fondiPrivatiSpec.length > 0) {
        stats.push(...getTextStatsStruttureCustom(fondiPrivatiSpec, 'Fondi Privati Specifiche', 'Fondi Privati Specifiche', 'F1.2SPEC', total))
      }
      
      // Fornitori (F2.1forn, F2.1sost, F2.2forn, F2.2sost)
      const fornitore1Nome = data.map((x:any)=>x.finanziamenti?.fornitori?.[0]?.nome).filter(isValidString)
      if (fornitore1Nome.length > 0) {
        stats.push(...getTextStatsStruttureCustom(fornitore1Nome, 'Fornitore 1 - Nome', 'Fornitore 1 - Nome', 'F2.1forn', total))
      }
      const fornitore1Sost = data.map((x:any)=>x.finanziamenti?.fornitori?.[0]?.tipo_sostegno).filter(isValidString)
      if (fornitore1Sost.length > 0) {
        stats.push(...getTextStatsStruttureCustom(fornitore1Sost, 'Fornitore 1 - Tipo Sostegno', 'Fornitore 1 - Tipo Sostegno', 'F2.1sost', total))
      }
      const fornitore2Nome = data.map((x:any)=>x.finanziamenti?.fornitori?.[1]?.nome).filter(isValidString)
      if (fornitore2Nome.length > 0) {
        stats.push(...getTextStatsStruttureCustom(fornitore2Nome, 'Fornitore 2 - Nome', 'Fornitore 2 - Nome', 'F2.2forn', total))
      }
      const fornitore2Sost = data.map((x:any)=>x.finanziamenti?.fornitori?.[1]?.tipo_sostegno).filter(isValidString)
      if (fornitore2Sost.length > 0) {
        stats.push(...getTextStatsStruttureCustom(fornitore2Sost, 'Fornitore 2 - Tipo Sostegno', 'Fornitore 2 - Tipo Sostegno', 'F2.2sost', total))
      }
    }

    return stats
  }

  // Utility per statistiche numeriche operatori
  function getNumericStatsOperatori(arr: number[], label: string, domanda: string, codice: string = ''): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    const valid = arr.filter((x: number) => typeof x === 'number' && !isNaN(x) && x !== null && x !== undefined)
    if (valid.length === 0) return []
    // La percentuale deve essere calcolata sul totale delle risposte valide
    const total = valid.length
    
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

  // Utility per totali aggregati operatori (SOMMA, non distribuzione)
  function getSumStatsOperatori(arr: number[], label: string, domanda: string, codice: string): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    // Calcola la SOMMA di tutti i valori
    const sum = arr.reduce((acc, val) => acc + (val || 0), 0)
    
    return [{
      Codice: codice,
      Domanda: domanda,
      Risposta: label,
      Frequenza: sum,
      Percentuale: '100%'
    }]
  }

  // Utility per testo libero operatori
  function getTextStatsOperatori(arr: any[], label: string, domanda: string, codice: string = ''): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    const valid = arr.filter((x: any) => {
      if (x == null) return false
      if (typeof x !== 'string') return false
      if (x.trim() === '') return false
      return true
    })
    if (valid.length === 0) return []
    // La percentuale deve essere calcolata sul totale delle risposte valide
    const total = valid.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Codice: codice,
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq as number,
      Percentuale: `${(((freq as number) / total) * 100).toFixed(1)}%`
    }))
  }

  function generateOperatoriStats(data: any[]): Array<StatRow> {
    if (data.length === 0) return [{ Codice: '', Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    
    const stats: Array<StatRow> = []
    const total = data.length

    // Campi base metadati (nell'ordine dell'export)
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura', 'ID_QUEST')) {
      stats.push(stat)
    }
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.tipo_struttura), 'Tipo Struttura', 'Tipo Struttura', 'TIPO_STRUTTURA')) {
      stats.push(stat)
    }

    // ID_STRUTTURA (campo separato)
    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.id_struttura), 'ID Struttura', 'ID Struttura (Dettaglio)', 'ID_STRUTTURA')) {
      stats.push(stat)
    }

    // Professione (PROF e PROF_SPEC devono venire PRIMA di B1, B2, B3)
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

    for (const stat of getTextStatsOperatori(data.map((x:any)=>x.professione?.altro_specificare), 'Professione Altro', 'Professione Altro', 'PROF_SPEC')) {
      stats.push(stat)
    }

    // Persone seguite (B1U, B1D, B1T) e Persone maggiorenni (B2U, B2D, B2T)
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
        const labelChiara = `${personaleLabels[key]} - ${sub.charAt(0).toUpperCase() + sub.slice(1)}`
        const codice = personaleCodici[key][sub]
        
        // Per 'totale', calcoliamo FREQUENZA di uomini + donne per ogni questionario
        if (sub === 'totale') {
          const valoriCalcolati = data.map((x:any) => 
            (x[key]?.uomini || 0) + (x[key]?.donne || 0)
          )
          stats.push(...getNumericStatsOperatori(valoriCalcolati, 'Totale', labelChiara, codice))
        } else {
          // Per uomini e donne, leggiamo direttamente (SEMPRE, senza controllo data[0])
          stats.push(...getNumericStatsOperatori(data.map((x:any)=>x[key]?.[sub] || 0), labelChiara, labelChiara, codice))
        }
      })
    })

    // Caratteristiche persone seguite (B3_1 - B3_16)
    const caratteristiche = ['stranieri_migranti', 'vittime_tratta', 'vittime_violenza', 'allontanati_famiglia', 'detenuti', 'ex_detenuti', 'misure_alternative', 'indigenti_senzatetto', 'rom_sinti', 'disabilita_fisica', 'disabilita_cognitiva', 'disturbi_psichiatrici', 'dipendenze', 'genitori_precoci', 'problemi_orientamento', 'altro']
    
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

    // Caratteristiche altro specificare (B3_16SPEC)
    const caratteristicheAltro = data.map((x:any)=>x.caratteristiche_persone?.altro_specificare).filter(isValidString)
    if (caratteristicheAltro.length > 0) {
      stats.push(...getTextStatsOperatori(caratteristicheAltro, 'Caratteristiche Altro', 'Caratteristiche Altro', 'B3_16SPEC'))
    }

    // Tipo interventi (B4_1 - B4_10)
    const tipoInterventi = ['sostegno_formazione', 'sostegno_lavoro', 'sostegno_abitativo', 'sostegno_famiglia', 'sostegno_coetanei', 'sostegno_competenze', 'sostegno_legale', 'sostegno_sociosanitario', 'mediazione_interculturale', 'altro']
    
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

    // Tipo intervento altro specificare (B4_10SPEC)
    const tipoInterventoAltro = data.map((x:any)=>x.tipo_intervento?.altro_specificare).filter(isValidString)
    if (tipoInterventoAltro.length > 0) {
      stats.push(...getTextStatsOperatori(tipoInterventoAltro, 'Tipo Intervento Altro', 'Tipo Intervento Altro', 'B4_10SPEC'))
    }

    // Interventi da potenziare (B5_1 - B5_11)
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

    // Interventi potenziare altro specificare (B5_11SPEC)
    const interventiPotenziareAltro = data.map((x:any)=>x.interventi_potenziare?.altro_specificare).filter(isValidString)
    if (interventiPotenziareAltro.length > 0) {
      stats.push(...getTextStatsOperatori(interventiPotenziareAltro, 'Interventi Potenziare Altro', 'Interventi Potenziare Altro', 'B5_11SPEC'))
    }

    // Difficoltà uscita (C1 - C9, numerici da 1 a 10) - SEMPRE generare statistiche
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
        
        // La percentuale deve essere calcolata sul totale delle risposte valide per questo campo
        const totalRisposteValide = values.length
        
        Object.entries(valueCounts).forEach(([grado, count]) => {
          stats.push({
            Codice: codice,
            Domanda: `Difficoltà Uscita - ${f.replace(/_/g, ' ')}`,
            Risposta: `Grado ${grado}`,
            Frequenza: count,
            Percentuale: `${((count / totalRisposteValide) * 100).toFixed(1)}%`
          })
        })
      }
    })
    const difficoltaAltro = data.map((x:any)=>x.difficolta_uscita?.altro_specificare).filter(isValidString)
    if (difficoltaAltro.length > 0) {
      stats.push(...getTextStatsOperatori(difficoltaAltro, 'Difficoltà Uscita Altro', 'Difficoltà Uscita Altro', 'C9SPEC'))
    }

    return stats
  }

  // Utility per statistiche numeriche giovani
  function getNumericStatsGiovani(arr: any[], label: string, domanda: string, codice: string = ''): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number|string, Percentuale: string}> {
    // Filtra valori numerici validi, includendo lo 0, accettando sia numeri che stringhe numeriche
    const valid = arr
      .map((x: any) => {
        if (x === null || x === undefined) return null
        if (typeof x === 'number' && !isNaN(x)) return x
        if (typeof x === 'string' && x.trim() !== '') {
          const num = parseFloat(x)
          if (!isNaN(num)) return num
        }
        return null
      })
      .filter((x: any) => x !== null) as number[]
    
    if (valid.length === 0) return []
    // La percentuale deve essere calcolata sul totale delle risposte valide
    const total = valid.length
    
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
  function getTextStatsGiovani(arr: any[], label: string, domanda: string, codice: string = ''): Array<{Codice: string, Domanda: string, Risposta: string, Frequenza: number, Percentuale: string}> {
    const valid = arr.filter((x: any) => {
      if (x == null) return false
      if (typeof x !== 'string') return false
      if (x.trim() === '') return false
      return true
    })
    if (valid.length === 0) return []
    // La percentuale deve essere calcolata sul totale delle risposte valide
    const total = valid.length
    const counts = valid.reduce((acc: Record<string, number>, v: string) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    return Object.entries(counts).map(([val, freq]) => ({
      Codice: codice,
      Domanda: domanda,
      Risposta: `${label}: ${val}`,
      Frequenza: freq as number,
      Percentuale: `${(((freq as number) / total) * 100).toFixed(1)}%`
    }))
  }

  function generateGiovaniStats(data: any[]): Array<StatRow> {
    if (data.length === 0) return [{ Codice: '', Domanda: 'Nessun dato disponibile', Risposta: '', Frequenza: 0, Percentuale: '0%' }]
    
    const stats: Array<StatRow> = []
    const total = data.length

    // ==== ORDINE ESATTO DEL TRACCIATO DI ESPORTAZIONE ====

    // 1. Metadati: ID_QUEST, FONTE
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.id), 'ID Questionario', 'ID Questionario', 'ID_QUEST'))
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.creato_da), 'Fonte (Creato da)', 'Fonte (Creato da)', 'FONTE'))

    // 2. PERCAUT (A1 - Percorso autonomia)
    const percAut = data.filter(item => item.percorso_autonomia === true).length
    stats.push({
      Codice: 'PERCAUT',
      Domanda: 'Percorso Autonomia',
      Risposta: 'Sì',
      Frequenza: percAut,
      Percentuale: `${((percAut / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'PERCAUT',
      Domanda: 'Percorso Autonomia',
      Risposta: 'No',
      Frequenza: total - percAut,
      Percentuale: `${(((total - percAut) / total) * 100).toFixed(1)}%`
    })

    // PERCAUT_SPEC
    stats.push(...getTextStatsGiovani(data.map((x:any)=> (x.tipo_percorso || x.percorso_autonomia_spec)), 'Percorso Autonomia Specificare', 'Percorso Autonomia Specificare', 'PERCAUT_SPEC'))

    // 3. VIVE (A2 - Vive in struttura)
    const viveStruttura = data.filter(item => item.vive_in_struttura === true).length
    stats.push({
      Codice: 'VIVE',
      Domanda: 'Vive in Struttura',
      Risposta: 'Sì',
      Frequenza: viveStruttura,
      Percentuale: `${((viveStruttura / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'VIVE',
      Domanda: 'Vive in Struttura',
      Risposta: 'No',
      Frequenza: total - viveStruttura,
      Percentuale: `${(((total - viveStruttura) / total) * 100).toFixed(1)}%`
    })

    // 4. CONDATT (A3 - Collocazione attuale)
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.collocazione_attuale), 'Collocazione Attuale', 'Collocazione Attuale', 'CONDATT'))
    
    // CONDATT_SPEC
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.collocazione_attuale_spec), 'Collocazione Attuale Specificare', 'Collocazione Attuale Specificare', 'CONDATT_SPEC'))

    // 5. FV.1-FV.16 (A4 - Fattori vulnerabilità)
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
      { key: 'fv15_orientamento_sessuale', label: 'Orientamento sessuale', codice: 'FV.15' },
      { key: 'fv16_altro', label: 'Altro', codice: 'FV.16' }
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
        Domanda: `Fattori Vulnerabilità - ${label}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Fattori Vulnerabilità - ${label}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // FV.16_SPEC
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.fattori_vulnerabilita?.fv16_spec), 'Fattori Vulnerabilità Altro Specificare', 'Fattori Vulnerabilità Altro Specificare', 'FV.16_SPEC'))

    // ==== SEZIONE B: DATI ANAGRAFICI ====

    // B1 - Sesso
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.sesso), 'Sesso', 'Sesso', 'B1'))

    // B2 - Classe età
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.classe_eta), 'Classe Età', 'Classe Età', 'B2'))

    // B3 - Luogo nascita
    stats.push(...getNumericStatsGiovani(data.map((x:any)=> {
      if (typeof x.luogo_nascita === 'number') return x.luogo_nascita
      if (x.luogo_nascita?.italia === true) return 1
      if (x.luogo_nascita) return 2
      return 0
    }), 'Luogo Nascita', 'Luogo Nascita', 'B3'))

    // B3SPEC - Luogo nascita altro paese
    stats.push(...getTextStatsGiovani(data.map((x:any)=> (x.luogo_nascita_spec || x.luogo_nascita?.altro_paese)), 'Luogo Nascita Altro Paese', 'Luogo Nascita Altro Paese', 'B3SPEC'))

    // B4 - Cittadinanza
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.cittadinanza), 'Cittadinanza', 'Cittadinanza', 'B4'))

    // B5 - Permesso soggiorno
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.permesso_soggiorno), 'Permesso Soggiorno', 'Permesso Soggiorno', 'B5'))

    // B6 - Tempo in struttura
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.tempo_in_struttura), 'Tempo in Struttura', 'Tempo in Struttura', 'B6'))

    // B7 - Precedenti strutture
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.precedenti_strutture), 'Precedenti Strutture', 'Precedenti Strutture', 'B7'))

    // B8.1-B8.6 - Famiglia origine
    const famigliaOrigine = [
      { membro: 'padre', codice: 'B8.1', label: 'Padre' },
      { membro: 'madre', codice: 'B8.2', label: 'Madre' },
      { membro: 'fratelli', codice: 'B8.3', label: 'Fratelli/Sorelle' },
      { membro: 'nonni', codice: 'B8.4', label: 'Nonni' },
      { membro: 'altri_parenti', codice: 'B8.5', label: 'Altri Parenti' },
      { membro: 'non_parenti', codice: 'B8.6', label: 'Non Parenti/Altri Conviventi' }
    ]
    
    famigliaOrigine.forEach(({ membro, codice, label }) => {
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
        Domanda: `Famiglia Origine - ${label}`,
        Risposta: 'Sì',
        Frequenza: count,
        Percentuale: `${((count / total) * 100).toFixed(1)}%`
      })
      stats.push({
        Codice: codice,
        Domanda: `Famiglia Origine - ${label}`,
        Risposta: 'No',
        Frequenza: total - count,
        Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
      })
    })

    // B9 - Titolo studio madre
    stats.push(...getNumericStatsGiovani(data.map((x:any)=> (x.titolo_studio_madre || x.madre?.titolo_studio || x.madre?.studio || 0)), 'Titolo Studio Madre', 'Titolo Studio Madre', 'B9'))

    // B10 - Situazione lavorativa madre
    stats.push(...getNumericStatsGiovani(data.map((x:any)=> (x.situazione_lavorativa_madre || x.madre?.situazione || x.madre?.lavoro || 0)), 'Situazione Lavorativa Madre', 'Situazione Lavorativa Madre', 'B10'))

    // B11 - Titolo studio padre
    stats.push(...getNumericStatsGiovani(data.map((x:any)=> (x.titolo_studio_padre || x.padre?.titolo_studio || x.padre?.studio || 0)), 'Titolo Studio Padre', 'Titolo Studio Padre', 'B11'))

    // B12 - Situazione lavorativa padre
    stats.push(...getNumericStatsGiovani(data.map((x:any)=> (x.situazione_lavorativa_padre || x.padre?.situazione || x.padre?.lavoro || 0)), 'Situazione Lavorativa Padre', 'Situazione Lavorativa Padre', 'B12'))

    // ==== SEZIONE C: FORMAZIONE, LAVORO, AUTONOMIA ====

    // C1 - Titolo studio
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.titolo_studio), 'Titolo Studio', 'Titolo Studio', 'C1'))

    // C2.1-C2.6 - Attività precedenti - SEMPRE generare
    if (true) {
      const attivitaPrecCodici = ['C2.1', 'C2.2', 'C2.3', 'C2.4', 'C2.5', 'C2.6'];
      const attivitaPrecFields = [
        { key: 'studiavo', label: 'Studiavo' },
        { key: 'lavoravo_stabile', altKey: 'lavoravo_stabilmente', label: 'Lavoravo stabilmente' },
        { key: 'lavoravo_saltuario', altKey: 'lavoravo_saltuariamente', label: 'Lavoravo saltuariamente' },
        { key: 'corso_formazione', label: 'Corso formazione' },
        { key: 'altro', label: 'Altro' },
        { key: 'nessuna', label: 'Nessuna' }
      ];
      
      attivitaPrecFields.forEach((field, idx) => {
        const count = data.filter(item => {
          if (field.altKey) {
            return item.attivita_precedenti?.[field.key] === true || item.attivita_precedenti?.[field.altKey] === true
          }
          return item.attivita_precedenti?.[field.key] === true
        }).length
        
        stats.push({
          Codice: attivitaPrecCodici[idx],
          Domanda: `Attività Precedenti - ${field.label}`,
          Risposta: 'Sì',
          Frequenza: count,
          Percentuale: `${((count / total) * 100).toFixed(1)}%`
        })
        stats.push({
          Codice: attivitaPrecCodici[idx],
          Domanda: `Attività Precedenti - ${field.label}`,
          Risposta: 'No',
          Frequenza: total - count,
          Percentuale: `${(((total - count) / total) * 100).toFixed(1)}%`
        })
      })
    }

    // C2.5SPEC - Attività precedenti altro specificare
    const attivitaPrecedentiAltro = data.map((x:any)=>(x.attivita_precedenti?.altro_spec || x.attivita_precedenti?.altro_specificare)).filter(isValidString)
    if (attivitaPrecedentiAltro.length > 0) {
      stats.push(...getTextStatsGiovani(attivitaPrecedentiAltro, 'Attività Precedenti Altro Specificare', 'Attività Precedenti Altro Specificare', 'C2.5SPEC'))
    }

    // C3 - Orientamento lavoro
    const orientamentoLavoroCount = data.filter(item => item.orientamento_lavoro?.usufruito === true || item.orientamento_lavoro === true || item.orientamento_lavoro === 1).length
    stats.push({
      Codice: 'C3',
      Domanda: 'Orientamento Lavoro',
      Risposta: 'Sì',
      Frequenza: orientamentoLavoroCount,
      Percentuale: `${((orientamentoLavoroCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'C3',
      Domanda: 'Orientamento Lavoro',
      Risposta: 'No',
      Frequenza: total - orientamentoLavoroCount,
      Percentuale: `${(((total - orientamentoLavoroCount) / total) * 100).toFixed(1)}%`
    })

    // C4.1-C4.5 - Orientamento luoghi - SEMPRE generare
    if (true) {
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
    }

    // C4.5SPEC - Orientamento luoghi altro specificare
    const orientamentoLuoghiAltro = data.map((x:any)=>x.orientamento_luoghi?.altro_spec).filter(isValidString)
    if (orientamentoLuoghiAltro.length > 0) {
      stats.push(...getTextStatsGiovani(orientamentoLuoghiAltro, 'Orientamento Luoghi Altro Specificare', 'Orientamento Luoghi Altro Specificare', 'C4.5SPEC'))
    }

    // C4_BIS - Utilità servizio orientamento
    stats.push(...getNumericStatsGiovani(data.map((x:any)=>x.utilita_servizio), 'Utilità Servizio Orientamento', 'Utilità Servizio Orientamento', 'C4_BIS'))

    // C5.1-C5.5 - Attività attuali - SEMPRE generare
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

    // C6 - Motivo non studio (campo numerico) - Sempre mostra anche se vuoto
    // Nel database si salva come motivi_non_studio (array), prendiamo il primo elemento
    const c6Stats = getNumericStatsGiovani(
      data.map((x:any)=> {
        // Prova entrambi i formati: array e singolo valore
        if (Array.isArray(x.motivi_non_studio) && x.motivi_non_studio.length > 0) {
          return parseInt(x.motivi_non_studio[0])
        }
        return x.motivo_non_studio || null
      }), 
      'Motivo Non Studio', 
      'Motivo Non Studio', 
      'C6'
    )
    if (c6Stats.length > 0) {
      stats.push(...c6Stats)
    } else {
      stats.push({
        Codice: 'C6',
        Domanda: 'Motivo Non Studio',
        Risposta: 'Nessun dato disponibile',
        Frequenza: 0,
        Percentuale: '0%'
      })
    }

    // C7 - Corso frequentato (campo testuale) - Sempre mostra anche se vuoto
    // Nel database si salva come corso_formazione.descrizione
    const corsoFrequentato = data.map((x:any)=> x.corso_formazione?.descrizione || x.corso_frequentato || '').filter(isValidString)
    if (corsoFrequentato.length > 0) {
      stats.push(...getTextStatsGiovani(corsoFrequentato, 'Corso Frequentato', 'Corso Frequentato', 'C7'))
    } else {
      stats.push({
        Codice: 'C7',
        Domanda: 'Corso Frequentato',
        Risposta: 'Nessun dato disponibile',
        Frequenza: 0,
        Percentuale: '0%'
      })
    }

    // C8 - Lavoro attuale (campo testuale) - Sempre mostra anche se vuoto
    // Nel database si salva come lavoro_attuale.descrizione (oggetto)
    const lavoroAttuale = data.map((x:any)=> x.lavoro_attuale?.descrizione || x.lavoro_attuale || '').filter(isValidString)
    if (lavoroAttuale.length > 0) {
      stats.push(...getTextStatsGiovani(lavoroAttuale, 'Lavoro Attuale', 'Lavoro Attuale', 'C8'))
    }

    // C8.1-C8.4 - Livelli utilità
    // SEMPRE generare
    if (true) {
      const livelliLabels = ['Studiare', 'Formazione', 'Lavorare', 'Ricerca Lavoro']
      const livelliCodici = ['C8.1', 'C8.2', 'C8.3', 'C8.4']
      const utilitaLabels = ['Per niente', 'Poco', 'Abbastanza', 'Molto']
      
      livelliLabels.forEach((label, index) => {
        const values = data.map(item => item.livelli_utilita?.[index]).filter(val => val !== undefined && val !== '' && val !== null)
        
        if (values.length > 0) {
          const valueCounts = values.reduce((acc: Record<string, number>, val) => {
            const utilitaLabel = utilitaLabels[val] || `Valore ${val}`
            acc[utilitaLabel] = (acc[utilitaLabel] || 0) + 1
            return acc
          }, {})
          
          // La percentuale deve essere calcolata sul totale delle risposte valide per questo campo
          const totalRisposteValide = values.length
          
          Object.entries(valueCounts).forEach(([utilitaLabel, count]) => {
          stats.push({
              Codice: livelliCodici[index],
            Domanda: `Livelli Utilità - ${label}`,
              Risposta: utilitaLabel,
            Frequenza: count,
            Percentuale: `${((count / totalRisposteValide) * 100).toFixed(1)}%`
            })
          })
        }
      })
    }

    // C9.1-C9.11 - Canali ricerca lavoro - SEMPRE generare
    if (true) {
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
      }

    // C9.11SPEC - Canali ricerca lavoro altro specificare
    const canaliRicercaLavoroAltro = data.map((x:any)=>(x.ricerca_lavoro?.altro_spec || x.ricerca_lavoro?.altro_specificare)).filter(isValidString)
    if (canaliRicercaLavoroAltro.length > 0) {
      stats.push(...getTextStatsGiovani(canaliRicercaLavoroAltro, 'Canali Ricerca Lavoro Altro Specificare', 'Canali Ricerca Lavoro Altro Specificare', 'C9.11SPEC'))
    }

    // C10 - Curriculum vitae
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

    // C11 - Centro impiego
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

    // C12 - Lavoro autonomo
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

    // C13.1-C13.8 - Condizioni lavoro (valori numerici 0-3) - SEMPRE generare
    const condizioniCodici = ['C13.1', 'C13.2', 'C13.3', 'C13.4', 'C13.5', 'C13.6', 'C13.7', 'C13.8'];
    const condizioniLabels = ['Stabilità', 'Flessibilità', 'Valorizzazione', 'Retribuzione', 'Fatica', 'Sicurezza', 'Utilità Sociale', 'Vicinanza Casa'];
    (['stabilita','flessibilita','valorizzazione','retribuzione','fatica','sicurezza','utilita_sociale','vicinanza_casa'] as const).forEach((f: any, idx) => {
      const values = data.map((x:any)=> (x.condizioni_lavoro?.[f] || x.aspetti_lavoro?.[f]))
      const c13Stats = getNumericStatsGiovani(values, condizioniLabels[idx], `Condizioni Lavoro - ${condizioniLabels[idx]}`, condizioniCodici[idx])
      if (c13Stats.length > 0) {
        stats.push(...c13Stats)
      } else {
        // Mostra sempre anche se vuoto
        stats.push({
          Codice: condizioniCodici[idx],
          Domanda: `Condizioni Lavoro - ${condizioniLabels[idx]}`,
          Risposta: 'Nessun dato disponibile',
          Frequenza: 0,
          Percentuale: '0%'
        })
      }
    })

    // ==== SEZIONE D: ABITAZIONE E SUPPORTO ====

    // D1.1-D1.10 - Abitazione precedente - SEMPRE generare
    if (true) {
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

    // D2.1-D2.10 - Figura aiuto - SEMPRE generare
    if (true) {
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
    }

    // D2.10SPEC - Figura aiuto altre persone specificare
    const figuraAiutoAltriSpec = data.map((x:any)=>x.figura_aiuto?.altre_persone_spec).filter(isValidString)
    if (figuraAiutoAltriSpec.length > 0) {
      stats.push(...getTextStatsGiovani(figuraAiutoAltriSpec, 'Figura Aiuto Altre Persone Specificare', 'Figura Aiuto Altre Persone Specificare', 'D2.10SPEC'))
    }

    // ==== SEZIONE E: PROSPETTIVE FUTURE ====

    // E1.1-E1.8 - Preoccupazioni futuro (valori numerici 0-3: Per niente, Poco, Abbastanza, Molto)
    // SEMPRE generare
    if (true) {
      const preoccupazioniLabels = ['Per niente', 'Poco', 'Abbastanza', 'Molto'];
      const preoccupazioniCodici = ['E1.1', 'E1.2', 'E1.3', 'E1.4', 'E1.5', 'E1.6', 'E1.7', 'E1.8'];
      
      (['pregiudizi','mancanza_lavoro','mancanza_aiuto','mancanza_casa','solitudine','salute','perdita_persone','altro'] as const).forEach((f: any, idx) => {
        const values = data.map(item => item.preoccupazioni_futuro?.[f]).filter(val => val !== undefined && val !== '' && val !== null)
        
        if (values.length > 0) {
          const valueCounts = values.reduce((acc: Record<string, number>, val) => {
            const preoccupazioneLabel = preoccupazioniLabels[val] || `Valore ${val}`
            acc[preoccupazioneLabel] = (acc[preoccupazioneLabel] || 0) + 1
            return acc
          }, {})
          
          // La percentuale deve essere calcolata sul totale delle risposte valide per questo campo
          const totalRisposteValide = values.length
          
          Object.entries(valueCounts).forEach(([preoccupazioneLabel, count]) => {
          stats.push({
              Codice: preoccupazioniCodici[idx],
            Domanda: `Preoccupazioni Futuro - ${f.replace(/_/g, ' ')}`,
              Risposta: preoccupazioneLabel,
            Frequenza: count,
            Percentuale: `${((count / totalRisposteValide) * 100).toFixed(1)}%`
            })
          })
        }
      })
      }

    // E1.8SPEC - Preoccupazioni futuro altro specificare
    const preoccupazioniFuturoAltroSpec = data.map((x:any)=>x.preoccupazioni_futuro?.altro_spec).filter(isValidString)
    if (preoccupazioniFuturoAltroSpec.length > 0) {
      stats.push(...getTextStatsGiovani(preoccupazioniFuturoAltroSpec, 'Preoccupazioni Futuro Altro Specificare', 'Preoccupazioni Futuro Altro Specificare', 'E1.8SPEC'))
    }

    // E2.1-E2.6 - Obiettivi realizzabili (valori numerici 0-3: Per niente, Poco, Abbastanza, Molto)
    // SEMPRE generare
    if (true) {
      const obiettiviLabels = ['Per niente', 'Poco', 'Abbastanza', 'Molto'];
      const obiettiviCodici = ['E2.1', 'E2.2', 'E2.3', 'E2.4', 'E2.5', 'E2.6'];
      
      (['lavoro_piacevole','autonomia','famiglia','trovare_lavoro','salute','casa'] as const).forEach((f: any, idx) => {
        const values = data.map(item => item.obiettivi_realizzabili?.[f]).filter(val => val !== undefined && val !== '' && val !== null)
        
        if (values.length > 0) {
          const valueCounts = values.reduce((acc: Record<string, number>, val) => {
            const obiettivoLabel = obiettiviLabels[val] || `Valore ${val}`
            acc[obiettivoLabel] = (acc[obiettivoLabel] || 0) + 1
            return acc
          }, {})
          
          // La percentuale deve essere calcolata sul totale delle risposte valide per questo campo
          const totalRisposteValide = values.length
          
          Object.entries(valueCounts).forEach(([obiettivoLabel, count]) => {
          stats.push({
              Codice: obiettiviCodici[idx],
            Domanda: `Obiettivi Realizzabili - ${f.replace(/_/g, ' ')}`,
              Risposta: obiettivoLabel,
            Frequenza: count,
            Percentuale: `${((count / totalRisposteValide) * 100).toFixed(1)}%`
            })
          })
        }
      })
    }

    // E3 - Aiuto futuro (campo testuale)
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.aiuto_futuro), 'Aiuto Futuro', 'Aiuto Futuro', 'E3'))

    // E4 - Pronto uscita (boolean or object with pronto property)
    const prontoUscitaCount = data.filter(item => {
      if (typeof item.pronto_uscita === 'object' && item.pronto_uscita !== null) {
        return item.pronto_uscita.pronto === true
      }
      return item.pronto_uscita === true || item.pronto_uscita === 1 || item.pronto_uscita === '1'
    }).length
    stats.push({
      Codice: 'E4',
      Domanda: 'Pronto Uscita',
      Risposta: 'Sì',
      Frequenza: prontoUscitaCount,
      Percentuale: `${((prontoUscitaCount / total) * 100).toFixed(1)}%`
    })
    stats.push({
      Codice: 'E4',
      Domanda: 'Pronto Uscita',
      Risposta: 'No',
      Frequenza: total - prontoUscitaCount,
      Percentuale: `${(((total - prontoUscitaCount) / total) * 100).toFixed(1)}%`
    })
    
    // E4.1 - Pronto uscita perché no (campo testuale)
    stats.push(...getTextStatsGiovani(data.map((x:any)=> {
      if (typeof x.pronto_uscita === 'object' && x.pronto_uscita !== null && !x.pronto_uscita.pronto) {
        return x.pronto_uscita.motivazione
      }
      return x.pronto_uscita_perche_no
    }), 'Pronto Uscita Perché No', 'Pronto Uscita Perché No', 'E4.1'))
    
    // E4.2 - Pronto uscita perché sì (campo testuale)
    stats.push(...getTextStatsGiovani(data.map((x:any)=> {
      if (typeof x.pronto_uscita === 'object' && x.pronto_uscita !== null && x.pronto_uscita.pronto) {
        return x.pronto_uscita.motivazione
      }
      return x.pronto_uscita_perche_si
    }), 'Pronto Uscita Perché Sì', 'Pronto Uscita Perché Sì', 'E4.2'))

    // E5.1-E5.10 - Emozioni uscita
    // SEMPRE generare
    if (true) {
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

    // E6 - Desiderio (campo testuale)
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.desiderio), 'Desiderio', 'Desiderio', 'E6'))

    // E7 - Nota aggiuntiva (campo testuale)
    stats.push(...getTextStatsGiovani(data.map((x:any)=>x.nota_aggiuntiva), 'Nota Aggiuntiva', 'Nota Aggiuntiva', 'E7'))

    return stats
  }

  // Funzione per generare statistiche incrociate
  const generateCrosstabs = async () => {
    try {
      toast.success('Generazione statistiche incrociate in corso...')
      
      // Recupera i dati dei giovani
      const { data: giovaniData, error } = await supabase.from('operatorinew').select('*')
      
      if (error) throw error
      if (!giovaniData || giovaniData.length === 0) {
        toast.error('Nessun questionario giovani trovato')
        return
      }

      // Carica le definizioni delle tabelle da generare (dal file locale)
      const crosstabsDef = await fetch('/incrociate-data.json')
        .then(res => res.json())

      // Dividi in gruppi più piccoli (max 200 fogli per file per evitare limiti Excel/browser)
      const groups = [
        { start: 0, end: 200, name: 'Parte_1_Record_001-200' },
        { start: 200, end: 400, name: 'Parte_2_Record_201-400' },
        { start: 400, end: 600, name: 'Parte_3_Record_401-600' },
        { start: 600, end: 800, name: 'Parte_4_Record_601-800' },
        { start: 800, end: 895, name: 'Parte_5_Record_801-895' },
        { start: 895, end: 944, name: 'Parte_6_Record_896-944_Filtri' }
      ]

      // Crea UN SOLO FILE con più fogli
      const workbook = XLSX.utils.book_new()
      
      // Genera un foglio per ogni gruppo
      for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
        const group = groups[groupIdx]
        
        toast.success(`Generazione ${group.name}...`)
        
        // Array che conterrà tutte le righe di questo foglio
        const allRows: any[][] = []
        
        for (let i = group.start; i < group.end; i++) {
          const def = crosstabsDef[i] as any
          
          try {
            // Aggiungi intestazione VERDE con numero record e campi
            allRows.push([`RECORD ${def.PROG}: ${def.RIGHE} x ${def.COLONNE}`])
            allRows.push([]) // Riga vuota dopo l'intestazione
            
            const crosstab = buildCrosstab(giovaniData, def.RIGHE, def.COLONNE)
            
            // Aggiungi le righe della tabella
            allRows.push(...crosstab)
            
            // Aggiungi 2 righe vuote tra una tabella e l'altra
            allRows.push([])
            allRows.push([])
          } catch (err) {
            console.error(`Errore nella tabella ${def.PROG}:`, err)
          }
          
          // Aggiorna progresso
          if (i % 50 === 0) {
            toast.success(`${group.name}: elaborate ${i - group.start + 1} / ${group.end - group.start} tabelle...`)
          }
        }

        // Crea il foglio con tutte le tabelle impilate
        const ws = XLSX.utils.aoa_to_sheet(allRows)
        
        // Applica formattazione verde alle intestazioni dei record
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
        for (let R = range.s.r; R <= range.e.r; R++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: 0 })
          const cell = ws[cellAddress]
          if (cell && cell.v && typeof cell.v === 'string' && cell.v.startsWith('RECORD')) {
            // Applica stile verde grassetto
            cell.s = {
              fill: { fgColor: { rgb: '92D050' } }, // Verde
              font: { bold: true, sz: 12, color: { rgb: '000000' } },
              alignment: { horizontal: 'left', vertical: 'center' }
            }
          }
        }
        
        const sheetName = `Foglio ${groupIdx + 1} (${group.start + 1}-${group.end})`
        XLSX.utils.book_append_sheet(workbook, ws, sheetName)
        
        toast.success(`${group.name} completato!`)
      }

      // Salva UN SOLO file
      const fileName = `statistiche_incrociate_completo_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`
      XLSX.writeFile(workbook, fileName)

      toast.success('File con tutte le statistiche incrociate generato con successo!')
    } catch (error) {
      console.error('Errore:', error)
      toast.error('Errore nella generazione delle statistiche incrociate')
    }
  }

  // Funzione helper per costruire una singola tabella incrociata
  function buildCrosstab(data: any[], rowField: string, colField: string): any[][] {
    // Filtra i dati se il rowField è un criterio (es. "SOMMA D2.1+D2.2...")
    let filteredData = data
    if (rowField.includes('SOMMA')) {
      filteredData = applyFilter(data, rowField)
      rowField = colField // Per i filtri, usiamo solo le colonne
    }

    // Estrai i valori per righe e colonne
    const rowValues = extractValues(filteredData, rowField)
    const colValues = extractValues(filteredData, colField)

    // Costruisci la tabella
    const result: any[][] = []
    
    // Intestazione con nome del campo colonne
    result.push([getFieldLabel(colField)])
    result.push([]) // Riga vuota
    
    // Header della tabella
    const colKeys = Array.from(new Set(colValues.map(v => v.value))).sort()
    result.push([getFieldLabel(rowField), ...colKeys.map(k => formatValue(colField, k)), 'Totale complessivo'])

    // Righe dei dati
    const rowKeys = Array.from(new Set(rowValues.map(v => v.value))).sort()
    rowKeys.forEach(rowKey => {
      const row: any[] = [formatValue(rowField, rowKey)]
      let rowTotal = 0
      
      colKeys.forEach(colKey => {
        const count = countMatches(filteredData, rowField, rowKey, colField, colKey)
        row.push(count)
        rowTotal += count
      })
      
      row.push(rowTotal)
      result.push(row)
    })

    // Riga totale
    const totalRow: any[] = ['Totale complessivo']
    let grandTotal = 0
    colKeys.forEach(colKey => {
      const colTotal = countMatchesCol(filteredData, colField, colKey)
      totalRow.push(colTotal)
      grandTotal += colTotal
    })
    totalRow.push(grandTotal)
    result.push(totalRow)

    return result
  }

  // Funzione per applicare filtri (es. SOMMA D2.1+D2.2...)
  function applyFilter(data: any[], filterExpr: string): any[] {
    if (filterExpr.includes('SOMMA D2.1+D2.2+D2.3+D2.4+D2.5)>0')) {
      return data.filter(item => {
        const sum = (item.figura_aiuto?.padre ? 1 : 0) +
                    (item.figura_aiuto?.madre ? 1 : 0) +
                    (item.figura_aiuto?.fratelli ? 1 : 0) +
                    (item.figura_aiuto?.altri_parenti ? 1 : 0) +
                    (item.figura_aiuto?.amici ? 1 : 0)
        return sum > 0
      })
    }
    if (filterExpr.includes('SOMMA D2.6+D2.7+D2.8)>0')) {
      return data.filter(item => {
        const sum = (item.figura_aiuto?.tutore ? 1 : 0) +
                    (item.figura_aiuto?.insegnanti ? 1 : 0) +
                    (item.figura_aiuto?.figure_sostegno ? 1 : 0)
        return sum > 0
      })
    }
    return data
  }

  // Funzione per estrarre valori da un campo
  function extractValues(data: any[], field: string): Array<{id: string, value: any}> {
    return data.map((item, idx) => ({
      id: item.id || idx.toString(),
      value: getFieldValue(item, field)
    }))
  }

  // Funzione per ottenere il valore di un campo dal questionario
  function getFieldValue(item: any, field: string): any {
    const fieldMap: Record<string, any> = {
      // Fattori vulnerabilità (FV.1 - FV.16)
      'FV.1': () => item.fattori_vulnerabilita?.fv1_stranieri ? 1 : 0,
      'FV.2': () => item.fattori_vulnerabilita?.fv2_vittime_tratta ? 1 : 0,
      'FV.3': () => item.fattori_vulnerabilita?.fv3_vittime_violenza ? 1 : 0,
      'FV.4': () => item.fattori_vulnerabilita?.fv4_allontanati_famiglia ? 1 : 0,
      'FV.5': () => item.fattori_vulnerabilita?.fv5_detenuti ? 1 : 0,
      'FV.6': () => item.fattori_vulnerabilita?.fv6_ex_detenuti ? 1 : 0,
      'FV.7': () => item.fattori_vulnerabilita?.fv7_esecuzione_penale ? 1 : 0,
      'FV.8': () => item.fattori_vulnerabilita?.fv8_indigenti ? 1 : 0,
      'FV.9': () => item.fattori_vulnerabilita?.fv9_rom_sinti ? 1 : 0,
      'FV.10': () => item.fattori_vulnerabilita?.fv10_disabilita_fisica ? 1 : 0,
      'FV.11': () => item.fattori_vulnerabilita?.fv11_disabilita_cognitiva ? 1 : 0,
      'FV.12': () => item.fattori_vulnerabilita?.fv12_disturbi_psichiatrici ? 1 : 0,
      'FV.13': () => item.fattori_vulnerabilita?.fv13_dipendenze ? 1 : 0,
      'FV.14': () => item.fattori_vulnerabilita?.fv14_genitori_precoci ? 1 : 0,
      'FV.15': () => item.fattori_vulnerabilita?.fv15_orientamento_sessuale ? 1 : 0,
      'FV.16': () => item.fattori_vulnerabilita?.fv16_altro ? 1 : 0,
      
      // Sezione B - Dati anagrafici
      'B1': () => item.sesso || 0,
      'B2': () => item.classe_eta || 0,
      'B4': () => item.cittadinanza || 0,
      'B6': () => item.tempo_in_struttura || 0,
      'B9': () => item.titolo_studio_madre || item.madre?.titolo_studio || 0,
      'B11': () => item.titolo_studio_padre || item.padre?.titolo_studio || 0,
      
      // Sezione C - Formazione e lavoro
      'C1': () => item.titolo_studio || 0,
      'C2.1': () => item.attivita_precedenti?.studiavo ? 1 : 0,
      'C2.2': () => (item.attivita_precedenti?.lavoravo_stabile || item.attivita_precedenti?.lavoravo_stabilmente) ? 1 : 0,
      'C2.3': () => (item.attivita_precedenti?.lavoravo_saltuario || item.attivita_precedenti?.lavoravo_saltuariamente) ? 1 : 0,
      'C2.4': () => item.attivita_precedenti?.corso_formazione ? 1 : 0,
      'C2.5': () => item.attivita_precedenti?.altro ? 1 : 0,
      'C2.6': () => item.attivita_precedenti?.nessuna ? 1 : 0,
      'C3': () => item.orientamento_lavoro?.usufruito ? 1 : 0,
      'C4.1': () => item.orientamento_luoghi?.scuola ? 1 : 0,
      'C4.2': () => item.orientamento_luoghi?.enti_formazione ? 1 : 0,
      'C4.3': () => item.orientamento_luoghi?.servizi_impiego ? 1 : 0,
      'C4.4': () => item.orientamento_luoghi?.struttura ? 1 : 0,
      'C4.5': () => item.orientamento_luoghi?.altro ? 1 : 0,
      'C5.1': () => item.attivita_attuali?.studio ? 1 : 0,
      'C5.2': () => item.attivita_attuali?.formazione ? 1 : 0,
      'C5.3': () => item.attivita_attuali?.lavoro ? 1 : 0,
      'C5.4': () => item.attivita_attuali?.ricerca_lavoro ? 1 : 0,
      'C5.5': () => item.attivita_attuali?.nessuna ? 1 : 0,
      
      // Sezione D - Figure di aiuto
      'D2.1': () => item.figura_aiuto?.padre ? 1 : 0,
      'D2.2': () => item.figura_aiuto?.madre ? 1 : 0,
      'D2.3': () => item.figura_aiuto?.fratelli ? 1 : 0,
      'D2.4': () => item.figura_aiuto?.altri_parenti ? 1 : 0,
      'D2.5': () => item.figura_aiuto?.amici ? 1 : 0,
      'D2.6': () => item.figura_aiuto?.tutore ? 1 : 0,
      'D2.7': () => item.figura_aiuto?.insegnanti ? 1 : 0,
      'D2.8': () => item.figura_aiuto?.figure_sostegno ? 1 : 0,
      'D2.9': () => item.figura_aiuto?.volontari ? 1 : 0,
      'D2.10': () => item.figura_aiuto?.altre_persone ? 1 : 0,
      
      // Sezione E - Preoccupazioni e obiettivi
      'E1.1': () => item.preoccupazioni_futuro?.pregiudizi || 0,
      'E1.2': () => item.preoccupazioni_futuro?.solitudine || 0,
      'E1.3': () => item.preoccupazioni_futuro?.relazioni || 0,
      'E1.4': () => item.preoccupazioni_futuro?.trovare_lavoro || 0,
      'E1.5': () => item.preoccupazioni_futuro?.mantenimento || 0,
      'E1.6': () => item.preoccupazioni_futuro?.salute || 0,
      'E1.7': () => item.preoccupazioni_futuro?.casa || 0,
      'E1.8': () => item.preoccupazioni_futuro?.documenti || 0,
      'E2.1': () => item.obiettivi_realizzabili?.pregiudizi || 0,
      'E2.2': () => item.obiettivi_realizzabili?.solitudine || 0,
      'E2.3': () => item.obiettivi_realizzabili?.relazioni || item.obiettivi_realizzabili?.famiglia || 0,
      'E2.4': () => item.obiettivi_realizzabili?.trovare_lavoro || 0,
      'E2.5': () => item.obiettivi_realizzabili?.salute || 0,
      'E2.6': () => item.obiettivi_realizzabili?.casa || 0,
      'E2.7': () => item.obiettivi_realizzabili?.documenti || 0,
      'E2.8': () => item.obiettivi_realizzabili?.mantenimento || 0,
      'E3': () => item.aiuto_futuro ? 1 : 0,
      'E4': () => {
        if (typeof item.pronto_uscita === 'object' && item.pronto_uscita !== null && 'pronto' in item.pronto_uscita) {
          return item.pronto_uscita.pronto ? 1 : 0
        }
        return item.pronto_uscita ? 1 : 0
      },
      'E5.1': () => item.emozioni_uscita?.felicita ? 1 : 0,
      'E5.2': () => item.emozioni_uscita?.tristezza ? 1 : 0,
      'E5.3': () => item.emozioni_uscita?.curiosita ? 1 : 0,
      'E5.4': () => item.emozioni_uscita?.preoccupazione ? 1 : 0,
      'E5.5': () => item.emozioni_uscita?.paura ? 1 : 0,
      'E5.6': () => item.emozioni_uscita?.liberazione ? 1 : 0,
      'E5.7': () => item.emozioni_uscita?.solitudine ? 1 : 0,
      'E5.8': () => item.emozioni_uscita?.rabbia ? 1 : 0,
      'E5.9': () => item.emozioni_uscita?.speranza ? 1 : 0,
      'E5.10': () => item.emozioni_uscita?.determinazione ? 1 : 0,
      'E6': () => item.desiderio ? 1 : 0,
      'PERCAUT': () => item.percorso_autonomia ? 1 : 0,
      'VIVE': () => item.vive_in_struttura ? 1 : 0,
    }

    const getter = fieldMap[field]
    return getter ? getter() : null
  }

  // Funzione per ottenere l'etichetta di un campo
  function getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      'FV.1': 'Stranieri', 'FV.2': 'Vittime tratta', 'FV.3': 'Vittime violenza',
      'FV.4': 'Allontanati famiglia', 'FV.5': 'Detenuti', 'FV.6': 'Ex detenuti',
      'FV.7': 'Esecuzione penale', 'FV.8': 'Indigenti', 'FV.9': 'Rom/Sinti',
      'FV.10': 'Disabilità fisica', 'FV.11': 'Disabilità cognitiva', 
      'FV.12': 'Disturbi psichiatrici', 'FV.13': 'Dipendenze',
      'FV.14': 'Genitori precoci', 'FV.15': 'Orientamento sessuale', 'FV.16': 'Altro',
      'B1': 'Sesso', 'B2': 'Classe età', 'B4': 'Cittadinanza', 'B6': 'Tempo in struttura',
      'B9': 'Titolo studio madre', 'B11': 'Titolo studio padre',
      'C1': 'Titolo studio', 
      'C2.1': 'Studiavo', 'C2.2': 'Lavoravo stabilmente', 'C2.3': 'Lavoravo saltuariamente',
      'C2.4': 'Corso formazione', 'C2.5': 'Altro', 'C2.6': 'Nessuna',
      'C3': 'Orientamento lavoro', 
      'C4.1': 'Scuola/Università', 'C4.2': 'Enti formazione', 'C4.3': 'Servizi impiego',
      'C4.4': 'Struttura', 'C4.5': 'Altro',
      'C5.1': 'Studio', 'C5.2': 'Formazione', 'C5.3': 'Lavoro',
      'C5.4': 'Ricerca lavoro', 'C5.5': 'Nessuna',
      'D2.1': 'Padre', 'D2.2': 'Madre', 'D2.3': 'Fratelli', 'D2.4': 'Altri parenti',
      'D2.5': 'Amici', 'D2.6': 'Tutore', 'D2.7': 'Insegnanti', 'D2.8': 'Figure sostegno',
      'D2.9': 'Volontari', 'D2.10': 'Altre persone',
      'E1.1': 'Pregiudizi nei miei confronti', 'E1.2': 'Solitudine', 'E1.3': 'Relazioni familiari',
      'E1.4': 'Trovare lavoro', 'E1.5': 'Mantenimento economico', 'E1.6': 'Salute',
      'E1.7': 'Casa', 'E1.8': 'Documenti',
      'E2.1': 'Pregiudizi nei miei confronti', 'E2.2': 'Solitudine', 'E2.3': 'Famiglia',
      'E2.4': 'Trovare lavoro', 'E2.5': 'Salute', 'E2.6': 'Avere una casa',
      'E2.7': 'Documenti', 'E2.8': 'Mantenimento economico',
      'E3': 'Aiuto futuro', 'E4': 'Pronto uscita',
      'E5.1': 'Felicità', 'E5.2': 'Tristezza', 'E5.3': 'Curiosità',
      'E5.4': 'Preoccupazione', 'E5.5': 'Paura', 'E5.6': 'Liberazione',
      'E5.7': 'Solitudine', 'E5.8': 'Rabbia', 'E5.9': 'Speranza', 'E5.10': 'Determinazione',
      'E6': 'Desiderio', 'PERCAUT': 'Percorso autonomia', 'VIVE': 'Vive in struttura'
    }
    return labels[field] || field
  }

  // Funzione per formattare un valore per la visualizzazione
  function formatValue(field: string, value: any): string {
    if (value === null || value === undefined) return 'N/D'
    
    // Campi binari (0/1) -> No/Sì
    const binaryFields = ['FV.1', 'FV.2', 'FV.3', 'FV.4', 'FV.5', 'FV.6', 'FV.7', 'FV.8', 'FV.9', 
      'FV.10', 'FV.11', 'FV.12', 'FV.13', 'FV.14', 'FV.15', 'FV.16',
      'C2.1', 'C2.2', 'C2.3', 'C2.4', 'C2.5', 'C2.6', 'C3', 
      'C4.1', 'C4.2', 'C4.3', 'C4.4', 'C4.5', 
      'C5.1', 'C5.2', 'C5.3', 'C5.4', 'C5.5',
      'D2.1', 'D2.2', 'D2.3', 'D2.4', 'D2.5', 'D2.6', 'D2.7', 'D2.8', 'D2.9', 'D2.10',
      'E3', 'E4', 'E5.1', 'E5.2', 'E5.3', 'E5.4', 'E5.5', 'E5.6', 'E5.7', 'E5.8', 'E5.9', 'E5.10', 'E6',
      'PERCAUT', 'VIVE']
    
    if (binaryFields.includes(field)) {
      return value === 1 ? 'Sì' : 'No'
    }
    
    // Campi con scale di valutazione (0-3) per E1 ed E2
    const scaleFields = ['E1.1', 'E1.2', 'E1.3', 'E1.4', 'E1.5', 'E1.6', 'E1.7', 'E1.8',
      'E2.1', 'E2.2', 'E2.3', 'E2.4', 'E2.5', 'E2.6', 'E2.7', 'E2.8']
    
    if (scaleFields.includes(field)) {
      const labels = ['per niente', 'poco', 'abbastanza', 'molto']
      if (field.startsWith('E2')) {
        labels.push('Non è mio obiettivo')
      }
      return labels[value] || String(value)
    }
    
    return String(value)
  }

  // Funzione per contare le corrispondenze
  function countMatches(data: any[], rowField: string, rowValue: any, colField: string, colValue: any): number {
    return data.filter(item => {
      const rowMatch = getFieldValue(item, rowField) === rowValue
      const colMatch = getFieldValue(item, colField) === colValue
      return rowMatch && colMatch
    }).length
  }

  // Funzione per contare le corrispondenze solo per colonna (per i totali)
  function countMatchesCol(data: any[], colField: string, colValue: any): number {
    return data.filter(item => getFieldValue(item, colField) === colValue).length
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
            onClick={generateCrosstabs}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Statistiche Incrociate
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