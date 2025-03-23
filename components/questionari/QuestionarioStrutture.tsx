'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { QuestionarioStrutture } from '@/types/questionari'

type Struttura = Database['public']['Tables']['strutture']['Row']

const FORME_GIURIDICHE = [
  { value: '1', label: 'Ente pubblico' },
  { value: '2', label: 'Impresa for profit (ditta individuale, SNC, SAS, SS, SRL, SRLS, SPA, SAPA)' },
  { value: '3', label: 'Cooperativa' },
  { value: '4', label: 'Impresa sociale (o Cooperativa sociale)' },
  { value: '5', label: 'Ente filantropico (o Fondazione)' },
  { value: '6', label: 'Associazione di promozione sociale' },
  { value: '7', label: 'Organizzazione di volontariato' },
  { value: '8', label: 'Rete associativa' },
  { value: '9', label: 'Società di mutuo soccorso' },
  { value: '10', label: 'Altro' }
]

const TIPI_STRUTTURA = [
  'Comunità educativa',
  'Casa famiglia',
  'Gruppo appartamento',
  'Centro diurno',
  'Altro'
]

const FIGURE_PROFESSIONALI: Array<{id: keyof QuestionarioStrutture['figure_professionali'], label: string}> = [
  { id: 'psicologi', label: 'Psicologi' },
  { id: 'assistenti_sociali', label: 'Assistenti sociali' },
  { id: 'educatori', label: 'Educatori' },
  { id: 'mediatori', label: 'Mediatori' },
  { id: 'medici', label: 'Medici' },
  { id: 'personale_infermieristico', label: 'Personale infermieristico' },
  { id: 'insegnanti', label: 'Insegnanti' },
  { id: 'operatori_religiosi', label: 'Operatori religiosi' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'operatori_legali', label: 'Operatori legali' },
  { id: 'operatori_multifunzionali', label: 'Operatori multifunzionali' },
  { id: 'amministrativi', label: 'Amministrativi' },
  { id: 'altro', label: 'Altro' }
]

// Aggiungiamo un tipo per i servizi
type ServizioKey = keyof QuestionarioStrutture['attivita_servizi']
type Servizio = QuestionarioStrutture['attivita_servizi'][ServizioKey]

// Aggiungiamo un tipo per le attività
type Attivita = {
  nome: string
  periodo: string
  contenuto: string
  destinatari: string
  attori: string
  punti_forza: string
  criticita: string
}

export default function QuestionarioStruttureForm() {
  const router = useRouter()
  const { userType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<QuestionarioStrutture>({
    id_struttura: '',
    forma_giuridica: {
      tipo: '1',
      altro_specificare: ''
    },
    tipo_struttura: '',
    anno_inizio: new Date().getFullYear(),
    mission: '',
    personale_retribuito: {
      uomini: 0,
      donne: 0,
      totale: 0
    },
    personale_volontario: {
      uomini: 0,
      donne: 0,
      totale: 0
    },
    figure_professionali: {
      psicologi: false,
      assistenti_sociali: false,
      educatori: false,
      mediatori: false,
      medici: false,
      personale_infermieristico: false,
      insegnanti: false,
      operatori_religiosi: false,
      tutor: false,
      operatori_legali: false,
      operatori_multifunzionali: false,
      amministrativi: false,
      altro: false,
      altro_specificare: ''
    },
    persone_ospitate: {
      fino_16_anni: { uomini: 0, donne: 0, totale: 0 },
      da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
      maggiorenni: { uomini: 0, donne: 0, totale: 0 },
      totali: { uomini: 0, donne: 0, totale: 0 }
    },
    persone_non_ospitate: {
      fino_16_anni: { uomini: 0, donne: 0, totale: 0 },
      da_16_a_18: { uomini: 0, donne: 0, totale: 0 },
      maggiorenni: { uomini: 0, donne: 0, totale: 0 },
      totali: { uomini: 0, donne: 0, totale: 0 }
    },
    caratteristiche_ospiti: {
      adolescenti: {
        stranieri_migranti: false,
        vittime_tratta: false,
        vittime_violenza: false,
        allontanati_famiglia: false,
        detenuti: false,
        ex_detenuti: false,
        misure_alternative: false,
        indigenti_senzatetto: false,
        rom_sinti: false,
        disabilita_fisica: false,
        disabilita_cognitiva: false,
        disturbi_psichiatrici: false,
        dipendenze: false,
        genitori_precoci: false,
        problemi_orientamento: false,
        altro: false,
        altro_specificare: ''
      },
      giovani_adulti: {
        stranieri_migranti: false,
        vittime_tratta: false,
        vittime_violenza: false,
        allontanati_famiglia: false,
        detenuti: false,
        ex_detenuti: false,
        misure_alternative: false,
        indigenti_senzatetto: false,
        rom_sinti: false,
        disabilita_fisica: false,
        disabilita_cognitiva: false,
        disturbi_psichiatrici: false,
        dipendenze: false,
        genitori_precoci: false,
        problemi_orientamento: false,
        altro: false,
        altro_specificare: ''
      }
    },
    caratteristiche_non_ospiti: {
      adolescenti: {
        stranieri_migranti: false,
        vittime_tratta: false,
        vittime_violenza: false,
        allontanati_famiglia: false,
        detenuti: false,
        ex_detenuti: false,
        misure_alternative: false,
        indigenti_senzatetto: false,
        rom_sinti: false,
        disabilita_fisica: false,
        disabilita_cognitiva: false,
        disturbi_psichiatrici: false,
        dipendenze: false,
        genitori_precoci: false,
        problemi_orientamento: false,
        altro: false,
        altro_specificare: ''
      },
      giovani_adulti: {
        stranieri_migranti: false,
        vittime_tratta: false,
        vittime_violenza: false,
        allontanati_famiglia: false,
        detenuti: false,
        ex_detenuti: false,
        misure_alternative: false,
        indigenti_senzatetto: false,
        rom_sinti: false,
        disabilita_fisica: false,
        disabilita_cognitiva: false,
        disturbi_psichiatrici: false,
        dipendenze: false,
        genitori_precoci: false,
        problemi_orientamento: false,
        altro: false,
        altro_specificare: ''
      }
    },
    attivita_servizi: {
      alloggio: { attivo: false, descrizione: '' },
      vitto: { attivo: false, descrizione: '' },
      servizi_bassa_soglia: { attivo: false, descrizione: '' },
      ospitalita_diurna: { attivo: false, descrizione: '' },
      supporto_psicologico: { attivo: false, descrizione: '' },
      sostegno_autonomia: { attivo: false, descrizione: '' },
      orientamento_lavoro: { attivo: false, descrizione: '' },
      orientamento_formazione: { attivo: false, descrizione: '' },
      istruzione: { attivo: false, descrizione: '' },
      formazione_professionale: { attivo: false, descrizione: '' },
      attivita_socializzazione: { attivo: false, descrizione: '' },
      altro: { attivo: false, descrizione: '' }
    },
    esperienze_inserimento: {
      presenti: false,
      attivita: []
    },
    attivita_future: [],
    collaborazioni: [],
    network: {
      punti_forza: '',
      criticita: ''
    },
    created_at: new Date().toISOString(),
    stato: 'bozza',
    fonte: 'operatore'
  })

  const updateTotali = (data: typeof formData) => {
    return {
      ...data,
      personale_retribuito: {
        ...data.personale_retribuito,
        totale: data.personale_retribuito.uomini + data.personale_retribuito.donne
      },
      personale_volontario: {
        ...data.personale_volontario,
        totale: data.personale_volontario.uomini + data.personale_volontario.donne
      }
    }
  }

  const handlePersonaleChange = (
    tipo: 'retribuito' | 'volontario',
    genere: 'uomini' | 'donne',
    value: number
  ) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [`personale_${tipo}`]: {
          ...prev[`personale_${tipo}`],
          [genere]: value
        }
      }
      return updateTotali(newData)
    })
  }

  const handleFiguraProfessionaleChange = (figura: keyof typeof formData.figure_professionali) => {
    setFormData(prev => ({
      ...prev,
      figure_professionali: {
        ...prev.figure_professionali,
        [figura]: !prev.figure_professionali[figura]
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('strutture')
        .insert([
          {
            ...formData,
            created_by: userType === 'operatore' ? userType : 'anonimo'
          }
        ])

      if (error) throw error

      router.push(`/dashboard/${userType}`)
    } catch (error) {
      console.error('Errore durante il salvataggio:', error)
      setError('Errore durante il salvataggio del questionario')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: parseInt(value) || 0
    }))
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleFormaGiuridicaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      forma_giuridica: {
        ...prev.forma_giuridica,
        tipo: value as QuestionarioStrutture['forma_giuridica']['tipo']
      }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE A: Descrizione della struttura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id_struttura">ID_STRUTTURA</Label>
            <Input
              id="id_struttura"
              value={formData.id_struttura}
              onChange={handleInputChange}
              placeholder="Identificativo della struttura (fornito da Inapp)"
            />
          </div>

          <div className="space-y-2">
            <Label>FORMAGIU Forma giuridica della struttura</Label>
            <RadioGroup
              value={formData.forma_giuridica.tipo}
              onValueChange={handleFormaGiuridicaChange}
              className="space-y-2"
            >
              {FORME_GIURIDICHE.map(forma => (
                <div key={forma.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={forma.value} id={`forma_${forma.value}`} />
                  <Label htmlFor={`forma_${forma.value}`}>{forma.label}</Label>
                </div>
              ))}
            </RadioGroup>
            
            {formData.forma_giuridica.tipo === '10' && (
              <div className="mt-2">
                <Label htmlFor="forma_altro">Specificare altro</Label>
                <Input
                  id="forma_altro"
                  value={formData.forma_giuridica.altro_specificare || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    forma_giuridica: {
                      ...prev.forma_giuridica,
                      altro_specificare: e.target.value
                    }
                  }))}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_struttura">TIPO_STRUTTURA</Label>
            <Input
              id="tipo_struttura"
              value={formData.tipo_struttura}
              onChange={handleInputChange}
              placeholder="casa-famiglia, centro diurno, semiautonomia, ecc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="anno_inizio">ANNO_INIZIO</Label>
            <Input
              id="anno_inizio"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={formData.anno_inizio}
              onChange={handleNumberChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mission">MISSION</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={handleTextareaChange}
              placeholder="Missione principale della struttura/finalità"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEZIONE B: Personale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personale_retribuito_uomini">Personale Retribuito - Uomini</Label>
            <Input
              id="personale_retribuito_uomini"
              type="number"
              value={formData.personale_retribuito.uomini}
              onChange={(e) => handlePersonaleChange('retribuito', 'uomini', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personale_retribuito_donne">Personale Retribuito - Donne</Label>
            <Input
              id="personale_retribuito_donne"
              type="number"
              value={formData.personale_retribuito.donne}
              onChange={(e) => handlePersonaleChange('retribuito', 'donne', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personale_volontario_uomini">Personale Volontario - Uomini</Label>
            <Input
              id="personale_volontario_uomini"
              type="number"
              value={formData.personale_volontario.uomini}
              onChange={(e) => handlePersonaleChange('volontario', 'uomini', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personale_volontario_donne">Personale Volontario - Donne</Label>
            <Input
              id="personale_volontario_donne"
              type="number"
              value={formData.personale_volontario.donne}
              onChange={(e) => handlePersonaleChange('volontario', 'donne', parseInt(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEZIONE C: Figure Professionali</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Figure professionali presenti nella struttura</Label>
            <div className="grid grid-cols-2 gap-4">
              {FIGURE_PROFESSIONALI.map(figura => (
                <div key={figura.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`figura_${figura.id}`}
                    checked={Boolean(formData.figure_professionali[figura.id])}
                    onChange={() => handleFiguraProfessionaleChange(figura.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`figura_${figura.id}`}>{figura.label}</Label>
                </div>
              ))}
            </div>
            
            {formData.figure_professionali.altro && (
              <div className="mt-2">
                <Label htmlFor="figura_altro_specificare">Specificare altro</Label>
                <Input
                  id="figura_altro_specificare"
                  value={formData.figure_professionali.altro_specificare || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                    ...prev,
                    figure_professionali: {
                      ...prev.figure_professionali,
                      altro_specificare: e.target.value
                    }
                  }))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sezione C: Persone Ospitate */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE C: Persone Ospitate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fino a 16 anni */}
          <div className="space-y-4">
            <h3 className="font-medium">Fino a 16 anni non compiuti</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ospitati_fino_16_uomini">Uomini</Label>
                <Input
                  id="ospitati_fino_16_uomini"
                  type="number"
                  min={0}
                  value={formData.persone_ospitate.fino_16_anni.uomini}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    persone_ospitate: {
                      ...prev.persone_ospitate,
                      fino_16_anni: {
                        ...prev.persone_ospitate.fino_16_anni,
                        uomini: parseInt(e.target.value) || 0,
                        totale: (parseInt(e.target.value) || 0) + prev.persone_ospitate.fino_16_anni.donne
                      }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ospitati_fino_16_donne">Donne</Label>
                <Input
                  id="ospitati_fino_16_donne"
                  type="number"
                  min={0}
                  value={formData.persone_ospitate.fino_16_anni.donne}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    persone_ospitate: {
                      ...prev.persone_ospitate,
                      fino_16_anni: {
                        ...prev.persone_ospitate.fino_16_anni,
                        donne: parseInt(e.target.value) || 0,
                        totale: prev.persone_ospitate.fino_16_anni.uomini + (parseInt(e.target.value) || 0)
                      }
                    }
                  }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Totale</Label>
              <div className="text-lg font-medium">
                {formData.persone_ospitate.fino_16_anni.totale}
              </div>
            </div>
          </div>

          {/* 16-18 anni */}
          <div className="space-y-4">
            <h3 className="font-medium">Dai 16 ai 18 anni non compiuti</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ospitati_16_18_uomini">Uomini</Label>
                <Input
                  id="ospitati_16_18_uomini"
                  type="number"
                  min={0}
                  value={formData.persone_ospitate.da_16_a_18.uomini}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    persone_ospitate: {
                      ...prev.persone_ospitate,
                      da_16_a_18: {
                        ...prev.persone_ospitate.da_16_a_18,
                        uomini: parseInt(e.target.value) || 0,
                        totale: (parseInt(e.target.value) || 0) + prev.persone_ospitate.da_16_a_18.donne
                      }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ospitati_16_18_donne">Donne</Label>
                <Input
                  id="ospitati_16_18_donne"
                  type="number"
                  min={0}
                  value={formData.persone_ospitate.da_16_a_18.donne}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    persone_ospitate: {
                      ...prev.persone_ospitate,
                      da_16_a_18: {
                        ...prev.persone_ospitate.da_16_a_18,
                        donne: parseInt(e.target.value) || 0,
                        totale: prev.persone_ospitate.da_16_a_18.uomini + (parseInt(e.target.value) || 0)
                      }
                    }
                  }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Totale</Label>
              <div className="text-lg font-medium">
                {formData.persone_ospitate.da_16_a_18.totale}
              </div>
            </div>
          </div>

          {/* Maggiorenni */}
          {/* ... struttura simile per i maggiorenni ... */}
        </CardContent>
      </Card>

      {/* Caratteristiche Ospiti */}
      <Card>
        <CardHeader>
          <CardTitle>Caratteristiche delle persone ospitate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Adolescenti */}
          <div className="space-y-4">
            <h3 className="font-medium">Adolescenti (16-18 anni non compiuti)</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.caratteristiche_ospiti.adolescenti).map(([key, value]) => {
                if (key === 'altro_specificare') return null;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`caratteristica_adolescenti_${key}`}
                      checked={Boolean(value)}
                      onChange={() => setFormData(prev => ({
                        ...prev,
                        caratteristiche_ospiti: {
                          ...prev.caratteristiche_ospiti,
                          adolescenti: {
                            ...prev.caratteristiche_ospiti.adolescenti,
                            [key]: !value
                          }
                        }
                      }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`caratteristica_adolescenti_${key}`}>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Giovani Adulti */}
          <div className="space-y-4">
            <h3 className="font-medium">Giovani Adulti (18-25 anni)</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.caratteristiche_ospiti.giovani_adulti).map(([key, value]) => {
                if (key === 'altro_specificare') return null;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`caratteristica_giovani_${key}`}
                      checked={Boolean(value)}
                      onChange={() => setFormData(prev => ({
                        ...prev,
                        caratteristiche_ospiti: {
                          ...prev.caratteristiche_ospiti,
                          giovani_adulti: {
                            ...prev.caratteristiche_ospiti.giovani_adulti,
                            [key]: !value
                          }
                        }
                      }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`caratteristica_giovani_${key}`}>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sezione D: Attività e Servizi */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE D: Attività e Servizi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Servizi di base */}
          <div className="space-y-4">
            <h3 className="font-medium">Servizi di base</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="servizio_alloggio"
                  checked={Boolean(formData.attivita_servizi.alloggio.attivo)}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    attivita_servizi: {
                      ...prev.attivita_servizi,
                      alloggio: {
                        ...prev.attivita_servizi.alloggio,
                        attivo: !prev.attivita_servizi.alloggio.attivo
                      }
                    }
                  }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="servizio_alloggio">Alloggio</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="servizio_vitto"
                  checked={Boolean(formData.attivita_servizi.vitto.attivo)}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    attivita_servizi: {
                      ...prev.attivita_servizi,
                      vitto: {
                        ...prev.attivita_servizi.vitto,
                        attivo: !prev.attivita_servizi.vitto.attivo
                      }
                    }
                  }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="servizio_vitto">Vitto</Label>
              </div>
            </div>
          </div>

          {/* Altri servizi */}
          <div className="space-y-4">
            <h3 className="font-medium">Altri servizi</h3>
            <div className="grid grid-cols-1 gap-4">
              {(Object.entries(formData.attivita_servizi) as [ServizioKey, Servizio][]).map(([key, value]) => {
                if (key === 'alloggio' || key === 'vitto') return null;
                if (typeof value !== 'object') return null;

                const servizio = formData.attivita_servizi[key as keyof typeof formData.attivita_servizi];
                if (!servizio || typeof servizio !== 'object') return null;

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`servizio_${key}`}
                        checked={Boolean(servizio.attivo)}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          attivita_servizi: {
                            ...prev.attivita_servizi,
                            [key]: {
                              ...servizio,
                              attivo: !servizio.attivo
                            }
                          }
                        }))}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`servizio_${key}`}>
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Label>
                    </div>
                    {servizio.attivo && (
                      <Textarea
                        id={`servizio_${key}_descrizione`}
                        value={servizio.descrizione || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          attivita_servizi: {
                            ...prev.attivita_servizi,
                            [key]: {
                              ...servizio,
                              descrizione: e.target.value
                            }
                          }
                        }))}
                        placeholder="Descrivi il servizio..."
                        className="mt-2"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Esperienze significative */}
          <div className="space-y-4">
            <h3 className="font-medium">Esperienze significative negli ultimi 3 anni</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="esperienze_presenti"
                checked={Boolean(formData.esperienze_inserimento.presenti)}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  esperienze_inserimento: {
                    ...prev.esperienze_inserimento,
                    presenti: !prev.esperienze_inserimento.presenti
                  }
                }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="esperienze_presenti">Sono presenti esperienze significative</Label>
            </div>

            {formData.esperienze_inserimento.presenti && (
              <div className="space-y-4">
                {(formData.esperienze_inserimento.attivita || []).map((attivita, index) => (
                  <Card key={index}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor={`esperienza_${index}_nome`}>Nome/Titolo</Label>
                        <Input
                          id={`esperienza_${index}_nome`}
                          value={attivita.nome}
                          onChange={(e) => {
                            const newAttivita = Array.from(formData.esperienze_inserimento.attivita || []);
                            newAttivita[index] = { ...newAttivita[index], nome: e.target.value };
                            setFormData(prev => ({
                              ...prev,
                              esperienze_inserimento: {
                                ...prev.esperienze_inserimento,
                                attivita: newAttivita
                              }
                            }));
                          }}
                        />
                      </div>
                      {/* Altri campi dell'esperienza... */}
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    const newAttivita: Attivita = {
                      nome: '',
                      periodo: '',
                      contenuto: '',
                      destinatari: '',
                      attori: '',
                      punti_forza: '',
                      criticita: ''
                    };
                    setFormData(prev => ({
                      ...prev,
                      esperienze_inserimento: {
                        ...prev.esperienze_inserimento,
                        attivita: [...Array.from(prev.esperienze_inserimento.attivita || []), newAttivita]
                      }
                    }));
                  }}
                >
                  Aggiungi Esperienza
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sezione E: Reti e Collaborazioni */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE E: Reti e Collaborazioni</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lista collaborazioni */}
          <div className="space-y-4">
            <h3 className="font-medium">Collaborazioni</h3>
            {formData.collaborazioni.map((collab, index) => (
              <Card key={index}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor={`collab_${index}_denominazione`}>Denominazione</Label>
                    <Input
                      id={`collab_${index}_denominazione`}
                      value={collab.denominazione}
                      onChange={(e) => {
                        const newCollabs = [...formData.collaborazioni];
                        newCollabs[index] = { ...newCollabs[index], denominazione: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          collaborazioni: newCollabs
                        }));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo di collaborazione</Label>
                    <RadioGroup
                      value={collab.tipo}
                      onValueChange={(value: 'ricorrente' | 'occasionale') => {
                        const newCollabs = [...formData.collaborazioni];
                        newCollabs[index] = { ...newCollabs[index], tipo: value };
                        setFormData(prev => ({
                          ...prev,
                          collaborazioni: newCollabs
                        }));
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ricorrente" id={`collab_${index}_tipo_ricorrente`} />
                        <Label htmlFor={`collab_${index}_tipo_ricorrente`}>Ricorrente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="occasionale" id={`collab_${index}_tipo_occasionale`} />
                        <Label htmlFor={`collab_${index}_tipo_occasionale`}>Occasionale</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`collab_${index}_oggetto`}>Oggetto della collaborazione</Label>
                    <Textarea
                      id={`collab_${index}_oggetto`}
                      value={collab.oggetto}
                      onChange={(e) => {
                        const newCollabs = [...formData.collaborazioni];
                        newCollabs[index] = { ...newCollabs[index], oggetto: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          collaborazioni: newCollabs
                        }));
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                collaborazioni: [
                  ...prev.collaborazioni,
                  { denominazione: '', tipo: 'ricorrente', oggetto: '' }
                ]
              }))}
            >
              Aggiungi Collaborazione
            </Button>
          </div>

          {/* Network */}
          <div className="space-y-4">
            <h3 className="font-medium">Valutazione del network</h3>
            <div className="space-y-2">
              <Label htmlFor="network_punti_forza">Punti di forza</Label>
              <Textarea
                id="network_punti_forza"
                value={formData.network.punti_forza}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  network: {
                    ...prev.network,
                    punti_forza: e.target.value
                  }
                }))}
                placeholder="Descrivi i punti di forza del network..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network_criticita">Criticità</Label>
              <Textarea
                id="network_criticita"
                value={formData.network.criticita}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  network: {
                    ...prev.network,
                    criticita: e.target.value
                  }
                }))}
                placeholder="Descrivi le criticità del network..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>Salva Questionario</Button>
    </form>
  )
} 