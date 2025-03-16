'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { QuestionarioOperatori } from '@/types/questionari'

const PROFESSIONI = [
  { value: '1', label: 'Psicologo' },
  { value: '2', label: 'Assistente sociale' },
  { value: '3', label: 'Educatore' },
  { value: '4', label: 'Mediatore' },
  { value: '5', label: 'Medico' },
  { value: '6', label: 'Personale infermieristico/operatore sanitario' },
  { value: '7', label: 'Insegnante/formatore' },
  { value: '8', label: 'Cappellano/operatore religioso e spirituale' },
  { value: '9', label: 'Tutor' },
  { value: '10', label: 'Operatore legale' },
  { value: '11', label: 'Operatore multifunzionale' },
  { value: '12', label: 'Amministrativo' },
  { value: '13', label: 'Altro' }
]

export default function QuestionarioOperatoriForm() {
  const router = useRouter()
  const { userType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<QuestionarioOperatori>({
    // Sezione A
    id_struttura: '',
    tipo_struttura: '',
    professione: {
      tipo: '1',
      altro_specificare: ''
    },

    // Sezione B
    persone_seguite: {
      totali: {
        uomini: 0,
        donne: 0,
        totale: 0
      },
      maggiorenni: {
        uomini: 0,
        donne: 0,
        totale: 0
      }
    },
    caratteristiche_persone: {
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
    tipo_intervento: {
      formazione_istruzione: false,
      ricerca_lavoro: false,
      autonomia_abitativa: false,
      rapporto_famiglia: false,
      relazioni_coetanei: false,
      valorizzazione_competenze: false,
      sostegno_legale: false,
      sostegno_sociosanitario: false,
      mediazione_interculturale: false,
      altro: false,
      altro_specificare: ''
    },
    interventi_potenziare: {
      formazione_istruzione: false,
      ricerca_lavoro: false,
      autonomia_abitativa: false,
      rapporto_famiglia: false,
      relazioni_coetanei: false,
      valorizzazione_competenze: false,
      sostegno_legale: false,
      sostegno_sociosanitario: false,
      mediazione_interculturale: false,
      nessuno: false,
      altro: false,
      altro_specificare: ''
    },

    // Sezione C
    difficolta_uscita: {
      problemi_economici: 1,
      trovare_lavoro: 1,
      lavori_qualita: 1,
      trovare_casa: 1,
      discriminazioni: 1,
      salute_fisica: 1,
      problemi_psicologici: 1,
      difficolta_linguistiche: 1,
      altro: 1,
      altro_specificare: ''
    }
  })

  // Funzione per aggiornare i totali
  const updateTotali = (data: QuestionarioOperatori) => {
    return {
      ...data,
      persone_seguite: {
        ...data.persone_seguite,
        totali: {
          ...data.persone_seguite.totali,
          totale: data.persone_seguite.totali.uomini + data.persone_seguite.totali.donne
        },
        maggiorenni: {
          ...data.persone_seguite.maggiorenni,
          totale: data.persone_seguite.maggiorenni.uomini + data.persone_seguite.maggiorenni.donne
        }
      }
    }
  }

  // Handler per i campi numerici delle persone seguite
  const handlePersoneChange = (
    tipo: 'totali' | 'maggiorenni',
    genere: 'uomini' | 'donne',
    value: number
  ) => {
    setFormData((prev: QuestionarioOperatori) => {
      const newData = {
        ...prev,
        persone_seguite: {
          ...prev.persone_seguite,
          [tipo]: {
            ...prev.persone_seguite[tipo],
            [genere]: value
          }
        }
      }
      return updateTotali(newData)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('operatori')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sezione A */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE A: Descrizione dell'operatore</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id_struttura">ID_STRUTTURA</Label>
            <Input
              id="id_struttura"
              value={formData.id_struttura}
              onChange={(e) => setFormData((prev: QuestionarioOperatori) => ({
                ...prev,
                id_struttura: e.target.value
              }))}
              placeholder="Identificativo della struttura (fornito da Inapp)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_struttura">Tipo struttura</Label>
            <Input
              id="tipo_struttura"
              value={formData.tipo_struttura}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                tipo_struttura: e.target.value
              }))}
              placeholder="casa-famiglia, centro diurno, semi autonomia, ecc."
            />
          </div>

          <div className="space-y-2">
            <Label>Professione dell'operatore</Label>
            <RadioGroup
              value={formData.professione.tipo}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                professione: {
                  ...prev.professione,
                  tipo: value
                }
              }))}
              className="space-y-2"
            >
              {PROFESSIONI.map(prof => (
                <div key={prof.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={prof.value} id={`prof_${prof.value}`} />
                  <Label htmlFor={`prof_${prof.value}`}>{prof.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {formData.professione.tipo === '13' && (
            <div className="space-y-2">
              <Label htmlFor="prof_altro">Specificare altro</Label>
              <Input
                id="prof_altro"
                value={formData.professione.altro_specificare}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  professione: {
                    ...prev.professione,
                    altro_specificare: e.target.value
                  }
                }))}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sezione B: Informazioni sulle persone seguite */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE B: Informazioni sulle persone seguite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* B1: Persone seguite totali */}
          <div className="space-y-4">
            <h3 className="font-medium">B1: Numero di persone seguite direttamente</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="persone_totali_uomini">Uomini</Label>
                <Input
                  type="number"
                  id="persone_totali_uomini"
                  min={0}
                  value={formData.persone_seguite.totali.uomini}
                  onChange={(e) => handlePersoneChange('totali', 'uomini', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="persone_totali_donne">Donne</Label>
                <Input
                  type="number"
                  id="persone_totali_donne"
                  min={0}
                  value={formData.persone_seguite.totali.donne}
                  onChange={(e) => handlePersoneChange('totali', 'donne', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Totale</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted">
                  {formData.persone_seguite.totali.totale}
                </div>
              </div>
            </div>
          </div>

          {/* B2: Persone maggiorenni */}
          <div className="space-y-4">
            <h3 className="font-medium">B2: Numero di persone maggiorenni seguite direttamente</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="persone_maggiorenni_uomini">Uomini</Label>
                <Input
                  type="number"
                  id="persone_maggiorenni_uomini"
                  min={0}
                  value={formData.persone_seguite.maggiorenni.uomini}
                  onChange={(e) => handlePersoneChange('maggiorenni', 'uomini', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="persone_maggiorenni_donne">Donne</Label>
                <Input
                  type="number"
                  id="persone_maggiorenni_donne"
                  min={0}
                  value={formData.persone_seguite.maggiorenni.donne}
                  onChange={(e) => handlePersoneChange('maggiorenni', 'donne', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Totale</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted">
                  {formData.persone_seguite.maggiorenni.totale}
                </div>
              </div>
            </div>
          </div>

          {/* B3: Caratteristiche persone seguite */}
          <div className="space-y-4">
            <h3 className="font-medium">B3: Caratteristiche delle persone seguite direttamente</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.caratteristiche_persone).map(([key, value]) => {
                if (key === 'altro_specificare') return null;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`caratteristica_${key}`}
                      checked={Boolean(value)}
                      onChange={() => setFormData((prev: QuestionarioOperatori) => ({
                        ...prev,
                        caratteristiche_persone: {
                          ...prev.caratteristiche_persone,
                          [key]: !value
                        }
                      }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`caratteristica_${key}`}>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                );
              })}
            </div>

            {formData.caratteristiche_persone.altro && (
              <div className="space-y-2">
                <Label htmlFor="caratteristiche_altro">Specificare altro</Label>
                <Input
                  id="caratteristiche_altro"
                  value={formData.caratteristiche_persone.altro_specificare || ''}
                  onChange={(e) => setFormData((prev: QuestionarioOperatori) => ({
                    ...prev,
                    caratteristiche_persone: {
                      ...prev.caratteristiche_persone,
                      altro_specificare: e.target.value
                    }
                  }))}
                />
              </div>
            )}
          </div>

          {/* B4: Tipo di intervento */}
          <div className="space-y-4">
            <h3 className="font-medium">B4: Il suo intervento riguarda</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.tipo_intervento).map(([key, value]) => {
                if (key === 'altro_specificare') return null;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`intervento_${key}`}
                      checked={Boolean(value)}
                      onChange={() => setFormData((prev: QuestionarioOperatori) => ({
                        ...prev,
                        tipo_intervento: {
                          ...prev.tipo_intervento,
                          [key]: !value
                        }
                      }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`intervento_${key}`}>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                );
              })}
            </div>

            {formData.tipo_intervento.altro && (
              <div className="space-y-2">
                <Label htmlFor="intervento_altro">Specificare altro</Label>
                <Input
                  id="intervento_altro"
                  value={formData.tipo_intervento.altro_specificare || ''}
                  onChange={(e) => setFormData((prev: QuestionarioOperatori) => ({
                    ...prev,
                    tipo_intervento: {
                      ...prev.tipo_intervento,
                      altro_specificare: e.target.value
                    }
                  }))}
                />
              </div>
            )}
          </div>

          {/* B5: Interventi da potenziare */}
          <div className="space-y-4">
            <h3 className="font-medium">B5: Interventi che la struttura dovrebbe realizzare o potenziare</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.interventi_potenziare).map(([key, value]) => {
                if (key === 'altro_specificare') return null;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`potenziare_${key}`}
                      checked={Boolean(value)}
                      onChange={() => setFormData((prev: QuestionarioOperatori) => ({
                        ...prev,
                        interventi_potenziare: {
                          ...prev.interventi_potenziare,
                          [key]: !value
                        }
                      }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`potenziare_${key}`}>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Label>
                  </div>
                );
              })}
            </div>

            {formData.interventi_potenziare.altro && (
              <div className="space-y-2">
                <Label htmlFor="potenziare_altro">Specificare altro</Label>
                <Input
                  id="potenziare_altro"
                  value={formData.interventi_potenziare.altro_specificare || ''}
                  onChange={(e) => setFormData((prev: QuestionarioOperatori) => ({
                    ...prev,
                    interventi_potenziare: {
                      ...prev.interventi_potenziare,
                      altro_specificare: e.target.value
                    }
                  }))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sezione C: Difficoltà uscita */}
      <Card>
        <CardHeader>
          <CardTitle>SEZIONE C: Informazioni sulle persone che hanno lasciato la struttura/progetto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">C1: Difficoltà che le persone uscite si trovano ad affrontare</h3>
            <p className="text-sm text-muted-foreground">
              Per ciascuna opzione assegnare un punteggio da 1 a 10 (dove 1 significa nessuna difficoltà e 10 difficoltà massima)
            </p>
            
            {Object.entries(formData.difficolta_uscita).map(([key, value]) => {
              if (key === 'altro_specificare') return null;
              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`difficolta_${key}`}>
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Label>
                  <Input
                    type="number"
                    id={`difficolta_${key}`}
                    min={1}
                    max={10}
                    value={value}
                    onChange={(e) => setFormData((prev: QuestionarioOperatori) => ({
                      ...prev,
                      difficolta_uscita: {
                        ...prev.difficolta_uscita,
                        [key]: parseInt(e.target.value) || 1
                      }
                    }))}
                  />
                </div>
              );
            })}

            {formData.difficolta_uscita.altro > 1 && (
              <div className="space-y-2">
                <Label htmlFor="difficolta_altro_spec">Specificare altro tipo di problema</Label>
                <Input
                  id="difficolta_altro_spec"
                  value={formData.difficolta_uscita.altro_specificare || ''}
                  onChange={(e) => setFormData((prev: QuestionarioOperatori) => ({
                    ...prev,
                    difficolta_uscita: {
                      ...prev.difficolta_uscita,
                      altro_specificare: e.target.value
                    }
                  }))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>Salva Questionario</Button>
    </form>
  )
} 