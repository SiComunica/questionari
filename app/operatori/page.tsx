"use client"

import React, { useState } from 'react';
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew';
import QuestionarioOperatoriNuovo from '@/components/questionari/QuestionarioOperatoriNuovo';
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardOperatori() {
  const [selectedQuestionario, setSelectedQuestionario] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleInvio = async () => {
    // Qui implementeremo la logica di invio al database
    try {
      // Logica di invio al database
      alert('Questionario inviato con successo!');
      setSelectedQuestionario(null);
    } catch (error) {
      alert('Errore durante l\'invio del questionario');
      console.error(error);
    }
  };

  const renderQuestionario = () => {
    switch (selectedQuestionario) {
      case 'giovani':
        return <QuestionarioGiovaniNew />;
      case 'operatori':
        return <QuestionarioOperatoriNuovo />;
      case 'strutture':
        return <QuestionarioStruttureNew />;
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
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => setSelectedQuestionario('giovani')}>
            <CardHeader>
              <CardTitle>Questionario Giovani</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Compila il questionario per i giovani</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedQuestionario('operatori')}>
            <CardHeader>
              <CardTitle>Questionario Operatori</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Compila il questionario per gli operatori</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedQuestionario('strutture')}>
            <CardHeader>
              <CardTitle>Questionario Strutture</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Compila il questionario per le strutture</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedQuestionario(null)}>
              Torna alla selezione
            </Button>
            <Button onClick={handleInvio}>
              Invia Questionario
            </Button>
          </div>
          {renderQuestionario()}
        </div>
      )}
    </div>
  );
} 