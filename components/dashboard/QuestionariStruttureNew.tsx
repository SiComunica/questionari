'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileSpreadsheet, FileText, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { exportToExcel, exportToPDF } from '@/utils/export'
import type { QuestionarioStruttureNew } from '@/types/questionari'

export default function QuestionariStruttureNew() {
  const [questionari, setQuestionari] = useState<QuestionarioStruttureNew[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestionario, setSelectedQuestionario] = useState<QuestionarioStruttureNew | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuestionari = async () => {
      try {
        const { data, error } = await supabase
          .from('strutture')
          .select('*')
          .order('creato_a', { ascending: false })

        if (error) throw error
        setQuestionari(data || [])
      } catch (err) {
        console.error('Errore:', err)
        toast.error('Errore nel caricamento dei questionari')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionari()
  }, [])

  const handleExportExcel = async (questionario?: QuestionarioStruttureNew) => {
    try {
      if (questionario) {
        exportToExcel({
          strutture: [questionario],
          giovani: [],
          operatori: []
        });
        toast.success('Questionario esportato in Excel');
      } else {
        exportToExcel({
          strutture: questionari,
          giovani: [],
          operatori: []
        });
        toast.success('Tutti i questionari esportati in Excel');
      }
    } catch (error) {
      console.error('Errore durante l\'export Excel:', error);
      toast.error('Errore durante l\'export in Excel');
    }
  };

  const handleExportPDF = async (questionario?: QuestionarioStruttureNew) => {
    try {
      if (questionario) {
        exportToPDF({
          strutture: [questionario],
          giovani: [],
          operatori: []
        });
        toast.success('Questionario esportato in PDF');
      } else {
        exportToPDF({
          strutture: questionari,
          giovani: [],
          operatori: []
        });
        toast.success('Tutti i questionari esportati in PDF');
      }
    } catch (error) {
      console.error('Errore durante l\'export PDF:', error);
      toast.error('Errore durante l\'export in PDF');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('strutture')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setQuestionari(prev => prev.filter(q => q.id !== id))
      toast.success('Questionario eliminato con successo')
    } catch (error) {
      toast.error('Errore durante l\'eliminazione')
    }
  }

  const renderQuestionarioDettaglio = (questionario: QuestionarioStruttureNew) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold">Dati Generali</h3>
            <p>Nome struttura: {questionario.nome_struttura}</p>
            <p>ID Struttura: {questionario.id_struttura}</p>
            <p>Data invio: {new Date(questionario.creato_a).toLocaleDateString()}</p>
            <p>Inviato da: {questionario.creato_da}</p>
            <p>Stato: {questionario.stato}</p>
            <p>Forma giuridica: {questionario.forma_giuridica}</p>
            <p>Tipo struttura: {questionario.tipo_struttura}</p>
            <p>Anno inizio: {questionario.anno_inizio}</p>
            <p>Missione: {questionario.missione}</p>
          </div>
          <div>
            <h3 className="font-bold">Personale</h3>
            <p>Uomini retribuiti: {questionario.personale_retribuito_uomini}</p>
            <p>Donne retribuite: {questionario.personale_retribuito_donne}</p>
            <p>Uomini volontari: {questionario.personale_volontario_uomini}</p>
            <p>Donne volontarie: {questionario.personale_volontario_donne}</p>
            <p>Figure professionali: {questionario.figure_professionali.join(', ')}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => handleExportExcel(questionario)} className="flex gap-2">
            <FileSpreadsheet size={20} />
            Excel
          </Button>
          <Button onClick={() => handleExportPDF(questionario)} className="flex gap-2">
            <FileText size={20} />
            PDF
          </Button>
        </div>
      </div>
    )
  }

  if (loading) return <div>Caricamento...</div>

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Questionari Strutture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-4">
          <Button onClick={() => handleExportExcel()} className="flex gap-2">
            <FileSpreadsheet size={20} />
            Esporta tutti in Excel
          </Button>
          <Button onClick={() => handleExportPDF()} className="flex gap-2">
            <FileText size={20} />
            Esporta tutti in PDF
          </Button>
        </div>

        {questionari.length === 0 ? (
          <p>Nessun questionario strutture ricevuto</p>
        ) : (
          <div className="space-y-4">
            {questionari.map((questionario) => (
              <Card key={questionario.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Struttura: {questionario.nome_struttura}</p>
                    <p className="text-sm text-gray-600">
                      Inviato il {new Date(questionario.creato_a).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stato: {questionario.stato}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedQuestionario(questionario)
                        setIsDialogOpen(true)
                      }}
                    >
                      Visualizza dettagli
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleExportExcel(questionario)}
                    >
                      <FileSpreadsheet size={20} />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleExportPDF(questionario)}
                    >
                      <FileText size={20} />
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleDelete(questionario.id)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dettaglio Questionario Struttura</DialogTitle>
          </DialogHeader>
          {selectedQuestionario && renderQuestionarioDettaglio(selectedQuestionario)}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 