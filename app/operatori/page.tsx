"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew';
import QuestionarioOperatoriNuovo from '@/components/questionari/QuestionarioOperatoriNuovo';
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew';

export default function Operatori() {
  const router = useRouter();
  const [selectedQuestionario, setSelectedQuestionario] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const handleLogout = () => {
    router.push('/');
  };

  const renderQuestionario = () => {
    switch (selectedQuestionario) {
      case 'questionariogiovaninew':
        return <QuestionarioGiovaniNew />;
      case 'questionariooperatorinuovo':
        return <QuestionarioOperatoriNuovo />;
      case 'questionariostruttureNew':
        return <QuestionarioStruttureNew />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Selezione Questionario</h1>
        <div className="flex gap-4">
          {selectedQuestionario && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedQuestionario(null)}
            >
              Torna alla selezione
            </Button>
          )}
          <Button 
            variant="destructive" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {!selectedQuestionario ? (
        <Card>
          <CardHeader>
            <CardTitle>Seleziona il questionario da compilare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={() => setSelectedQuestionario('questionariogiovaninew')}>
                Questionario Giovani
              </Button>
              <Button onClick={() => setSelectedQuestionario('questionariooperatorinuovo')}>
                Questionario Operatori
              </Button>
              <Button onClick={() => setSelectedQuestionario('questionariostruttureNew')}>
                Questionario Strutture
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        renderQuestionario()
      )}
    </div>
  );
} 