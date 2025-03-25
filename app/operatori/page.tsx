"use client"

import React, { useState } from 'react';
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew';
import QuestionarioOperatoriNuovo from '@/components/questionari/QuestionarioOperatoriNuovo';
import { QuestionarioStruttureNew } from "@/types/questionari";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from "@/components/ui/use-toast";

export default function DashboardOperatori() {
  const [selectedQuestionario, setSelectedQuestionario] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Devi essere autenticato per inviare il questionario');
        return;
      }

      if (!formData) {
        alert('Seleziona un questionario e compilalo prima di inviare');
        return;
      }

      // Ottieni l'ID dell'operatore dalla sessione
      const { data: operatore } = await supabase
        .from('operatori')
        .select('id')
        .eq('creato_da', user.id)
        .single();

      const operatoreId = operatore?.id || 'anonimo';

      if (selectedQuestionario === 'questionariogiovaninew') {
        const { error } = await supabase.from('questionariogiovaninew').insert({
          ...formData,
          creato_da: user.id,
          fonte: `operatore${operatoreId}`,
          stato: 'inviato'
        });

        if (error) throw error;
      } 
      else if (selectedQuestionario === 'questionariostruttureNew') {
        const { error } = await supabase.from('struttura').insert({
          ...formData,
          creato_da: user.id,
          fonte: `operatore${operatoreId}`,
          stato: 'inviato'
        });

        if (error) throw error;
      }
      else if (selectedQuestionario === 'questionariooperatorinuovo') {
        const { error } = await supabase.from('operatori').insert({
          ...formData,
          creato_da: user.id,
          fonte: `operatore${operatoreId}`,
          stato: 'inviato'
        });

        if (error) throw error;
      }

      alert('Questionario inviato con successo!');
      setFormData(null);
      setSelectedQuestionario(null);
    } catch (error) {
      console.error('Errore durante l\'invio:', error);
      alert('Errore durante l\'invio del questionario');
    }
  };

  const handleInviaQuestionario = async (questionario: QuestionarioStruttureNew) => {
    try {
      const response = await fetch('/api/questionari/strutture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionario)
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'invio del questionario');
      }

      toast({
        title: "Questionario inviato con successo",
        description: "Il questionario è stato salvato e sarà visibile nella dashboard amministratori",
        duration: 5000,
      });

    } catch (error) {
      console.error('Errore:', error);
      toast({
        title: "Errore durante l'invio",
        description: "Si è verificato un errore durante l'invio del questionario. Riprova più tardi.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const renderQuestionario = () => {
    switch (selectedQuestionario) {
      case 'questionariogiovaninew':
        return <QuestionarioGiovaniNew fonte="operatore" />;
      case 'questionariooperatorinuovo':
        return (
          <QuestionarioOperatoriNuovo 
            initialData={formData} 
            setFormData={setFormData}
          />
        );
      case 'questionariostruttureNew':
        return (
          <QuestionarioStruttureNew 
            initialData={formData} 
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Operatori</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {!selectedQuestionario ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedQuestionario('questionariogiovaninew')}
          >
            <Card>
              <CardHeader>
                <CardTitle>Questionario Giovani</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Compila il questionario per i giovani</p>
              </CardContent>
            </Card>
          </div>

          <div
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedQuestionario('questionariooperatorinuovo')}
          >
            <Card>
              <CardHeader>
                <CardTitle>Questionario Operatori</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Compila il questionario per gli operatori</p>
              </CardContent>
            </Card>
          </div>

          <div
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedQuestionario('questionariostruttureNew')}
          >
            <Card>
              <CardHeader>
                <CardTitle>Questionario Strutture</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Compila il questionario per le strutture</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedQuestionario(null)}>
              Torna alla selezione
            </Button>
            <Button onClick={handleSubmit}>
              Invia Questionario
            </Button>
          </div>
          {renderQuestionario()}
        </div>
      )}
    </div>
  );
} 